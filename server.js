'use strict'

const express = require('express')
const server = express()
const port = process.env.PORT || 1103

const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/trying',function(err,res){
    if(err) {console.log('Connect to database failed')}
    else {console.log('Connect successfully')}
})

const users = require('./Users/users.js')
const video = require('./Users/Videos/video.js')

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: false}))
server.use(cors())
server.use(express.static('public'))

const router = express.Router()
server.use('/',router)
router.use('/users', users)
router.use('/users/video', video)

// server.use('*', (req,res) => {
// 	res.sendfile(__dirname + '/index.html')
// })
server.listen(port, (err) =>{
	if(err) console.error(err)
	else console.log('start')
})