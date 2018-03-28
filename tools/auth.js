let loginAuth = function (req, res, next) {
    var url = req.originalUrl
    let urlArr = ['/login/', '/login', '/register']
    if (urlArr.indexOf(url) == -1 && !req.session.user) {
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

// app.use();
var sessionNormal = cookieSession({
    secret: 'yongzhi',
    maxAge: 1000 * 60 * 60 * 360,
})

module.exports = {
    loginAuth:loginAuth,
    sessionRedis:sessionRedis,
    sessionNormal:sessionNormal,
}