const mongoose = require('mongoose')

const VideoSchema = new mongoose.Schema({
	videourl: String
})

module.exports = mongoose.model('Video', VideoSchema)
