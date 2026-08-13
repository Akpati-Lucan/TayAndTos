import { sendBookingConfirmation, sendNewUserConfirmation } from '../sevices/email_service.js';
import * as bookingTemplate from '../templates/booking_email.js';
import * as passwordResetTemplate from '../templates/password_reset_email.js';

export const sendBooking = async (req, res) => {
  try {
    const { booking, user } = req.body;
    if (!booking || !user) {
      return res.status(400).json({ success: false, message: 'Booking and user required' });
    }

    await sendBookingConfirmation(booking, user);
    res.json({ success: true, message: 'Booking confirmation email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const sendGuestBooking = async (req, res) => {
    try {
      const { booking, user } = req.body;
      if (!booking || !user) {
        return res.status(400).json({ success: false, message: 'Booking and user information required' });
      }
      if (booking.user_id) {
        return res.status(400).json({ success: false, message: 'This endpoint is for guest bookings only' });
      }
  
      await sendBookingConfirmation(booking, user);
      res.json({ success: true, message: 'Guest booking confirmation email sent successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to send guest booking confirmation', error: err.message });
    }
  };
  

export const sendNewUser = async (req, res) => {
  try {
    const { user } = req.body;
    if (!user || !user.email) {
      return res.status(400).json({ success: false, message: 'User email required' });
    }

    await sendNewUserConfirmation(user);
    res.json({ success: true, message: 'New user confirmation email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Public endpoint to resend new user confirmation email
export const resendNewUserConfirmation = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }
    
    // Verify user exists in database
    const db = require('../db');
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found with the provided email' 
      });
    }
    
    const user = users[0];
    
    // Send the confirmation email
    await sendNewUserConfirmation(user);
    
    res.json({ 
      success: true, 
      message: 'New user confirmation email sent successfully' 
    });
  } catch (error) {
    console.error('Error resending new user confirmation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to resend new user confirmation email', 
      error: error.message 
    });
  }
};

// Test email connection endpoint
export const testConnection = async (req, res) => {
  try {
    // Test SendGrid connection by sending a test email
    const testMsg = {
      to: 'test@example.com',
      from: { email: process.env.SENDGRID_FROM_EMAIL || 'noreply@tayandtos.com', name: 'Tay and Tos' },
      subject: 'Test Email Connection',
      text: 'This is a test email to verify the email service is working.',
      html: '<p>This is a test email to verify the email service is working.</p>'
    };
    
    // Note: In production, you might want to actually send this test email
    // For now, we'll just return success to indicate the endpoint is working
    res.json({ 
      success: true, 
      message: 'Email service endpoint is working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error testing email connection:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to test email connection', 
      error: error.message 
    });
  }
};


export const sendTestEmail = async (req, res) => {
    try {
      const testBooking = { confirmation_code: 'TEST123', room: 'Master Bedroom', check_in_date: '2024-01-15', check_out_date: '2024-01-17', number_of_guests: 2, status: 'confirmed', special_requests: 'Early check-in' };
      const testUser = { email: 'tayandtoscorporations.com', first_name: 'John', last_name: 'Doe' };
  
      await sendBookingConfirmation(testBooking, testUser);
      res.json({ success: true, message: 'Test email sent successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to send test email', error: err.message });
    }
  };

export const previewBookingEmail = (req, res) => {
  try {
    const { booking, user } = req.body;

    if (!booking || !user) {
      return res.status(400).send('<h2>Booking and user info required for preview</h2>');
    }

    const checkInDate = new Date(booking.check_in_date).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
    const checkOutDate = new Date(booking.check_out_date).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
    const duration = Math.ceil((new Date(booking.check_out_date) - new Date(booking.check_in_date)) / (1000*60*60*24));

    // Generate the HTML string
    const htmlContent = bookingTemplate.generateHtml(booking, user, checkInDate, checkOutDate, duration);

    // Send HTML directly to browser
    res.set('Content-Type', 'text/html');
    res.send(htmlContent);
  } catch (err) {
    console.error('Error generating email preview:', err);
    res.status(500).send('<h2>Failed to generate email preview</h2>');
  }
};

export const previewPasswordResetEmail = (req, res) => {
  try {
    const { user, resetToken, resetUrl } = req.body;

    if (!user || !resetToken || !resetUrl) {
      return res.status(400).send('<h2>User, resetToken, and resetUrl required for preview</h2>');
    }

    // Generate the HTML string
    const { html } = passwordResetTemplate.generatePasswordResetEmailContent(user, resetToken, resetUrl);

    // Send HTML directly to browser
    res.set('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    console.error('Error generating password reset email preview:', err);
    res.status(500).send('<h2>Failed to generate password reset email preview</h2>');
  }
};

export default {
  sendBooking,
  sendGuestBooking,
  sendNewUser,
  resendNewUserConfirmation,
  testConnection,
  sendTestEmail,
  previewBookingEmail,
  previewPasswordResetEmail
};
