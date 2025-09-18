// utils/generateCode.js
import crypto from 'crypto';

export function generateConfirmationCode() {
  return crypto.randomBytes(6).toString('hex'); // 12-char alphanumeric string
}

export default generateConfirmationCode;
