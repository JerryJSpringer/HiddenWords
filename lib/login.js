/**
 * Module dependencies.
 */
// Express
const express = require('express');
const router = express.Router();

// Auth
const middleware = require('./utilities/middleware');

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
	const query = 'SELECT MemberId, Username, Password FROM MEMBERS WHERE Email = $1'
	pool.connect()
		.then(async function (client) {
			const result = await client.query(query, [req.body.email]);
			const hash = result.rows[0].password;
			const userId = result.rows[0].memberId;
			const username = result.rows[0].username;

			// Verify password
			if (await middleware.verifyPassword(req.body.password, hash)) {
				// Password match
				const token = middleware.generateAccessToken(userId, username, req.body.email);
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