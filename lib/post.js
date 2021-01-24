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
	res.render('post', { title: 'Post' });
});

router.post('/', middleware.checkToken, function (req, res, next) {
	// Check if all fields are supplied
	if (!req.body.title || !req.body.content) {
		return res.status(400).send({
			message: "Missing required information"
		});
	} else {
		next();
	}
}, async function (req, res) {
	// Post the poem

	// Get poem params
	const userId = req.userId;
	const title = req.body.title;
	const content = req.body.content;
	const postDate = Date.now()/1000.0;
	
	const query = 'INSERT INTO POSTS(AuthorId, Title, Content, PostDate) VALUES ($1, $2, $3, to_timestamp($4))';
	var values = [userId, title, content, postDate];

	// Store poem in database and redirect to poem
	pool.connect()
		.then(function (client) {
			client.query(query, values)
				.then(function () {
					res.status(200).send({
						success: true
					});
				})
				.catch(function (err) {
					console.log(err);
					res.status(400).send({
						message: err.detail
					});
				});
		})
		.catch(function (err) {
			console.error(err)
		});
});

module.exports = router;
