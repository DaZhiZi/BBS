var apiUserRegister = function (data, callback) {
    ajax({
        method  : 'POST',
        path    : '/register',
        data    : data,
        callback: function (r) {
            callback(r)
        }
    })
}

var getRegisterData = function (event) {
    var username = dqs('#id-input-username').value
    var password = dqs('#id-input-password').value
    
    var data = {
        username: username,
        password: password,
    }
    return data
}
let cbRegister = function (event) {
    var data = getRegisterData()
    log('data', data)
    apiUserRegister(data, function (r) {
        let res = JSON.parse(r.response)
        //log('res', res)
        if (res.success) {
            log('注册成功001', res)
        } else {
            log('注册失败', res.code)
        }
    })
}

var apiUserLogin = function (data, callback) {
    ajax({
        method  : 'POST',
        path    : '/login',
        data    : data,
        callback: function (r) {
            callback(r)
        }
    })
}

let cbLogin = function (event) {
    var data = getRegisterData()
    //log('data', data)
    apiUserLogin(data, function (r) {
        let res = JSON.parse(r.response)
        log('res', res)
        if (res.success) {
            if (res.data.admin) {
                location.href = '/admin'
            } else {
                location.href = '/user'
            }
        } else {
            log('res错误', res)
        }
    })
}
let init = function () {
    bindEvent('#id-button-register', 'click', cbRegister)
    bindEvent('#id-button-login', 'click', cbLogin)
}
init()