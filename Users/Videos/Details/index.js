const mongoose = require('mongoose')

const DetailSchema = new mongoose.Schema({
	uploader: String,   //上传者
	title: String,  //视频名
	vdourl: String,   //视频路径
	introduction: String,   //简介
	price: Number,   //视频价格
	paidppnumber: Number,　 　//付费人数
	concernednumber: Number,   //收藏人数
	time: {                   // 创建时间
		createAt: {
			type: Date,
			default: Date.now()
		}
	}
})

module.exports = mongoose.model('Detail', DetailSchema)