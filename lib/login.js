/**
 * Module dependencies.
 */
// Express
const express = require('express');
const router = express.Router();

// Auth
const auth = require('./utilities/auth');

// Database connection
const pool = require('./utilities/sql_conn').pool;

router.get('/', function (req, res) {
	res.render('login', { title: 'Login' });
});

router.post('/', function (req, res, next) {
	// Check if all fields are supplied
	if (!req.body.email || !req.body.password) {
		res.status(400).send({
			message: "Missing required information"
		});
	} else {
		// Set email to lowercase
		req.body.email = (req.body.email).toLowerCase();
		next();
	}
}, function (req, res) {
	// Get hash here
	const query = 'SELECT password FROM MEMBERS WHERE Email = $1'
	pool.connect()
		.then(async function (client) {
			const result = await client.query(query, [req.body.email]);
			const hash = result.rows[0].password;

			// Verify password
			if (await auth.verifyPassword(req.body.password, hash)) {
				// Password match
				const token = auth.generateAccessToken({ username: req.body.username });
				res.status(200).json(token);
			} else {
				// Password mis-match
				res.status(400).send({
					message: 'Username or password does not match'
				});
			}
		})
		.catch(function (err) {
			console.log(err);
		});
});

module.exports = router;