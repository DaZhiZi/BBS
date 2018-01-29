//侧边栏，用户信息
let apiUserInfo = function (callback) {
    ajax({
        method  : 'GET',
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

//主题信息
let apiThemeInfo = function (callback) {
    let theme_id = location.pathname.split('theme/detail/')[1]
    ajax({
        method  : 'GET',
        path    : `/theme/detail/data/${theme_id}`,
        callback: function (r) {
            callback(r)
        }
    })
}

let transInfoData = function (obj) {
    obj.userInfo = obj.userInfo || {}
    obj.topicInfo = obj.topicInfo || {}
    obj.content = marked(obj.content)
    return obj
}

let themeInfoTem = function (obj) {
    //log('themeInfoTem', obj.is_collect)
    //初始化时判断obj.is_collect--是否为收藏
    let collect = {
        class:['', 'collect-success'],
        text:['收藏', '取消收藏'],
    }
    let is_collect = obj.is_collect ? 1 : 0
    let html = `
        <div class="header theme-header" data-theme_id="${obj._id}">
            <span class="theme-full-title">
                ${obj.title}
            </span>
            <div class="changes">
                <span>发布于 ${obj.create_at}</span>
                <span>作者 <a href="/user/${obj.userInfo.username}">${obj.userInfo.username}</a></span>
                <span>${obj.browseInfo.view_num} 次浏览</span>
                <span> 来自 ${obj.topicInfo.cnName}</span>
                <button class="button-theme-collect pull-right ${collect.class[is_collect]}">${collect.text[is_collect]}</button>
            </div>
        </div>
        <div class="inner">
            <div class="theme-content">
                <div class="markdown-body">
                    ${obj.content}
                </div>
            </div>
        </div>
    `
    return html
}

let cbThemeInfo = function (r) {
    let res = JSON.parse(r.response)
    if (res.success) {
        let data = transInfoData(res.data)
        let info = themeInfoTem(data)
        
        $('.theme-main').append(info)
        $('head title').text(res.data.title)
    }
}

let getAllReply = function (callback) {
    let theme_id = location.pathname.split('theme/detail/')[1]
    ajax({
        method  : 'GET',
        path    : `/reply/all/${theme_id}`,
        callback: function (r) {
            callback(r)
        }
    })
}

let allReplyInfoTem = function (obj, reply_num) {
    let html = `
        <div class="cell-reply reply-area reply-item" data-reply-id="${obj._id}" data-reply-to-id=""
        id="${obj._id}">
            <div class="author-content">
                <a href="/user/${obj.userInfo.username}" class="user-avatar">
                    <img src="${obj.userInfo.avatar}" title="${obj.userInfo.username}">
                </a>
        
                <div class="user-info">
                    <a class="dark reply-author" href="/user/${obj.userInfo.username}">${obj.userInfo.username}</a>
                    <a class="reply-time" href="#${obj._id}">${reply_num + 1}楼 • ${obj.update_at}</a>
                </div>
                
                <div class="user-action">
                    <span>
                        <i class="glyphicon glyphicon-thumbs-up icon-reply-up" title="赞同"></i>
                        <span class="up-count">${obj.ups.length}</span>
                    </span>
        
                    <span>
                        <i class="fa fa-reply reply2-btn" title="回复"></i>
                    </span>
                </div>
            </div>
            <div class="reply_content from-${obj.userInfo.username}">
                <div class="markdown-body">
                    ${obj.content}
                </div>
            </div>
        </div>
    `
    return html
}

let cbAllReply = function (r) {
    //log('ThemeInfo r.response', r.response)
    let res = JSON.parse(r.response)
    if (res.success) {
        let data = res.data
        for (var i = 0; i < data.length; i++) {
            let obj = data[i]
            //log('data[i]', data[i])
            obj.content = marked(obj.content)
            let html = allReplyInfoTem(obj, i)
            $('.all-reply').append(html)
        }
        
    }
}

let init = function () {
    apiUserInfo(cbUserInfo)
    apiThemeInfo(cbThemeInfo)
    getAllReply(cbAllReply)
}

