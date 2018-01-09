var apiAllTopic = function (callback) {
    ajax({
        path    : '/topic/all',
        callback: function (r) {
            callback(r)
        }
    })
}
let cbAllTopic = function (r) {
    let res = JSON.parse(r.response)
    if (res.success) {
        let data = res.data
        //log(' 添加topic后的返回值', data)
        for (var i = 0; i < data.length; i++) {
            let obj = data[i]
            let htmlTag = tagTemplate(obj)
            $('.list-tag').append(htmlTag)
        }
        
    }
}

var apiUserInfo = function (callback) {
    ajax({
        path    : '/user/info',
        callback: function (r) {
            callback(r)
        }
    })
}

let userInfoTem = function (obj) {
    let html = `
        <div>
            <a class="user-avatar" href="/user/${obj.username}">
                <img src=${obj.avatar} title=${obj.username}>
            </a>
            <span class="user_name"><a class="dark" href="/user/${obj.username}">${obj.username}</a></span>
    
            <div class="space clearfix"></div>
            <span class="signature">
                ${obj.signature}
            </span>
        </div>
    `
    return html
}

let cbUserInfo = function (r) {
    //log('r.response', r.response)
    let res = JSON.parse(r.response)
    if (res.success) {
        let data = res.data
        let html = userInfoTem(data)
        $('.user-card').append(html)
    }
}

let init = function () {
    apiAllTopic(cbAllTopic)
    apiUserInfo(cbUserInfo)
}