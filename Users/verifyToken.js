const jwt = require('jsonwebtoken')

function verifyToken(router) {
	router.use('*', (req, res, next) => {
    	var token = req.query.token
    	jwt.verify(token, 'secretKey', (err,usert) => {
			if (err) 
				return res.json('无效的token')
			else { 
				next()
			}
		})
	})
}

module.exports = verifyToken