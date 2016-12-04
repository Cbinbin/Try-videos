const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
var multer = require('multer')　//文件上传
var fs = require('fs') //文件操作系统
var Video = require('../Videos')
var Detail = require('../Videos/Details')
const Use = require('../Use')
var Videophoto = require('../Videoptos')


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/videos')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname )
  }
})

var upload = multer({ storage: storage }).single('videofile')

//上传视频路径
router.post('/', (req, res) => {
  var token = req.query.token
  upload(req, res, (err) => {
    if (err) {
      console.log(req.file)        
      res.send({ message: 'something wrong' })
      return
    }
    jwt.verify(token, 'secretKey', (err,usert) => {
      if(err) return res.json('无效的token')
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
router.delete('/one/:_vid', (req,res) => {
  Video.findOne({ _id: req.params._vid}, (err,vurl) => {
    if(!vurl) return res.send({ error: '找不到视频' })
    //本地删除文件
    fs.unlink(vurl.videourl.substring(15), (err) => {
      if(err) return console.log(err)
      console.log('video deleted success')
    })
    //删除路径
    Video.remove({ _id: req.params._vid }, (err) => {
      if(err) return res.send({ error: '路径删除失败' })
      res.send({ status: '路径已删除' })
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
router.post('/detail/:_vid', (req,res) => {
  // if( idid(req.params._vid) ) {
  //   res.send({ error: '此视频id不正确' })
  //   console.log(user_id)
  //   return
  // }
  var token = req.query.token
  jwt.verify(token, 'secretKey', (err,usert) => {
    if(err) return res.json('无效的token')
    Use.findOne({ _id: usert.userId }, (err,user) => {
      if(!user) return res.send({error: '用户id错误'})
      Video.findOne({_id: req.params._vid}, (err,vlj) => {
        if(!vlj) return res.send({error: '视频id错误'})
        Videophoto.findOne({_id: req.params._vid}, (err,vpurl) => {
          if(!vpurl) return res.send({warning: '请先上传帧图'})
          const description = new Detail()
          if(req.body.paidPerson == null) req.body.paidPerson = []
          else if(req.body.paidPerson == "") req.body.paidPerson = []
          if(req.body.cocerPerson == null) req.body.cocerPerson = []
          else if(req.body.cocerPerson == "") req.body.cocerPerson = []
          if(req.body.paidppnumber == null) req.body.paidppnumber = 0
          if(req.body.concernednumber == null) req.body.concernednumber = 0
          description.set({
            _id: req.params._vid,  //设置视频id和信息id为相同
            uploader: user.nickname,
            title: req.body.title,
            vdourl: vlj.videourl,
            vdoPhotourl: vpurl.videoPhotoUrl,
            introduction: req.body.introduction,
            price: req.body.price,
            paidPerson: req.body.paidPerson,
            cocerPerson: req.body.cocerPerson,
            paidppnumber: req.body.paidppnumber,
            concernednumber: req.body.concernednumber,
          })
          description.save((err,detail) => {
            if(err) return res.send({ message: '信息保存失败' })
            console.log('description added success')
            res.send({ status: '信息已以相同id保存' })
            // res.send(detail)
          })
        })
      })
    })
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
router.delete('/detail/:_vid', (req,res) => {
  var token = req.query.token
  jwt.verify(token, 'secretKey', (err,usert) => {
    if(err) return res.json('无效的token')
    Use.findOne({ _id: usert.userId }, (err,user) => {
      if(!user) return res.send({error: '用户id错误,无法删除'})
      Video.findOne({ _id: req.params._vid}, (err,video) => {
        if(!video) return res.send({ error: '视频id错误' })
        //本地删除文件
        fs.unlink(video.videourl.substring(15), (err) => {
          if(err) console.log({ error: '视频删除失败' })
          console.log('video file deleted success')
        })
        //删除帧图
        Videophoto.findOne({ _id: req.params._vid}, (err,vp) => {
          if(!vp) return console.log({error: '无帧图'})
          fs.unlink(vp.videoPhotoUrl.substring(15), (err) => {
            if(err) console.log({ error: '帧图删除失败' })
            console.log('videoPhoto file deleted success')
          })
          Videophoto.remove({ _id: req.params._vid }, (err) => {
            if(err) console.log({ error: '帧图路径删除失败' })
            console.log('videoPhoto url deleted success')
          })
        })
        //删除路径
        Video.remove({ _id: req.params._vid }, (err) => {
          if(err) console.log({ error: '视频路径删除失败' })
          console.log('video url deleted success')
          // res.send({ status: '已删除' })
        })
        Detail.remove({ _id: req.params._vid }, (err) => {
          if(err) console.log({ error: '信息删除失败' })
          res.send({ status: '视频和信息已删除' })
        })
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