const mongoose = require('mongoose')

const UseSchema = new mongoose.Schema({
	nickname : String,  //昵称
	headPortrait: String,   //头像
	phone: Number,   //手机号
	paypassword : String,  //支付密码
	balance : Number,  //余额
	paidVideos: Array,   //支付视频
	notices : Array,   //通知
	collects : Array   //收藏	
})

module.exports = mongoose.model('Use', UseSchema)
