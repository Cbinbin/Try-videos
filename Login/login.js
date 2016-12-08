const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../Login')
const Use = require('../Users/Use')
var Head = require('../Users/Headprts')

//登录
router.post('/', function(req, res) {
	User.findOne({ phone : req.body.phone}, (err,admin) => {
		if(err) return res.send(err)
		else if(!admin) return res.send({error: '找不到此手机号'})
		if(admin.userpassword === req.body.userpassword) {
			jwt.sign({userId: admin._id},
				'secretKey',
				{algorithm: 'HS256',
				 expiresIn: '2h' },    //expiresIn设置token有效期
				(err, token) => {
					if(err) return res.send(err)
					Use.findOne({_id: admin._id}, (err,infmt) => {
						if(err) return res.send(err)
						res.json([{token: token}, admin, infmt])
					})					
				}
			)
		}
		else return res.send({error: '密码错误'})
	})
})


module.exports = router