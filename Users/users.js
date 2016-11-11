const express = require('express')
const router = express.Router()
var multer = require('multer') //文件上传
var fs = require('fs') //文件操作系统
const Phone = require('../Users/Phones') //手机号码
var Head = require('./Headprts')　//头像
const Payword = require('./Paypwords') //支付密码


//收藏，通知，余额(及收入支出信息，时间)，昵称，视频日期
//-----------------------------------------------
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname )
  }
})

var upload = multer({ storage: storage }).single('photofile')

//上传头像路径
router.post('/image/:_id', (req, res) => {
	upload(req, res, (err) => {
		if (err) {
	        // console.log(req.file)        
	        res.send({ message: 'something wrong' })
        	return
        }
        Phone.findOne( { _id: req.params._id}, (err,ids) => {
			if(!ids) {
				res.send({ error: '此id为无效' })
				return
			}
	        var imag = new Head({
	        	_id : req.params._id,
	        	headprturl : 'localhost:1103/'+ req.file.path
	        })
	        imag.save(function(err,heads) {
	        	if(err) res.send({ error: '文件保存失败'　})
	        	console.log('image added success')
	      		res.send(heads)
	        })
		})
	})
})
//获取头像路径
router.get('/image/:_id', (req,res) => {
	Head.findById(req.params._id, (err,image) => {
		if(err) return res.send({error: '图片获取失败' })
		res.json(image)
	})
})
//删除头像
router.delete('/image/:_id', (req,res) => {
	Head.findOne({ _id: req.params._id}, (err,hurl) => {
		if(!hurl) return res.send({ error: '找不到图片' })
		//本地删除文件
		fs.unlink(hurl.headprturl.substring(15), (err) => {
			if(err) return console.log(err)
			console.log('image deleted success')
		})
		//删除路径
		Head.remove({ _id: req.params._id}, (err) => {
			if(err) return res.send({ error: '图片删除失败' })
			res.send({ status: '已删除' })
		})
	})
	
})
//
router.get('/image', (req,res) => {
	Head.find( (err,imagess) => {
		if(err) return res.send({error: '图片获取失败' })
		res.json(imagess)
	})
})


//---------------------------------------------------

//设置支付密码
router.post('/payword/:_id', (req,res) => {
	Phone.findOne( { _id: req.params._id}, (err,ids) => {
		if(!ids) {
			res.send({ error: '此id为无效' })
			return
		}
		const ppw = new Payword()
		ppw.set({
			_id : req.params._id,
			paypassword : req.body.paypassword
		})
		ppw.save((err) => {
			if(err) return res.send({error: '支付密码保存失败'})
			console.log('payword added success')
			res.send({status: '支付密码已保存'})
		})
	})
})
//获取支付密码
router.get('/payword/:_id', (req,res) => {
	Payword.findById(req.params._id, (err,payw) => {
		if(err) return res.send({error: '支付密码获取失败' })
		res.json(payw)
	})
})
//删除支付密码
router.delete('/payword/:_id', (req,res) => {
	Payword.remove({ _id: req.params._id }, (err) => {
		if(err) return res.send({error: 'error'})
		res.send({status: 'delete'})
	})
})
//
router.get('/payword', (req,res) => {
	Payword.find( (err,payss) => {
		if(err) return res.send({error: '支付密码获取失败' })
		res.json(payss)
	})
})


module.exports = router