const mongoose = require('mongoose')

const CollectSchema = new mongoose.Schema({
	collector : String,   // 收藏者
	author : String,   //作者
	videoTitle : String,   //视频名
	vdo_id : String   //视频id	
})

module.exports = mongoose.model('Collect', CollectSchema)