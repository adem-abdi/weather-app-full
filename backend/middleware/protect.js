const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect middleware: Check for Bearer Token in headers
// If valid, allow access; if not, return 401 Unauthorized
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for Authorization header with Bearer token
    // Format: Authorization: Bearer <token>
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]; // Extract token after "Bearer "
    }

    // If no token found
    if (!token) {
      return res.status(401).json({
        error: 'Not authorized. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID from token (exclude password)
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(401).json({
          error: 'User not found'
        });
      }

      // Attach user to request object for use in controllers
      req.user = user;
      next();

    } catch (error) {
      // Token verification failed
      return res.status(401).json({
        error: 'Not authorized. Invalid token.'
      });
    }

  } catch (error) {
    console.error('Protect middleware error:', error);
    return res.status(500).json({
      error: 'Server error during authentication'
    });
  }
};

module.exports = protect;

