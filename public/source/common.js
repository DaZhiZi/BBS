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

let page_foot_html = function () {
    let html = `
    	<div id="footer-main">
            <div class="links">
                <a class="dark" href="/rss">RSS</a>
                |
                <a class="dark" href="https://github.com/cnodejs/nodeclub/">源码地址</a>
            </div>
            <div class="col-fade">
                <p>CNode 社区为国内最专业的 Node.js 开源技术社区，致力于 Node.js 的技术研究。</p>
            </div>
        </div>
    `
    return html
}
let foot_html = page_foot_html()
$('.page-footer').append(foot_html)

let friends_chain_html = function () {
    let html = `
        <div class="header">
            <span class="col_fade">友情社区</span>
        </div>
        <div class="inner">
            <ol class="friendship-community">
                <li>
                    <a href="https://ruby-china.org/" target="_blank">
                        <img src="//o4j806krb.qnssl.com/public/images/ruby-china-20150529.png">
                    </a>
                </li>
                <div class="sep10"></div>
                <li>
                    <a href="http://golangtc.com/" target="_blank">
                        <img src="//o4j806krb.qnssl.com/public/images/golangtc-logo.png">
                    </a>
                </li>
                <div class="sep10"></div>
                <li>
                    <a href="http://phphub.org/" target="_blank">
                        <img src="//o4j806krb.qnssl.com/public/images/phphub-logo.png">
                    </a>
                </li>
                <div class="sep10"></div>
                <li>
                    <a href="https://testerhome.com/" target="_blank">
                        <img src="//dn-cnode.qbox.me/FjLUc7IJ2--DqS706etPQ1EGajxK">
                    </a>
                </li>
            </ol>
        </div>
    `
    return html
}
let friends_chain = friends_chain_html()
$('.friends_chain').append(friends_chain)

let client_app_html = function () {
    let html = `
        <div class="header">
            <span class="col_fade">客户端二维码</span>
        </div>
        <div class="inner cnode-app-download">
            <img src="/images/二维码.jpg" class="img-weixin">
            <br>
            <a href="https://github.com/soliury/noder-react-native" target="_blank">客户端源码地址</a>
        </div>
    `
    return html
}
let client_app = client_app_html()
$('.client_app').append(client_app)