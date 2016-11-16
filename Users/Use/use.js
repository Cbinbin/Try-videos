const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const Use = require('../Use')
const Notice = require('./Notice')  //通知
const Collect = require('./Collect')  //收藏
const Detail = require('../Videos/Details')  //视频信息

//--------------------------------------------------------

//添加用户个人信息   //!只能添加一次,想修改只能用patch分开去修改!
router.post('/information', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.json('无效的token')
		const uu = new Use()
		if(req.body.nickname == null) req.body.nickname = ""
		if(req.body.paypassword == null) req.body.paypassword = ""
		if(req.body.balance == null) req.body.balance = 0	
		if(req.body.balance == "") req.body.balance = 0 //设置余额为0
		if(req.body.notices == null) req.body.notices = []
		if(req.body.collects == null) req.body.collects = []
		uu.set({
			_id : usert.userId,
			nickname : req.body.nickname,
			paypassword : req.body.paypassword,
			balance : req.body.balance,
			notices : req.body.notices,
			collects : req.body.collects
		})
		uu.save((err) => {
			if(err) return res.send({error: '个人信息已存在,保存失败'})
			console.log('information added success')
			res.send({status: '信息已保存'})
		})
	})
})
//个人信息
router.get('/information/:_id', (req,res) => {
	Use.findById(req.params._id, (err,usus) => {
		if(err) return res.send({error: '个人信息获取失败' })
		res.json(usus)
	})
})
//删除个人信息
router.delete('/information', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.json('无效的token')
		Use.remove({ _id: usert.userId }, (err) => {
			if(err) return res.send({error: 'error'})
			res.send({status: 'delete'})
		})
	})
})
//
router.get('/information', (req,res) => {
	Use.find( (err,all) => {
		if(err) return res.send({error: '信息获取失败' })
		res.json(all)
	})
})

//-----------------------------------------------------

var sign = false
//旧密码验证
router.post('/oldpayword', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.json('无效的token')
		Use.findOne({_id: usert.userId}, (err,inf) => {
			if(!inf) return res.send({error: '信息查找失败'})
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
		if(err) return res.json('无效的token')
		Use.findOne({_id: usert.userId}, (err,inf) => {
			if(!inf) return res.send({error: '信息查找失败'})
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
				if(err) return res.send({error: '更改失败'})
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
		if(err) return res.json('无效的token')
		Use.findById( usert.userId, {_id:0, paypassword:1}, (err,paywd) => {
			if(err) return res.send({error: '尚未添加个人信息'})
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
		if(err) return res.json('无效的token')
		Use.findOne({_id: usert.userId}, (err,useinfm) => {
			if(!useinfm) return res.send({error: '信息查找失败'})
			nnn = useinfm.nickname
			useinfm.nickname = req.body.nickname
			useinfm.save((err) => {
				if(err) return res.send({error: '更改失败'})
				res.send({message: '已更改昵称'})
			})
			Notice.find({owner: nnn}, (err,not) => {
				if(!not) return console.log(err)
				not.map((item,index) => {
					item.owner = req.body.nickname
					item.save((err) => {
						if(err) return console.log({error: 'n更改失败'})
					})
				})
			})
			Collect.find({collector: nnn}, (err,col) => {
				if(!col) return console.log(err)
				col.map((item,index) => {
					item.collector = req.body.nickname
					item.save((err) => {
						if(err) return console.log({error: 'n更改失败'})
					})
				})
			})
		})
	})
})

//--------------------------------------------------------

//更改余额     localhost:1103/user/balance?token=${token}
router.patch('/balance', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.json('无效的token')
		Use.findOne({_id: usert.userId}, (err,useinfm) => {
			if(!useinfm) return res.send({error: '信息查找失败'})
			useinfm.balance = req.body.balance
			useinfm.save((err) => {
				if(err) return res.send({error: '更改失败'})
				res.send({message: '已更改余额'})
			})
		})
	})
})
//查询余额
router.get('/balance', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.json('无效的token')
		Use.findOne( { _id: usert.userId}, {_id:0, balance:1}, (err,ubal) => {
			if(!ubal) {
				res.send({ error: '此id为无效' })
				return
			}
			res.json(ubal)
		})
	})
})

//---------------------------------------------------------

//提交新通知
router.post('/notice', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.json('无效的token')
		Use.findOne( { _id: usert.userId}, (err,user) => {
			if(!user) {
				res.send({ error: '信息查找失败' })
				return
			}
			const noti = new Notice()

			if(req.body.videoTitle == null) req.body.videoTitle = ""
			else if(req.body.IrrelevantTF) req.body.videoTitle = ""
			if(req.body.outlay == null) req.body.outlay = 0
			else if(req.body.outlay == "") req.body.outlay = 0
			else if(req.body.IrrelevantTF) req.body.outlay = 0
			if(req.body.costTF == null) req.body.costTF = false
			if(req.body.operaTF == null) req.body.operaTF = true
			if(req.body.operaTF == true) req.body.outlay = 0
			if(req.body.rmoveTF == null) req.body.rmoveTF = false
			if(req.body.IrrelevantTF == null) req.body.IrrelevantTF = true
			if(req.body.other == null) req.body.other = "通知"
			if(req.body.other == "") req.body.other = "通知"
			noti.set({  //可有多个id
				owner : user.nickname,
				videoTitle : req.body.videoTitle,
				outlay : req.body.outlay,
				costTF : req.body.costTF,    //true为'-',false为'+'
				operaTF : req.body.operaTF,   //true为'操作视频',false为'支出收入'
				rmoveTF : req.body.rmoveTF,   //true为'删除视频',false为'上传视频'
				IrrelevantTF : req.body.IrrelevantTF,   //true为'其他',false为'相关'
				other : req.body.other
			})
			noti.save((err) => {
				if(err) return res.send({error: '新通知提交失败'})
			})
		})
	})
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return console.log('无效的token')
		Use.findOne( { _id: usert.userId}, (err,user) => {
			if(err) return res.send({ error: '信息查找失败' })
			Notice.find({owner: user.nickname},{ _id: 0, _id: 1}, 
			(err,noids) => {
				if(err) return res.send({error: '查找不到该用户的通知'})
				user.notices = noids
				user.save((err) => {
					if(err) return res.send({error: 'notices更新失败'})
					res.send({message: '通知已更新'})
				})
			})
		})
	})
})
//获取该用户通知历史(包含余额支出收入)
router.get('/allnotices', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.json('无效的token')
		Use.findOne( { _id: usert.userId}, (err,user) => {
			if(!user) {
				res.send({ error: '信息查找失败' })
				return
			}
			Notice.find({owner: user.nickname}, (err,allnot) => {
				if(err) return res.send({error: '获取失败'})
				res.json(allnot)
			})
		})
	})
})
//清除通知
router.delete('/allnotices', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.json('无效的token')
		Use.findOne( { _id: usert.userId}, (err,user) => {
			if(!user) {
				res.send({ error: '信息查找失败' })
				return
			}
			Notice.remove({owner: user.nickname}, (err) => {
				if(err) return res.send({error: '清除失败'})
				res.send({status: '通知全部清除'})
			})
		})
	})
})

//---------------------------------------------------------
//添加收藏
router.post('/collect/:_vid', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.json('无效的token')
		Use.findOne( { _id: usert.userId}, (err,user) => {
			if(!user) {
				res.send({ error: '信息查找失败' })
				return
			}
			const coll = new Collect()
			if(req.body.cost == null) req.body.cost = 0
			Detail.findOne({_id: req.params._vid}, (err,detail) => {
				if(!detail) return res.send({ error: '视频信息获取失败(id)' })
				Collect.findOne({videoTitle: detail.title}, (err,same) => {
					if(same) return res.send({ message: '此收藏已存在' })
					coll.set({
						collector : user.nickname,
						author : detail.uploader,
						videoTitle : detail.title,
						cost : req.body.cost,
						vdo_id : detail._id
					})
					coll.save((err) => {
						if(err) return res.send({error: '收藏失败'})
						res.send({message: '已添加进收藏'})
					})
				})
			})
		})
	})
	//
	jwt.verify(token, 'secretKey', (err,usert) => {
		Use.findOne( { _id: usert.userId}, (err,user) => {
			Detail.findOne({_id: req.params._vid}, (err) => {     //模仿上段代码中的
				Collect.findOne({}, (err) => {     //模仿上段代码中的
					//此时查找停留在上个状态,多找一次当作更新
					Collect.find({collector: user.nickname}, { _id: 0, _id: 1}, 
					(err,clets) => {
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
router.get('/allcollect', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.json('无效的token')
		Use.findOne( { _id: usert.userId}, (err,user) => {
			if(!user) {
				res.send({ error: '信息查找失败' })
				return
			}
			Collect.find({collector: user.nickname}, (err,allco) => {
				if(err) return res.send({error: '收藏获取失败'})
				res.json(allco)
			})
		})
	})
})
//获取单个收藏
router.get('/collect/:_cid', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.json('无效的token')
		Use.findOne( { _id: usert.userId}, (err,user) => {
			if(!user) return res.send({ error: '信息查找失败' })	
			Collect.findById(req.params._cid, (err,acoll) => {
				if(err) return res.send({error: '收藏获取失败'})
				if(user.nickname != acoll.collector) {
					res.send({ error: '用户与收藏者匹配不上' })
					return
				}
				Detail.findById(acoll.vdo_id, (err,adet) => {
					if(err) return res.send({error: '信息获取失败'})
					res.json([acoll, adet])
				})
			})
		})
	})
})
//清除收藏
router.delete('/collect/:_cid', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.json('无效的token')
		Use.findOne( { _id: usert.userId}, (err,user) => {
			if(!user) {
				res.send({ error: '信息查找失败' })
				return
			}
			Collect.findById(req.params._cid, (err,coll) => {
				if(!coll) return res.send({error: '找不到收藏'})
				Collect.remove({_id: req.params._cid}, (err) => {
					if(err) return res.send({error: '清除失败'})
					res.send({status: '收藏已删除'})
				})
			})
		})
	})
})
//清除所有收藏
router.delete('/allcollectes', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.json('无效的token')
		Use.findOne( { _id: usert.userId}, (err,user) => {
			if(!user) {
				res.send({ error: '信息查找失败' })
				return
			}
			Collect.remove({collector: user.nickname}, (err) => {
				if(err) return res.send({error: '清除失败'})
				res.send({status: '收藏全部清除'})
			})
		})
	})
})


module.exports = router