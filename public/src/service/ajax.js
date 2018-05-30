var guaSync = function (callback) {
    // setTimeout 函数一定会把第一个参数放在后台去执行
    setTimeout(function () {
        callback()
    }, 0)
}

// AJAX事件，request是object
var ajax = function (request) {
    // 代理的时候用，
    // 非代理时let baseUrl = "
    let baseUrl = 'http://localhost:8081'
    // 默认值
    var req = {
        url: baseUrl + request.url,
        // 传对象 自动转JSON
        data: JSON.stringify(request.data) || null,
        method: request.method || 'GET',
        header: request.header || {},
        contentType: request.contentType || 'application/json',
        sync: (request.sync !== false),
        callback: request.callback || function (res) {
            console.log('读取成功！')
        }
    }
    // console.log('req.sync', req.sync);
    var resData = null
    var r = new XMLHttpRequest()
    // 设置请求方法和请求地址，
    r.open(req.method, req.url, req.sync)
    r.setRequestHeader('Content-Type', req.contentType)
    // setHeader
    Object.keys(req.header).forEach(key => {
        r.setRequestHeader(key, req.header[key])
    })
    // 注册响应函数
    r.onreadystatechange = function () {
        if (r.readyState === 4) {
            if (req.sync == false) {
                // 留着看是否需要JSOn.parse(r.response)
                // console.log('r.response', r.response);
                resData = JSON.parse(r.response)
            } else {
                req.callback(r)
            }
        }
    }
    // 发送请求
    if (req.method == "GET") {
        r.send()
    } else {
        r.send(req.data)
    }

    if (req.sync == false) {
        return resData
    }
}

var ajaxSync = function (request) {
    var req = {
        url: request.url,
        // 传对象 自动转JSON
        data: JSON.stringify(request.data) || null,
        method: request.method || 'GET',
        header: request.header || {},
        contentType: request.contentType || 'application/json',
        callback: request.callback || function (res) {
            console.log('读取成功！')
        }
    }
    var resData = null
    var r = new XMLHttpRequest()
    // open 的第三个参数表示是否以异步的方式发送请求
    // 如果是 false, 就是用同步(MDN不推荐同步阻塞，但我们可以用在少数需要回调嵌套的地方)
    r.open(request.method, request.path, false)
    if (request.contentType != undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = function () {
        if (r.readyState == 4) {
            // request.callback(r.response)
            resData = r
        }
    }
    r.send(request.data)
    return resData
}

const ajaxPromise = function (request) {
    let req = {
        path: request.path,
        // 传对象 自动转JSON
        data: JSON.stringify(request.data) || null,
        method: request.method || 'GET',
        header: request.header || {},
        contentType: request.contentType || 'application/json',
        callback: request.callback || function (res) {
            console.log('读取成功！')
        }
    }
    let r = new XMLHttpRequest()
    let promise = new Promise(function (resolve, reject) {
        r.open(req.method, req.path, true)
        r.setRequestHeader('Content-Type', req.contentType)
        // setHeader
        Object.keys(req.header).forEach(key => {
            r.setRequestHeader(key, req.header[key])
        })
        r.onreadystatechange = function () {
            if (r.readyState === 4) {
                // 回调函数
                req.callback(r)
                // Promise 成功
                resolve(r)
            }
        }
        r.onerror = function (err) {
            reject(err)
        }
        if (req.method === 'GET') {
            r.send()
        } else {
            // POST
            r.send(req.data)
        }
    })
    return promise
}
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

module.exports = {
    ajax: ajax,
    ajaxSync: ajaxSync,
    ajaxPromise: ajaxPromise,
    uploadFile:uploadFile,
}

// 同步执行方案

// ajax是正常的异步执行ajax，
// ajaxSync是同步ajax，只返回r.respons e。回调函数由下一步执行。
// 同步写法如下
/*
guaSync(function () {
    var data1 = ajax(request1)
    callback1(data1)
    var data2 = ajax(request2)
    callback2(data2)
})

// ajaxPromise返回的是promise。
let apiAllTopic = async function (callback) {
    await ajaxPromise({
        method: 'GET',
        path: '/topic/all',
        callback: callback,
    })
}
let init = async function () {
    await apiAllTopic(callback1)
    await ajax2(callback2)
}
*/