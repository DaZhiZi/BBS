var express = require('express')
var router = express.Router()

const userModel = require('../models/user')

const {log, sendHtml, resMsg} = require('../tools/utils.js')

router.get('/', (request, response) => {
    sendHtml(response, '/admin.html')
})

module.exports = router
