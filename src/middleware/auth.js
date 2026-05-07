const jwt = require('jsonwebtoken');

/**
 * JWT Authentication middleware.
 *
 * This middleware:
 * 1. Extracts the Bearer token from the Authorization header
 * 2. Verifies the token using the JWT_SECRET
 * 3. Attaches the decoded user info to req.user
 * 4. Returns 401 if token is missing or invalid
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.substring(7);
  const secret = process.env.JWT_SECRET || 'your-secret-key';

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { authenticate };
