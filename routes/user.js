var express = require('express')
var router = express.Router()

const multer = require('multer')
//这个是缓存目录
var upload = multer({dest: 'uploads/'})

const Model = require('../models/user')
const {log, sendHtml} = require('../tools/utils.js')
/* GET users listing. */
router.get('/', function (request, response) {
    sendHtml(response, '/user.html')
})

router.get('/info', async function (request, response) {
    let form = request.session
    //log('user session', form)
    let info = await Model.getInfo(form)
    //log('user session', info)
    response.send(info)
})

router.post('/info', async function (request, response) {
    let user = request.session
    let form = request.body
    //log('user form', user, form)
    let info = await Model.updateInfo(user, form)
    //log('user 返回值', info)
    response.send(info)
})

router.post('/avatar', upload.single('avatar'), async function (request, response) {
    //通过user——id获得用户名，将文件信息传给model，返回
    let user_id = request.session.user_id
    let avatarFile = request.file
    let msg = await Model.uploadAvatar(user_id, avatarFile)
    //log('req.file', request.file)  // 上传的文件信息
    //log('返回的信息', msg)
    
    response.send(msg)
})

router.post('/password', async function (request, response) {
    let user = request.session
    let form = request.body
    // log('user/password form', user, form)
    let info = await Model.updatePassword(user, form, request)
    //log('user 返回值', info)
    response.send(info)
})

router.post('/real_remove', async (request, response) => {
    //log('request.body', request.body, request.session)
    let form = request.body
    const msg = await Model.real_remove(form)
    response.json(msg)
})

module.exports = router
