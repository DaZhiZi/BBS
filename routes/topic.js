var express = require('express')
var router = express.Router()

const Model = require('../models/topic')

const {log} = require('../tools/utils.js')

router.post('/add', async (request, response) => {
    let form = {
        author: request.session.username,
        enName: request.body.enName,
        cnName: request.body.cnName,
    }
    const msg = await Model.add(form)
    response.json(msg)
})

router.get('/all', async (request, response) => {
    //验证用户权限
    const msg = await Model.all()
    //log('all msg', msg)
    response.json(msg)
})

router.post('/remove', async (request, response) => {
    //验证用户权限
    log('delete response.body', request.body)
    let id = request.body._id
    const msg = await Model.remove(id)
    response.json(msg)
})

module.exports = router