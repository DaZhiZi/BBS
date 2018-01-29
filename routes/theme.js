var express = require('express')
var router = express.Router()

const Model = require('../models/theme')

const {log, sendHtml} = require('../tools/utils.js')

router.get('/new', async (request, response) => {
    //验证用户权限
    sendHtml(response, '/theme/new.html')
})

router.post('/add', async (request, response) => {
    log('request.session', request.session)
    log('request.body', request.body)
    let form = request.body
    let userInfo = request.session
    let msg = ''
    if (userInfo.username) {
        msg = await Model.add(form, userInfo)
    } else {
        msg = '请先登录'
    }
    response.json(msg)
})

router.get('/topic/:topic_id', async (request, response) => {
    //验证用户权限
    //log('不带page request.path', request.path, request.query)
    let pageNum = request.query.page
    let topic_id = request.params.topic_id
    const msg = await Model.all({topic_id: topic_id}, pageNum)
    response.json(msg)
})

//请求详情页面
router.get('/detail/:_id', async (request, response) => {
    //验证用户权限
    sendHtml(response, '/theme/detail.html')
})

//请求详情数据
router.get('/detail/data/:_id', async (request, response) => {
    //log('request.session', request.session.user_id)
    let user_id = request.session.user_id
    let form = {_id: request.params._id}
    const msg = await Model.detail(form, user_id)
    response.json(msg)
})

router.get('/noReply', async (request, response) => {
    const msg = await Model.noReply()
    response.json(msg)
})

router.post('/remove', async (request, response) => {
    //验证用户权限
    //log('delete response.body', request.body)
    let id = request.body._id
    const msg = await Model.remove(id)
    response.json(msg)
})

router.post('/collect', async (request, response) => {
    //log('request.body', request.body, request.session)
    let theme_id = request.body.theme_id
    let user_id = request.session.user_id
    const msg = await Model.collect(theme_id, user_id)
    response.json(msg)
})

module.exports = router