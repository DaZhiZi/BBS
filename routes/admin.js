var express = require('express')
var router = express.Router()

const userModel = require('../models/user')

const {log, sendHtml, resMsg} = require('../tools/utils.js')

router.get('/', (request, response) => {
    sendHtml(response, '/admin/topic.html')
})

router.get('/theme', (request, response) => {
    sendHtml(response, '/admin/theme.html')
})

module.exports = router
