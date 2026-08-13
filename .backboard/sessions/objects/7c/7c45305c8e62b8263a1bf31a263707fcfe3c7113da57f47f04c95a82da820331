import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';

dotenv.config();


/* Needed to resolve paths correctly even if you run from another directory */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Go two folders up and into Database/tayandtos.db */
const dbPath = path.resolve(__dirname, '../Database/tayandtos.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log(`Connected to SQLite DB at ${dbPath}`);
  }
});

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
      database: 'tay-tos-db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Create admin user
    const pooledConn = await pool.getConnection();
    await createAdminUser(pooledConn);
    pooledConn.release();

  } catch (err) {
    console.error(' Database initialization failed:', err);
    throw err;
  }
}

/**
 * Restart the database
 * Drops existing database and re-runs setup.sql
 */
async function restartDatabase() {
  try {
    console.log('Restarting database...');

    // Connect to MySQL server (no DB selected yet)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    // Drop the database if it exists
    await connection.query(`DROP DATABASE IF EXISTS \`tay-tos-db\`;`);
    console.log(' Existing database dropped.');

    // Run setup.sql to recreate database and tables
    const setupSQL = fs.readFileSync(path.join(__dirname, 'setup.sql'), 'utf-8');
    await connection.query(setupSQL);
    console.log(' Database and tables recreated.');

    await connection.end();

    // Re-initialize pool
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'tay-tos-db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Recreate admin user
    const pooledConn = await pool.getConnection();
    await createAdminUser(pooledConn);
    pooledConn.release();

    console.log(' Database restart complete!');
  } catch (err) {
    console.error('Error restarting database:', err);
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
        `INSERT INTO users (email, first_name, last_name, phone_number, password_hash, admin)
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

export {
  initializeDatabase,
  restartDatabase,
  getPool,
  query,
  db
};
