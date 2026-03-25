const request = require('supertest');
const Database = require('better-sqlite3');
const { setDb } = require('../src/db');
const User = require('../src/models/user');
const app = require('../src/index');

let db;

beforeEach(() => {
  db = new Database(':memory:');
  setDb(db);
});

describe('Users API', () => {
  describe('POST /users/register', () => {
    it('should register a new user', async () => {
      // TODO: Write actual test
      expect(true).toBe(true);
    });

    it('should hash the password before storing', async () => {
      // TODO: Write actual test
      expect(true).toBe(true);
    });

    it('should reject duplicate usernames', async () => {
      // TODO: Write actual test
      expect(true).toBe(true);
    });

    it('should reject duplicate emails', async () => {
      // TODO: Write actual test
      expect(true).toBe(true);
    });

    it('should require all fields', async () => {
      // TODO: Write actual test
      expect(true).toBe(true);
    });
  });

  describe('POST /users/login', () => {
    it('should return a JWT token for valid credentials', async () => {
      // TODO: Write actual test
      expect(true).toBe(true);
    });

    it('should reject invalid password', async () => {
      // TODO: Write actual test
      expect(true).toBe(true);
    });

    it('should reject non-existent user', async () => {
      // TODO: Write actual test
      expect(true).toBe(true);
    });
  });

  describe('GET /users', () => {
    it('should return an empty array when no users exist', async () => {
      const res = await request(app).get('/users');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return all registered users', async () => {
      db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)').run('alice', 'alice@example.com', 'hash1');
      db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)').run('bob', 'bob@example.com', 'hash2');

      const res = await request(app).get('/users');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('username', 'alice');
      expect(res.body[1]).toHaveProperty('username', 'bob');
    });

    it('should not include password_hash in response', async () => {
      db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)').run('alice', 'alice@example.com', 'hash1');

      const res = await request(app).get('/users');
      expect(res.status).toBe(200);
      res.body.forEach(user => {
        expect(user).not.toHaveProperty('password_hash');
        expect(user).not.toHaveProperty('email');
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('username');
      });
    });
  });

  describe('GET /users/profile', () => {
    it('should return profile for authenticated user', async () => {
      // TODO: Write actual test
      expect(true).toBe(true);
    });

    it('should reject requests without auth token', async () => {
      // TODO: Write actual test
      expect(true).toBe(true);
    });

    it('should not include password_hash in response', async () => {
      // TODO: Write actual test
      expect(true).toBe(true);
    });
  });
});
