let topicTemplate = function (obj) {
    let html = `
        <option value='${obj._id}' class="${obj.enName}">${obj.cnName}</option>
    `
    return html
}

var apiAllTopic = function (callback) {
    ajax({
        method  : 'GET',
        url    : '/topic/all',
        callback: function (r) {
            callback(r)
        }
    })
}

let cbAllTopic = function (r) {
    //log('r.response', r.response)
    let res = JSON.parse(r.response)
    if (res.success) {
        let data = res.data
        for (var i = 0; i < data.length; i++) {
            let obj = data[i]
            let html = topicTemplate(obj)
            $('.topic-list').append(html)
        }
        
    }
}

var apiUserInfo = function (callback) {
    ajax({
        method  : 'GET',
        url    : '/user/info/data',
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