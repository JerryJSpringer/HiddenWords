/**
 * Module dependencies.
 */

const express = require('express');
const router = express.Router();

// Use body parser for router
router.use(require('body-parser').json());

router.get('/', function (req, res) {
	var posts = [];
	for(i = 0; i < 5; i++) {
		var post = new Object();
		post.title = 'Title';
		post.preview = 'Preview text';
		post.author = 'author';
		post.date = 'date';
		posts.push(post);
	}
	
	res.render('homepage', { title: "Home", posts: posts });
});

module.exports = router;