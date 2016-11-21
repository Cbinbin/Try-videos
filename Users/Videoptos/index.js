const mongoose = require('mongoose')

const VideophotoSchema = new mongoose.Schema({
	videoPhotoUrl : String
})

module.exports = mongoose.model('Videophoto', VideophotoSchema)
