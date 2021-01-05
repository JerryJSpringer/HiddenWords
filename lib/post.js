/**
 * Module dependencies.
 */
// Express
const express = require('express');
const router = express.Router();

// Auth
const middleware = require('./utilities/middleware');

// Argon2 for hashing
const argon2 = require('argon2');

router.get('/', function (req, res) {
	res.render('post', { title: 'Post' });
});

router.post('/', middleware.checkToken, function(req, res, next) {
	return res.json(req.user);
});

module.exports = router;
