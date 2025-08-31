const express = require('express');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');
const emailController = require('../controllers/email_controller');

const router = express.Router();

router.post('/send-booking-confirmation', authenticateToken, emailController.sendBooking);
router.post('/send-new-user-confirmation', authenticateToken, emailController.sendNewUser);

// Guest booking endpoint
router.post('/send-guest-booking-confirmation', authenticateToken, emailController.sendGuestBooking);

// Test endpoints
router.post('/test', authenticateToken, emailController.sendTestEmail);

// Preview endpoints (for development/testing)
router.post('/preview-booking-email', emailController.previewBookingEmail);
router.post('/preview-password-reset-email', emailController.previewPasswordResetEmail);
router.get('/preview-test', (req, res) => {
  res.sendFile(path.join(__dirname, '../email-preview-test.html'));
});
router.get('/preview-password-reset-test', (req, res) => {
  res.sendFile(path.join(__dirname, '../password-reset-preview-test.html'));
});

// Public endpoints (no authentication required)
router.post('/resend-new-user-confirmation', emailController.resendNewUserConfirmation);
router.get('/test-connection', emailController.testConnection);

module.exports = router;
