// server/config/db.js
// This module initializes a SQLite database and exposes helper functions for
// executing queries. It ensures that all necessary tables exist and that a
// default admin user is created on first run. The helper functions wrap
// sqlite3's callback‑based API in promises for easier use with async/await.

const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// We'll keep a single shared database connection. Once connectDB() has
// resolved, the `db` variable will be populated and ready for use. Other
// modules can require this file and use the exported helper functions. If
// connectDB() has not been called, the helpers will still work provided
// connectDB() is called before any queries are executed.
let db;

/**
 * Open a connection to the SQLite database and create tables if they don't
 * already exist. Also creates a default admin user if no users exist. This
 * function should be awaited before the server starts handling requests.
 *
 * @returns {Promise<void>}
 */
function connectDB() {
  return new Promise((resolve, reject) => {
    // Locate the database file relative to this module. It will live in the
    // project root so it persists between runs.
    const dbPath = path.join(__dirname, '..', 'database.sqlite');
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ SQLite connection failed', err);
        return reject(err);
      }
      console.log('✅ Connected to SQLite database');
      // Ensure foreign keys are enforced
      db.run('PRAGMA foreign_keys = ON');
      // Create tables and seed data in a serialized order to avoid race
      // conditions. serialize() guarantees the statements run sequentially.
      db.serialize(() => {
        // Users table
        db.run(
          `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            createdAt TEXT DEFAULT (datetime('now')),
            updatedAt TEXT DEFAULT (datetime('now'))
          )`
        );
        // About sections table. The column name "order" is quoted because
        // ORDER is a reserved keyword in SQL.
        db.run(
          `CREATE TABLE IF NOT EXISTS about_sections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title_en TEXT,
            title_ar TEXT,
            description_en TEXT,
            description_ar TEXT,
            imageURL TEXT DEFAULT '',
            "order" INTEGER NOT NULL,
            createdAt TEXT DEFAULT (datetime('now')),
            updatedAt TEXT DEFAULT (datetime('now'))
          )`
        );
        // Room types table
        db.run(
          `CREATE TABLE IF NOT EXISTS room_types (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name_en TEXT NOT NULL,
            name_ar TEXT NOT NULL,
            imageURL TEXT NOT NULL,
            createdAt TEXT DEFAULT (datetime('now')),
            updatedAt TEXT DEFAULT (datetime('now'))
          )`
        );
        // Design types table
        db.run(
          `CREATE TABLE IF NOT EXISTS design_types (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name_en TEXT NOT NULL,
            name_ar TEXT NOT NULL,
            imageURL TEXT NOT NULL,
            createdAt TEXT DEFAULT (datetime('now')),
            updatedAt TEXT DEFAULT (datetime('now'))
          )`
        );
        // Gallery images table. References room_types and design_types via
        // foreign keys. We store batchId as TEXT to group images uploaded
        // together.
        db.run(
          `CREATE TABLE IF NOT EXISTS gallery_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title_en TEXT,
            title_ar TEXT,
            description_en TEXT,
            description_ar TEXT,
            imageURL TEXT NOT NULL,
            roomType INTEGER NOT NULL,
            designType INTEGER NOT NULL,
            album TEXT,
            batchId TEXT,
            createdAt TEXT DEFAULT (datetime('now')),
            updatedAt TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (roomType) REFERENCES room_types(id) ON DELETE CASCADE,
            FOREIGN KEY (designType) REFERENCES design_types(id) ON DELETE CASCADE
          )`
        );
        // Home settings table. Only one row is expected but we allow
        // multiple for flexibility.
        db.run(
          `CREATE TABLE IF NOT EXISTS home_settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mainTitle_en TEXT,
            mainTitle_ar TEXT,
            subTitle_en TEXT,
            subTitle_ar TEXT,
            backgroundImage TEXT,
            createdAt TEXT DEFAULT (datetime('now')),
            updatedAt TEXT DEFAULT (datetime('now'))
          )`
        );
        // Contact settings table. Complex fields are stored as JSON strings.
        db.run(
          `CREATE TABLE IF NOT EXISTS contact_settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            backgroundImage TEXT,
            address TEXT,
            instagram TEXT,
            facebook TEXT,
            whatsapp TEXT,
            otherLinks TEXT,
            createdAt TEXT DEFAULT (datetime('now')),
            updatedAt TEXT DEFAULT (datetime('now'))
          )`
        );
        // After ensuring tables, seed a default admin if no user exists
        db.get('SELECT COUNT(*) AS count FROM users', async (err, row) => {
          if (err) {
            console.error('❌ Error checking user count', err);
            return resolve();
          }
          if (row.count === 0) {
            const hashed = await bcrypt.hash('admin', 10);
            db.run(
              'INSERT INTO users (name, password) VALUES (?, ?)',
              ['admin', hashed],
              (err2) => {
                if (err2) {
                  console.error('❌ Error creating default admin', err2);
                } else {
                  console.log('✅ Default admin user created: admin/admin');
                }
                resolve();
              }
            );
          } else {
            resolve();
          }
        });
      });
    });
  });
}

/**
 * Execute a statement that modifies the database (e.g. INSERT, UPDATE, DELETE).
 * Returns a promise that resolves with an object containing the last inserted
 * row ID and the number of rows changed.
 *
 * @param {string} sql
 * @param {Array<any>} params
 */
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('Database connection has not been initialized'));
    }
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

/**
 * Execute a query that returns a single row.
 *
 * @param {string} sql
 * @param {Array<any>} params
 */
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('Database connection has not been initialized'));
    }
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

/**
 * Execute a query that returns all matching rows.
 *
 * @param {string} sql
 * @param {Array<any>} params
 */
function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('Database connection has not been initialized'));
    }
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = {
  connectDB,
  run,
  get,
  all,
};