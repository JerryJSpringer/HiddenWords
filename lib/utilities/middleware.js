// Argon2 for hashing
const argon2 = require('argon2');

// JWT
const jwt = require('jsonwebtoken');
const config = {
	secret: process.env.JSON_WEB_TOKEN
};

function checkToken(req, res, next) {
	// Get the jwt access token from the request header
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	// If there isn't any token
	if (token == null) {
		return res.sendStatus(401); 
	}

	// Try and verify the token
	jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
		if (err) {
			return res.sendStatus(403);
		} else {
			req.userId = decoded.userId;
			req.username = decoded.username;
			req.email = decoded.email;
			next();
		}
	});
};

function isValid(token) {
	// Try and verify the token
	return jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
		if (err) {
			return {
				success: false,
				message: 'Token is not valid'
			};
		} else {
			return {
				success: true,
				userId: decoded.userId,
				username: decoded.username,
				email: decoded.email
			};
		}
	});
};

function generateAccessToken(userId, username, email) {
	return jwt.sign(
		{
			userId: userId,
			username: username,
			email: email
		}, process.env.TOKEN_SECRET, {expiresIn: '30m'});
};

async function hashPassword(password) {
	try {
		const hash = await argon2.hash(password);
		return hash;
	} catch (err) {
		console.log(err);
	}
};

async function verifyPassword(password, hash) {
	try {
		return await argon2.verify(hash, password);
	} catch (err) {
		console.log(err);
	}
}

module.exports = {
	checkToken: checkToken,
	isValid: isValid,
	generateAccessToken: generateAccessToken,
	hashPassword: hashPassword,
	verifyPassword: verifyPassword
}