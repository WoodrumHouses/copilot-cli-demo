const Database = require('better-sqlite3');

let db = new Database(':memory:');

function initTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

initTables();

function initDb(externalDb) {
  db = externalDb;
  initTables();
}

function getByUsername(username) {
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
}

// TODO: Implement create(data) - should hash password before storing
// TODO: Implement getById(id)
// TODO: Implement update(id, data)
// TODO: Implement verifyPassword(username, password) - compare with stored hash

module.exports = { initDb, getByUsername };