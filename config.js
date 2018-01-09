const mongoose = require('mongoose')
const crypto = require('crypto')
const {log} = require('./utils')
var db = mongoose.connect('mongodb://localhost/forum', {
    //由于一些废弃的功能，所以用下面的配置
    useMongoClient: true,
})

mongoose.Promise = global.Promise

mongoose.connection.on('error', function (error) {
    log('数据库连接失败：' + error)
})

mongoose.connection.on('open', function () {
    log('数据库连接成功')
})

mongoose.connection.on('disconnected', function () {
    log('数据库连接断开')
})

let salt = 'i6*M*Q)Z9>)'

var b = {}

b.encrypt = function (str) {
    let key = crypto.pbkdf2Sync(str, salt, 2, 16, 'sha512')
    let value = key.toString('hex')
    return value
}

b.fakeReply = {
    user_id  : '',
    update_at: '暂无回复',
    _id      : '',
    userInfo : {
        username: '暂无回复',
        user_id : '',
        avatar  : '',
    }
}

module.exports = b
