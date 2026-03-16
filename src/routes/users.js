const express = require('express');
const router = express.Router();

// POST /users/register — register a new user
router.post('/register', (req, res) => {
  // TODO: Extract username, email, password from req.body
  // TODO: Validate that all required fields are present
  // TODO: Hash the password using bcrypt
  // TODO: Store the user in the database
  // TODO: Return the created user (without password_hash)
  res.status(501).json({ error: 'Not implemented' });
});

// POST /users/login — authenticate and return JWT
router.post('/login', (req, res) => {
  // TODO: Extract username and password from req.body
  // TODO: Look up user by username
  // TODO: Verify password against stored hash
  // TODO: Generate JWT token with user id and username
  // TODO: Return the token
  res.status(501).json({ error: 'Not implemented' });
});

// GET /users/profile — get current user profile (requires auth)
router.get('/profile', (req, res) => {
  // TODO: Add auth middleware to protect this route
  // TODO: Get user id from the authenticated token
  // TODO: Fetch user from database
  // TODO: Return user profile (without password_hash)
  res.status(501).json({ error: 'Not implemented' });
});

// PUT /users/profile — update current user profile (requires auth)
router.put('/profile', (req, res) => {
  // TODO: Add auth middleware to protect this route
  // TODO: Get user id from the authenticated token
  // TODO: Update allowed fields (email, username)
  // TODO: Return updated profile
  res.status(501).json({ error: 'Not implemented' });
});

module.exports = router;
