
const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet');

const {log, sendHtml, exTime} = require('./tools/utils')
const {loginAuth, sessionNormal, sessionRedis, sessionExpress, sessionMongo} = require('./tools/auth')

//配置信息
app.use(helmet());
app.use(express.static('./public'))
// 登录拦截需要重构
app.use(sessionMongo)
// 由于session的生成是由中间件产生的，所以session认证需要先调用session中间件
app.use(loginAuth)
app.use(exTime);
app.use(cors())
app.use(bodyParser.json({limit: '5mb'}))

//引入路由
const index = require('./routes/index')
const topic = require('./routes/topic')
const theme = require('./routes/theme')
const user = require('./routes/user')
const reply = require('./routes/reply')
const admin = require('./routes/admin')

//注册路由
app.use('/', index)
app.use('/user', user)
app.use('/topic', topic)
app.use('/theme', theme)
app.use('/reply', reply)
app.use('/admin', admin)

//运行服务
const run = (port = 8081, host = '') => {
    const server = app.listen(port, host, () => {
        const address = server.address()
        host = address.address
        port = address.port
        log(`listening server at http://${host}:${port}`)
    })
}

if (require.main === module) {
    const port = 8081
    const host = '127.0.0.1'
    run(port, host)
}

module.exports = app
