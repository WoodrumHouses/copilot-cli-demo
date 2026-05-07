const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

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

function getById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

function create(data) {
  const { username, email, password } = data;
  const password_hash = bcrypt.hashSync(password, 10);

  try {
    const result = db.prepare(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)'
    ).run(username, email, password_hash);

    return getById(result.lastInsertRowid);
  } catch (err) {
    // Handle unique constraint violations
    if (err.message.includes('UNIQUE constraint failed: users.username')) {
      throw { field: 'username', message: 'username is already taken' };
    }
    if (err.message.includes('UNIQUE constraint failed: users.email')) {
      throw { field: 'email', message: 'email is already registered' };
    }
    throw err;
  }
}

function verifyPassword(username, password) {
  const user = getByUsername(username);
  if (!user) {
    return false;
  }
  return bcrypt.compareSync(password, user.password_hash);
}

function update(id, data) {
  const { email, username } = data;
  db.prepare(`
    UPDATE users SET
      email = COALESCE(?, email),
      username = COALESCE(?, username)
    WHERE id = ?
  `).run(email, username, id);

  return getById(id);
}

module.exports = { initDb, getByUsername, getById, create, verifyPassword, update };