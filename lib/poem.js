/**
 * Module dependencies.
 */

const express = require('express');
const { pool } = require('./utilities/sql_conn');
const router = express.Router();
const dateHelper = require('./utilities/date');

// Use body parser for router
router.use(require('body-parser').json());

router.get('/:postId/:authorId', function (req, res) {

	// Post
	var post = new Object();

	// Queries
	// We add one extra post to check for additional pages
	const query =
		`SELECT 
			Posts.*,
			Members.Username,
			COUNT(Favorites.PostID) AS Likes
		FROM Posts
		LEFT JOIN Members
			ON(Posts.AuthorID = Members.MemberID)
		LEFT JOIN Favorites
			ON(Posts.PostID = Favorites.PostID)
		WHERE
			Posts.PostID = ${req.params.postId}
		GROUP BY
			Posts.PostID, Members.MemberID;`;

	// Connect to database and get poem
	pool.connect()
		.then(async function (client) {
			const result = await client.query(query);

			var row = result.rows[0];
			post.postId = row.postid;
			post.authorId = row.authorid;
			post.author = row.username;
			post.title = row.title;
			post.content = row.content;
			post.postDate = dateHelper.getDateString(row.postdate);
			post.likes = row.likes;
		})
		.catch(function (err) {
			console.log(err);
		})
		.finally(function () {
			res.render('poem', 
				{ 
					title: "Poem", 
					post: post 
				});
		});
});

module.exports = router;