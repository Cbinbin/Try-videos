const mongoose = require('mongoose')

const PaySchema = new mongoose.Schema({
	paypassword : String
})

module.exports = mongoose.model('Payword', PaySchema)
