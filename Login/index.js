const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	phone: Number,
	userpassword: String
})

module.exports = mongoose.model('User', UserSchema)