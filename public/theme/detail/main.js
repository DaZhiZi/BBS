let addReply = function (data, callback) {
    ajax({
        method  : 'POST',
        data    : data,
        url    : '/reply/add',
        callback: function (r) {
            callback(r)
        }
    })
}

let newReplyData = function () {
    let data = {
        content : $('#id-reply-text').val(),
        theme_id: $('.theme-main .theme-header')[0].dataset.theme_id,
    }
    return data
}

let addReplyTem = function (obj, reply_num) {
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
                <div class="markdown-text">
                    ${obj.content}
                </div>
            </div>
        </div>
    `
    return html
}

let cbAddReply = function (event) {
    let data = newReplyData()
    addReply(data, function (r) {
        let res = JSON.parse(r.response)
        if (res.success) {
            $('.all-reply').show()
            let data = res.data
            let reply_num = $('.cell-reply').length
            let html = addReplyTem(data, reply_num)
            $('.all-reply').append(html)
        } else {
            log('res', res)
        }
    })
}

let apiReplyUp = function (data, callback) {
    ajax({
        method  : 'POST',
        data    : data,
        url    : `/reply/${data.replyId}/up`,
        callback: function (r) {
            callback(r)
        }
    })
}

let cbReplyUp = function (event) {
    let that = $(this)
    let replyId = that.parents('.cell-reply').attr('id')
    let data = {
        replyId: replyId,
    }
    apiReplyUp(data, function (r) {
        let res = JSON.parse(r.response)
        if (res.success) {
            that.siblings('.up-count').text(res.data)
        }
    })
}

let apiThemeColl = function (id, callback) {
    let data = {
        theme_id:id,
    }
    ajax({
        method  : 'POST',
        data    : data,
        url    : '/theme/collect',
        callback: function (r) {
            callback(r)
        }
    })
}
let cbThemeColl = function (e) {
    let theme_id = $(this).parents('.theme-header')[0].dataset.theme_id
    apiThemeColl(theme_id, function (r) {
        let res = JSON.parse(r.response)
        if (res.success) {
            let collect = {
                class:['', 'collect-success'],
                text:['收藏', '取消收藏'],
            }
            let is_collect = res.data.is_collect ? 1 : 0
            log('res.data', res.data)
            toggleClass('collect-success', '.button-theme-collect')
            $('.button-theme-collect').text(collect.text[is_collect])
        }
    })
}

let __main = function () {
    init()
    $(document).on('click', '#id-add-reply', cbAddReply)
    $(document).on('click', '.icon-reply-up', cbReplyUp)
    $(document).on('click', '.button-theme-collect', cbThemeColl)
}

__main()