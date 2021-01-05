/**
 * Module dependencies.
 */
// Express
const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
	res.render('logout', { title: 'Logout' });
});

module.exports = router;