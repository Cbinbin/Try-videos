const mongoose = require('mongoose')

const DetailSchema = new mongoose.Schema({
	uploader: String,  //上传者
	title: String,  //视频名
	introduction: String,  //简介
	price: Number,  //视频价格
	paidppnumber: Number,　　//付费人数
	concernednumber: Number,  //收藏人数
	time: {
		createAt: {
			type: Date,
			default: Date.now()
		}
	}
})

module.exports = mongoose.model('Detail', DetailSchema)