const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { create, getByUsername, getById, verifyPassword, update } = require('../models/user');
const { validateRegister, validateLogin } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

// POST /users/register — register a new user
router.post('/register', validateRegister, (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = create({ username, email, password });

    // Return user without password_hash
    const { password_hash, ...userResponse } = user;
    res.status(201).json(userResponse);
  } catch (err) {
    if (err.field) {
      // Database constraint error (duplicate username/email)
      return res.status(400).json({
        errors: [{ field: err.field, message: err.message }]
      });
    }
    res.status(500).json({ error: err.message });
  }
});

// POST /users/login — authenticate and return JWT
router.post('/login', validateLogin, (req, res) => {
  try {
    const { username, password } = req.body;
    const user = getByUsername(username);

    if (!user || !verifyPassword(username, password)) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { id: user.id, username: user.username },
      secret,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /users/profile — get current user profile (requires auth)
router.get('/profile', authenticate, (req, res) => {
  try {
    const user = getById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user without password_hash
    const { password_hash, ...userResponse } = user;
    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /users/profile — update current user profile (requires auth)
router.put('/profile', authenticate, (req, res) => {
  try {
    const { email, username } = req.body;
    const user = update(req.user.id, { email, username });

    // Return updated user without password_hash
    const { password_hash, ...userResponse } = user;
    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
