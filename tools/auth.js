let loginAuth = function (req, res, next) {
    var url = req.originalUrl
    let urlArr = ['/login/', '/login', '/register']
    //log('req.session 请求验证', url, req.xhr, req.method)
    if (urlArr.indexOf(url) == -1 && !req.session.username) {
        //log('tiaozhuan')
        return res.redirect('/login')
    }
    console.log('req.xmlhttprequest', req.headers['x-requested-with']);
    next()
}

module.exports = {
    loginAuth:loginAuth
}