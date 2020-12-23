/**
 * Application Variables
 */
// Express application and port
const express = require('express');
const app = express();
const port = process.env.PORT || '3000';

// Path
const path = require('path');

// Authentication
const expressSession = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
require('dotenv').config();
const authRouter = require('./lib/auth')


/**
 * Session configuration
 */
const session = {
	secret: process.env.SESSION_SECRET,
	cookie: {},
	resave: false,
	saveUninitialized: false
};

if (app.get('env') == 'production') {
	// Serve secure cookies, requires HTTPS
	session.cookie.secure = true;
}


/**
 * Passport configuration
 */
const strategy = new Auth0Strategy(
	{
		domain: process.env.AUTH0_DOMAIN,
		clientID: process.env.AUTH0_CLIENT_ID,
		clientSecret: process.env.AUTH0_CLIENT_SECRET,
		callbackURL: process.env.AUTH0_CALLBACK_URL
	},
	function (accessToken, refreshToken, extraParams, profile, done) {
		/**
		 * Access tokens are used to authorize users to an API
		 * (resource server)
		 * accessToken is the token to call the Auth0 API
		 * or a secured third-party API
		 * extraParams.id_token has the JSON Web Token
		 * profile has all the information from the user
		 */
		return done(null, profile);
	}
);


/**
 * Application configuration
 */
// Authentication
app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

// Authentication middleware
app.use(function (req, res, next) {
	res.locals.isAuthenticated = req.isAuthenticated();
	next();
})

app.use('/', authRouter);

// View engine for Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Static pathing
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));


/**
 * Route definitions
 */
const secured = function (req, res, next) {
	if (req.user) {
		return next();
	}

	req.session.returnTo = req.originalUrl;
	res.redirect('/login');
}

// Defined routes
app.use('/poems', require('./lib/poem'));
app.use('/', require('./lib/homepage'));


/**
 * Middleware
 */
// Reponse to improperly formed json.
app.use(function (err, req, res, next) {
	next();
});


/**
 * Launch server
 */
app.listen(port, function () {
	console.log('Server running on port:' + port);
});