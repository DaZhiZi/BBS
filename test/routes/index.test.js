var should = require('should')
var config = require('../../tools/config')
var app = require('../../app')
var request = require('supertest')(app)
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
    
    it('should / 200', function (done) {
        request.get('/').end(function (err, res) {
            log('res', res.status)
            res.status.should.equal(200)
            res.text.should.containEql('无人回复的话题')
            res.text.should.containEql('友情社区')
            done(err)
        })
    })
    
    it('should /?page=-1 200', function (done) {
        request.get('/?page=-1').end(function (err, res) {
            res.status.should.equal(200)
            res.text.should.containEql('积分榜')
            res.text.should.containEql('友情社区')
            done(err)
        })
    })
    
    it('should /sitemap.xml 200', function (done) {
        request.get('/sitemap.xml')
            .expect(200, function (err, res) {
                res.text.should.containEql('<url>')
                done(err)
            })
    })
    
    it('should /app/download', function (done) {
        request.get('/app/download')
            .expect(302, function (err, res) {
                done(err)
            })
    })
})