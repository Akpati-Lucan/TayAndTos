// utils/generateCode.js
const crypto = require('crypto');

function generateConfirmationCode() {
  return crypto.randomBytes(6).toString('hex'); // 12-char alphanumeric string
}

module.exports = generateConfirmationCode;
