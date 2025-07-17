const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

let pool;

/**
 * Run setup.sql to create database and tables
 * Then initialize pool and optionally create admin user
 */
async function initializeDatabase() {
  try {
    // Connect to MySQL server (no DB yet)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    // Run setup.sql
    const setupSQL = fs.readFileSync(path.join(__dirname, 'setup.sql'), 'utf-8');
    await connection.query(setupSQL);
    console.log(' Database and tables created!');
    await connection.end();

    // Initialize connection pool to selected DB
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Create admin user
    const pooledConn = await pool.getConnection();
    await createAdminUser(pooledConn);
    pooledConn.release();

  } catch (err) {
    console.error('🚨 Database initialization failed:', err);
    throw err;
  }
}

/**
 * Create admin user if it doesn't exist
 */
async function createAdminUser(connection) {
  const adminEmail = process.env.ADMIN_EMAIL || 'divinetay-toscorporations@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminPhone = process.env.ADMIN_PHONE || '+234 814 074 9365';
  const adminFirstName = process.env.ADMIN_FIRST_NAME || 'Admin';
  const adminLastName = process.env.ADMIN_LAST_NAME || 'User';
  const isAdmin = true;

  try {
    console.log(' Checking for admin user by email:', adminEmail);
    const [users] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [adminEmail]
    );

    if (users.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await connection.query(
        `INSERT INTO users (email, first_name, last_name, phone_number, password, admin)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [adminEmail, adminFirstName, adminLastName, adminPhone, hashedPassword, isAdmin]
      );
      console.log(' Admin user created.');
    } else {
      console.log(' Admin user already exists.');
    }
  } catch (err) {
    console.error(' Error creating admin user:', err);
    throw err;
  }
}

/**
 * Get database pool
 */
function getPool() {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initializeDatabase() first.');
  }
  return pool;
}

/**
 * Query wrapper for convenience
 */
async function query(sql, params) {
  if (!pool) throw new Error('Database pool not initialized. Call initializeDatabase() first.');
  return pool.query(sql, params);
}

module.exports = {
  initializeDatabase,
  getPool,
  query
};
