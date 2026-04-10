const jwt = require('jsonwebtoken');

module.exports = function requireAuth(req, res, next) {
  // Expect header: Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // attach user info to request
    next();               // move on to the route handler
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};