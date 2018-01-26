let addReply = function (data, callback) {
    ajax({
        method  : 'POST',
        data    : data,
        path    : '/reply/add',
        callback: function (r) {
            callback(r)
        }
    })
}

let newReplyData = function () {
    let data = {
        content : $('#id-reply-text').val(),
        theme_id: location.href.split('theme/detail/')[1].split('#')[0],
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
        path    : `/reply/${data.replyId}/up`,
        callback: function (r) {
            callback(r)
        }
    })
}

let cbReplyUp = function (event) {
    let that = $(this)
    let replyId = that.parents('.cell-reply').attr('id')
    apiReplyUp({replyId: replyId,}, function (r) {
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
        path    : '/theme/collect',
        callback: function (r) {
            callback(r)
        }
    })
}
let cbThemeInfo = function (e) {
    let theme_id = $(this).parents('.theme-header')[0].dataset.theme_id
    apiThemeColl(theme_id, function (r) {
        let res = JSON.parse(r.response)
        if (res.success) {
            //1.改变class
            //2.改变data-action
            //3.根据action作出相应的变化，无非就是上面两个加上相应的url
        }
    })
}

let __main = function () {
    init()
    $(document).on('click', '#id-add-reply', cbAddReply)
    $(document).on('click', '.icon-reply-up', cbReplyUp)
    $(document).on('click', '.button-theme-collect', cbThemeInfo)
}

__main()