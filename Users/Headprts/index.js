const mongoose = require('mongoose')

const HeadprtSchema = new mongoose.Schema({
	headprturl : String
})

module.exports = mongoose.model('Head', HeadprtSchema)
