const mongoose = require('mongoose')

const NoticeSchema = new mongoose.Schema({
	owner : String,   //通知所属人
	videoTitle : String,
	outlay : Number,
	costTF : Boolean,  //判断为收入或支出,与outlay有关
	operaTF : Boolean,  //判断为入出信息或视频操作信息
	rmoveTF : Boolean,  //判断上传或删除
	IrrelevantTF: Boolean,  //判断为相关信息或其他
	other : String,  //其他信息
	noticetime: {
		createAt: {
			type: Date,
			default: Date.now()
		}
	}
})

module.exports = mongoose.model('Notice', NoticeSchema)
