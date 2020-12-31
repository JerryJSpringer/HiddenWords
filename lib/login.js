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
	res.render('login', { title: 'Login'});
});

router.post('/', function(req, res, next) {
	console.log('posted');
	console.log(req.body.username);

	// Get hash here
	const hash = 'fake hash';

	// Verify password
	try {
		if (argon2.verify(hash, req.body.password)) {
			// Password match
			const token = auth.generateAccessToken({ username: req.body.username });
			return res.json(token);
		} else {
			// Password mis-match
			return res.redirect('/login');
		}
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;