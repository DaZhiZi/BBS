const moment = require('moment')
var fs = require('fs')
const obj = {}

moment.locale('zh-cn') // 使用中文
let formatDate = function (date, friendly) {
    date = moment(date)
    if (friendly) {
        return date.format('YYYY-MM-DD HH:mm')
    } else {
        return date.fromNow()
    }
}

/**
 * 根据key值，获得obj部分value。
 * @param o             原object
 * @param args          要获取的key
 * @returns {{}}        返回新的含有key的新object
 */
obj.getKey = function (o, ...args) {
    let obj = JSON.parse(JSON.stringify(o))
    let newObj = {}
    for (var i = 0; i < args.length; i++) {
        var key = args[i]
        if (obj[key]) {
            newObj[key] = obj[key]
        }
    }
    return newObj
}
// 格式化时间
obj.dealDate = function (o) {
    let obj = JSON.parse(JSON.stringify(o))
    obj.create_at = formatDate(obj.create_at)
    obj.update_at = formatDate(obj.update_at)
    return obj
}

obj.datePlugin = function (schema) {
    schema.methods.create_at_ago = function () {
        return formatDate(this.create_at, true)
    }
    
    schema.methods.update_at_ago = function () {
        return formatDate(this.update_at, true)
    }
}

obj.log = (...args) => {
    const t = moment(Date.now()).format('HH:mm:ss')
    const arg = [t].concat(args)
    // 打印出来的结果带上时间
    console.log.apply(console, arg)
    
    // log 出来的结果写入到文件中
    const content = t + ' ' + args + '\n'
    fs.writeFileSync('log.txt', content, {
        flag: 'a',
    })
}

obj.toArray = function (data) {
    var con = Array.isArray(data)
    if (con) {
        return data
    } else {
        return [data]
    }
}

//如果存在，删除，不存在，添加
obj.toggleArr = function (str, arr) {
    let index = arr.indexOf(str)
    if (index == -1) {
        arr.push(str)
    } else {
        arr.splice(index, 1)
    }
    return arr
}

obj.sendHtml = function (response, path) {
    var fs = require('fs')
    var options = {
        encoding: 'utf-8'
    }
    realPath = './views' + path
    fs.readFile(realPath, options, function (err, data) {
        response.set('Content-Type', 'text/html');
        response.send(data)
    })
}

obj.resMsg = function (data = null, msg = '', success = true) {
    let obj = {
        data   : data,
        success: success,
        message: msg,
    }
    return obj
}

module.exports = obj