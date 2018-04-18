let loginAuth = function (req, res, next) {
    var url = req.originalUrl
    let urlArr = ['/login/', '/login', '/register']
    if (urlArr.indexOf(url) == -1 && !req.session.userinfo) {
        return res.redirect('/login')
    }
    next()
}

var expressSession = require('express-session');
const cookieSession = require('cookie-session')

// session持久化
var redis = require('redis')
var RedisStore = require('connect-redis')(expressSession);
var redisClient = redis.createClient(6379, '127.0.0.1');
var options = {
    client:redisClient,
}
var sessionRedis = expressSession({
    store: new RedisStore(options),
    secret: 'yongzhi',
    resave:false,
    saveUninitialized:true,
})

const MongoStore = require('connect-mongo')(expressSession)
var sessionMongo = expressSession({
    secret: 'yongzhi',
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    store: new MongoStore({
        url: 'mongodb://localhost/session-store',
        touchAfter: 3600 * 24 * 30 // time period in seconds
    })
})
// app.use();
var sessionNormal = cookieSession({
    secret: 'yongzhi',
    maxAge: 1000 * 60 * 60 * 360,
})
var sessionExpress = expressSession({
    secret: 'yongzhi',
    resave: false,
    saveUninitialized: true
})
module.exports = {
    loginAuth:loginAuth,
    sessionRedis:sessionRedis,
    sessionNormal:sessionNormal,
    sessionExpress:sessionExpress,
    sessionMongo:sessionMongo,
}