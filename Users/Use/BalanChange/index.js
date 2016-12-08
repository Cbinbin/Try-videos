const mongoose = require('mongoose')

const BChangeSchema = new mongoose.Schema({
	userId: String,
	videoId: String,
	videoTitle: String,
	outlay: Number,
	bctime: {
		type: Date,
		default: Date.now()
	}
})

module.exports = mongoose.model('BChange', BChangeSchema)