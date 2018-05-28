// 基本函数定义，对所有的函数进行分类，
// array， object， string ，number， dom， 基本

// 对一些number 补零，js不支持1 < arg < 10
var addZero = function (arg) {
    if (arg >= 1 && arg < 10) {
        arg = '0' + arg
    }
    return arg
}

var nowDate = function () {
    var d = new Date()
    var year = d.getFullYear()
    var month = d.getMonth() + 1
    var month = addZero(month)
    var day = d.getDate()
    var hour = d.getHours()
    var min = d.getMinutes()
    var sec = d.getSeconds()
    var sec = addZero(sec)
    
    return `${hour}:${min}:${sec}`
}

var log = console.log.bind(console, nowDate() + ': ')

// 合并dqs和dqsa，按需返回
var dqs = function (selector) {
    var allElements = document.querySelectorAll(selector)
    var l = allElements.length
    if (l > 1) {
        return allElements
    }
    return allElements[0]
}

// DOM 元素加载后的函数调用
var domLoad = function (selector, callback) {
    var intervalNum = setInterval(function () {
        var ele = dqs(selector)
        console.log('没有加载')
        if (ele) {
            console.log('元素有了', ele)
            callback()
            clearInterval(intervalNum)
        }
    }, 500)
}

var addClass = function (className, selector) {
    var elements = newTypeOf(selector) == 'string' ? dqs(selector) : selector
    var elements = elements.length ? elements : [elements]
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        e.classList.add(className)
    }
}

var removeClass = function (className, selector) {
    var sel = '.' + className
    var elements = dqs(sel)
    if (selector) {
        var elements = newTypeOf(selector) == 'string' ? dqs(selector) : selector
    }
    var elements = elements.length ? elements : [elements]
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        e.classList.remove(className)
    }
}

var toggleClass = function (className, selector) {
    var elements = newTypeOf(selector) == 'string' ? dqs(selector) : selector
    var elements = elements.length ? elements : [elements]
    for (var e of elements) {
        if (e.classList.contains(className)) {
            e.classList.remove(className)
        } else {
            e.classList.add(className)
        }
    }
}
// 如果visible被设置则删除它，否则添加它
// div.classList.toggle("visible");

// 添加/删除 visible，取决于测试条件，i小于10
// IE不支持第二个参数
// div.classList.toggle("visible", i < 10);

// var toggleClass = function (element, className, condition) {
//     return element.classList.toggle(className, condition);
// }

// 判断字符串是否是数字
var isNum = function (s) {
    if (s != null && s != '') {
        return !isNaN(s)
    }
    return false
}

// 把秒（153.54）转换成时间格式02:33
var transTime = function (time) {
    var minute = parseInt(time / 60)
    var second = parseInt(time % 60)
    // 补零
    var minute = addZero(minute)
    var second = addZero(second)
    // 如果小于一个小时
    if (minute < 60) {
        var t = `${minute}:${second}`
    } else {
        var hour = parseInt(minute / 60)
        var minute = parseInt(minute % 60)
        
        var minute = addZero(minute)
        var hour = addZero(hour)
        var t = `${hour}:${minute}:${second}`
    }
    return t
}

// 当前时间的转换
// new Date()返回的时间格式如下
// Tue Jun 13 2017 14:27:59 GMT+0800 (中国标准时间)
var nowTime = function () {
    var d = new Date()
    var year = d.getFullYear()
    var month = d.getMonth() + 1
    var month = addZero(month)
    var day = d.getDate()
    var hour = d.getHours()
    var min = d.getMinutes()
    var sec = d.getSeconds()
    var sec = addZero(sec)
    
    return `${year}/${month}/${day} ${hour}:${min}:${sec}`
}

// 在a~b之间生成随机整数
var randomBetween = function (start, end) {
    var n = Math.random() * (end - start + 1)
    return Math.floor(n + start)
}

// 使用函数检查一个数字是否是奇数（奇数对2取余数不等于0）
var isOdd = function (n) {
    // 取余数的操作符是 %
    if (n % 2 != 0) {
        return true
    } else {
        return false
    }
}

// 用于测试的套路
var ensure = function (condition, message) {
    if (!condition) {
        console.log(message)
    }
}

// 在该元素的最后添加子元素
var appendHtml = function (element, html) {
    element.insertAdjacentHTML('beforeend', html)
}

// find 函数可以查找 element 的所有子元素
var findElement = function (element, selector) {
    var len = element.querySelectorAll(selector).length
    if (len > 1) {
        return element.querySelectorAll(selector)
    }
    return element.querySelector(selector)
}

// 查找target在兄弟元素的序号
var eleIndex = function () {
    var target = event.target
    // 确认点击的是第几个index
    var targetAll = target.parentElement.children
    var index = 0
    for (var i = 0; i < targetAll.length; i++) {
        if (targetAll[i].contains(target)) {
            var index = i
        }
    }
    return index
}

// 当无selector参数时，删除ele的所有子元素
// 有时，删除ele下的含有selector的所有子元素
var clearEle = function (ele, selector) {
    var eleSel = ele.querySelector(selector)
    if (eleSel == null) {
        while (ele.firstChild) {
            ele.removeChild(ele.firstChild)
        }
    } else {
        var eleSel = ele.querySelectorAll(selector)
        for (var i = 0; i < eleSel.length; i++) {
            eleSel[i].remove()
        }
    }
}
// 还没有完成的函数，返回一个数组，包含element下所有非selector元素。没有意义
// 目前有元素包含关系了，A. (B)
// 适用于弹窗之类的东西，当点击弹窗以外的地方时，关闭弹窗

// 事件绑定
var bindEvent = function (selector, eventName, callback) {
    var elements = newTypeOf(selector) == 'string' ? dqs(selector) : selector
    var elements = elements.length ? elements : [elements]
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        e.addEventListener(eventName, callback)
    }
}

var searchEle = function (val, resultDom) {
    addClass('none', resultDom)
    resultDom.forEach(function (element) {
        var con = (element.innerText.toLowerCase().indexOf(val.toLowerCase()) != -1)
        if (con) {
            element.classList.remove('none')
        }
    })
}

// AJAX事件，request是object
// 如何设置，当callback没有设定，默认的函数设置
/*
var ajax = function (request) {
    var baseUrl = request.base || location.origin
    var method = request.method || 'GET'
    var url = baseUrl + request.path
    var contentType = request.contentType || 'application/json'
    var data = JSON.stringify(request.data) || ''
    
    var callback = function () {
        if (!request.callback) {
            console.log('请求成功，PS:没有设置callback')
        } else {
            request.callback(r)
        }
    }
    var r = new XMLHttpRequest()
    // 设置请求方法和请求地址，
    r.open(method, url, true)
    // 设置发送的数据的格式
    r.setRequestHeader('Content-Type', contentType)
    // 注册响应函数
    r.onreadystatechange = function () {
        if (r.readyState === 4) {
            if (r.status === 200) {
                callback()
            } else {
                //return fail(request.status);
                console.log('request.status', request, request.status)
            }
        }
    }
    // 发送请求
    r.send(data)
}
*/

// AJAX事件，request是object
// ajax函数，涵盖了ajaxSync
var ajax = function (request) {
    // 默认值
    var req = {
        url: request.url,
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
                resData = r
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
const ajaxPromise = function(request) {
    let req = {
        url: request.url,
        // 传对象 自动转JSON
        data: JSON.stringify(request.data) || null,
        method: request.method || 'GET',
        header: request.header || {},
        contentType: request.contentType || 'application/json',
        callback: request.callback || function(res) {
            console.log('读取成功！')
        }
    }
    let r = new XMLHttpRequest()
    let promise = new Promise(function(resolve, reject) {
        r.open(req.method, req.url, true)
        r.setRequestHeader('Content-Type', req.contentType)
        // setHeader
        Object.keys(req.header).forEach(key => {
            r.setRequestHeader(key, req.header[key])
        })
        r.onreadystatechange = function() {
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
var ajaxSync = function(request) {
    var data = null
    var r = new XMLHttpRequest()
    // open 的第三个参数表示是否以异步的方式发送请求
    // 如果是 false, 就是用同步
    r.open(request.method, request.url, false)
    if (request.contentType != undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = function() {
        if (r.readyState == 4) {
            // request.callback(r.response)
            data = r
        }
    }
    if (request.method == 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
    return data
}
var runSync = function(callback) {
    // setTimeout 函数一定会把第一个参数放在后台去执行
    setTimeout(function() {
        callback()
    }, 0)
}
const parseQuery = (path) => {
    let url = path || location.search

    if (url == "") {
        return {}
    }
    var arr = url.split('?')[1].split('&')
    // ["tab=all", "page=5"]
    let query = {}
    for (var i = 0; i < arr.length; i++) {
        // str.concat()
        let q = arr[i]
        var queryKey = q.split('=')[0]
        var queryValue = q.split('=')[1]
        query[queryKey] = queryValue
    }
    return query
}

// var fail = function (code) {
//     var textarea = dqs('.test-ie-response-text');
//     textarea.value = 'Error code: ' + code;
// }
// ajax(request)

// 对于ajax请求可以进一步进行包装，如下所示。

// var updateTodo = function(todoId, task) {
//     var url = 'http://vip.cocode.cc/sandbox/todo/3400711034/update/' + todoId
//     var data = {
//         'task': task,
//     }
//     data = JSON.stringify(data)
//     ajax('POST', url, data, function(r){
//         var t = JSON.parse(r.response)
//         console.log(t)
//     })
// }

//var uploadFile = function (file, url, field='avatar') {
//    var baseUrl = location.origin
//    var absoluteUrl = baseUrl + url
//    var fd = new FormData()
//    var ajax = new XMLHttpRequest()
//    /* 把文件添加到表单里 */
//    fd.append(field, file)
//    ajax.open('post', absoluteUrl, true)
//
//    ajax.onload = function () {
//        console.log(ajax.responseText)
//    }
//
//    ajax.send(fd)
//}

// 由于typeof类型判断有种种弊端，可以借鉴jQuery.type()的方式
//关于typeof的用法和弊端见下
//http://bonsaiden.github.io/JavaScript-Garden/zh/#types.typeof

//类型判断，Array,Object
var newTypeOf = function (type) {
    var constructor = Object.prototype.toString.call(type)
    //"[object Array]"  slice(8, -1)
    //var newType = constructor.split('object ')[1].split(']')[0]
    var newType = constructor.slice(8, -1)
    var lowerCase = newType.toLowerCase()
    return lowerCase
}

// 判断有多少个字符串里面含有某字符的数量，
// 1.拆分多个，比如ss有多个字符。ss = '22'
// 2.判断非字符串，比如数字，其没有length和slice方法，因此将其类型转换成string

var hasStrNum = function (bs, ss) {
    // 类型判断，
    var bsType = (newTypeOf(bs) != 'string')
    var ssType = (newTypeOf(ss) != 'string')
    // 类型转换，是否有其他更好的方式，不用强制转换。
    if (bsType || ssType) {
        var bs = String(bs)
        var ss = String(ss)
    }
    var num = 0
    var sslen = ss.length
    for (var i = 0; i < bs.length; i++) {
        var n = bs.slice(i, i + sslen)
        if (n == ss) {
            var num = num + 1
        }
    }
    return num
}

// var bs = 12345645
// var ss = 45
// hasStrNum(bs, ss)
// 要看
// var ss = 454
// var bs = 12345454
// 需要考虑这种情况，是否允许hasStrNum(bs, ss) = 2，即当ss = 454 ,bs中包含45454，
// 此时hasStrNum(bs, ss)是1还是2。
// if (n == ss) {
//     var num = num + 1
//     var i = i + sslen - 1
// }

// 整数、有两位小数，
// 输入限制，取代正则。
var is_digit = function (s) {
    var numbers = '0123456789.'
    var emptyStr = ''
    for (var i = 0; i < s.length; i++) {
        if (!numbers.includes(s[i])) {
            return emptyStr
        }
    }
    // 英文句点最多只能有一个
    var con1 = (hasStrNum(s, '.') >= 2)
    // 小数点后最多只能有两位
    var con2 = (s.split('.')[1] != undefined && s.split('.')[1].length > 2)
    // 条件判断为false，返回空字符串
    if (con1 || con2) {
        return emptyString
    }
    return s
}

// input等输入框的输入限制
// var inputPrice = dqs('.input-price')
// inputPrice.addEventListener('keyup', function(event) {
//     var target = event.target
//     target.value = is_digit(target.value)
// })

// 延时函数的另一种写法，
// 不可以直接调用f，因为其内部存在调用信息。
var setTimeRun = function (start, end, delayTime) {
    var f = function () {
        console.log(start, 'start的数字')
        start++
        if (start <= end) {
            setTimeout(f, delayTime)
        }
    }
    f()
}
// setTimeRun(0, 255, 3000)

// 清除所有的setTimeout
// Javascript 中并没有内置的函数来清除所有的定时器（timeout 或 interval），
// 不过我们可以使用一种暴力的方法来清除所有的定时器。
// 由于 ID 会随着定时器被调用的增加而增加，
// 因此可以记录下最大的 ID 并一起清除。
var clearAllTimeout = function () {
    // 先调用一个setTimeout，记录TimeoutId的最大值biggestTimeoutId
    var biggestTimeoutId = window.setTimeout(function () {}, 1)
    for (var i = 1; i < biggestTimeoutId; i++) {
        clearTimeout(i)
    }
}

//
//将两个数组打包成object
var zipObj = function (keys, values) {
    var index = 0
    // 取两个数组中长度的最小值
    var len = Math.min(keys.length, values.length)
    var out = {}
    while (index < len) {
        out[keys[index]] = values[index]
        index += 1
    }
    return out
}

// var keys = ['q', 'd', 456]
// var values = [1, 2]
// zipObj(keys,values )
// {q: 1, d: 2}

// 数组去重
var uniArr = function (arr) {
    //临时数组
    var n = []
    for (var i = 0; i < arr.length; i++) {
        if (n.indexOf(arr[i]) == -1)
            n.push(arr[i])
    }
    return n
}

var uniArrObj = function (array) {
    var o = {}
    for (let a of array) {
        o[a] = 1
    }
    return Object.keys(o)
}

// ES6的方法set数组去重，返回的是Set
var uniArr6 = function (arr) {
    //临时数组
    var s = new Set()
    for (var i = 0; i < arr.length; i++) {
        s.add(arr[i])
    }
    return s
}

// 返回对象的key
var keysIn = function (obj) {
    var prop
    var ks = []
    for (prop in obj) {
        ks[ks.length] = prop
    }
    return ks
}

// 面向Stack Overflow编程，出现error时，页面跳转到Stack Overflow搜索错误信息的界面上，
// try {
//     console.log(hk);
// } catch(e) {
//     window.location.href = "https://stackoverflow.com/search?q=" + e.message
// }

// 列表排序

// 比较函数，先根据val是否为数字，然后根据本地排序
var comparer = function (index) {
    return function (a, b) {
        var valA = getCellValue(a, index)
        var valB = getCellValue(b, index)
        return isNum(valA) && isNum(valB) ? valA - valB : valA.localeCompare(valB)
    }
}

// 获得每个row的值
var getCellValue = function (row, index) {
    var cell = row.querySelectorAll('td')
    return cell[index].innerText
}

var sortTable = function () {
    var index = eleIndex()
    var table = target.closest('table')
    // 选取table下所有的tr数组
    var trAll = table.querySelectorAll('tbody tr')
    var trAllArr = []
    for (var i = 0; i < trAll.length; i++) {
        trAllArr.push(trAll[i])
    }
    var rows = trAllArr.sort(comparer(index))
    // 排序，逆序
    this.asc = !this.asc
    if (!this.asc) {
        rows = rows.reverse()
    }
    // 删除所有tbody的子元素
    var tbody = table.querySelector('tbody')
    var tr = table.querySelector('tr')
    clearEle(tbody, 'tr')
    for (var j = 0; j < rows.length; j++) {
        appendHtml(tbody, rows[j].outerHTML)
    }
}

// IE版本的检测
var testIEversion = function () {
    var win = window
    var doc = win.document
    var input = doc.createElement('input')
    
    var ie = (function () {
        //"!win.ActiveXObject" is evaluated to true in IE11
        if (win.ActiveXObject === undefined) return null
        if (!win.XMLHttpRequest) return 6
        if (!doc.querySelector) return 7
        if (!doc.addEventListener) return 8
        if (!win.atob) return 9
        //"!doc.body.dataset" is faster but the body is null when the DOM is not
        //ready. Anyway, an input tag needs to be created to check if IE is being
        //emulated
        if (!input.dataset) return 10
        return 11
    })()
    return ie
}
//
// var IEversion = testIEversion()
//
// console.log('前面的IE的版本测试', IEversion);
// if (IEversion <= 9) {
//     console.log('后面的IE的版本测试', IEversion);
// }
// 如果不是IE，IEversion == null

// cookie相关的函数
// 设置cookie
var setCookie = function (cname, cvalue, exdays) {
    var d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    var expires = 'expires=' + d.toGMTString()
    document.cookie = cname + '=' + cvalue + '; ' + expires
}
// 读取cookie
var getCookie = function (cname) {
    var name = cname + '='
    var ca = document.cookie.split(';')
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim()
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ''
}
// 检查cookie， username是设置的key值。
var checkCookie = function (username) {
    username = getCookie(username)
    if (username != null && username != '') {
        alert('Welcome again ' + username + '!')
    } else {
        username = prompt('Please enter your name:', '')
        if (username != null && username != '') {
            setCookie(username, username, 365)
        }
    }
}
// 利用JSON，深拷贝
var copy_object = function (obj) {
    return JSON.parse(JSON.stringify(obj))
}

var genNumArr = function (start, end) {
    let arr = []
    for (var i = start; i < end + 1; i++) {
        arr.push(i)
    }
    return arr
}

var pages = function (cur, total, totalNum = 5) {
    cur = parseInt(cur)
    total = parseInt(total)
    let leftNUm = Math.ceil(totalNum / 2)
    let rightNum = totalNum - leftNUm
    let nums = genNumArr(1, total)
    
    let start = (cur - leftNUm > 0) ? (cur - leftNUm) : 0

    let end = (cur + rightNum) < total ? (cur + rightNum) : total
    if (start == 0 && end < total && total < totalNum) {
        end = total
    }
    let t = nums.slice(start, end)
    return t
}

//提示信息
let tipsTemplate = function (target, type = 'success', msg = '提示信息') {
    let top = target.getBoundingClientRect().top - 80
    let left = target.getBoundingClientRect().left

    let tips = `
        <div class="tip-${type} div-tips" style="top:${top}px;left:${left}px;position:fixed;" >
            <h3 class="popover-title">${type}</h3>
            <div class="popover-content">${msg}</div>
        </div>
    `
    return tips
}
// @parameter

let genTip = function (target, type, msg) {
    //console.log('target', target)
    let tem = tipsTemplate(target, type, msg)
    $(target).parent().append(tem)
}

let tagTemplate = function (obj) {
    let tem = `
        <li class="li-tag">
            <span class="single-tag label label-success" data-id="${obj._id}" data-en="${obj.enName}">
${obj.cnName}</span>
            <span class="del-tag">x</span>
        </li>
    `
    return tem
}

let maskTemplate = function () {
    let html = `ss
    `
}
//GuaAlert('title 是 string', 'message 是 string')
var GuaAlert = function (title, message) {
    /*
    title 是 string
    message 是 string

    这个函数生成一个弹窗插入页面
    弹窗包含 title 作为标题 和 message 作为信息
    还包含一个 OK 按钮
    点击 OK 按钮关闭弹窗
    */
    var t = `
    <div class='modal-container modal-remove'>
        <div class='modal-mask'></div>
        <div class="modal-alert vertical-center">
            <div class="modal-title">
                ${title}
            </div>
            <div class="modal-message">
                ${message}
            </div>
            <div class='modal-control'>
                <button class="modal-button" type="button" name="button">ok</button>
            </div>
        </div>
    </div>
    `
    var body = dqs('body')
    appendHtml(body, t)
    // css
    var css = `
    <style class="modal-remove">
        .modal-container {
            position: fixed;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
        }
        .modal-mask {
            position: fixed;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            background: black;
            opacity: 0.5;
        }
        .modal-alert {
            margin: 0 auto;
            width: 200px;
            opacity: 1;
        }
        .modal-title {
            text-align: center;
            font-size: 27px;
            background: lightblue;
        }
        .modal-message {
            padding: 10px 5px;
            background: white;
        }
        .modal-button {
            width: 100%;
            height: 100%;
            font-size: 22px;
            border: 0;
        }
        .vertical-center {
            top: 50%;
            position: relative;
            transform: translateY(-50%);
        }
    </style>
    `
    var head = dqs('head')
    appendHtml(head, css)
    // event
    dqs('.modal-button').addEventListener('click', function () {
        console.log('click ok')
        removeAll('.modal-remove')
    })
}

//增加字符串计数方法
String.prototype.count = function (str) {
    //以空格split
    var strArr = this.split(' ')
    var num = 0
    for (var i = 0; i < strArr.length; i++) {
        if (strArr[i] == str) {
            num = num + 1
        }
    }
    return num
}

var countWord = function (str) {
    var strArr = str.split(' ')
    // 数组去重
    var arr = unique(strArr)
    var countArr = []
    for (var i = 0; i < arr.length; i++) {
        var word = arr[i]
        var num  = str.count(word)
        var ele = {
            word:word,
            num:num,
        }
        countArr.push(ele)
    }
    return countArr
}
/**
 * 1. 字符串 不区分大小写
 * 2. 返回的数组按照特定nums从大到小排序
 */
