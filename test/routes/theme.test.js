const app = require('../../app')
const request = require('supertest')
const expect = require('chai').expect
const config = require('../../tools/config')
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

describe('theme router test', function () {
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
                expect(res.status).to.equal(200);
                done(err)
            })
    })
    const remove_test_data = {
        'title'   : '单元测试',
        'content' : '单元测试新增主题测试',
    }
    after(function(done) {
        // 在本区块的所有测试用例之后执行
        authenticatedUser
            .post('/theme/real_remove')
            .send(remove_test_data)
            .end(function (err, res) {
                let resBody = JSON.parse(res.text)
                expect(res.status).to.equal(200);
                expect(resBody).to.be.true
                done(err)
            })
    });

    //HTML 请求
    it('GET /new HTML', function (done) {
        authenticatedUser
            .get('/theme/new/')
            .end(function (err, res) {
            // log('theme new res', res.text
            expect(res.status).to.equal(200);
            expect(res.text).to.include('新增帖子');
            expect(res.text).to.include('提交新帖子');
            done(err)
        })
    })

    it('POST /add AJAX', function (done) {
        authenticatedUser
            .post('/theme/add')
            .send({
                'title'   : '单元测试',
                'topic_id': '5a3ca28bb2ddd607a81be0a5',
                'content' : '单元测试新增主题测试',
            })
            .expect(200)
            .end(function ( err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(resBody.success).to.be.true
                expect(resBody.data).to.have.property('title', '单元测试');
                expect(resBody.data).to.have.property('_id');
                done(err)
            })
    })
    
    //错误的topic ID，
    it('POST /add AJAX dirty', function (done) {
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
                expect(resBody.success).to.be.false
                //log('resBody', resBody)
                // resBody.success.should.be.false()
                done(err)
            })
    })
    
    it('GET /topic/:topic_id AJAX', function (done) {
        authenticatedUser
            .get('/theme/topic/5a3ca28bb2ddd607a81be0a5')
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(resBody.success).to.be.true
                expect(resBody.data.theme).to.be.instanceof(Array)
                expect(resBody.data).to.have.property('page');
                done(err)
            })
    })

    it('GET /topic/:topic_id AJAX dirty', function (done) {
        authenticatedUser
            .get('/theme/topic/5a5563bcfafcbc23d01acf0600')
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(resBody.success).to.be.false
                expect(resBody.data).to.be.null
                done(err)
            })
    })

    it('GET /detail/:theme_id AJAX', function (done) {
        authenticatedUser
            .get('/theme/detail/5a434a4ceb1bb9078cd12065')
            .end(function (err, res) {
                expect(res.status).to.equal(200);
                expect(res.text).to.include('theme详情页');
                done(err)
            })
    })

    it('GET /detail/data/:theme_id AJAX', function (done) {
        authenticatedUser
            .get('/theme/detail/data/5a434a4ceb1bb9078cd12065')
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(resBody.success).to.be.true
                expect(resBody.data).to.have.property('content');
                expect(resBody.data).to.have.property('_id');
                done(err)
            })
    })

    it('GET /detail/data/:theme_id AJAX dirty', function (done) {
        authenticatedUser
            .get('/theme/detail/data/5a434a4ceb1bb9078cd120')
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(resBody.success).to.be.false
                expect(resBody.data).to.be.null
                done(err)
            })
    })

    it('GET /noReply AJAX', function (done) {
        authenticatedUser
            .get('/theme/noReply')
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(resBody.success).to.be.true
                expect(resBody.data).to.be.instanceof(Array)
                done(err)
            })
    })

    it('POST /collect AJAX', function (done) {
        authenticatedUser
            .post('/theme/collect')
            .send({
                'theme_id'   : '5a434a4ceb1bb9078cd12065',
            })
            .expect(200)
            .end(function (err, res) {
                if (err) done(err)
                let resBody = JSON.parse(res.text)
                expect(resBody.success).to.be.true
                expect(resBody.data).to.have.property('is_collect')
                done(err)
            })
    })

    it('POST /collect AJAX dirty', function (done) {
        authenticatedUser
            .post('/theme/collect')
            .send({
                'theme_id'   : '5a434a4ceb1bb9078cd120650',
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
})