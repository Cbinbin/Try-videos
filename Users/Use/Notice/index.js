const mongoose = require('mongoose')

const NoticeSchema = new mongoose.Schema({
	owner : String,   //通知所属人
	videoId: String,
	videoTitle : String,
	payor: String,   //
	payorId: String,   //
	payorHeadId: String,
	outlay : Number,
	kinds : {
		type: Number,
		min: 0,
		max: 9
	},
	IrrelevantTF: Boolean,  //判断
	other : String,  //其他信息
	noticetime: {
		type: Date,
		default: Date.now()
	}
})

module.exports = mongoose.model('Notice', NoticeSchema)
