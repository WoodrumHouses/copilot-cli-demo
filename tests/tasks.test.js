const request = require('supertest');
const Database = require('better-sqlite3');
const { setDb } = require('../src/db');
const app = require('../src/index');

beforeEach(() => {
  setDb(new Database(':memory:'));
});

describe('Tasks API', () => {
  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'Test task', description: 'A test task' });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Test task');
      expect(res.body.id).toBeDefined();
    });

    it('should default priority to medium', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'No priority task' });

      expect(res.status).toBe(201);
      expect(res.body.priority).toBe('medium');
    });
  });

  describe('GET /tasks', () => {
    it('should return an empty list initially', async () => {
      const res = await request(app).get('/tasks');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return all tasks', async () => {
      await request(app).post('/tasks').send({ title: 'Task 1' });
      await request(app).post('/tasks').send({ title: 'Task 2' });

      const res = await request(app).get('/tasks');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a single task', async () => {
      const created = await request(app)
        .post('/tasks')
        .send({ title: 'Find me' });

      const res = await request(app).get(`/tasks/${created.body.id}`);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Find me');
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app).get('/tasks/9999');
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update a task', async () => {
      const created = await request(app)
        .post('/tasks')
        .send({ title: 'Original' });

      const res = await request(app)
        .put(`/tasks/${created.body.id}`)
        .send({ title: 'Updated', status: 'done' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated');
      expect(res.body.status).toBe('done');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', async () => {
      const created = await request(app)
        .post('/tasks')
        .send({ title: 'Delete me' });

      const res = await request(app).delete(`/tasks/${created.body.id}`);
      expect(res.status).toBe(204);

      const check = await request(app).get(`/tasks/${created.body.id}`);
      expect(check.status).toBe(404);
    });
  });
});
