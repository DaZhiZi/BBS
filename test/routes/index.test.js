var should = require('should')
var config = require('../../tools/config')
var app = require('../../app')
var request = require('supertest')
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

describe('index router test', function () {
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

    const remove_test_data = {
        username: 'test001',
    }
    after(function(done) {
        // 在本区块的所有测试用例之后执行
        authenticatedUser
            .post('/user/real_remove')
            .send(remove_test_data)
            .end(function (err, res) {
                let resBody = JSON.parse(res.text)
                res.status.should.equal(200)
                resBody.should.be.ok()
                done(err)
            })
    });

    it('GET / HTML', function (done) {
        authenticatedUser
            .get('/')
            .end(function (err, res) {
            //log('res status test', res.status)
            res.status.should.equal(200)
            res.text.should.containEql('bbs-首页')
            done(err)
        })
    })

    it('GET /login/ HTML', function (done) {
        request(app)
            .get('/login/')
            .end(function (err, res) {
            //log('res status test', res.status)
            res.status.should.equal(200)
            res.text.should.containEql('注册 登录')
            done(err)
        })
    })

    it('POST /login AJAX', function (done) {
        request(app)
            .post('/login')
            .send(loginInfo)
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                resBody.success.should.be.ok()
                resBody.data.should.have.property('username', 'test')
                resBody.data.should.have.property('password')
                resBody.data.should.have.property('user_id')
                done(err)
            })
    })

    it('POST /login AJAX dirty', function (done) {
        request(app)
            .post('/login')
            .send({
                username: 'test',
                password: 'test0',
            })
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                resBody.success.should.be.false()
                should(resBody.data).be.exactly(null)
                done(err)
            })
    })

    it('POST /register AJAX', function (done) {
        request(app)
            .post('/register')
            .send({
                username: 'test001',
                password: 'test001',
            })
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                resBody.success.should.be.ok()
                resBody.data.should.have.property('username', 'test001')
                done(err)
            })
    })

    it('GET /logout AJAX', function (done) {
        authenticatedUser
            .get('/logout')
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                resBody.success.should.be.ok()
                should(resBody.data).be.exactly(null)
                done(err)
            })
    })
})