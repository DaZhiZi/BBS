let topicTemplate = function (obj) {
    let html = `
        <span data-topicid="${obj._id}" class="topic-tab ${obj.enName}">${obj.cnName}</span>
    `
    return html
}

let apiAllTopic = function (callback) {
    ajax({
        method  : 'GET',
        path    : '/topic/all',
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
    let path = topicId || 'all'
    ajax({
        method  : 'GET',
        path    : `/theme/topic/${path}`,
        callback: function (r) {
            callback(r)
        }
    })
}

let genTheme = function (arr) {
    for (let i = 0; i < arr.length; i++) {
        let html = cellTemplate(arr[i])
        $('.theme-all').append(html)
    }
}

let pageTem = function (obj) {
    let pageArr = pages(obj.pageNum, obj.pageTotal)
    let temStr = `
        <ul class="pagination">
            <li><a data-num="1">首页</a></li>
            {% for num in pageArr %}
                {% if num == ${obj.pageNum} %}
                    <li><a data-num="{{ num }}" class="page-active">{{ num }}</a></li>
                {% else %}
                    <li><a data-num="{{ num }}">{{ num }}</a></li>
                {% endif %}
            {% endfor %}
            <li><a data-num="{{pageTotal}}"">尾页</a></li>
        </ul>
    `
    let o = {
        pageArr:pageArr,
        pageTotal:obj.pageTotal,
    }
    //log('pageArr', pageArr)
    let html = nunjucks.renderString(temStr, o)
    
    return html
}

let genPage = function (obj) {
    $(".content-footer .pagination").remove()
    let html = pageTem(obj)
    $('.content-footer').append(html)
}

let cbGetTheme = function (r) {
    $('.theme-all').empty()
    let res = JSON.parse(r.response)
    if (res.success) {
        // 现在分两步，一步渲染theme列表，
        // 一步渲染分页
        let data = res.data
        
        let themeArr = data.theme
        //log('theme data', data)
        genTheme(themeArr)
        let page = data.page
        genPage(page)
    }
}

let noRepTheme = function (obj) {
    let html = `
        <li>
            <div>
                <a class="dark topic_title" href="/theme/detail/${obj._id}" title="${obj.title}">
                    ${obj.title}
                </a>
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


let cbLogOut = function (r) {
    log('注销, r.response', r.response)
    $('.panel-new-theme').hide()
}

let logOut = function () {
    ajax({
        method  : 'GET',
        path    : `/logout`,
        callback: function (r) {
            log('注销, r.response', r.response)
            let res = JSON.parse(r.response)
            if (res.success) {
                $('.panel-new-theme').hide()
                location.href = '/login'
            }
        }
    })
}

let switchTopic = function (e) {
    let target = e.target
    $(this).siblings('.topic-tab').removeClass('topic-current')
    $(this).addClass('topic-current')
    let topicId = target.dataset.topicid
    apiGetTheme(cbGetTheme, topicId)
    //log('topicId', topicId)
}

let apiGetPage = function (callback, pageNum) {
    let topicId = $(".topic-current")[0].dataset.topicid
    ajax({
        method  : 'GET',
        path    : `/theme/topic/${topicId}?page=${pageNum}`,
        callback: function (r) {
            callback(r)
        }
    })
}

let switchPage = function (e) {
    let target = e.target
    let pageNum = target.dataset.num
    apiGetPage(cbGetTheme, pageNum)
}

let init = function () {
    //以cb开头的函数，表示是callback, 中间无get之类的，默认是all（或者get）
    //获取所有Topic
    apiAllTopic(cbAllTopic)
    //获取所有Theme
    apiGetTheme(cbGetTheme)
    //获取所有最早的，无人回复的话题
    apiGetNoRep(cbGetNoRep)
    //绑定，登出功能
    $(document).on('click', '#logout', logOut)
    //绑定，topic切换功能
    $(document).on('click', '.topic-list .topic-tab', switchTopic)
    $(document).on('click', '.pagination li', switchPage)
    /**
     * 1.绑定事件
     * 2.获取data-num
     * 3.根据data-num进行ajax请求
     * 4.请求成功后，移除当前theme list内容
     * 5.替换theme list 和分页。
     * 6.给分页添加相应的效果，active or not
     */
}
