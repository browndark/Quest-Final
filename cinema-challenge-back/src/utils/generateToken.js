const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for authentication
 * @param {String} id - User ID to include in the token
 * @returns {String} - JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || '1d'
  });
};

module.exports = generateToken;
