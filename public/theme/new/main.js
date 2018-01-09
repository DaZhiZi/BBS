var apiAddTheme = function (data, callback) {
    ajax({
        method  : 'POST',
        path    : '/theme/add',
        data    : data,
        callback: function (r) {
            callback(r)
        }
    })
}

var getThemeData = function () {
    var title = dqs('#id-input-title').value
    var topic_id = dqs('.topic-list').value
    var content = dqs('#id-text-content').value
    
    var data = {
        title   : title,
        topic_id: topic_id,
        content : content,
    }
    return data
}

let cbNewTheme = function (event) {
    var data = getThemeData()
    //log('data getThemeData', data)
    apiAddTheme(data, function (r) {
        let res = JSON.parse(r.response)
        if (res.success) {
            log('res.data', res.data)
        } else {
            log('res错误', res)
        }
    })
}

let __main = function () {
    init()
    bindEvent('.button-new-theme', 'click', cbNewTheme)
}
__main()
