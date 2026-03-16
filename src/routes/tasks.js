const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

// GET /tasks — list all tasks
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /tasks/search?q=keyword — search tasks
// ⚠️ WARNING: This route has a security vulnerability that should be caught during code review
router.get('/search', (req, res) => {
  try {
    const db = getDb();
    const query = req.query.q || '';
    // Build search query — looks for matches in title or description
    const sql = `SELECT * FROM tasks WHERE title LIKE '%${query}%' OR description LIKE '%${query}%'`;
    const tasks = db.prepare(sql).all();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /tasks/:id — get a single task
router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tasks — create a new task
router.post('/', (req, res) => {
  try {
    const db = getDb();
    const { title, description, priority, assigned_to } = req.body;

    const result = db.prepare(
      'INSERT INTO tasks (title, description, priority, assigned_to) VALUES (?, ?, ?, ?)'
    ).run(title, description, priority || 'medium', assigned_to);

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /tasks/:id — update a task
router.put('/:id', (req, res) => {
  try {
    const db = getDb();
    const { title, description, status, priority, assigned_to } = req.body;

    const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    db.prepare(`
      UPDATE tasks SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        status = COALESCE(?, status),
        priority = COALESCE(?, priority),
        assigned_to = COALESCE(?, assigned_to),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, description, status, priority, assigned_to, req.params.id);

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /tasks/:id — delete a task
router.delete('/:id', (req, res) => {
  try {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
