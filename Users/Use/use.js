const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../../Login') //账户
const Use = require('../Use')
const Notice = require('./Notice')  //通知
const Collect = require('./Collect')  //收藏
const Detail = require('../Videos/Details')  //视频信息
var Head = require('../Headprts')

//--------------------------------------------------------

//添加用户个人信息   //!只能添加一次,想修改只能用patch分开去修改!
router.post('/information', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.send(err)
		const uu = new Use()
		Use.findOne({ nickname: req.body.nickname }, (err,same) => {
			if(same) return res.send({error: '昵称已存在,请重命名' })    //昵称不允许出现相同
			if(req.body.nickname == null) req.body.nickname = ""
			if(req.body.paypassword == null) req.body.paypassword = ""
			if(req.body.balance == null) req.body.balance = 0	
			if(req.body.balance == "") req.body.balance = 0 //设置余额为0
			if(req.body.paidVideos == null) req.body.paidVideos = []
			if(req.body.notices == null) req.body.notices = []
			if(req.body.collects == null) req.body.collects = []
			User.findOne({_id: usert.userId}, (err,userp) => {
				// if(req.body.nickname == "") req.body.nickname = userp.phone
				Head.findOne({_id: usert.userId}, (err,head) => {
					if(err) return res.send(err)
					else if(!head) head = {headprturl: ""}
					uu.set({
						_id : usert.userId,
						nickname : req.body.nickname,
						headPortrait : head.headprturl,
						phone : userp.phone,
						paypassword : req.body.paypassword,
						balance : req.body.balance,
						paidVideos : req.body.paidVideos,
						notices : req.body.notices,
						collects : req.body.collects
					})
					uu.save((err, uuu) => {
						if(err) return res.send(err)
						console.log('information added success')
						// res.send({status: '信息已保存'})
						res.json(uuu)
					})
				})
			})
		})
	})
})
//个人信息
router.get('/information/:_id', (req,res) => {
	Use.findById(req.params._id, (err,usus) => {
		if(err) return res.send(err)
		res.json(usus)
	})
})
//删除个人信息
router.delete('/information', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.send(err)
		Use.remove({ _id: usert.userId }, (err) => {
			if(err) return res.send(err)
			res.send({status: 'delete'})
		})
	})
})
//
router.get('/informations', (req,res) => {
	Use.find({}, (err,all) => {
		if(err) return res.send(err)
		res.json(all)
	})
})

//-----------------------------------------------------

var sign = false
//旧密码验证
router.post('/oldpayword', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.send(err)
		Use.findOne({_id: usert.userId}, (err,inf) => {
			if(err) return res.send(err)
			else if(!inf) return res.send({error: '信息查找失败'})
			if(req.body.paypassword === inf.paypassword) {
				res.send({message: '继续下一步'})
				return sign = true
			}
			else {
				sign = false
				return res.send({error: '密码不正确'})
			}
		})
	})
})
//更改支付密码
router.patch('/payword', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.send(err)
		Use.findOne({_id: usert.userId}, (err,inf) => {
			if(err) return res.send(err)
			else if(!inf) return res.send({error: '信息查找失败'})
			if(inf.paypassword == "") { 
				inf.paypassword = req.body.paypassword
			}
			else if (inf.paypassword) {
				if(sign == true) inf.paypassword = req.body.paypassword
				else {
					return res.send({error: '没通过密码验证'})	
				}
				sign = false		
			}
			inf.save((err) => {
				if(err) return res.send(err)
				res.send({message: '已更改支付密码'})
				console.log(sign)
			})
		})
	})
})
//获取支付密码
router.get('/payword', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.send(err)
		Use.findById( usert.userId, {_id:0, paypassword:1}, (err,paywd) => {
			if(err) return res.send(err)
			res.json(paywd)
		})
	})	
})

//-------------------------------------------------------

//更改昵称    localhost:1103/user/nickname?token=${token}
router.patch('/nickname', (req,res) => {
	var token = req.query.token
	var nnn
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.send(err)
		Use.findOne({_id: usert.userId}, (err,useinfm) => {
			if(err) return res.send(err)
			else if(!useinfm) return res.send({error: '信息查找失败'})
			if(req.body.nickname == null) return res.send({warning: '不能为空'})
			nnn = useinfm.nickname
			Use.findOne({ nickname: req.body.nickname }, (err,same) => {
				if(same) return res.send({error: '昵称已存在,请重命名' })
				useinfm.nickname = req.body.nickname
				useinfm.save((err) => {
					if(err) return res.send(err)
					res.send({message: '已更改昵称'})
				})
				Detail.find({uploader: nnn}, (err,det) => {
					if(!det) return console.log(err)
					det.map((item,index) => {
						item.uploader = req.body.nickname
						item.save((err) => {
							if(err) return console.log({error: 'd更改失败'})
						})
					})
				})     //连同视频信息中的上传者
				Notice.find({owner: nnn}, (err,not) => {
					if(!not) return console.log(err)
					not.map((item,index) => {
						item.owner = req.body.nickname
						item.save((err) => {
							if(err) return console.log({error: 'n更改失败'})
						})
					})
				})    //连同通知中的本人
				Collect.find({collector: nnn}, (err,col) => {
					if(!col) return console.log(err)
					col.map((item,index) => {
						item.collector = req.body.nickname
						item.save((err) => {
							if(err) return console.log({error: 'cc更改失败'})
						})
					})
				})    //连同收藏中的收藏人和视频作者
				Collect.find({author: nnn}, (err,col) => {
					if(!col) return console.log(err)
					col.map((item,index) => {
						item.author = req.body.nickname
						item.save((err) => {
							if(err) return console.log({error: 'ca更改失败'})
						})
					})
				})
			})
		})
	})
})




module.exports = router