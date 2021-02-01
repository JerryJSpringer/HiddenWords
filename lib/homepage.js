/**
 * Module dependencies.
 */

const express = require('express');
const router = express.Router();
const postLoader = require('./utilities/post_loader');

// Use body parser for router
router.use(require('body-parser').json());

router.get('/', async function (req, res) {

	// Get all posts sorted by newest
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
		GROUP BY Posts.PostID, Members.MemberID
		ORDER BY Posts.PostDate DESC`;

	var responseObject = await postLoader.loadPosts(req, query);
	responseObject.title = 'Home';
	res.render('homepage', responseObject);
});

module.exports = router;