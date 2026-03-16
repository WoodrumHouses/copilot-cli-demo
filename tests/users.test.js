const request = require('supertest');
const Database = require('better-sqlite3');
const { setDb } = require('../src/db');
const app = require('../src/index');

beforeEach(() => {
  setDb(new Database(':memory:'));
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
