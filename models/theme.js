const mongoose = require('mongoose')
const userModel = require('../models/user')
const topicModel = require('../models/topic')
const replyModel = require('../models/reply')

const {log, resMsg, dealDate, getKey, toggleArr} = require('../tools/utils')

const themeSchema = new mongoose.Schema({
    user_id : {type: String, default: '作者ID'},
    topic_id: {type: String, default: 'topic_id'},
    
    title     : {type: String, default: '标题'},
    content   : {type: String, default: '内容'},
    //浏览数据，包含回复数、浏览数、收藏数
    browseInfo: {
        reply_num  : {type: Number, default: 0},
        view_num   : {type: Number, default: 0},
        collect_num: {type: Number, default: 0},
        collect_pep: {type: Array, default: []},
    },
    
    //最后回复
    last_reply   : {type: String},
    last_reply_at: {type: Date, default: Date.now},
    
    //帖子性质
    top : {type: Boolean, default: false}, // 置顶帖
    good: {type: Boolean, default: false}, // 精华帖
    lock: {type: Boolean, default: false}, // 被锁定主题
    
    _delete  : {type: Boolean, default: false},
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now},
})

var themeMongo = mongoose.model('theme', themeSchema)

class Theme {
    static async add (form = {}, userInfo) {
        form.user_id = userInfo.user_id
        let valid = await topicModel.test({_id: form.topic_id})
        //log('valid', valid)
        if (valid == true) {
            let doc = await themeMongo.create(form)
            let obj = resMsg(doc, 'theme添加成功')
            return obj
        } else {
            let obj = resMsg(null, 'theme添加失败', false)
            return obj
        }
    }

    static async collect (theme_id, user_id) {
        let valid = await this.test({_id:theme_id})
        if (valid == false) {
            return resMsg(null, 'theme_id错误', false)
        }
        // theme collect lists
        let doc = await themeMongo.findOne({_id:theme_id})
        let collect_pep = doc.browseInfo.collect_pep
        let newCollects = toggleArr(user_id, collect_pep)
        let dealUp = await themeMongo.updateOne({_id:theme_id}, {'browseInfo.collect_pep': newCollects})

        // user collect lists
        let userDoc = await userModel.getInfo({user_id:user_id})
        // log('userDoc', userDoc)
        let collect_list = userDoc.data.collect_list
        toggleArr(theme_id, collect_list)
        await userModel.updateInfo({user_id:user_id}, {'collect_list': newCollects})
        
        let is_collect = (newCollects.indexOf(user_id) != -1)
        //log('is_collect操作', is_collect)
        let data = {
            is_collect:is_collect,
        }
        let obj = resMsg(data, '成功')
        return obj
    }

    static async all (form = {}, pageNum=1) {
        // 默认条件
        let con = {
            _delete: false,
            top:false,
            lock:false,
        }

        // topic_id验证
        if (form.topic_id != 'all') {
            con.topic_id = form.topic_id
            let valid = await topicModel.test({_id:form.topic_id})
            // log('valid model theme', valid)
            if (valid == false) {
                let obj = resMsg(null, '不存在该topic', false)
                return obj
            }
        }

        let theme_per_page = 3
        let that = new this()
        // 分页和top帖信息
        let info = await that.page_top(form, pageNum, con, theme_per_page)
        let {data, top_theme} = info
        let top_num = top_theme.length
        let pageSkip = (pageNum - 1) * theme_per_page - top_num
        let skips = pageSkip > 0 ? pageSkip : 0
        let limits = (pageNum == 1) ? (theme_per_page - top_num) : theme_per_page
        // log('limits, skips', limits, skips)
        let doc = await themeMongo.find(con).skip(skips).limit(limits)
        let allTheme = (pageNum == 1) ? top_theme.concat(doc) : doc
        let newDoc = await that.dealAll(allTheme)
        data.theme = newDoc
        // log('data, all', data)
        let obj = resMsg(data, '所有主题请求成功')
        return obj
    }
    
    async page_top (form = {}, pageNum = 1, con, theme_per_page) {
        let top_theme = await themeMongo.find({
            _delete: false,
            top    : true,
        })
        
        let themeNum = await themeMongo.count(con)
        let allTheme = themeNum + top_theme.length
        let pageTotal = Math.ceil(allTheme / theme_per_page)
        let data = {
            page: {
                pageNum  : pageNum,
                pageTotal: pageTotal,
            }
        }
        return {
            data     : data,
            top_theme: top_theme,
        }
    }
    
    static async noReply () {
        let con = {
            _delete               : false,
            'browseInfo.reply_num': 0,
        }
        let doc = await themeMongo.find(con, {_id: 1, title: 1}).sort({update_at: -1}).limit(5)
        //log('无人回复的话题', doc)
        let obj = {}
        if (doc == null) {
            obj = resMsg(doc, '请求失败', false)
        } else {
            obj = resMsg(doc, '所有主题请求成功')
        }
        return obj
    }
    
    static async detail (form = {}, user_id) {
        let valid = await this.test(form)
        if (valid == false) {
            return resMsg(null, 'Theme参数错误', false)
        }
        //log('theme detail form', form)
        let doc = await themeMongo.findOne(form)
        // log(' detail doc', doc)

        let obj = {}
        if (doc == null) {
            obj = resMsg(null, '此话题不存在或已被删除。', false)
        } else {
            let that = new this()
            let newDoc = await that.dealOne(doc, user_id)
            //数字增加的写法
            let suc = await themeMongo.updateOne(form, {$inc: {'browseInfo.view_num': 1}})
            obj = resMsg(newDoc, 'Theme查询成功')
        }
        //log('themeMongo.findOne', obj)
        return obj
    }
    
    static async view (id = '') {
        //应该添加注册验证
        let form = {_id: id}
        await themeMongo.update(form, {_delete: true})
        let obj = resMsg(id, '注册成功')
        return obj
    }
    
    static async plus_reply_num (form = {}) {
        let valid = await this.test({_id: form.theme_id})
        if (valid == false) {
            return false
        }
        let suc = await themeMongo.updateOne({_id: form.theme_id}, {$inc: {'browseInfo.reply_num': 1}})
        //log('plus_reply_num 数字增加的写法 ', suc, form)
        return suc
    }
    
    async dealOne (form = {}, user_id) {
        let obj = await dealDate(form)
        let userAllInfo = await userModel.getInfo({user_id: obj.user_id})
        obj.userInfo = getKey(userAllInfo.data, 'username', 'user_id', 'avatar')
        
        let topicAllInfo = await topicModel.findOne({_id: obj.topic_id})
        obj.topicInfo = getKey(topicAllInfo, '_id', 'enName', 'cnName')
        
        //是否收藏
        let collArr = obj.browseInfo.collect_pep
        obj.is_collect = (collArr.indexOf(user_id) != -1)
        return obj
    }
    
    async dealAll (themeList = []) {
        let arr = []
        //需要考虑，某个字段没有的情况。比如现在没有回复，哪最后的回复怎么办。
        for (var i = 0; i < themeList.length; i++) {
            let single = themeList[i]
            if (single == null) {
                continue
            }
            single = await dealDate(single)
            let userAllInfo = await userModel.getInfo({user_id: single.user_id})
            // log('userAllInfo dealAll', single.user_id)
            single.userInfo = getKey(userAllInfo.data, 'username', 'user_id', 'avatar')
            
            // todo: 写个单独的函数处理topic问题
            let topicAllInfo = await topicModel.findOne({_id: single.topic_id})
            single.topicInfo = getKey(topicAllInfo, '_id', 'enName', 'cnName')
            let topTopic = {
                enName:'top',
                cnName:'置顶',
            }
            if (single.top == true) {
                single.topicInfo = topTopic
            }
            let goodTopic = {
                enName:'good',
                cnName:'精华',
            }
            if (single.good == true) {
                single.topicInfo = goodTopic
            }
            
            let theme_id = single._id
            let replyDoc = await replyModel.last({theme_id: theme_id})
            single.lastReplyInfo = replyDoc
            
            //回复的数量
            let docAll = await replyModel.all({theme_id: theme_id})
            single.browseInfo.reply_num = docAll.data.length
            
            //log('single', single.userInfo, i)
            arr.push(single)
        }
        return arr
    }

    static async test (form = {}) {
        //log('topic test form', form)
        let doc
        try {
            doc = await themeMongo.findOne(form)
        } catch (err) {
            return false
        }
        return doc !== null
    }
    static async remove (form = {}) {
        //log('topic test form', form)
        let doc
        try {
            doc = await themeMongo.update(form, {_delete:true})
        } catch (err) {
            return false
        }
        return doc !== null
    }

    static async real_remove (form = {}) {
        let doc
        try {
            doc = await themeMongo.remove(form)
        } catch (err) {
            return false
        }
        return doc !== null
    }
}

module.exports = Theme
