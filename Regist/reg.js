const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../Login') //账户


//--------------------------------------------------

//注册　
router.post('/user', (req,res) => {
	var re = /[^\w\u4e00-\u9fa5]/g
	User.findOne( {phone: req.body.phone}, (err,un) => {

		if(req.body.phone == null) return res.send({warning: '手机号不能为空'})
		else if(req.body.phone == "") return res.send({warning: '手机号不能为空'})
		else if(req.body.phone.split("", 1) == 0) return res.send({warning: '手机号首位不能为0'})
		if(un) {
			res.send({error: '该手机号已被使用过'})
			return
		}
		
		// if(req.body.phone.length != 11) return res.send({warning: '不是11位手机号'})
		const use = new User()
		if(re.test(req.body.userpassword)) return res.send({warning: '只能为数字,字母或下划线'})
		use.set({
			phone : req.body.phone,
			userpassword : req.body.userpassword
		})
		use.save((err,user) => {
	        if (err) return res.send({ error: '注册保存失败' })
	        res.json(user)
	    })
    })
})
//成员及id
router.get('/user', (req,res) => {
	User.find({}, { _id:0, _id:1, phone:1 },(err,users) => {
		if(err) return res.send({error:'获取失败'})
		res.json(users)
	})
})
//删除
router.delete('/user/:_id', (req,res) => {
	User.remove({ _id: req.params._id }, (err) => {
		if(err) return res.send({error: 'error'})
		res.send({status: 'delete'})
	})
})
//更改密码(需token)
router.patch('/password', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.json('无效的token')
		User.findOne({_id: usert.userId}, (err,inf) => {
			if(!inf) return res.send({error: '信息查找失败'})
			if (req.body.oldpassword === inf.userpassword) 
				inf.userpassword = req.body.userpassword
			else return res.send({error: '密码错误'})
			inf.save((err) => {
				if(err) return res.send({error: '更改失败'})
				res.send({message: '密码更改成功'})
			})
		})
	})
})
//找回密码
var code = false
router.patch('/forgotpassword', (req,res) => {
	User.findOne({phone : req.body.phone}, (err,user) => {
		if(!user) return res.send({error: '此号码没注册过'})
		if(!code) return res.send({error: '验证失败'}) 
		user.userpassword = req.body.userpassword
		user.save((err) => {
			if(err) return res.send({error: '找回失败'})
			res.send({message: '密码更改成功'})
		})
	})
})


module.exports = router