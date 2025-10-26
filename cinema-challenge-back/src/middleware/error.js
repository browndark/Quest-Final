/**
 * Error response middleware for 404 not found
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.notFound = (req, res, next) => {
  // List of paths that are common for preflight checks
  const prefightPaths = ['/api/v1/auth/register', '/api/v1/auth/login'];
  
  // Skip logging for common preflight route checks 
  // These routes will be properly accessed when user tries to login/register
  if (prefightPaths.includes(req.originalUrl)) {
    res.status(404).json({
      success: false,
      message: 'Route exists but is currently inactive'
    });
    return;
  }
  
  // Normal 404 error handling for other routes
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Custom error handler middleware
 * @param {Object} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.errorHandler = (err, req, res, next) => {
  // Log error for server side debugging
  console.error(err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  
  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = {};
    
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
    
    message = 'Validation failed';
    
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  }
  
  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Resource not found';
  }
  
  // Handle duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
    
    return res.status(statusCode).json({
      success: false,
      message,
      field: err.keyValue
    });
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
