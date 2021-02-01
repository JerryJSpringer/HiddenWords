/**
 * Module dependencies.
 */

const express = require('express');
const router = express.Router();
const postLoader = require('./utilities/post_loader');

// Use body parser for router
router.use(require('body-parser').json());

router.get('/:authorId/:authorName', async function (req, res) {

	// Get all posts associated with authorId
	const query =
		`SELECT 
			Posts.*,
			Members.Username,
			COUNT(Favorites.PostID) AS Likes
		FROM Posts
		LEFT JOIN Members
			ON (Posts.AuthorID = Members.MemberID)
		LEFT JOIN Favorites
			ON (Posts.PostID = Favorites.PostID)
		WHERE Members.MemberID = ${req.params.authorId}
		GROUP BY Posts.PostID, Members.MemberID
		ORDER BY Posts.PostDate DESC`;

	var responseObject = await postLoader.loadPosts(req, query);
	responseObject.title = req.params.authorName;
	res.render('user', responseObject);
});

module.exports = router;