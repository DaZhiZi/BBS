let loginAuth = function (req, res, next) {
    var url = req.originalUrl
    let urlArr = ['/login/', '/login', '/register']
    // console.log('req.session.userinfo', req.session);
    if (urlArr.indexOf(url) == -1 && !req.session.userinfo) {
        return res.redirect('/login')
    }
    next()
}

const expressSession = require('express-session');
const cookieSession = require('cookie-session')

const sessionNormal = cookieSession({
    secret: 'yongzhi',
    maxAge: 1000 * 60 * 60 * 360,
})
// session持久化
const redis = require('redis')
const RedisStore = require('connect-redis')(expressSession);
const redisClient = redis.createClient(6379, '127.0.0.1');
const options = {
    client:redisClient,
}
const sessionRedis = expressSession({
    store: new RedisStore(options),
    secret: 'yongzhi',
    resave:false,
    saveUninitialized:true,
})

const expiryDate = new Date( Date.now() + 30 * 24 * 60 * 60 * 1000 ); // 30 day
const MongoStore = require('connect-mongo')(expressSession)
const sessionMongo = expressSession({
    secret: 'yongzhi',
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    store: new MongoStore({
        url: 'mongodb://localhost/session-store',
        touchAfter: 3600 * 24 * 30 // time period in seconds
    }),
    cookie:{
        //secure: true, // only https
        httpOnly: true,
        expires: expiryDate,
    }
})

const sessionExpress = expressSession({
    secret: 'yongzhi',
    resave: false,
    saveUninitialized: true
})
const postAuth = function (request, response, next) {
    // post 未登录 非/login
    let urlArr = ['/login/', '/login', '/register']
    let urlV = (urlArr.indexOf(request.path) == -1)
    console.log('request.path', request.path, urlV);
    if (request.session.userinfo == undefined && urlV) {
        let obj = {
            data   : '',
            success: false,
            message: "未登录",
        }
        response.json(obj)
    }
    next()
}
module.exports = {
    loginAuth:loginAuth,
    sessionRedis:sessionRedis,
    sessionNormal:sessionNormal,
    sessionExpress:sessionExpress,
    sessionMongo:sessionMongo,
    postAuth:postAuth,
}