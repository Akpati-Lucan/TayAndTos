const crypto = require('crypto');

/**
 * Generate a cryptographically secure random token
 * @param {number} length - Length of the token (default: 32)
 * @returns {string} - Secure random token
 */
function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a secure password reset token
 * @returns {string} - Secure reset token
 */
function generatePasswordResetToken() {
  return generateSecureToken(32);
}

/**
 * Hash a token for storage (optional additional security)
 * @param {string} token - The token to hash
 * @returns {string} - Hashed token
 */
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Verify if a token matches a hashed token
 * @param {string} token - The plain token
 * @param {string} hashedToken - The hashed token to compare against
 * @returns {boolean} - True if tokens match
 */
function verifyToken(token, hashedToken) {
  return hashToken(token) === hashedToken;
}

module.exports = {
  generateSecureToken,
  generatePasswordResetToken,
  hashToken,
  verifyToken
};
