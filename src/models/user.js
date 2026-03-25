const { getDb } = require('../db');

function getByUsername(username) {
  return getDb().prepare('SELECT * FROM users WHERE username = ?').get(username);
}

function getAll() {
  return getDb().prepare('SELECT id, username, email, created_at FROM users').all();
}

// TODO: Implement create(data) - should hash password before storing
// TODO: Implement getById(id)
// TODO: Implement update(id, data)
// TODO: Implement verifyPassword(username, password) - compare with stored hash

module.exports = { getByUsername, getAll };
