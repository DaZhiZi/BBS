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
        // log('form.userInfo', form.userInfo)
        // 应该添加topic_id验证
        // 或者说应该在全局验证一些POST请求
        let doc = await themeMongo.create(form)
        let obj = resMsg(doc, '注册成功')
        return obj
    }

    static async collect (theme_id, user_id) {
        // theme collect lists
        let doc = await themeMongo.findOne({_id:theme_id})
        let collect_pep = doc.browseInfo.collect_pep
        let newCollects = toggleArr(user_id, collect_pep)
        let dealUp = await themeMongo.updateOne({_id:theme_id}, {'browseInfo.collect_pep': newCollects})

        // user collect lists
        let userDoc = await userModel.getInfo({user_id:user_id})
        let collect_list = userDoc.data.collect_list
        let newCollectList = toggleArr(theme_id, collect_list)
        let dealUser = await userModel.updateInfo({user_id:user_id}, {'collect_list': newCollects})
        
        let is_collect = (newCollects.indexOf(user_id) != -1)
        //log('is_collect操作', is_collect)
        let data = {
            is_collect:is_collect,
        }
        let obj = resMsg(data, '成功')
        return obj
    }

    static async all (form = {}, pageNum=1) {
        let con = {
            _delete: false,
            top:false,
            lock:false,
        }
        if (form.topic_id != 'all') {
            con.topic_id = form.topic_id
        }
        let that = new this()
        // 分页和top帖信息
        let info = await that.page_top(form, pageNum, con)
        let {data, top_theme} = info
    
        let top_num = top_theme.length
        let pageSkip = (pageNum - 1) * 2 - top_num
        let skips = pageSkip > 0 ? pageSkip : 0
        let limits = (pageNum == 1) ? (2 - top_num) : 2
        log('limits, skips', limits, skips)
        let doc = await themeMongo.find(con).skip(skips).limit(limits)
        let allTheme = (pageNum == 1) ? top_theme.concat(doc) : doc
        let newDoc = await that.dealAll(allTheme)
        data.theme = newDoc
        let obj = resMsg(data, '所有主题请求成功')
        return obj
    }
    
    async page_top (form = {}, pageNum = 1, con) {
        let top_theme = await themeMongo.find({
            _delete: false,
            top    : true,
        })
        
        let themeNum = await themeMongo.count(con)
        let allTheme = themeNum + top_theme.length
        let pageTotal = Math.ceil(allTheme / 2)
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
        //log('theme detail form', form)
        let doc = await themeMongo.findOne(form)
        //log(' detail doc', doc)
        
        let obj = {}
        if (doc == null) {
            obj = resMsg(null, '此话题不存在或已被删除。', false)
        } else {
            let that = new this()
            let newDoc = await that.dealOne(doc, user_id)
            //数字增加的写法
            let suc = await themeMongo.updateOne(form, {$inc: {'browseInfo.view_num': 1}})
            //log('数字增加的写法', suc)
            obj = resMsg(newDoc, 'Theme查询成功')
        }
        //log('themeMongo.findOne', obj)
        return obj
    }
    
    static async view (id = '') {
        //应该添加注册验证
        let form = {_id: id}
        let doc = await themeMongo.update(form, {_delete: true})
        let obj = resMsg(id, '注册成功')
        return obj
    }
    
    static async plus_reply_num (form = {}) {
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
}

module.exports = Theme
