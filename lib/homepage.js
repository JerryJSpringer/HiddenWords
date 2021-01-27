/**
 * Module dependencies.
 */

const express = require('express');
const { pool } = require('./utilities/sql_conn');
const router = express.Router();

// Use body parser for router
router.use(require('body-parser').json());

router.get('/', function (req, res) {

	// Constants
	const maxPostsPerPage = 5;
	const maxPreviewLength = 75;

	// Posts
	var posts = [];
	var page = 0;
	var postsPerPage = maxPostsPerPage;
	var extra = false;

	if (req.query.page)
		page = req.query.page;

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
		GROUP BY
		Posts.PostID, Members.MemberID
		LIMIT ${postsPerPage + 1} OFFSET ${page * postsPerPage};`;

	// Connect to database and get poem
	pool.connect()
		.then(async function (client) {
			const result = await client.query(query);

			if (result.rows.length < postsPerPage)
				postsPerPage = result.rows.length;
			else if (result.rows.length === maxPostsPerPage + 1)
				extra = true;

			for (i = 0; i < postsPerPage; i++) {
				var row = result.rows[i];
				var post = new Object();
				post.postId = row.postid;
				post.authorId = row.authorid;
				post.author = row.username;
				post.title = row.title;
				post.preview = row.content;
				post.postDate = row.postdate;
				post.likes = row.likes;

				if (post.preview.length > maxPreviewLength)
					post.preview = (post.preview).substring(0, maxPreviewLength) + '...';

				posts.push(post);
			}
		})
		.catch(function (err) {
			console.log(err);
		})
		.finally(function () {
			res.render('homepage', 
				{ 
					title: "Home", 
					posts: posts, 
					page: page, 
					extra: extra
				});
		});
});

module.exports = router;