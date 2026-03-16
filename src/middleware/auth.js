/**
 * JWT Authentication middleware.
 *
 * This middleware should:
 * 1. Extract the Bearer token from the Authorization header
 * 2. Verify the token using the JWT_SECRET
 * 3. Attach the decoded user info to req.user
 * 4. Return 401 if token is missing or invalid
 */
function authenticate(req, res, next) {
  // TODO: Implement JWT verification
  // TODO: Extract token from Authorization header
  // TODO: Verify token and attach user to request
  res.status(401).json({ error: 'Authentication not implemented' });
}

module.exports = { authenticate };
