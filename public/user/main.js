let cbFileBack = function () {
    console.log(ajax.responseText)
}
let uploadFile = function (file, url, func=cbFileBack) {
    var fd = new FormData()
    var ajax = new XMLHttpRequest()
    /* 把文件添加到表单里 */
    //avatar是前后端约定的，上传文件的标识字段
    fd.append('avatar', file)
    ajax.open('post', url, true)
    
    ajax.onload = function () {
        func(ajax.responseText)
    }
    ajax.send(fd)
}
let cbUploadFile = function (event) {
    let input = dqs('#id-input-file')
    var file = input.files[0]
    // log('input.files', input.files[0], input)
    uploadFile(file, '/user/avatar', function (r) {
        let res = JSON.parse(r)
        // 给图片加随机字符串实现在图片地址src不变的情况下让浏览器重新加载图片
        dqs('.user-card .user-avatar img').src = res.data.avatar + '?t=' + Math.random();
    })
}

let updatePassword = function (data, callback) {
    ajax({
        method  : 'POST',
        url    : '/user/password',
        data    : data,
        callback: function (r) {
            callback(r)
        }
    })
}

let resetPassword = function (r) {
    //log('r.response', r.response)
    let res = JSON.parse(r.response)
    if (res.success) {
        //log('res, ', res)
    }
}

let passwordData = function () {
    let old = $('.old-password').val()
    let newP = $('.new-password').val()
    let confirmP = $('.confirm-password').val()
    let data = {
        old : old,
        newP: newP,
        confirmP:confirmP,
    }
    return data
}
let cbUpdatePassword = function (event) {
    let data = passwordData()
    if (data.newP == data.confirmP) {
        updatePassword(data, resetPassword)
    } else {
        alert('两次密码不一致')
    }
}

let __main = function () {
    init()
    $(document).on('click', '#id-update-password', cbUpdatePassword)
    bindEvent('.button-upload-file', 'click', cbUploadFile)
}

__main()