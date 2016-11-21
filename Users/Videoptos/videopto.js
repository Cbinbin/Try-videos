const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
var multer = require('multer') //文件上传
var fs = require('fs') //文件操作系统
var Detail = require('../Videos/Details')
var Videophoto = require('../Videoptos')

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/vidphotos')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname )
  }
})

var upload = multer({ storage: storage }).single('vidphotofile')

//上传帧图
router.post('/:_vid', (req, res) => {
	upload(req, res, (err) => {
		if (err) {
	        // console.log(req.file)        
	        res.send({ message: 'something wrong' })
        	return
        }
        var token = req.query.token
		jwt.verify(token, 'secretKey', (err,usert) => {
			if(err) return res.json('无效的token')
	        var vphoto = new Videophoto({
	        	_id : req.params._vid,
	        	videoPhotoUrl : 'localhost:1103/'+ req.file.path
	        })
	        vphoto.save(function(err,vp) {
	        	if(err) return res.send({ error: '文件保存失败'　})
	        	console.log('videoPhoto added success')
	      		res.send(vp)
	        })
		})
	})
})
//替换帧图
router.patch('/:_vid/replace', (req, res) => {
	upload(req, res, (err) => {
		if (err) {      
	        res.send({ message: 'something wrong' })
        	return
        }
        var token = req.query.token
		jwt.verify(token, 'secretKey', (err,usert) => {
			if(err) return res.json('无效的token')
	        Videophoto.findOne({ _id : req.params._vid }, (err,vpurl) => {
	        	if(!vpurl) return res.send({error: '无图片'})
	        	fs.unlink(vpurl.videoPhotoUrl.substring(15), (err) => {
					if(err) return console.log(err)
					console.log('videoPhoto deleted success')
				})
			    vpurl.videoPhotoUrl = 'localhost:1103/'+ req.file.path
		        vpurl.save(function(err,vp) {
		        	if(err) return res.send({ error: '文件保存失败'　})
		        	console.log('videoPhoto replace success')
		      		res.send(vp)
		        })
	        })
	    	Detail.findOne({ _id : req.params._vid }, (err,vd) => {
				if(!vd) return console.log({error: '无该视频信息'})
				vd.vdoPhotourl = 'localhost:1103/'+ req.file.path
				vd.save(function(err) {
		        	if(err) console.log({ error: '帧图路径保存失败'　})
		        	console.log('vdoPhotourl replace success')
		        })
		    })
		})
	})
})

module.exports = router