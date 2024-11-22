const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'ancestor',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0, 
});

pool.on("error", (err) => {
  console.error("Database error: ", err);
});

module.exports = pool;
    