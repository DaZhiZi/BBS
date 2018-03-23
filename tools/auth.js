let loginAuth = function (req, res, next) {
    var url = req.originalUrl
    let urlArr = ['/login/', '/login', '/register']
    if (urlArr.indexOf(url) == -1 && !req.session.user) {
        return res.redirect('/login')
    }
    next()
}

module.exports = {
    loginAuth:loginAuth
}