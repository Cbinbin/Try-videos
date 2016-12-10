const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
var multer = require('multer') //文件上传
var fs = require('fs') //文件操作系统
var Head = require('../Headprts')　//头像

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
router.post('/', (req, res) => {
	upload(req, res, (err) => {
		if (err) {
	        // console.log(req.file)        
	        res.send({ message: 'something wrong' })
        	return
        }
        var token = req.query.token
		jwt.verify(token, 'secretKey', (err,usert) => {
			if(err) return res.json('无效的token')
	        var imag = new Head({
	        	_id : usert.userId,
	        	headprturl : 'localhost:1103/'+ req.file.path
	        })
	        imag.save(function(err,heads) {
	        	if(err) return res.send({ error: '文件保存失败'　})
	        	console.log('image added success')
	      		res.send(heads)
	      		Use.update({_id: usert.userId}, 
	      		{$set: {headPortrait: heads.headprturl}}, 
	      		{upsert : true}, (err, txt)=> {
	      			if(err) console.log(err)
	      			console.log(txt)
	      		})
	        })
		})
	})
})
//更换头像
router.patch('/replace', (req, res) => {
	upload(req, res, (err) => {
		if (err) {
	        // console.log(req.file)        
	        res.send({ message: 'something wrong' })
        	return
        }
        var token = req.query.token
		jwt.verify(token, 'secretKey', (err,usert) => {
			if(err) return res.json('无效的token')
	        Head.findOne({ _id : usert.userId }, (err,hurl) => {
	        	if(err) return res.send({error: '无头像'})
	        	fs.unlink(hurl.headprturl.substring(15), (err) => {
					if(err) return console.log(err)
					console.log('image deleted success')
				})
			    hurl.headprturl = 'localhost:1103/'+ req.file.path
		        hurl.save(function(err,heads) {
		        	if(err) return res.send({ error: '文件保存失败'　})
		        	console.log('image replace success')
		      		res.send(heads)
		      		Use.update({_id: usert.userId}, 
		      		{$set: {headPortrait: heads.headprturl}}, 
		      		{upsert : true}, (err, txt)=> {
		      			if(err) console.log(err)
		      			console.log(txt)
		      		})
		        })
	        })
		})
	})
})
//获取头像路径
router.get('/', (req,res) => {
	var token = req.query.token
	jwt.verify(token, 'secretKey', (err,usert) => {
		if(err) return res.json('无效的token')
		Head.findById( usert.userId, (err,image) => {
			if(err) return res.send({error: '图片获取失败' })
			res.json(image)
		})
	})
})
router.get('/:_id', (req,res) => {
	Head.findById( req.params._id, (err,image) => {
		if(err) return res.send(err)
		res.json(image)
	})
})
//删除头像(暂时不用)
router.delete('/:_id', (req,res) => {
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
//(暂时不用)
router.get('/all', (req,res) => {
	Head.find( (err,imagess) => {
		if(err) {
			console.log(err)
			return res.send({error: '图片获取失败' })
		}
		res.json(imagess)
	})
})



module.exports = router