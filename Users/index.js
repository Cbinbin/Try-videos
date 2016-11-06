const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	username: String,
	userpassword: String
})

module.exports = mongoose.model('User', UserSchema)