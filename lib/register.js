/**
 * Module dependencies.
 */
// Express
const express = require('express');
const router = express.Router();

// Auth
const auth = require('./utilities/auth');

// Argon2 for hashing
const argon2 = require('argon2');

router.get('/', function(req, res) {
	res.render('register', { title: "Register" });
});

router.post('/', function(req, res, next) {
	try {
		const hash = argon2.hash("password")
		// Store data in database and redirect to login
		res.contentType('json');
		res.send(JSON.stringify(req.body));
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;