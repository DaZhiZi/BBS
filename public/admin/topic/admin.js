var apiAddTopic = function (data, callback) {
    ajax({
        method  : 'POST',
        path    : '/topic/add',
        data    : data,
        callback: function (r) {
            callback(r)
        }
    })
}

$(document).on('click', '.button-topic-add', function (event) {
    let cnName = $('#id-cn-new').val()
    let enName = $('#id-en-new').val()
    let data = {
        cnName: cnName,
        enName: enName,
    }
    let conNum = $('.list-tag li').length < 10
    if (conNum == true) {
        apiAddTopic(data, function (r) {
            let res = JSON.parse(r.response)
            if (res.success == false) {
                log('Topic添加失败, 原因是:',  res.message )
                return
            }
            let htmlTag = tagTemplate(res.data)
            $('.list-tag').append(htmlTag)
            $('#input-new-tag').val('')
        })
    } else {
        genTip(event.target, 'success', '最多只能有五个tag')
    }
})

var apiDelTopic = function (data, callback) {
    ajax({
        method  : 'POST',
        path    : '/topic/remove',
        data    : data,
        callback: function (r) {
            callback(r)
        }
    })
}

$(document).on('click', '.del-tag', function () {
    let id = $(this).parent('.li-tag').find('.single-tag')[0].dataset.id
    apiDelTopic({_id: id}, function (r) {
        let res = JSON.parse(r.response)
        let id = res.data.topic_id
        // log('res id ', id, res)
        $(`.single-tag[data-id=${id}]`).parent().remove()
    })
})

let __main = function () {
    init()
}
__main()