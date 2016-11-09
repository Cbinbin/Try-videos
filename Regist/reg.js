const express = require('express')
const router = express.Router()
const User = require('../Users') //账户
const Phone = require('../Users/Phones') //手机号码


//--------------------------------------------------

//注册　
router.post('/user/:_id', (req,res) => {
	Phone.findOne( { _id: req.params._id}, (err,ids) => {
		if(!ids) {
			res.send({ error: '该号码没通过验证' })
			return
		}
		User.findOne( {username: req.body.username}, (err,un) => {
			if(un) {
				res.send({error: '该名字已被使用过'})
				return
			}
			const use = new User()
			use.set({
				_id : req.params._id,
				username : req.body.username,
				userpassword : req.body.userpassword
			})
			use.save((err) => {
		        if (err) return res.send({ error: '同一ID只可注册一次' })
		        res.json('ok')
		    })
	    })
	})
})
//成员及id
router.get('/user', (req,res) => {
	User.find({}, { _id:0, _id:1, username:1 },(err,users) => {
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

//--------------------------------------------------

//号码验证
router.post('/phone', (req,res) => {
	Phone.findOne({phonenumber: req.body.phonenumber}, (err,sj) => {
		if (sj) {  
			res.send({error: '该号码已被验证过'})
			return
		}
		const phone = new Phone()
		phone.set({
			phonenumber : req.body.phonenumber
		})
		phone.save((err,ph) => {
	        if (err) return res.send({ error: '号码保存失败' })
	        res.send(ph)
	    })
    })
})
//查看号码
router.get('/phone', (req,res) => {
	Phone.find({}, { _id:0, phonenumber:1 },(err,nums) => {
		if(err) return res.send({error:'获取失败'})
		res.json(nums)
	})
})
//删除
router.delete('/phone/:_id', (req,res) => {
	Phone.remove({ _id: req.params._id }, (err) => {
		if(err) return res.send({error: 'error'})
		res.send({status: 'delete'})
	})
})


module.exports = router