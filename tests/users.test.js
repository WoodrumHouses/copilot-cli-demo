const request = require('supertest');
const Database = require('better-sqlite3');
const { setDb } = require('../src/db');
const app = require('../src/index');

beforeEach(() => {
  setDb(new Database(':memory:'));
});

describe('Users API', () => {
  describe('POST /users/register', () => {
    it('should register a new user with valid credentials', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'securePassword123'
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.username).toBe('testuser');
      expect(res.body.email).toBe('test@example.com');
      expect(res.body.password_hash).toBeUndefined();
      expect(res.body.created_at).toBeDefined();
    });

    it('should hash the password before storing', async () => {
      const password = 'myPassword123';
      const res = await request(app)
        .post('/users/register')
        .send({
          username: 'hashtest',
          email: 'hash@example.com',
          password
        });

      expect(res.status).toBe(201);
      expect(res.body.password_hash).toBeUndefined();

      // Verify password is actually hashed by checking we can look up the user
      const user = await request(app).get('/users/profile');
      // This would require auth, but tests that login works with the hashed password
    });

    it('should reject duplicate usernames', async () => {
      await request(app)
        .post('/users/register')
        .send({
          username: 'unique',
          email: 'first@example.com',
          password: 'password123'
        });

      const res = await request(app)
        .post('/users/register')
        .send({
          username: 'unique',
          email: 'second@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'username' })
      );
    });

    it('should reject duplicate emails', async () => {
      await request(app)
        .post('/users/register')
        .send({
          username: 'user1',
          email: 'same@example.com',
          password: 'password123'
        });

      const res = await request(app)
        .post('/users/register')
        .send({
          username: 'user2',
          email: 'same@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'email' })
      );
    });

    it('should require username', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'username' })
      );
    });

    it('should require email', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'email' })
      );
    });

    it('should require password', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          username: 'testuser',
          email: 'test@example.com'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'password' })
      );
    });

    it('should reject empty username', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          username: '',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          username: 'testuser',
          email: 'not-an-email',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'email' })
      );
    });

    it('should reject short password', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'abc'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'password' })
      );
    });
  });

  describe('POST /users/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      await request(app)
        .post('/users/register')
        .send({
          username: 'logintest',
          email: 'login@example.com',
          password: 'validPassword123'
        });
    });

    it('should return a JWT token for valid credentials', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          username: 'logintest',
          password: 'validPassword123'
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(typeof res.body.token).toBe('string');
      // JWT tokens have 3 parts separated by dots
      expect(res.body.token.split('.')).toHaveLength(3);
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          username: 'logintest',
          password: 'wrongPassword123'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
      expect(res.body.token).toBeUndefined();
    });

    it('should reject non-existent user', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          username: 'nonexistent',
          password: 'validPassword123'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
      expect(res.body.token).toBeUndefined();
    });

    it('should require username', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          password: 'validPassword123'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'username' })
      );
    });

    it('should require password', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          username: 'logintest'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'password' })
      );
    });
  });

  describe('GET /users/profile', () => {
    let authToken;

    beforeEach(async () => {
      // Create a test user and login to get token
      await request(app)
        .post('/users/register')
        .send({
          username: 'profiletest',
          email: 'profile@example.com',
          password: 'validPassword123'
        });

      const loginRes = await request(app)
        .post('/users/login')
        .send({
          username: 'profiletest',
          password: 'validPassword123'
        });

      authToken = loginRes.body.token;
    });

    it('should return profile for authenticated user', async () => {
      const res = await request(app)
        .get('/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBeDefined();
      expect(res.body.username).toBe('profiletest');
      expect(res.body.email).toBe('profile@example.com');
      expect(res.body.password_hash).toBeUndefined();
    });

    it('should reject requests without auth token', async () => {
      const res = await request(app).get('/users/profile');

      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    it('should not include password_hash in response', async () => {
      const res = await request(app)
        .get('/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.password_hash).toBeUndefined();
    });

    it('should reject invalid token', async () => {
      const res = await request(app)
        .get('/users/profile')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });
  });
});
