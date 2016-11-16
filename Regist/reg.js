const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../Login') //账户


//--------------------------------------------------

//注册　
router.post('/user', (req,res) => {
	User.findOne( {phone: req.body.phone}, (err,un) => {
		if(un) {
			res.send({error: '该手机号已被使用过'})
			return
		}
		const use = new User()
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
//更改密码
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


module.exports = router