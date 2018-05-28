var apiUserRegister = function (data, callback) {
    ajax({
        method  : 'POST',
        url    : '/register',
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
let validRegister = function (obj) {
    var v = Object.values(obj)
    var res = true
    v.forEach(function (value) {
        if (value.length < 2) {
            res = false
        }
    })
    return res
}
let cbRegister = function (event) {
    var data = getRegisterData()
    var res = validRegister(data)
    if (res == true) {
        apiUserRegister(data, function (r) {
            let res = JSON.parse(r.response)
            if (res.success == true) {
                log('注册成功', res)
            } else {
                log('注册失败', res.message)
            }
        })
    } else {
        log('前端认证：用户名或密码不符合规定')
    }

}

var apiUserLogin = function (data, callback) {
    ajax({
        method  : 'POST',
        url    : '/login',
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
        console.log('res', r.response)
        let res = JSON.parse(r.response)
        log('res', res)
        if (res.success) {
            if (res.data.admin) {
                location.href = '/admin'
            } else {
                location.href = '/'
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

const __main = function () {
    init()
}

__main()