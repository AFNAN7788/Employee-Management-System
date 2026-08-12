/**
 * Middleware that restricts access to admin-only users.
 * Must be used AFTER authMiddleware (which sets req.user).
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only administrators can perform this action.',
    });
  }
  next();
};

module.exports = { requireAdmin };
