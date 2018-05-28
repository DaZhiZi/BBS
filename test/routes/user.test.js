const app = require('../../app')
const request = require('supertest')
const expect = require('chai').expect
const config = require('../../tools/config')
const {log} = require('../../tools/utils')

describe('user router test', function () {
    const loginInfo = {
        username: 'test',
        password: 'test',
    }
    var authenticatedUser = request.agent(app)
    before(function (done) {
        authenticatedUser
            .post('/login')
            .send(loginInfo)
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                done(err)
            })
    })

    after(function(done) {
        authenticatedUser
            .post('/user/password')
            .send({
                old : 'test',
                newP: 'test',
                confirmP:'test',
            })
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(res.status).to.equal(200);
                expect(resBody.success).to.be.true
                done(err)
            })
    });

    it('GET / HTML', function (done) {
        authenticatedUser
            .get('/user/')
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                expect(res.text).to.include('bbs-用户中心');
                done(err)
            })
    })

    it('GET /info AJAX', function (done) {
        authenticatedUser
            .get('/user/info/data')
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(res.status).to.equal(200);
                expect(resBody.data).to.have.property('username', 'test');
                done(err)
            })
    })

    it('POST /info AJAX', function (done) {
        authenticatedUser
            .post('/user/info/data')
            .send({
                signature:'懒否，不懒。',
            })
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(resBody.success).to.be.true
                expect(resBody).to.have.property('message');
                expect(resBody.data).to.have.property('signature', '懒否，不懒。');
                done(err)
            })
    })

    it('POST /password AJAX', function (done) {
        authenticatedUser
            .post('/user/password')
            .send({
                old : 'test',
                newP: 'test',
                confirmP:'test111',
            })
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(resBody.success).to.be.true
                expect(resBody).to.have.property('message');
                expect(resBody.data).to.have.property('newPass');
                done(err)
            })
    })
})