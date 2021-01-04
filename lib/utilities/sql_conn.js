const { Pool } = require('pg');
const pool = new Pool({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: process.env.PGPORT
});

pool.on('connect', function () {
	console.log('Database connected');
});

pool.on('error', function (err, client) {
	console.error('Error:', err);
});

module.exports = {
	pool: pool
}