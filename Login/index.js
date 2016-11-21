const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	phone: { type: Number, required: true },
	userpassword: { type: String, required: true }
})

module.exports = mongoose.model('User', UserSchema)