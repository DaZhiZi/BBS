var express = require('express')
var router = express.Router()

const Model = require('../models/theme')

const {log, sendHtml} = require('../tools/utils.js')

router.get('/new', async (request, response) => {
    //验证用户权限
    sendHtml(response, '/theme/new.html')
})

router.post('/add', async (request, response) => {
    let form = request.body
    let userinfo = request.session.userinfo
    let msg = ''
    if (userinfo.username) {
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
router.get('/detail/:theme_id', async (request, response) => {
    //验证用户权限
    sendHtml(response, '/theme/detail.html')
})

//请求详情数据
router.get('/detail/data/:theme_id', async (request, response) => {
    let user_id = request.session.userinfo.user_id
    let form = {
        _id: request.params.theme_id
    }
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
    let _id = request.body._id
    const msg = await Model.remove({_id:_id})
    response.json(msg)
})

router.post('/collect', async (request, response) => {
    let theme_id = request.body.theme_id
    let user_id = request.session.userinfo.user_id
    const msg = await Model.collect(theme_id, user_id)
    response.json(msg)
})
// 专门用于删除测试数据
router.post('/real_remove', async (request, response) => {
    let form = request.body
    const msg = await Model.real_remove(form)
    response.json(msg)
})

module.exports = router