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
	res.render('register', { title: "Register" });
});


router.post('/', function (req, res, next) {
	// Check if all fields are supplied
	if (!req.body.email || !req.body.username || !req.body.password) {
		res.status(400).send({
			message: "Missing required information"
		});
	} else {
		// Set email to lowercase
		req.body.email = (req.body.email).toLowerCase();
		next();
	}
}, function (req, res, next) {
	// Check if password is at least 6 characters
	if ((req.body.password).length <= 6) {
		res.status(400).send({
			message: "Password must be at least 6 characters."
		});
	} else {
		next();
	}
}, async function (req, res) {
	// Register the user
	res.contentType('json');

	// Get registration params
	const username = req.body.username;
	const email = req.body.email;
	const hash = await auth.hashPassword(req.body.password);

	// Store data in database and redirect to login
	const query = 'INSERT INTO MEMBERS(Username, Email, Password, Privilege, Verification) VALUES ($1, $2, $3, $4, $5)';
	var values = [username, email, hash, 0, 0];
	pool.connect()
		.then(function (client) {
			client.query(query, values)
				.then(function () {
					res.status(200).send({
						success: true
					});
				})
				.catch(function (err) {
					var constraint = err.constraint;
					var message = err.detail;

					if (constraint === 'members_username_key') {
						message = 'Username exists';
					} else if (constraint === 'members_email_key') {
						message = 'Email exists';
					}

					res.status(400).send({
						message: err.detail
					});
				});
		})
		.catch(function (err) {
			console.error(err);
		});
});

module.exports = router;