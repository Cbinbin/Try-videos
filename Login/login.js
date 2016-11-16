const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../Login')
const Use = require('../Users/Use')

//登录
router.post('/', function(req, res) {
	User.findOne({ phone : req.body.phone}, (err,admin) => {
		if(!admin) {
			res.send({error: '找不到此用户名'})
			return
		}
		if(admin.userpassword === req.body.userpassword) {
			jwt.sign({userId: admin._id},
				'secretKey',
				{algorithm: 'HS256',
				 expiresIn: '2h' },    //expiresIn设置token有效期
				(err, token) => {
					if(err) return res.send({error: '获取token失败'})
					Use.findOne({_id: admin._id}, (err,infmt) => {
						if(err) return res.send({error: '个人信息获取失败'})
						res.json([{token: token}, admin, infmt])
					})					
				}
			)
		}
	})
})
//登出
router.delete('/', function(req, res) {
	res.send({message: '登出'})
})


module.exports = router