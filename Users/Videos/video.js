const express = require('express')
const router = express.Router()
var multer = require('multer')
var Video = require('../Videos')
var Detail = require('../Videos/Details')


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/videos')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname )
  }
})

var upload = multer({ storage: storage }).single('videofile')

//上传视频
router.post('/', (req, res) => {
  upload(req, res, (err) => {
		if (err) {
      console.log(req.file)        
      res.send({ message: 'something wrong' })
    	return
    }
    var vid = new Video({
    	videourl: 'localhost:1103/'+ req.file.path
    })
    vid.save((err,videos) => {
    	if(err) res.send({ error: '文件保存失败'　})
    	console.log('video added success')
  		res.send(videos)
    })
	})
})
//获取视频
router.get('/:_id', (req,res) => {
  Video.findById(req.params._id, (err,video) => {
    if(err) res.send({ error: '获取失败' })
    res.json(video)
  })
})
//删除视频
router.delete('/:_id', (req,res) => {
  Video.remove({ _id: req.params._id }, (err) => {
    if(err) res.send({ error: '删除失败' })
    res.send({ status: '已删除' })
  })
})

//-------------------------------------------------
//函数
var user_id = new Array()
const idid = (useid) => {
  var TF
  Video.find({}, { _id:0, _id:1 }, (err,ids) =>{
    if(err) console.error(err)
    user_id = ids.map((num) => {
      return num._id
    })
    return user_id
  })
  user_id.map((item,index) => {
    if(useid == item) {
      TF = false
      return
    }
    else TF = true
  })
  return TF
}
//添加视频信息
router.post('/:_id', (req,res) => {
  if( idid(req.params._id) ) {
    res.send({ error: '此视频id不正确' })
    return
  }
  const description = new Detail()
  description.set({
    _id: req.params._id,  //设置视频id和信息id为相同
    title: req.body.title,
    introduction: req.body.introduction,
    paidppnumber: req.body.paidppnumber,
    concernednumber: req.body.concernednumber
  })
  description.save((err,detail) => {
    if(err) res.send({ error: '信息保存失败' })
    console.log('description added success')
    res.send({ status: '信息已以相同id保存' })
    // res.send(detail)
  })  
})
//获取视频信息
router.get('/detail/:_id', (req,res) => {
  Detail.findById(req.params._id, (err,detail) => {
    if(err) res.send({ error: '信息获取失败' })
    res.json(detail)
  })
})
//删除视频信息
router.delete('/detail/:_id', (req,res) => {
  Detail.remove({ _id: req.params._id }, (err) => {
    if(err) res.send({ error: '信息删除失败' })
    res.send({ status: '信息已删除' })
  })
})

module.exports = router
