const app = require('../../app')
const request = require('supertest')
const expect = require('chai').expect
const config = require('../../tools/config')
const {log} = require('../../tools/utils')

describe('topic router test', function () {
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
    const remove_test_data = {
        enName: 'mocha-test',
        cnName: 'mocha测试',
    }
    after(function(done) {
        authenticatedUser
            .post('/topic/real_remove')
            .send(remove_test_data)
            .end(function (err, res) {
                let resBody = JSON.parse(res.text)
                expect(res.status).to.equal(200);
                expect(resBody).to.be.true
                done(err)
            })
    });
    let topic_id;
    it('POST /add AJAX', function (done) {
        authenticatedUser
            .post('/topic/add')
            .send(remove_test_data)
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(resBody).to.have.property('message');
                expect(resBody.success).to.be.true
                expect(resBody.data).to.have.property('enName', 'mocha-test');
                expect(resBody.data).to.have.property('cnName', 'mocha测试');
                topic_id = resBody.data._id
                done(err)
            })
    })

    it('GET /all AJAX', function (done) {
        authenticatedUser
            .get('/topic/all')
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(resBody.success).to.be.true
                expect(resBody.data).to.be.instanceof(Array)
                done(err)
            })
    })

    it('POST /remove AJAX', function (done) {
        authenticatedUser
            .post('/topic/remove')
            .send({_id: topic_id})
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(resBody.success).to.be.true
                expect(resBody).to.have.property('message');
                expect(resBody.data).to.have.property('topic_id');
                done(err)
            })
    })

    it('POST /remove AJAX dirty', function (done) {
        let wrong_topic_id = topic_id + '45l'
        authenticatedUser
            .post('/topic/remove')
            .send({_id: wrong_topic_id})
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(resBody.success).to.be.false
                expect(resBody.data).to.be.null
                done(err)
            })
    })
})