const express = require('express')
const router = express.Router()
var multer = require('multer')　//文件上传
var fs = require('fs') //文件操作系统
var Video = require('../Videos')
var Detail = require('../Videos/Details')
const Use = require('../Use')
const Phone = require('../../Regist/Phones')


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/videos')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname )
  }
})

var upload = multer({ storage: storage }).single('videofile')

//上传视频路径(用户id)
router.post('/:_id', (req, res) => {
  upload(req, res, (err) => {
		if (err) {
      console.log(req.file)        
      res.send({ message: 'something wrong' })
    	return
    }
    Phone.findOne( { _id: req.params._id}, (err,ids) => {
      if(!ids) {
        res.send({ error: '此id为无效' })
        return
      }
      var vid = new Video({
      	videourl: 'localhost:1103/'+ req.file.path
      })
      vid.save((err,videos) => {
      	if(err) return res.send({ error: '文件保存失败'　})
      	console.log('video added success')
    		res.send(videos)
      })
    })
	})
})
//获取视频路径(视频本身id)
router.get('/one/:_vid', (req,res) => {
  Video.findById(req.params._vid, (err,video) => {
    if(err) return res.send({ error: '视频获取失败' })
    res.json(video)
  })
})
//删除视频
<<<<<<< HEAD
router.delete('/one/:_vid', (req,res) => {
  Video.findOne({ _id: req.params._vid}, (err,vurl) => {
=======
router.delete('/:_id', (req,res) => {
  Video.findOne({ _id: req.params._id}, (err,vurl) => {
>>>>>>> 961ac041d431f55c95c0819799d11be6aa7fe930
    if(!vurl) return res.send({ error: '找不到视频' })
    //本地删除文件
    fs.unlink(vurl.videourl.substring(15), (err) => {
      if(err) return console.log(err)
      console.log('video deleted success')
    })
    //删除路径
<<<<<<< HEAD
    Video.remove({ _id: req.params._vid }, (err) => {
      if(err) return res.send({ error: '路径删除失败' })
      res.send({ status: '路径已删除' })
=======
    Video.remove({ _id: req.params._id }, (err) => {
      if(err) return res.send({ error: '删除失败' })
      res.send({ status: '已删除' })
>>>>>>> 961ac041d431f55c95c0819799d11be6aa7fe930
    })
  })
})
//
router.get('/all', (req,res) => {
  Video.find( (err,videoss) => {
    if(err) return res.send({ error: '视频路径获取失败' })
    res.json(videoss)
  })
})

//-------------------------------------------------
//函数
// var user_id = new Array()
// const idid = (useid) => {
//   var TF
//   Video.find({}, { _id:0, _id:1 }, (err,ids) => {
//     if(err) console.error(err)
//     user_id = ids.map((num) => {
//       return num._id
//     })
//     return user_id
//   })
//   user_id.map((item,index) => {
//     if(useid == item) {
//       TF = false
//       return
//     }
//     else TF = true
//   })
//   return TF
// }
//添加视频信息
<<<<<<< HEAD
router.post('/detail/:_id/:_vid', (req,res) => {
  // if( idid(req.params._vid) ) {
  //   res.send({ error: '此视频id不正确' })
  //   console.log(user_id)
  //   return
  // }
  Use.findOne({ _id: req.params._id }, (err,user) => {
    if(!user) return res.send({error: '用户id错误'})
    Video.findOne({_id: req.params._vid}, (err,vlj) => {
      if(!vlj) return res.send({error: '视频id错误'})
      const description = new Detail()
      description.set({
        _id: req.params._vid,  //设置视频id和信息id为相同
        uploader: user.nickname,
        title: req.body.title,
        vdourl: vlj.videourl,
        introduction: req.body.introduction,
        price: req.body.price,
        paidppnumber: req.body.paidppnumber,
        concernednumber: req.body.concernednumber
      })
      description.save((err,detail) => {
        if(err) return res.send({ message: '信息保存失败' })
        console.log('description added success')
        res.send({ status: '信息已以相同id保存' })
        // res.send(detail)
      })
    })
=======
router.post('/detail/:_id', (req,res) => {
  if( idid(req.params._id) ) {
    res.send({ error: '此视频id不正确' })
    console.log(user_id)
    return
  }
  const description = new Detail()
  description.set({
    _id: req.params._id,  //设置视频id和信息id为相同
    uploader: req.body.uploader,
    title: req.body.title,
    introduction: req.body.introduction,
    price: req.body.price,
    paidppnumber: req.body.paidppnumber,
    concernednumber: req.body.concernednumber
  })
  description.save((err,detail) => {
    if(err) return res.send({ message: '信息保存失败' })
    console.log('description added success')
    res.send({ status: '信息已以相同id保存' })
    // res.send(detail)
>>>>>>> 961ac041d431f55c95c0819799d11be6aa7fe930
  })  
})
//获取视频all信息
router.get('/detail/:_vid', (req,res) => {
  Detail.findById(req.params._vid, (err,detail) => {
    if(err) return res.send({ error: '信息获取失败' })
    res.json(detail)
  })
})
//删除视频all信息
router.delete('/detail/:_id/:_vid', (req,res) => {
  Use.findOne({ _id: req.params._id }, (err,user) => {
    if(!user) return res.send({error: '用户id错误,无法删除'})
    Video.findOne({ _id: req.params._vid}, (err,video) => {
      if(!video) return res.send({ error: '视频id错误' })
      //本地删除文件
      fs.unlink(video.videourl.substring(15), (err) => {
        if(err) return console.log(err)
        console.log('video deleted success')
      })
      //删除路径
      Video.remove({ _id: req.params._vid }, (err) => {
        if(err) return res.send({ error: '视频路径删除失败' })
        // res.send({ status: '已删除' })
      })
      Detail.remove({ _id: req.params._vid }, (err) => {
        if(err) return res.send({ error: '信息删除失败' })
        res.send({ status: '视频和信息已删除' })
      })
    })
  })
})
//
router.get('/all/detail', (req,res) => {
  Detail.find( (err,detailss) => {
    if(err) return res.send({ error: '信息获取失败' })
    res.json(detailss)
  })
})

module.exports = router
