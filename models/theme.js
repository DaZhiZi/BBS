const mongoose = require('mongoose')
const userModel = require('../models/user')
const topicModel = require('../models/topic')
const replyModel = require('../models/reply')

const {log, resMsg, dealDate, getKey} = require('../utils')

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
        //log('form.userInfo', form.userInfo)
        //应该添加注册验证
        let doc = await themeMongo.create(form)
        let obj = resMsg(doc, '注册成功')
        return obj
    }
    
    static async all (form = {}, pageNum=1) {
        let sortRule = {}
        let pageLimits = 2
        let pageSkip = (pageNum > 0) ? (pageNum - 1) : 1
        let con = {_delete: false}
        if (form.topic_id != 'all') {
            con.topic_id = form.topic_id
        }
        let doc = await themeMongo.find(con).skip(pageSkip).limit(pageLimits)
        // 分页信息
        let themeNum = await themeMongo.count(con)
        let pageTotal = Math.ceil(themeNum / pageLimits)
        let obj = {}
        let data = {
            page:{
                pageNum:pageNum,
                pageTotal:pageTotal,
            }
        }
        if (doc == null) {
            data.theme = null
            obj = resMsg(data, '请求失败', false)
        } else {
            let that = new this()
            let newDoc = await that.dealAll(doc)
            data.theme = newDoc
            obj = resMsg(data, '所有主题请求成功')
        }
        return obj
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
    
    static async detail (form = {}) {
        //log('theme detail form', form)
        let doc = await themeMongo.findOne(form)
        //log(' detail doc', doc)
        
        let obj = {}
        if (doc == null) {
            obj = resMsg(null, '此话题不存在或已被删除。', false)
        } else {
            let that = new this()
            let newDoc = await that.dealOne(doc)
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
    
    static async plusreply_num (form = {}) {
        let suc = await themeMongo.updateOne({_id: form.theme_id}, {$inc: {'browseInfo.reply_num': 1}})
        //log('plusreply_num 数字增加的写法 ', suc, form)
        return suc
    }
    
    async dealOne (form = {}) {
        let obj = await dealDate(form)
        let userAllInfo = await userModel.getInfo({user_id: obj.user_id})
        obj.userInfo = getKey(userAllInfo.data, 'username', 'user_id', 'avatar')
        
        let topicAllInfo = await topicModel.findOne({_id: obj.topic_id})
        obj.topicInfo = getKey(topicAllInfo, '_id', 'enName', 'cnName')
        return obj
    }
    
    async dealAll (form = []) {
        
        //需要考虑，某个字段没有的情况。比如现在没有回复，哪最后的回复怎么办。
        for (var i = 0; i < form.length; i++) {
            form[i] = await dealDate(form[i])
            let userAllInfo = await userModel.getInfo({user_id: form[i].user_id})
            form[i].userInfo = getKey(userAllInfo.data, 'username', 'user_id', 'avatar')
            
            let topicAllInfo = await topicModel.findOne({_id: form[i].topic_id})
            form[i].topicInfo = getKey(topicAllInfo, '_id', 'enName', 'cnName')
            
            let theme_id = form[i]._id
            let replyDoc = await replyModel.last({theme_id: theme_id})
            form[i].lastReplyInfo = replyDoc
            
            //回复的数量
            let docAll = await replyModel.all({theme_id: theme_id})
            form[i].browseInfo.reply_num = docAll.data.length
            //log('所有的回复docAll', docAll.data.length)
        }
        return form
    }
}

module.exports = Theme
