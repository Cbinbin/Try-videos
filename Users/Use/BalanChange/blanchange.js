const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const Use = require('../../Use')
const Detail = require('../../Videos/Details')
const BChange = require('../BalanChange')

//--------------------------------------------------------

//更改余额     localhost:1103/user/balance?token=${token}
router.patch('/', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.send(err)
		Use.findOne({_id: usert.userId}, (err,useinfm) => {
			if(err) return res.send(err)
			else if(!useinfm) return res.send({error: '信息查找失败'})
			if(req.body.balance == null) req.body.balance = 0
			useinfm.balance = req.body.balance
			useinfm.save((err) => {
				if(err) return res.send(err)
				res.send({message: '已更改余额'})
			})
		})
	})
})

//查询余额
router.get('/', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.send(err)
		Use.findOne( { _id: usert.userId}, {_id:0, balance:1}, (err,ubal) => {
			if(err) return res.send(err)
			else if(!ubal) return res.send({ error: '此id为无效' })
			BChange.find({ userId: usert.userId}, {_id:0, userId:0}, (err, allchange)=> {
				if(err) return res.send(err)
				res.json([ubal, allchange])
			})
		})
	})
})
//-----------------------
//购买
router.post('/pay/:_vid', (req, res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.send(err)
		Use.findOne({_id: usert.userId}, (err, ifm)=> {
			if(err) return res.send(err)
			else if(!ifm) return res.send({ error: '个人信息获取失败'})
			Detail.findOne({_id: req.params._vid}, (err, detail)=> {
				if(err) return res.send(err)
				else if(!detail) return res.send({ error: '视频信息获取失败'})
				if(ifm.balance < req.body.cost) return res.send({warning: '余额不足'})
				if(req.body.cost > 0) {

					Detail.update( {_id: req.params._vid}, 
					{$push: {paidPerson:usert.userId}, $inc: {paidppnumber: 1}}, 
					{upsert : true}, (err,deta) => {
						if(err) return res.send(err)
						else if(!deta) return console.log('插新失败')
							console.log(deta)
					})

					Use.update( {_id: usert.userId}, {$push: {paidVideos:req.params._vid}}, 
					{upsert : true}, (err, paidv) => {
						if(err) return console.log(err)
						if(!paidv) return console.log('插新失败')
						console.log({message: 'paidVideos change'})
					})

					const bchange = new BChange()
					bchange.set({
						userId: usert.userId,
						videoId: detail._id,
						videoTitle: detail.title,
						outlay: -req.body.cost
					})
					bchange.save((err)=> {
						if(err) return console.log('bchange save failed')
						res.json({
							"收入者ID": detail.uploaderId,
							"videoId": detail._id,
							"income": req.body.cost
						})
					})
				}
				else return res.json('no pay')
				ifm.balance = ifm.balance - req.body.cost
				ifm.save((err, ifmm)=> {
					if(err) return res.send(err)
				})
			})
		})
	})
})
//视频收入增加余额
router.post('/:_id/:_vid', (req,res) => {
	if(req.body.income <= 0) return res.send({warning: '收入不可为负'})
	Use.findOne({_id: req.params._id}, (err,useinfm) => {
		if(err) return res.send(err)
		else if(!useinfm) return res.send({error: '信息查找失败'})
		Detail.findOne({_id: req.params._vid}, (err, detail)=> {
			if(err) return res.send(err)
			else if(!detail) return res.send({ error: '视频信息获取失败'})
			const bchange = new BChange()
			bchange.set({
				userId: req.params._id,
				videoId: detail._id,
				videoTitle: detail.title,
				outlay: req.body.income
			})
			bchange.save((err)=> {
				if(err) return res.send(err)
				res.json('ok')
			})
			useinfm.balance = useinfm.balance + Number(req.body.income)
			useinfm.save((err,uinfm) => {
				if(err) return console.log(err)
			})
		})
	})
})

module.exports = router