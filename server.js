'use strict'

const express = require('express')
const server = express()
const port = process.env.PORT || 1103

const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
mongoose.connect('mongodb://cvideo:video123@ds155097.mlab.com:55097/trying',function(err,res){
    if(err) {console.log('Connect to database failed')}
    else {console.log('Connect successfully')}
})


const api = require('./Api')
const regist = require('./Regist/reg.js')
const login = require('./Login/login.js')
const user = require('./Users/Use/use.js') //
const image = require('./Users/Headprts/headport.js')
const video = require('./Users/Videos/video.js')
const videophoto = require('./Users/Videoptos/videopto.js')

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: false}))
server.use(cors())
server.use('/public', express.static('public'))

server.get('/api', (req,res) => {
	res.json(api)
})

const router = express.Router()
server.use('/',router)
router.use('/reg', regist)
router.use('/login', login)
router.use('/user', user)
router.use('/user/image', image)
router.use('/user/video', video)
router.use('/user/videophoto', videophoto)

// server.use('*', (req,res) => {
// 	res.sendfile(__dirname + '/index.html')
// })
server.listen(port, (err) =>{
	if(err) console.error(err)
	else console.log('start')
})