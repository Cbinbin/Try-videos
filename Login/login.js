const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../Login')
const Use = require('../Users/Use')
var Head = require('../Users/Headprts')

//登录
router.post('/', function(req, res) {
	User.findOne({ phone : req.body.phone}, (err,admin) => {
		if(!admin) {
			res.send({error: '找不到此手机号'})
			return
		}
		if(admin.userpassword === req.body.userpassword) {
			jwt.sign({userId: admin._id},
				'secretKey',
				{algorithm: 'HS256',
				 expiresIn: '1h'},    //expiresIn设置token有效期
				(err, token) => {
					if(err) return res.send({error: '获取token失败'})
						
					Use.findOne({_id: admin._id}, (err,infmt) => {
						if(err) return res.send({error: '个人信息获取失败'})
						res.json([{token: token}, admin, infmt])
					})					
				}
			)
		}
		else return res.send({error: '密码错误'})
	})
})
//登出
router.delete('/', function(req, res) {
	res.send({message: '登出'})
})


module.exports = router