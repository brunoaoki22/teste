const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool. This is more efficient than creating a single connection
// for every query, as it reuses existing connections.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// A simple function to test the connection.
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to the database.');
        connection.release();
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

testConnection();

module.exports = pool;
