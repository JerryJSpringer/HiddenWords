/**
 * Module dependencies.
 */

const express = require('express');
const router = express.Router();

// Use body parser for router
router.use(require('body-parser').json());

router.use(function (req, res) {
	res.render('homepage', { title: "Home" });
});

module.exports = router;