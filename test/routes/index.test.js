var should = require('should')
var config = require('../../tools/config')
var app = require('../../app')
var request = require('supertest')
const index = require('../../routes/index')
var {log} = require('../../tools/utils')
/*

测试用例目前分为两种
1. 网页(should)
    对网页的关键字进行包含判断--首页：无人回复话题
2. GET、POST请求(logic judge --> mocha)
    对返回的数据进行判别.
    GET:    success--true OR false, data.length
    POST:   success--true OR false, data.username(或其他字段的判断, Object contain)
*/

describe('test/controllers/site.test.js', function () {
    const loginInfo = {
        username: 'test',
        password: 'test',
    }
    const authenticatedUser = request.agent(app)
    before(function (done) {
        authenticatedUser
            .post('/login')
            .send(loginInfo)
            .end(function (err, res) {
                res.status.should.equal(200)
                done(err)
            })
    })
    
    it('should / 200', function (done) {
        authenticatedUser.get('/').end(function (err, res) {
            log('res status test', res.status)
            res.status.should.equal(200)
            res.text.should.containEql('bbs-首页')
            done(err)
        })
    })
    
})