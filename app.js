const express = require('express')

const bodyParser = require('body-parser')
const session = require('cookie-session')

const nunjucks = require('nunjucks')
const multer = require('multer')

const app = express()

//配置信息
app.use(bodyParser.json({limit: '5mb'}))
app.use(express.static('./public'))

//注意maxAge的单位是毫秒
app.use(session({
    secret: 'yongzhi',
    maxAge: 1000 * 60 * 60 * 360,
}))

// 配置 nunjucks 模板, 第一个参数是模板文件的路径
// nunjucks.configure 返回的是一个 nunjucks.Environment 实例对象
var env = nunjucks.configure('views', {
    //如果在环境变量中设置了 autoescape，所有的输出都会自动转义，
    // 但可以使用 safe 过滤器，Nunjucks 就不会转义了。
    autoescape: true,
    express   : app,
    noCache   : true,
})

//这个是缓存目录
var upload = multer({dest: 'uploads/'})

const {log, sendHtml} = require('./tools/utils')
const {loginAuth} = require('./tools/auth')

// 登录信息验证
app.use(loginAuth)

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
