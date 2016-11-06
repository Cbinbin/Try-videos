const mongoose = require('mongoose')

const DetailSchema = new mongoose.Schema({
	title: String,
	introduction: String,
	paidppnumber: Number,
	concernednumber: Number
})

module.exports = mongoose.model('Detail', DetailSchema)