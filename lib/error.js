/**
 * Module dependencies.
 */

const express = require('express');
const router = express.Router();

// Use body parser for router
router.use(require('body-parser').json());

router.get('*', function (req, res) {
	res.render('error', { title: "Not Found" });
});

module.exports = router;