const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
	adminname: String,
	password: String
})

module.exports = mongoose.model('Admin', AdminSchema)