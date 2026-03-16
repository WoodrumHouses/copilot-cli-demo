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
  // Validation not yet implemented — passes everything through
  next();
}

module.exports = { validateTask };
