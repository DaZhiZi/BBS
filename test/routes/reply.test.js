const app = require('../../app')
const request = require('supertest')
const expect = require('chai').expect
const config = require('../../tools/config')
const {log} = require('../../tools/utils')

const config_test = require('../config/config.test')

describe('reply router test', function () {
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
                expect(res.status).to.equal(200);
                done(err)
            })
    })
    const remove_test_data = {
        content : '测试数据，reply内容',
        theme_id: config_test.theme_id,
    }
    after(function(done) {
        authenticatedUser
            .post('/reply/real_remove')
            .send({content : '测试数据，reply内容',})
            .end(function (err, res) {
                let resBody = JSON.parse(res.text)
                expect(res.status).to.equal(200);
                expect(resBody).to.be.true
                done(err)
            })
    });

    it('POST /add AJAX', function (done) {
        authenticatedUser
            .post('/reply/add')
            .send(remove_test_data)
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(resBody).to.have.property('message');
                expect(resBody.success).to.be.true
                expect(resBody.data).to.have.property('content', '测试数据，reply内容');
                expect(resBody.data.userInfo).to.be.an.instanceof(Object).and.to.have.property('username', 'test');
                done(err)
            })
    })

    it('POST /add AJAX dirty', function (done) {
        authenticatedUser
            .post('/reply/add')
            .send({
                content : '测试数据，reply内容',
                theme_id: '5a434a4ceb1bb9078cd120605',
            })
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(resBody.success).to.be.false
                expect(resBody.data).to.be.null
                done(err)
            })
    })

    it('POST /:reply_id/up AJAX', function (done) {
        authenticatedUser
            .post('/reply/5a4346eceb1bb9078cd12064/up')
            .send({
                replyId: '5a4346eceb1bb9078cd12064',
            })
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(resBody.success).to.be.true
                expect(resBody.data).to.be.finite
                done(err)
            })
    })

    it('POST /:reply_id/up AJAX dirty', function (done) {
        authenticatedUser
            .post('/reply/5a4346eceb1bb9078cd120640/up')
            .send({
                replyId: '5a4346eceb1bb9078cd512064',
            })
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                //log('resBody', resBody)
                expect(resBody.success).to.be.false
                expect(resBody.data).to.be.null
                // resBody.success.should.be.false()
                // should(resBody.data).be.exactly(null)
                done(err)
            })
    })

    it('GET /all/:theme_id AJAX', function (done) {
        authenticatedUser
            .get('/reply/all/5a434a4ceb1bb9078cd12065')
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(resBody.success).to.be.true
                expect(resBody.data).to.be.an.instanceof(Array)
                done(err)
            })
    })
})