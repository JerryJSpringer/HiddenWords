/**
 * Module dependencies.
 */
// Express
const express = require('express');
const router = express.Router();

// Auth
const middleware = require('./utilities/middleware');

router.post('/', function (req, res) {
	if (req.body.token) {
		return res.json(middleware.isValid(req.body.token));
	} else {
		return res.json({
			success: false,
			message: 'No token is supplied'
		});
	}
});

module.exports = router;