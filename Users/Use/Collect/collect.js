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
//添加收藏
router.post('/:_vid', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.send(err)
		Use.findOne( { _id: usert.userId}, (err,user) => {
			if(err) return res.send(err)
			else if(!user) return res.send({ error: '信息查找失败' })
			const coll = new Collect()
			Detail.findOne({_id: req.params._vid}, (err,detail) => {
				if(err) return res.send(err)
				else if(!detail) return res.send({ error: '视频信息获取失败(id)' })
				Collect.findOne({videoTitle: detail.title}, (err,same) => {
					if(err) return res.send(err)
					else if(!same) console.log(same)
					else if(user.nickname == same.collector) return res.send({ message: '此收藏已存在' })
					coll.set({
						collector : user.nickname,
						author : detail.uploader,
						videoTitle : detail.title,
						vdo_id : detail._id
					})
					coll.save((err, collect) => {
						if(err) return res.send(err)
						res.send({collectId: collect._id})
					})
					Detail.update( {_id: req.params._vid}, 
					{$push: {cocerPerson: usert.userId}, $inc: {concernednumber: 1}}, 
					{upsert : true}, (err,deta) => {
						if(!deta) return console.log('插新失败')
						console.log(deta)
					})
				})
			})
		})
	})
	//
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return console.log(err)
		Use.findOne( { _id: usert.userId}, (err,user) => {
			if(err) return console.log(err)
			Detail.findOne({_id: req.params._vid}, (err, detail) => {
				if(err) return console.log(err)
				Collect.findOne({}, (err) => {
					Collect.find({collector: user.nickname}, { _id: 0, _id: 1}, 
					(err,clets) => {
						if(err) return console.log(err)
						if(!clets) return console.log({error: '3'})
						user.collects = clets
						user.save((err) => {
							if(err) return console.log({error: 'collects更新失败'})
							console.log(clets)
						})
					})
				})
			})
		})
	})
})
//获取该用户的收藏
router.get('/all', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.send(err)
		Use.findOne( { _id: usert.userId}, (err,user) => {
			if(err) return res.send(err)
			else if(!user) return res.send({ error: '信息查找失败' })
			Collect.find({collector: user.nickname}, (err,allco) => {
				if(err) return res.send(err)
				res.json(allco)
			})
		})
	})
})
//获取单个收藏
router.get('/:_cid', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.send(err)
		Use.findOne( { _id: usert.userId}, (err,user) => {
			if(err) return res.send(err)
			else if(!user) return res.send({ error: '信息查找失败' })	
			Collect.findById(req.params._cid, (err,acoll) => {
				if(err) return res.send(err)
				if(user.nickname != acoll.collector) {
					res.send({ error: '用户与收藏者匹配不上' })
					return
				}
				Detail.findById(acoll.vdo_id, (err,adet) => {
					if(err) return res.send(err)
					res.json([acoll, adet])
				})
			})
		})
	})
})
//清除收藏
router.delete('/:_cid', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.send(err)
		Use.findOne( { _id: usert.userId}, (err,user) => {
			if(err) return res.send(err)
			else if(!user) return res.send({ error: '信息查找失败' })	
			Collect.findById(req.params._cid, (err,coll) => {
				if(err) return res.send(err)
				else if(!coll) return res.send({error: '找不到收藏'})
				Detail.update( {_id: coll.vdo_id}, 
				{$pull: {cocerPerson:usert.userId}, $inc: {concernednumber: -1}}, 
				(err,deta) => {
					if(!deta) return console.log('删减失败')
						console.log(deta)
				})
				Collect.remove({_id: req.params._cid}, (err) => {
					if(err) return res.send(err)
					res.send({status: '收藏已删除'})
					Collect.find({collector: user.nickname}, { _id: 0, _id: 1}, 
					(err,clets) => {
						console.log(clets)
						if(!clets) return console.log({error: '3'})
						user.collects = clets
						user.save((err) => {
							if(err) return console.log({error: 'collects更新失败'})
						})
					})
				})
			})
			// Use.update({_id: usert.userId}, 
			// {$pull: {collects:req.params._cid}}, (err,cdeta) => {
			// 	if(!cdeta) return console.log('删减失败')
			// 		console.log(cdeta)
			// })
		})
	})
})
//清除所有收藏
router.delete('/', (req, res)=> {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.send(err)
		Use.findOne( { _id: usert.userId}, (err,user) => {
			if(err) return res.send(err)
			if(!user) return res.send({ error: '信息查找失败' })
			Detail.update( {cocerPerson: usert.userId}, 
			{$pull: {cocerPerson:usert.userId}, $inc: {concernednumber: -1}}, 
			(err,deta) => {
				if(!deta) return console.log('删减失败')
					console.log(deta)
			})
			Collect.remove({collector: user.nickname}, (err) => {
				if(err) return res.send(err)
				res.send({status: '收藏全部清除'})
				Collect.find({collector: [user.nickname]}, { _id: 0, _id: 1}, 
				(err,clets) => {
					console.log(clets)
					if(!clets) return console.log({error: '3'})
					user.collects = clets
					user.save((err) => {
						if(err) return console.log({error: 'collects更新失败'})
					})
				})
			})
		})
	})
})

module.exports = router