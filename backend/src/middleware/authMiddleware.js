import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  console.log('🔐 Auth middleware - Headers:', {
    authorization: req.headers.authorization ? 'Bearer [TOKEN]' : 'MISSING',
    'content-type': req.headers['content-type']
  });

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('🔐 Auth middleware - Token found, length:', token.length);
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('🔐 Auth middleware - Token decoded:', { id: decoded.id, iat: decoded.iat });
      
      req.user = await User.findById(decoded.id).select('-password');
      console.log('🔐 Auth middleware - User found:', req.user ? { name: req.user.name, role: req.user.role } : 'NOT FOUND');
      
      if (!req.user) {
        console.log('❌ Auth middleware - User not found in database');
        return res.status(401).json({ success: false, message: 'User not found in database' });
      }
      
      if (!req.user.isActive) {
        console.log('❌ Auth middleware - User account is inactive');
        return res.status(401).json({ success: false, message: 'Account is inactive' });
      }
      
      console.log('✅ Auth middleware - Authentication successful');
      next();
    } catch (err) {
      console.error('💥 Auth middleware error:', {
        name: err.name,
        message: err.message,
        expiredAt: err.expiredAt
      });
      
      let errorMessage = 'Not authorized, invalid token';
      if (err.name === 'JsonWebTokenError') {
        errorMessage = 'Invalid token format';
      } else if (err.name === 'TokenExpiredError') {
        errorMessage = 'Token has expired';
      }
      
      return res.status(401).json({ success: false, message: errorMessage });
    }
  } else {
    console.log('❌ Auth middleware - No Authorization header found');
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};


export const adminOnly = (req, res, next) => {
  console.log('👑 Admin middleware - User role:', req.user?.role);
  
  if (!req.user) {
    console.log('❌ Admin middleware - No user found');
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  
  if (req.user.role !== "admin") {
    console.log('❌ Admin middleware - Access denied for role:', req.user.role);
    return res.status(403).json({
      success: false,
      message: `Access denied: Admin only. Your role: ${req.user.role}`
    });
  }
  
  console.log('✅ Admin middleware - Access granted');
  next();
};