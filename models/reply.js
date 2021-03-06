const mongoose = require('mongoose')
const userModel = require('./user')
const {fakeReply} = require('../tools/config')
const {log, resMsg, dealDate, getKey, toggleArr} = require('../tools/utils')

const replySchema = new mongoose.Schema({
    theme_id: {type: String, default: '帖子ID'},
    user_id : {type: String, default: '作者ID'},
    content : {type: String, default: '内容'},
    
    ups      : {type: Array, default: []},
    _delete  : {type: Boolean, default: false},
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now},
})

var replyMongo = mongoose.model('reply', replySchema)

class Reply {
    static async add (form = {}, userInfo) {
        //log('userInfo.user_id', userInfo.user_id)
        //if (!userInfo.user_id) {
        //    log('里面')
        //    return resMsg(null, '用户没有登录', false)
        //}
        //应该添加注册验证
        form.user_id = userInfo.user_id
        let doc = await replyMongo.create(form)
        
        //log('前面的form', form)
        let that = new this()
        let newDoc = await that.dealOne(doc)
        
        let themeModel = require('./theme')
        
        let suc = await themeModel.plus_reply_num({theme_id: form.theme_id})
        if (suc == false) {
            return resMsg(null, 'theme_id错误', false)
        }
        //log('添加用户信息后的suc', suc)
        let obj = resMsg(newDoc, '回复添加成功')
        return obj
    }
    
    static async remove (id = '') {
        //应该添加注册验证
        let form = {_id: id}
        let doc = await replyMongo.update(form, {_delete: true})
        let obj = resMsg(id, '注册成功')
        return obj
    }
    
    static async all (form = {}) {
        form._delete = false
        let doc = await replyMongo.find(form)
        //log('all doc', doc)
        let data = []
        let that = new this()
        for (var i = 0; i < doc.length; i++) {
            let singleDoc = doc[i]
            let newDoc = await that.dealOne(singleDoc)
            data.push(newDoc)
        }
        let obj = resMsg(data, '获取所有回复成功')
        return obj
    }
    
    //根据theme——id来查询，最后一个
    //跟游客的体制一样，当没有回复时，用一个占位符来表示
    static async last (form = {}) {
        form._delete = false
        let doc = await replyMongo.find(form).sort({update_at: -1}).limit(1)
        let info = {}
        if (doc.length == 0) {
            info = fakeReply
        } else {
            let infoAll = await dealDate(doc[0])
            info = getKey(infoAll, 'user_id', 'update_at', '_id')
            let userAllInfo = await userModel.getInfo({user_id: info.user_id})
            // log('userAllInfo info.user_id', infoAll);
            info.userInfo = getKey(userAllInfo.data, 'username', 'user_id', 'avatar')
        }
        return info
    }
    
    static async up (form = {}, userInfo) {
        form._delete = false
        let doc
        try {
            doc = await replyMongo.findOne(form)
        } catch(err) {
            return resMsg(null, 'reply_id错误', false)
        }
        let ups = doc.ups
        let newUps = toggleArr(userInfo.user_id, ups)
        await replyMongo.updateOne(form, {ups: newUps})
        let len = newUps.length
        
        //log('dealUp操作', len, newUps, dealUp)
        let obj = resMsg(len, '成功')
        return obj
    }
    
    async dealOne (form = {}) {
        let obj = await dealDate(form)
        let userAllInfo = await userModel.getInfo({user_id: obj.user_id})
        obj.userInfo = getKey(userAllInfo.data, 'username', 'user_id', 'avatar')
        return obj
    }
    static async real_remove (form = {}) {
        let doc
        try {
            doc = await replyMongo.remove(form)
        } catch (err) {
            return false
        }
        return doc !== null
    }
}

module.exports = Reply
