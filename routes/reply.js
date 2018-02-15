var express = require('express')
var router = express.Router()

const Model = require('../models/reply')

const {log, sendHtml} = require('../tools/utils.js')

router.post('/add', async (request, response) => {
    let form = request.body
    let userInfo = request.session
    //log('reply add request.session', request.session)
    //log('reply add request.body', request.body)
    const msg = await Model.add(form, userInfo)
    response.json(msg)
})

router.post('/:reply_id/up', async (request, response) => {
    let form = {_id: request.body.replyId}
    let userInfo = request.session
    //log('id/up request.session', request.session)
    //log('id/up request.body', request.body)
    const msg = await Model.up(form, userInfo)
    //log('msg reply add ', msg)
    response.json(msg)
})

router.get('/all/:theme_id', async (request, response) => {
    //验证用户权限
    let form = {
        theme_id: request.params.theme_id,
    }
    const msg = await Model.all(form)
    response.json(msg)
})

router.post('/remove', async (request, response) => {
    //验证用户权限
    log('delete response.body', request.body)
    let id = request.body._id
    const msg = await Model.remove(id)
    response.json(msg)
})
// 专门用于删除测试数据
router.post('/real_remove', async (request, response) => {
    //log('request.body', request.body, request.session)
    let form = request.body
    const msg = await Model.real_remove(form)
    response.json(msg)
})
module.exports = router