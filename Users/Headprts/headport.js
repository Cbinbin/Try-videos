const express = require('express')
const router = express.Router()
var multer = require('multer') //文件上传
var fs = require('fs') //文件操作系统
const Phone = require('../../Regist/Phones') //手机号码
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
router.post('/:_id', (req, res) => {
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
router.get('/:_id', (req,res) => {
	Head.findById(req.params._id, (err,image) => {
		if(err) return res.send({error: '图片获取失败' })
		res.json(image)
	})
})
//删除头像
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
//
router.get('/', (req,res) => {
	Head.find( (err,imagess) => {
		if(err) {
			console.log(err)
			return res.send({error: '图片获取失败' })
		}
		res.json(imagess)
	})
})



module.exports = router