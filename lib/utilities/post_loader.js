/**
 * Module dependencies.
 */

const { pool } = require('./sql_conn');
const dateHelper = require('./date');


async function loadPosts(req, query) {

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

	// Limits the amount of posts grabbed to n + 1 (to check for next page)
	// Offset by page number and posts per page
	query += `\nLIMIT ${postsPerPage + 1} OFFSET ${page * postsPerPage};`;

	var responseObject;

	// Connect to database and get posts
	await pool.connect()
		.then(async function (client) {
			const result = await client.query(query);

			// Set the amount of posts on page and check if there are extra
			if (result.rows.length < postsPerPage)
				postsPerPage = result.rows.length;
			else if (result.rows.length === maxPostsPerPage + 1)
				extra = true;

			// Get all posts but the extra post
			for (i = 0; i < postsPerPage; i++) {
				var row = result.rows[i];
				var post = new Object();
				post.postId = row.postid;
				post.authorId = row.authorid;
				post.author = row.username;
				post.title = row.title;
				post.link = (row.title).replace(' ', '_').toLowerCase();
				post.preview = row.content;
				post.postDate = dateHelper.getDateString(row.postdate);
				post.likes = row.likes;

				// Set preview text
				if (post.preview.length > maxPreviewLength)
					post.preview = (post.preview).substring(0, maxPreviewLength) + '...';

				// Push post to list of posts
				posts.push(post);
			}
		})
		.catch(function (err) {
			console.log(err);
		})
		.finally(function () {
			responseObject = {
				posts: posts,
				page: page,
				extra: extra,
				url: req.baseUrl + req.path
			};
		});

	return responseObject;
};

module.exports = {
	loadPosts: loadPosts	
};