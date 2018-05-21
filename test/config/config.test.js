// 获取theme，reply，user，topic等需要的ID
const app = require('../../app')
const request = require('supertest')
const expect = require('chai').expect
const {log} = require('../../tools/utils')

let config = {

}
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

    it('GET /topic/all AJAX', function (done) {
        authenticatedUser
            .get('/topic/all')
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(resBody.success).to.be.true;
                if (resBody.data.length == 0) {
                    let msg = "topic 数据为空"
                    console.log('GET /topic/all AJAX', msg);
                    return msg
                }
                let firstData = resBody.data[0]
                config.topic_id = firstData['_id']
                done(err)
            })
    })

    it('GET /theme/topic/all AJAX', function (done) {
        authenticatedUser
            .get('/theme/topic/all')
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(resBody.success).to.be.true;
                if (resBody.data.theme.length == 0) {
                    let msg = "theme 数据为空"
                    console.log('GET /topic/all AJAX', msg);
                    return msg
                }
                let firstData = resBody.data.theme[0]
                config.theme_id = firstData['_id']
                done(err)
            })
    })
    it('GET /reply/all/list AJAX', function (done) {
        authenticatedUser
            .get(`/reply/all/${config.theme_id}`)
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(resBody.success).to.be.true;
                if (resBody.data.length == 0) {
                    let msg = "reply 数据为空"
                    console.log('GET /topic/all AJAX', msg);
                    return msg
                }
                let firstData = resBody.data[0]
                config.reply_id = firstData['_id']
                console.log('config', config);
                done(err)
            })
    })
})

module.exports = config
