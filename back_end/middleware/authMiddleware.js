const jwt = require('jsonwebtoken');
const { Types } = require('mongoose');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('No token provided');
    }

    console.log('Attempting to verify token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully:', decoded);
    
    // Extract user ID from decoded token based on payload structure
    const userId = new Types.ObjectId(decoded.id || (decoded.user && decoded.user.id));
    
    req.user = {
      _id: userId,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    console.error('Detailed auth error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    res.status(401).json({ 
      success: false,
      message: 'Authentication failed',
      details: error.message 
    });
  }
};

module.exports = auth;
