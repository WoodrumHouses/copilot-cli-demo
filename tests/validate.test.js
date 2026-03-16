const request = require('supertest');
const Database = require('better-sqlite3');
const { setDb } = require('../src/db');
const app = require('../src/index');

beforeEach(() => {
  setDb(new Database(':memory:'));
});

describe('Task Validation (POST /tasks)', () => {
  describe('title field', () => {
    it('should reject a task with no title', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ description: 'No title provided' });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'title' })
      );
    });

    it('should reject a task with empty string title', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: '', description: 'Empty title' });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should reject a task with title exceeding 200 characters', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'x'.repeat(201) });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('priority field', () => {
    it('should reject invalid priority value', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'Valid title', priority: 'urgent' });

      expect(res.status).toBe(400);
      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'priority' })
      );
    });

    it('should accept valid priority values', async () => {
      for (const priority of ['low', 'medium', 'high']) {
        const res = await request(app)
          .post('/tasks')
          .send({ title: 'Valid task', priority });

        expect(res.status).toBe(201);
      }
    });
  });

  describe('status field', () => {
    it('should reject invalid status value', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'Valid title', status: 'cancelled' });

      expect(res.status).toBe(400);
      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'status' })
      );
    });
  });

  describe('description field', () => {
    it('should reject description exceeding 2000 characters', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'Valid title', description: 'x'.repeat(2001) });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });
});
