const should = require('should')
const config = require('../../tools/config')
const app = require('../../app')
const request = require('supertest')
const index = require('../../routes/index')
const {log} = require('../../tools/utils')
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
    //所有单元测试执行前的钩子
    // 对于POST请求添加的数据，应该在test执行完之后，删除掉。
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
                res.status.should.equal(200)
                done(err)
            })
    })
    
    //HTML 请求
    it('theme new HTML / 200', function (done) {
        authenticatedUser
            .get('/theme/new/')
            .end(function (err, res) {
            log('res', res.status)
            res.status.should.equal(200)
            res.text.should.containEql('新增帖子')
            res.text.should.containEql('提交新帖子')
            done(err)
        })
    })
    //POST请求，预先执行登录程序
    // 正确的用户名和密码
    it('theme add HTML / 200 POST', function (done) {
        authenticatedUser
            .post('/theme/add')
            .send({
                'title'   : '单元测试',
                'topic_id': '5a5563c9fafcbc23d01acf07',
                'content' : '单元测试新增主题测试',
            })
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                //log('resBody', resBody)
                resBody.success.should.be.ok()
                //拥有某个属性，且值等于第二个参数
                resBody.data.should.have.property('title', '单元测试')
                resBody.data.should.have.property('user_id', 'c475c1f5-41af-4ae7-9d6b-195fefa0ec68')
                //拥有某个属性
                resBody.data.should.have.property('_id')
                done()
            })
    })
    
    //错误的topic ID，
    it('theme add wrong topic_id / 200 POST', function (done) {
        authenticatedUser
            .post('/theme/add')
            .send({
                'title'   : '单元测试',
                'topic_id': '5a5563c9fafcbc23d01acf07000',
                'content' : '单元测试新增主题测试',
            })
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                //log('resBody', resBody)
                resBody.success.should.not.be.ok()
                done()
            })
    })
    
    it('theme /topic/:topic_id / 200 GET', function (done) {
        authenticatedUser
            .get('/theme/topic/5a5563bcfafcbc23d01acf06')
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                //log('resBody', resBody)
                resBody.success.should.be.ok()
                //拥有某个属性，且值等于第二个参数
                resBody.data.theme.should.be.instanceof(Array)
                resBody.data.should.have.property('page')
                ////拥有某个属性
                //resBody.data.should.have.property('_id')
                done()
            })
    })
    //todo 错误的topic_id应该加以处理程序
    it('theme /topic/:topic_id wrong topic_id', function (done) {
        authenticatedUser
            .get('/theme/topic/5a5563bcfafcbc23d01acf0600')
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                log('resBody', resBody.data.theme)
                resBody.success.should.be.ok()
                //拥有某个属性，且值等于第二个参数
                resBody.data.theme.should.be.instanceof(Array)
                resBody.data.should.have.property('page')
                ////拥有某个属性
                //resBody.data.should.have.property('_id')
                done()
            })
    })
})