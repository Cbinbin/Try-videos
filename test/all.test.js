var request = require('superagent')
var chai = require('chai')
var expect = chai.expect

var ID
var testToken
var videoID

describe('注册', function() {
	it('成功', function(done) {
		request
		.post('http://localhost:1103/reg/user')
		.send({phone: '9876543210', userpassword: '222222'})
		// .set('Accept', 'application/json')
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.body._id).to.be.exist
			ID = res.body._id
			done()
		})	
	})
	it('账号已存在', function(done) {
		request
		.post('http://localhost:1103/reg/user')
		.send({phone: '9876543210', userpassword: '222222'})
		.end(function(err, res) {
			if(err) return console.log(err.message)
		expect(res.text).to.be.equal('{"error":"该手机号已被使用过"}')
			done()
		})	
	})
	it('空', function(done) {
		request
		.post('http://localhost:1103/reg/user')
		.send({phone: '', userpassword: ''})
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.text).to.be.equal('{"warning":"手机号不能为空"}')
			done()
		})	
	})
	it('首位非零', function(done) {
		request
		.post('http://localhost:1103/reg/user')
		.send({phone: '012345', userpassword: '222222'})
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.text).to.be.equal('{"warning":"手机号首位不能为0"}')
			done()
		})	
	})
	it('密码格式错误', function(done) {
		request
		.post('http://localhost:1103/reg/user')
		.send({phone: '98765', userpassword: '!222222'})
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.text).to.be.equal('{"warning":"只能为数字,字母或下划线"}')
			done()
		})	
	})
})

describe('登录', function() {
	it('成功', function(done) {
		request
		.post('http://localhost:1103/login')
		.send({phone: '9876543210', userpassword: '222222'})
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.body[0].token).to.be.exist
			testToken = res.body[0].token
			done()
		})
	})
	it('添加个人信息', function(done) {
		request
		.post('http://localhost:1103/user/information?token=' + testToken)
		.send({
			nickname: '测试', 
			paypassword: 'ceshi', 
			balance: '2'
		})
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.body).to.be.an('object')
			done()
		})
	})
	it('获取个人信息', function(done) {
		request
		.get('http://localhost:1103/user/information?token=' + testToken)
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.body).to.be.an('object')
			// console.log(res.body)
			done()
		})
	})
})
describe('更改支付密码', function() {
	it('旧密码验证', function(done) {
		request
		.post('http://localhost:1103/user/oldpayword?token=' + testToken)
		.send({paypassword: 'ceshi'})
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.text).to.be.equal('{"message":"继续下一步"}')
			done()
		})
	})
	it('改密码', function(done) {
		request
		.patch('http://localhost:1103/user/payword?token=' + testToken)
		.send({paypassword: 'ceshi123'})
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.text).to.be.equal('{"message":"已更改支付密码"}')
			done()
		})
	})
})
describe('改', function() {
	it('更改昵称', function(done) {
		request
		.patch('http://localhost:1103/user/nickname?token=' + testToken)
		.send({nickname: '测试昵称'})
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.text).to.be.equal('{"message":"已更改昵称"}')
			done()
		})
	})
	it('更改余额', function(done) {
		request
		.patch('http://localhost:1103/user/balance?token=' + testToken)
		.send({balance: '22'})
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.text).to.be.equal('{"message":"已更改余额"}')
			done()
		})
	})
	it('token更改密码', function(done) {
		request
		.patch('http://localhost:1103/reg/password?token=' + testToken)
		.send({oldpassword: '222222', userpassword: '111111'})
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.text).to.be.equal('{"message":"密码更改成功"}')
			done()
		})
	})
})

describe('头像', function() {
	it('上传', function(done) {
		request
		.post('http://localhost:1103/user/image?token=' + testToken)
		.attach('photofile','test/testphoto.jpg')    //文件上传
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.text).to.be.exist
			// console.log(res.text)
			done()
		})
	})
	it('更换', function(done) {
		request
		.patch('http://localhost:1103/user/image/replace?token=' + testToken)
		.attach('photofile','test/testimage.png')    //文件上传
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.text).to.be.exist
			// console.log(res.text)
			done()
		})
	})
})

describe('视频', function() {
	it('上传', function(done) {
		request
		.post('http://localhost:1103/user/video?token=' + testToken)
		// .set('enctype', 'multipart/form-data')
		.attach('videofile','test/testphoto.jpg')    //文件上传
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.body._id).to.be.exist
			videoID = res.body._id
			// console.log(res.body._id)
			done()
		})
	})
	it('上传帧图', function(done) {
		request
		.post('http://localhost:1103/user/videophoto/' + videoID + '?token=' + testToken)
		.attach('vidphotofile','test/testimage.png')    //文件上传
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.body).to.be.exist
			// console.log(res.body)
			done()
		})
	})
	it('添加视频信息', function(done) {
		request
		.post('http://localhost:1103/user/video/detail/' + videoID + '?token=' + testToken)
		.send({
			title: '测试视频信息', 
			introduction: '信息简介', 
			price: '2',
			paidppnumber: '2',
			concernednumber: '2'
		})
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.text).to.be.equal('{"status":"信息已以相同id保存"}')
			done()
		})
	})
	it('获取视频信息', function(done) {
		request
		.get('http://localhost:1103/user/video/detail/' + videoID)
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.body).to.be.exist
			// console.log(res.body)
			done()
		})
	})
})

describe('通知和收藏', function() {
	it('提交新通知', function(done) {
		request
		.post('http://localhost:1103/user/notice?token=' + testToken)
		.send({
			videoTitle: ''
		})
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.text).to.be.equal('{"message":"通知已更新"}')
			done()
		})
	})
	it('获取通知', function(done) {
		request
		.get('http://localhost:1103/user/allnotices?token=' + testToken)
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.body).to.be.exist
			// console.log(res.body)
			done()
		})
	})
	it('添加收藏', function(done) {
		request
		.post('http://localhost:1103/user/collect/' + videoID + '?token=' + testToken)
		.send({
			cost: ''
		})
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.text).to.be.equal('{"message":"已添加进收藏"}')
			done()
		})
	})
	it('获取收藏', function(done) {
		request
		.get('http://localhost:1103/user/allcollect?token=' + testToken)
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.body).to.be.exist
			// console.log(res.body)
			done()
		})
	})
})

describe('other', function() {
	it('查看所有手机号', function(done) {
		request
		.get('http://localhost:1103/reg/user')
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.body).to.be.an('array')
			done()
		})
	})
})

describe('删除', function() {
	it('删除头像', function(done) {
		request
		.delete('http://localhost:1103/user/image/' + ID)
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.text).to.be.equal('{"status":"已删除"}')
			done()
		})
	})
	it('删除通知', function(done) {
		request
		.delete('http://localhost:1103/user/allnotices?token=' + testToken)
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.text).to.be.equal('{"status":"通知全部清除"}')
			done()
		})
	})
	it('清除收藏', function(done) {
		request
		.delete('http://localhost:1103/user/allcollectes?token=' + testToken)
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.text).to.be.equal('{"status":"收藏全部清除"}')
			done()
		})
	})
	it('删除视频信息', function(done) {
		request
		.delete('http://localhost:1103/user/video/detail/' + videoID + '?token=' + testToken)
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.text).to.be.equal('{"status":"视频和信息已删除"}')
			done()
		})
	})
	it('删除个人信息', function(done) {
		request
		.delete('http://localhost:1103/user/information?token=' + testToken)
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.text).to.be.equal('{"status":"delete"}')
			done()
		})
	})
	it('删除账号', function(done) {
		request
		.delete('http://localhost:1103/reg/user/' + ID)
		.end(function(err, res) {
			if(err) return console.log(err.message)
			expect(res.text).to.be.equal('{"status":"delete"}')
			done()
		})	
	})
})
