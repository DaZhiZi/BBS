const app = require('../../app')
const request = require('supertest')
const expect = require('chai').expect
const config = require('../../tools/config')
const {log} = require('../../tools/utils')

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
                expect(res.status).to.equal(200);
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
                expect(res.status).to.equal(200);
                expect(resBody).to.be.true
                done(err)
            })
    });

    it('GET / HTML', function (done) {
        authenticatedUser
            .get('/')
            .end(function (err, res) {
            expect(res.status).to.equal(200);
            expect(res.text).to.include('bbs-首页');
            done(err)
        })
    })

    it('GET /login/ HTML', function (done) {
        request(app)
            .get('/login/')
            .end(function (err, res) {
            expect(res.status).to.equal(200);
            expect(res.text).to.include('注册 登录')
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
                let resBody = JSON.parse(res.text);
                expect(resBody.success).to.be.true
                expect(resBody.data).to.have.property('username', 'test');
                expect(resBody.data).to.have.property('password');
                expect(resBody.data).to.have.property('user_id');
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
                expect(resBody.success).to.be.false;
                expect(resBody.data).to.be.null;
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
                expect(resBody.success).to.be.true
                expect(resBody.data).to.have.property('username', 'test001');
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
                expect(resBody.success).to.be.true;
                expect(resBody.data).to.be.null;
                done(err)
            })
    })
})