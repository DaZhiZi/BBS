//回到顶部
var backTopHtml = `
    <div id="back-top">回到顶部</div>
    `
$('body').append(backTopHtml)

$(document).on('scroll', function () {
    var top = window.scrollY
    if (top > 100) {
        $('#back-top').show()
    } else {
        $('#back-top').hide()
    }
})

$(document).on('click', '#back-top', function () {
    $(document).scrollTop(0)
})