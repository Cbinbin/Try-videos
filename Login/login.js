const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../Users/index.js')

//登录
router.post('/', function(req, res) {
	User.findOne({ username : req.body.username}, (err,admin) => {
		if(!admin) {
			res.send({error: '找不到此用户名'})
			return
		}
		if(admin.userpassword === req.body.userpassword) {
			jwt.sign({userId: admin._id},
				'secretKey',
				{algorithm: 'HS256'},
				(err, token) => {
					if(err) return res.send({error: '获取token失败'})					
					res.send({token: token})
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