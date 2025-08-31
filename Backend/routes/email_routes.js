const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const emailController = require('../controllers/emailController');

const router = express.Router();

router.post('/send-booking-confirmation', authenticateToken, emailController.sendBooking);
router.post('/send-new-user-confirmation', authenticateToken, emailController.sendNewUser);

// Guest booking endpoint
router.post('/send-guest-booking-confirmation', authenticateToken, emailController.sendGuestBooking);

// Test endpoints
router.post('/test', authenticateToken, emailController.sendTestEmail);

// Public endpoints (no authentication required)
router.post('/resend-new-user-confirmation', emailController.resendNewUserConfirmation);
router.get('/test-connection', emailController.testConnection);

module.exports = router;
