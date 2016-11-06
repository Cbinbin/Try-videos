const express = require('express')
const router = express.Router()
var multer = require('multer')
const User = require('../Users')
var Head = require('./Headprts')
const Payword = require('./Paypwords')
const Phone = require('./Phones')


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname )
  }
})

var upload = multer({ storage: storage }).single('photofile')

router.post('/image', (req, res) => {
	upload(req, res, (err) => {
		if (err) {
	        // console.log(req.file)        
	        res.send({ message: 'something wrong' })
        	return
        }
        var imag = new Head({
        	headprturl : 'localhost:1103/'+ req.file.path
        })
        imag.save(function(err,heads) {
        	if(err) res.send({ error: '文件保存失败'　})
        	console.log('image added success')
      		res.send(heads)
        })
	})
})


router.post('/', (req,res) => {
	const use = new User()
	use.set({
		username : req.body.username,
		userpassword : req.body.userpassword
	})
	use.save(function(err) {
            if (err)
                res.send(err)
            res.json('ok')
        })

})


router.get('/', (req,res) => {
	User.find((err,users) => {
		if(err) res.send({error:'获取失败'})
		res.json(users)
	})
})



module.exports = router