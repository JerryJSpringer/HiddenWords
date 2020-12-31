const jwt = require('jsonwebtoken');
const config = {
	secret: process.env.JSON_WEB_TOKEN
};

function checkToken(req, res, next) {
	// Get the jwt access token from the request header
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (token == null) return res.sendStatus(401); // If there isn't any token
	jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
		if (err) return res.sendStatus(403);
		req.user = decoded;
		next()
	});
};

function generateAccessToken(username) {
	return jwt.sign(username, process.env.TOKEN_SECRET, {expiresIn: '2d'});
};

module.exports = {
	checkToken: checkToken,
	generateAccessToken: generateAccessToken
}