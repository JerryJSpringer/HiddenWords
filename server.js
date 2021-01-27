/**
 * Application Variables
 */
// Express application and port
const express = require('express');
const app = express();
const port = process.env.PORT || '3000';

// Path
const path = require('path');

// Process evn
const dotenv = require('dotenv');
dotenv.config();

// Body parser
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });


/**
 * Application configuration
 */
// View engine for Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body parsing
app.use(bodyParser.json());
app.use(urlencodedParser);

// Static pathing
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));


/**
 * Route definitions
 */
app.use('/auth', require('./lib/auth'));
app.use('/logout', require('./lib/logout'));
app.use('/login', require('./lib/login'));
app.use('/register', require('./lib/register'));
app.use('/post', require('./lib/post'));
app.use('/poems', require('./lib/poem'));
app.use('/', require('./lib/homepage'));
app.use('*', require('./lib/error'))

/**
 * Launch server
 */
app.listen(port, function () {
	console.log('Server running on port:' + port);
});