const mongoose = require('mongoose')

const UnputSchema = new mongoose.Schema({
	uploaderId: String,
	title: String,  //视频名
	vdoPath: String,   //视频路径
	introduction: String,   //简介
	price: Number,   //视频价格
})

module.exports = mongoose.model('Unput', UnputSchema)
