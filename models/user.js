const fs = require('fs')
const uuid = require('uuid/v4')
const mongoose = require('mongoose')

const {encrypt} = require('../tools/config')
const {log, resMsg, dealDate, getKey} = require('../tools/utils')

var userSchema = new mongoose.Schema({
    username: {type: String, default: ''},
    password: {type: String, default: ''},
    user_id : {type: String, default: ''},
    
    avatar   : {type: String, default: '/images/default.png'},
    signature: {type: String, default: '这家伙很懒，什么个性签名都没有留下。'},
    admin    : {type: Boolean, default: false},

    collect_list:{type: Array, default: []},

    _delete  : {type: Boolean, default: false},
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now},
})

var userMongo = mongoose.model('user', userSchema)

class User {
    static async add (form = {}) {
        let res = await this.validAdd(form)
        if (res.status == false) {
            return  resMsg(null, res.msg, false)
        }
        form.password = encrypt(form.password)
        form.user_id = uuid()
        let doc = await userMongo.create(form)
        let data = getKey(doc, 'username', 'password')

        let obj = resMsg(data, '注册成功')
        return obj
    }
    
    static async login (form = {}) {
        form.password = encrypt(form.password)
        let doc = await userMongo.findOne(form)
        let obj = {}
        if (doc == null) {
            obj = resMsg(null, '登录失败，用户名或密码错误', false)
        } else {
            let data = getKey(doc, 'username', 'password', 'admin', 'user_id')
            obj = resMsg(data, '登录成功')
        }
        return obj
    }
    
    static async getInfo (form = {}) {
        let doc = await userMongo.findOne(form)
        // log('doc getInfo',form, doc )
        let con = (doc == null)
        let obj = {}
        if (con) {
            obj = resMsg(null, '用户信息获取失败', false)
        } else {
            obj = resMsg(doc, '用户信息获取成功')
        }
        //log('getInfo', obj)
        return obj
    }
    
    static async uploadAvatar (user_id, avatarFile) {
        log('avatarFile', avatarFile, user_id)
        //读取文件，将读取的信息，写入以user_id命名的文件中，删除源文件
        let fileType = avatarFile.originalname.split('.').pop()
        let des_file = './public/images/avatar/' + user_id + '.' + fileType
        
        //异步fs方法在test文件中
        let data = fs.readFileSync(avatarFile.path)
        fs.writeFileSync(des_file, data)
        fs.unlinkSync(avatarFile.path)
        let avatar = des_file.split('/public')[1]
        let doc = await userMongo.update({user_id: user_id}, {avatar: avatar})
        let msg = resMsg({avatar: avatar}, '文件上传成功')
        return msg
    }
    
    static async updateInfo (user = null, form = {}) {
        let doc = await userMongo.update(user, form)
        let con = (doc != null)
        let obj = {}
        if (con) {
            let data = {
                admin : doc.admin,
                avatar: doc.avatar,
            }
            obj = resMsg(form, '获取成功')
        } else {
            obj = resMsg(null, '获取失败', false)
        }
        return obj
    }
    
    static async updatePassword (user = null, form = {}, request) {
        //1.验证密码
        let oldP = encrypt(form.old)
        if (user.password != oldP) {
            return resMsg(null, '初始密码错误', false)
        }
        //2.更新密码
        let newPass = encrypt(form.newP)
        let doc = await userMongo.update(user, {password: newPass})
        // log('更新之后的密码', doc)
        //3.更新session
        let con = (doc != null)
        if (con) {
            request.session.userinfo.password = newPass
            let data = {
                newPass:newPass,
            }
            return resMsg(data, '密码更新成功')
        } else {
            return resMsg(null, '密码更新失败', false)
        }
    }

    static async validAdd (form = {}) {
        //应该添加注册验证
        // 1.用户名不重复
        // 2.用户和密码的限制（长度，是否包含汉字，奇异字母等）
        let msg = ''
        let status = true
        let limit_len = (form.username.length > 3 && form.password.length > 3)
        if (limit_len == false) {
            msg = '用户名或密码不符合规定'
            status = false
        }
        let isRepeatedData = {username:form.username}
        let isRepeated = await this.getInfo(isRepeatedData)
        if (isRepeated.success == true) {
            msg = '用户名已被注册'
            status = false
        }
        let obj = {
            msg:msg,
            status:status,
        }
        return obj
    }

    static async real_remove (form = {}) {
        //log('topic test form', form)
        let doc
        try {
            doc = await userMongo.remove(form)
        } catch (err) {
            return false
        }
        return doc !== null
    }
}

module.exports = User
