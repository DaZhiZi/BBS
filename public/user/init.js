let topicTemplate = function (obj) {
    let html = `
        <option value="${obj._id}">${obj.title}</option>
    `
    return html
}

let apiAllTopic = function (callback) {
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
        for (let i = 0; i < data.length; i++) {
            let obj = data[i]
            let html = topicTemplate(obj)
            $('.topic-list').append(html)
        }
    }
}

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

let signTem = function (str) {
    let html = `
        <div class="edit-signature">
            <span>个性签名:</span>
            <span class="info-signature signature">${str}</span>
            <button class="button-edit-signature">编辑</button>
            <button class="button-update-signature">更新</button>
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
        
        let sign = signTem(data.signature)
        $('.edit-user-info .inner').append(sign)
    }
}

let cbEditSignature = function () {
    $(this).siblings('.info-signature').attr('contenteditable', true)
}

let apiUpdateInfo = function (data, callback) {
    ajax({
        method  : 'POST',
        data    : data,
        path    : '/user/info',
        callback: function (r) {
            callback(r)
        }
    })
}

let cbUpdateSignature = function () {
    $(this).siblings('.info-signature').attr('contenteditable', false)
    let text = $(this).siblings('.info-signature').text()
    
    apiUpdateInfo({signature: text}, function (r) {
        let res = JSON.parse(r.response)
        if (res.success) {
            $('.signature').text(res.data.signature)
            
        }
    })
}

// 文件的读取
// 预览本地图片
let fileRead = function () {
    let containerAll = dqs('.container-all')
    
    // 不能直接写event.target.files
    let target = event.target
    let files = target.files
    let len = files.length
    for (let i = 0; i < len; i++) {
        let f = files[i]
        
        let reader = new FileReader()
        // 文件读取成功后
        let createImg = function (file) {
            
            return function (e) {
                let img = `
                        <img class="img-circle" src="${this.result}" />
                        `
                //console.log('this.result', e.target.result);
                appendHtml(containerAll, img)
            }
        }
        reader.onload = createImg()
        //读取文件内容
        reader.readAsDataURL(f)
        
    }
    
}

let cbFileRead = function () {
    fileRead()
    $('.container-all img').remove()
}

let init = function () {
    apiUserInfo(cbUserInfo)
    apiAllTopic(cbAllTopic)
    $(document).on('click', '.button-update-signature', cbUpdateSignature)
    $(document).on('click', '.button-edit-signature', cbEditSignature)
    bindEvent('.input-file', 'change', cbFileRead)
}

