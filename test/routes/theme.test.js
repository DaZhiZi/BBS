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
3. 对POST请求，事后删除添加的数据。
*/

describe('theme router', function () {
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
    const remove_test_data = {
        'title'   : '单元测试',
        'content' : '单元测试新增主题测试',
    }
    after(function() {
        // 在本区块的所有测试用例之后执行
        authenticatedUser
            .post('/theme/real_remove')
            .send(remove_test_data)
            .end(function (err, res) {
                res.status.should.equal(200)
                done(err)
            })
    });


    //HTML 请求
    it('theme new HTML / 200', function (done) {
        authenticatedUser
            .get('/theme/new/')
            .end(function (err, res) {
            // log('theme new res', res.text)
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
                'topic_id': '5a3ca28bb2ddd607a81be0a5',
                'content' : '单元测试新增主题测试',
            })
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                // log('resBody', resBody)
                resBody.success.should.be.ok()
                //拥有某个属性，且值等于第二个参数
                resBody.data.should.have.property('title', '单元测试')
                // resBody.data.should.have.property('user_id', 'c475c1f5-41af-4ae7-9d6b-195fefa0ec68')
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
            .get('/theme/topic/5a3ca28bb2ddd607a81be0a5')
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
    // 错误的topic_id应该加以处理程序
    it('theme /topic/:topic_id wrong topic_id', function (done) {
        authenticatedUser
            .get('/theme/topic/5a5563bcfafcbc23d01acf0600')
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                resBody.success.should.be.false()
                //拥有某个属性，且值等于第二个参数
                should(resBody.data).be.exactly(null)
                ////拥有某个属性
                //resBody.data.should.have.property('_id')
                done()
            })
    })

    it('theme detail HTML / 200 GET', function (done) {
        authenticatedUser
            .get('/theme/detail/5a434a4ceb1bb9078cd12065')
            .end(function (err, res) {
                // log('theme new res', res.text)
                res.status.should.equal(200)
                res.text.should.containEql('theme详情页')
                done(err)
            })
    })

    it('theme detail data AJAX / 200 GET', function (done) {
        authenticatedUser
            .get('/theme/detail/data/5a434a4ceb1bb9078cd12065')
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                resBody.success.should.be.ok()
                //拥有某个属性，且值等于第二个参数
                resBody.data.should.have.property('content')
                //拥有某个属性
                resBody.data.should.have.property('_id')
                done(err)
            })
    })
    // 对错误 _id 要有统一的处理方式
    it('wrong theme detail data AJAX / 200 GET', function (done) {
        authenticatedUser
            .get('/theme/detail/data/5a434a4ceb1bb9078cd120650')
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                resBody.success.should.not.be.ok()
                should(resBody.data).be.exactly(null)
                done(err)
            })
    })

    it('theme noReply data AJAX / 200 GET', function (done) {
        authenticatedUser
            .get('/theme/noReply')
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                resBody.success.should.be.ok()
                // 数据结构为array
                resBody.data.should.be.instanceof(Array)
                done(err)
            })
    })

    it('theme collect data AJAX post', function (done) {
        authenticatedUser
            .post('/theme/collect')
            .send({
                'theme_id'   : '5a434a4ceb1bb9078cd12065',
            })
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                resBody.success.should.be.ok()
                resBody.data.should.have.property('is_collect')
                done(err)
            })
    })

    it('collect AJAX post wrong theme_id', function (done) {
        authenticatedUser
            .post('/theme/collect')
            .send({
                'theme_id'   : '5a434a4ceb1bb9078cd120650',
            })
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                resBody.success.should.not.be.ok()
                should(resBody.data).be.exactly(null)
                done(err)
            })
    })
})