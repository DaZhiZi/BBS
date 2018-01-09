let topicTemplate = function (obj) {
    let html = `
        <span data-topicid="${obj._id}" class="topic-tab ${obj.enName}">${obj.cnName}</span>
    `
    return html
}

let apiGetTopic = function (callback) {
    ajax({
        method  : 'GET',
        path    : '/topic/all',
        callback: function (r) {
            callback(r)
        }
    })
}

let cbGetTopic = function (r) {
    //log('r.response', r.response)
    let res = JSON.parse(r.response)
    if (res.success) {
        let data = res.data
        for (let i = 0; i < data.length; i++) {
            let title = data[i]
            let htmlTag = topicTemplate(title)
            $('.topic-list').append(htmlTag)
        }
        
    }
}

let cellTemplate = function (obj) {
    let html = `
        <div class="cell">
            <!--主题作者信息 头像和名字-->
            <a class="user-avatar pull-left" href="/user/${obj.userInfo.user_id}">
                <img src="${obj.userInfo.avatar}" title="${obj.userInfo.username}">
            </a>
            <!--浏览信息-->
            <span class="reply-count pull-left">
                <span class="count-of-replies" title="回复数">${obj.browseInfo.reply_num}</span>
                <span class="count-seperator">/</span>
                <span class="count-of-visits" title="点击数">${obj.browseInfo.view_num}</span>
            </span>
            <!--最后回复的信息 reply-id-->
            <a class="last-time pull-right" href="/theme/detail/${obj._id}#${obj.lastReplyInfo._id}">
                <img class="user-small-avatar" src="${obj.lastReplyInfo.userInfo.avatar}">
                <span class="last-reply-time">${obj.lastReplyInfo.update_at}</span>
            </a>
            <!--主要信息-->
            <div class="topic-title-wrapper">
                <!--主题类型，包括class:type-top和title:置顶-->
                <span class="topic-type ${obj.topicInfo.enName}">${obj.topicInfo.cnName}</span>
                <a class="theme-title" href="/theme/detail/${obj._id}" title=${obj.title}>
                    ${obj.title}
                </a>
            </div>
        </div>
    `
    return html
}

let apiGetTheme = function (callback, topicId) {
    let path = ''
    if (topicId == undefined) {
        path = 'all'
    } else {
        path = topicId
    }
    ajax({
        method  : 'GET',
        path    : `/theme/topic/${path}`,
        callback: function (r) {
            callback(r)
        }
    })
}

let cbGetTheme = function (r) {
    $('.theme-all').empty()
    let res = JSON.parse(r.response)
    if (res.success) {
        let data = res.data
        //log('theme data', data.length)
        for (let i = 0; i < data.length; i++) {
            let html = cellTemplate(data[i])
            $('.theme-all').append(html)
        }
        
    }
}

let noRepTheme = function (obj) {
    let html = `
        <li>
            <div><a class="dark topic_title" href="/theme/detail/${obj._id}"
            title="${obj.title}">${obj.title}</a>
            </div>
        </li>
    `
    return html
}

let apiGetNoRep = function (callback) {
    ajax({
        method  : 'GET',
        path    : '/theme/noReply',
        callback: function (r) {
            callback(r)
        }
    })
}

let cbGetNoRep = function (r) {
    //log('apiGetNoRep r.response', r.response)
    let res = JSON.parse(r.response)
    if (res.success) {
        let data = res.data
        for (let i = 0; i < data.length; i++) {
            let obj = data[i]
            let html = noRepTheme(obj)
            $('.no-reply-theme .unstyled').append(html)
        }
        
    }
}

let logOut = function () {
    ajax({
        method  : 'GET',
        path    : `/logout`,
        callback: function (r) {
            log('注销', r.response)
            $('.panel-new-theme').hide()
        }
    })
}

let cbTopicClick = function (r) {
    $('.theme-all').empty()
    let res = JSON.parse(r.response)
    if (res.success) {
        let data = res.data
        for (let i = 0; i < data.length; i++) {
            //log('title', title);
            let html = cellTemplate(data[i])
            $('.theme-all').append(html)
        }
        
    }
}

let switchTopic = function (e) {
    let target = e.target
    $(this).siblings('.topic-tab').removeClass('topic-current')
    $(this).addClass('topic-current')
    let topicId = target.dataset.topicid
    apiGetTheme(cbTopicClick, topicId)
    //log('topicId', topicId)
}

let init = function () {
    //以cb开头的函数，表示是callback
    //获取所有Topic
    apiGetTopic(cbGetTopic)
    //获取所有Theme
    apiGetTheme(cbGetTheme)
    //获取所有最早的，无人回复的话题
    apiGetNoRep(cbGetNoRep)
    //绑定，登出功能
    $(document).on('click', '#logout', logOut)
    //绑定，topic切换功能
    $(document).on('click', '.topic-list .topic-tab', switchTopic)
}
