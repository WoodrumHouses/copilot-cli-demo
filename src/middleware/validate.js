/**
 * Input validation middleware for task endpoints.
 *
 * This middleware should validate incoming request bodies for POST /tasks:
 * - title: required, must be a non-empty string, max 200 characters
 * - description: optional, must be a string if provided, max 2000 characters
 * - priority: optional, must be one of 'low', 'medium', 'high'
 * - status: optional, must be one of 'pending', 'in_progress', 'done'
 *
 * If validation fails, return 400 with { errors: [...] }
 */
function validateTask(req, res, next) {
  const errors = [];
  const { title, description, priority, status } = req.body || {};

  if (typeof title !== 'string' || title.trim().length === 0) {
    errors.push({ field: 'title', message: 'title is required and must be a non-empty string' });
  } else if (title.length > 200) {
    errors.push({ field: 'title', message: 'title must be at most 200 characters' });
  }

  if (description !== undefined) {
    if (typeof description !== 'string') {
      errors.push({ field: 'description', message: 'description must be a string' });
    } else if (description.length > 2000) {
      errors.push({ field: 'description', message: 'description must be at most 2000 characters' });
    }
  }

  if (priority !== undefined && !['low', 'medium', 'high'].includes(priority)) {
    errors.push({ field: 'priority', message: "priority must be one of 'low', 'medium', 'high'" });
  }

  if (status !== undefined && !['pending', 'in_progress', 'done'].includes(status)) {
    errors.push({ field: 'status', message: "status must be one of 'pending', 'in_progress', 'done'" });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

/**
 * Input validation middleware for user registration.
 *
 * This middleware should validate incoming request bodies for POST /users/register:
 * - username: required, non-empty string
 * - email: required, valid email format
 * - password: required, minimum 8 characters
 *
 * If validation fails, return 400 with { errors: [...] }
 */
function validateRegister(req, res, next) {
  const errors = [];
  const { username, email, password } = req.body || {};

  if (typeof username !== 'string' || username.trim().length === 0) {
    errors.push({ field: 'username', message: 'username is required and must be a non-empty string' });
  }

  if (typeof email !== 'string' || email.trim().length === 0) {
    errors.push({ field: 'email', message: 'email is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: 'email', message: 'email must be a valid email address' });
  }

  if (typeof password !== 'string') {
    errors.push({ field: 'password', message: 'password is required' });
  } else if (password.length < 8) {
    errors.push({ field: 'password', message: 'password must be at least 8 characters' });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

function validateLogin(req, res, next) {
  const errors = [];
  const { username, password } = req.body || {};

  if (typeof username !== 'string' || username.trim().length === 0) {
    errors.push({ field: 'username', message: 'username is required' });
  }

  if (typeof password !== 'string' || password.length === 0) {
    errors.push({ field: 'password', message: 'password is required' });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

module.exports = { validateTask, validateRegister, validateLogin };
