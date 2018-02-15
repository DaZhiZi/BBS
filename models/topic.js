const mongoose = require('mongoose')
const {log, resMsg, dealDate} = require('../tools/utils')

//相当于给这个类一个模型，或者说基本的架构。
const topicSchema = new mongoose.Schema({
    cnName  : {type: String, default: '主题名称'},
    enName  : {type: String, default: 'english name'},
    abstract: {type: String, default: '摘要描述'},
    author  : {type: String, default: '作者'},
    
    _delete  : {type: Boolean, default: false},
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now},
})
var topicMongo = mongoose.model('topic', topicSchema)

class Topic {
    static async add (form = {}) {
        //应该添加注册验证
        // log('**前面的topic', form)
        let doc = await topicMongo.create(form)
        // log('添加后topic后的doc', doc)
        let obj = resMsg(doc, '注册成功')
        return obj
    }
    
    static async remove (id = '') {
        //应该添加注册验证
        //log('doc id', id)
        let doc
        let form = {_id: id}
        try {
            doc = await topicMongo.update(form, {_delete: true})
        } catch(err) {
            return resMsg(null, 'topic移除错误', false)
        }
        // log('topic remove doc', id, doc)
        let data = {
            topic_id:id,
        }
        let obj = resMsg(data, 'topic移除成功')
        return obj
    }
    
    static async all () {
        let doc = await topicMongo.find({_delete: false})
        // log('topic all', doc)
        let con = (doc != null)
        let obj = {}
        if (con) {
            let that = new this
            let newDoc = that.dealAll(doc)
            obj = resMsg(newDoc, '获取Topic列表成功')
        } else {
            obj = resMsg(null, '获取Topic列表失败', false)
        }
        return obj
    }
    
    static async findOne (form = {}) {
        let doc = await topicMongo.findOne(form)
        let newDoc = dealDate(doc)
        //log('doc', newDoc)
        return newDoc
    }
    
    // 验证topic是否存在
    static async test (form = {}) {
        //log('topic test form', form)
        let doc
        try {
            doc = await topicMongo.findOne(form)
        } catch (err) {
            return false
        }
        return doc != null
    }
    
    dealAll (doc = []) {
        for (var i = 0; i < doc.length; i++) {
            doc[i] = dealDate(doc[i])
        }
        return doc
    }
    static async real_remove (form = {}) {
        //log('topic test form', form)
        let doc
        try {
            doc = await topicMongo.remove(form)
        } catch (err) {
            return false
        }
        return doc !== null
    }
}

module.exports = Topic
