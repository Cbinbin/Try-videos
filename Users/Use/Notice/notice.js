const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../../../Login') //账户
const Use = require('../../Use')
const Notice = require('../Notice')  //通知
const Collect = require('../Collect')  //收藏
const Detail = require('../../Videos/Details')  //视频信息
var Head = require('../../Headprts')

//---------------------------------------------------------
//提交新通知
router.post('/', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.send(err)
		Use.findOne( { _id: usert.userId}, (err,user) => {
			if(err) return res.send(err)
			else if(!user) return res.send({ error: '信息查找失败' })
			const noti = new Notice()

			if(req.body.videoId == null) req.body.videoId = ""
			else if(req.body.IrrelevantTF) req.body.videoId = ""
			if(req.body.outlay == null) req.body.outlay = 0
			else if(req.body.outlay == "") req.body.outlay = 0
			else if(req.body.IrrelevantTF) req.body.outlay = 0
			if(req.body.kinds == null) req.body.kinds = 0
			if(req.body.IrrelevantTF == null) req.body.IrrelevantTF = false
			if(req.body.other == null) req.body.other = "通知"
			if(req.body.other == "") req.body.other = "通知"

			Detail.findOne({_id: req.body.videoId}, (err,detail) => {
				// if(err) return res.send(err)
				if(!detail) {
					detail = {uploader: null, title: null}
				}
				Use.findOne({nickname: detail.uploader}, (err,por) => {
					if(err) return res.send(err)
					else if(!por) {
						por = {_id: null, nickname: null}
					}	
					noti.set({  //可有多个id
						owner : user.nickname,
						videoId: req.body.videoId,  //
						videoTitle : detail.title,
						payor: por.nickname,
						payorId: por._id,
						outlay : req.body.outlay,
						kinds : req.body.kinds,    //
						IrrelevantTF : req.body.IrrelevantTF,   //true为'查看',false为'红点'
						other : req.body.other
					})
					noti.save((err,not) => {
						if(err) return res.send(err)
						res.send(not)
					})
				})
			})
		})
	})
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return console.log(err)
		Use.findOne( { _id: usert.userId}, (err,user) => {
			if(err) return console.log(err)
			Detail.findOne((err,detail) => {       //这部分为同步
				Use.findOne((err,por) => {
					Notice.find({owner: user.nickname},{ _id: 0, _id: 1}, 
					(err,noids) => {
						console.log(noids)
						if(err) return console.log({error: '查找不到该用户的通知'})
						user.notices = noids
						user.save((err) => {
							if(err) return console.log({error: 'notices更新失败'})
						})
					})
				})
			})
		})
	})
})
//系统通知
router.post('/system', (req,res)=>{
	const noti = new Notice()
	if(req.body.other == null) req.body.other = "gaga"
	else if(req.body.other == null) req.body.other = "gaga"
	noti.set({
		owner : "系统通知",
		other : req.body.other
	})
	noti.save((err,not) => {
		if(err) return res.send(err)
		res.json(not)
	})
})
//获取该用户通知历史(包含余额支出收入)
router.get('/all', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.send(err)
		Use.findOne( { _id: usert.userId}, (err,user) => {
			if(err) return res.send(err)
			else if(!user) return res.send({ error: '信息查找失败' })
			Notice.find({owner: "系统通知"}, (err,sysnot) => {
				if(err) return res.send(err)
				Notice.find({owner: user.nickname}, (err,allnot) => {
					if(err) return res.send(err)
					res.json([sysnot,allnot])
				})
			})
		})
	})
})
//清除通知
router.delete('/all', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.send(err)
		Use.findOne( { _id: usert.userId}, (err,user) => {
			if(err) return res.send(err)
			else if(!user) return res.send({ error: '信息查找失败' })
			Notice.remove({owner: user.nickname}, (err) => {
				if(err) return res.send(err)
				res.send({status: '通知全部清除'})
				Notice.find({owner: user.nickname},{ _id: 0, _id: 1}, 
				(err,noids) => {
					if(err) return console.log({error: '查找不到该用户的通知'})
					user.notices = noids
					user.save((err) => {
						if(err) return console.log({error: 'notices更新失败'})
					})
				})
			})
		})
	})
})

module.exports = router