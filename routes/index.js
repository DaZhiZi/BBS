var express = require('express')
var router = express.Router()

const userModel = require('../models/user')

const {log, sendHtml, resMsg} = require('../tools/utils.js')

router.get('/', (request, response) => {
    sendHtml(response, '/index.html')
})

router.get('/login', (request, response) => {
    sendHtml(response, '/login.html')
})

router.post('/login', async (request, response) => {
    const form = request.body
    const msg = await userModel.login(form)
    request.session.userinfo = msg.data
    response.send(msg)
})

router.post('/register', async (request, response) => {
    const form = request.body
    let msg = await userModel.add(form)
    response.json(msg)
})

router.get('/logout', (request, response) => {
    request.session.userinfo = null
    let res = resMsg(null, '注销成功')
    response.json(res)
})

router.get('/about', (request, response) => {
    sendHtml(response, '/about.html')
})

module.exports = router
