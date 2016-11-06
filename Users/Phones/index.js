const mongoose = require('mongoose')

const PhoneSchema = new mongoose.Schema({
	phonenumber : Number
})

module.exports = mongoose.model('Phone', PhoneSchema)
