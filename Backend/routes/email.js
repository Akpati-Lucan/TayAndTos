const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../db');

// Using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');

// Set API key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Email configuration
const EMAIL_CONFIG = {
  from: process.env.FROM_EMAIL || 'akpatilucan@gmail.com', // Change to your verified sender
  fromName: 'Tay and Tos Accommodation'
};

/**
 * Send booking confirmation email to user
 * @param {Object} booking - Booking object with user details
 * @param {Object} user - User object with email and name
 * @returns {Promise} - SendGrid response
 */
const sendBookingConfirmationEmail = async (booking, user) => {
  try {
    // Log configuration for debugging
    console.log('SendGrid Configuration:');
    console.log('- API Key present:', !!process.env.SENDGRID_API_KEY);
    console.log('- API Key format:', process.env.SENDGRID_API_KEY?.startsWith('SG.') ? 'Valid' : 'Invalid');
    console.log('- From Email:', EMAIL_CONFIG.from);
    console.log('- To Email:', user.email);
    
    // Validate configuration
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY environment variable not set');
    }
    
    if (!process.env.SENDGRID_API_KEY.startsWith('SG.')) {
      throw new Error('SENDGRID_API_KEY format invalid - should start with SG.');
    }
    
    if (!EMAIL_CONFIG.from) {
      throw new Error('FROM_EMAIL environment variable not set');
    }

    // Format dates for better readability
    const checkInDate = new Date(booking.check_in_date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const checkOutDate = new Date(booking.check_out_date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Calculate duration
    const duration = Math.ceil((new Date(booking.check_out_date) - new Date(booking.check_in_date)) / (1000 * 60 * 60 * 24));

    // Create email content
    const emailContent = {
      to: user.email,
      from: EMAIL_CONFIG.from,
      fromName: EMAIL_CONFIG.fromName,
      subject: `🎉 Booking Confirmed! Code: ${booking.confirmation_code} - ${checkInDate}`,
      text: generateTextEmail(booking, user, checkInDate, checkOutDate, duration),
      html: generateHtmlEmail(booking, user, checkInDate, checkOutDate, duration)
    };

    console.log('Sending email with content:', {
      to: emailContent.to,
      from: emailContent.from,
      subject: emailContent.subject
    });

    // Send email
    const response = await sgMail.send(emailContent);
    console.log(`Booking confirmation email sent to ${user.email}`);
    return response;
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    
    // Enhanced error logging for SendGrid issues
    if (error.code === 403) {
      console.error('SendGrid 403 Forbidden Error Details:');
      console.error('- This usually means:');
      console.error('  1. Invalid or expired API key');
      console.error('  2. Sender email not verified in SendGrid');
      console.error('  3. API key lacks "Mail Send" permissions');
      console.error('  4. SendGrid account restrictions');
      console.error('- Current configuration:');
      console.error('  - API Key present:', !!process.env.SENDGRID_API_KEY);
      console.error('  - API Key format:', process.env.SENDGRID_API_KEY?.startsWith('SG.') ? 'Valid' : 'Invalid');
      console.error('  - From Email:', EMAIL_CONFIG.from);
      console.error('  - To Email:', user.email);
    }
    
    throw error;
  }
};

/**
 * Generate plain text version of the email
 */
function generateTextEmail(booking, user, checkInDate, checkOutDate, duration) {
  return `
Dear ${user.first_name} ${user.last_name},

🎉 Your booking has been successfully confirmed!

IMPORTANT: Your confirmation code is: ${booking.confirmation_code}

Please save this code for your records and bring it with you for check-in.

BOOKING DETAILS:
- Confirmation Code: ${booking.confirmation_code}
- Room: ${booking.room}
- Check-in: ${checkInDate}
- Check-out: ${checkOutDate}
- Duration: ${duration} night${duration > 1 ? 's' : ''}
- Number of Guests: ${booking.number_of_guests}
- Status: ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}

SPECIAL REQUESTS: ${booking.special_requests || 'None'}

ARRIVAL INFORMATION:
- Check-in time: 12:00 PM
- Check-out time: 12:00 PM
- Please bring a valid ID for check-in

CONTACT INFORMATION:
- Phone: +234 814 074 9365
- Phone: +234 803 843 6811
- Email: divinetay-toscorporations@gmail.com
- Address: NO. 5, UNITY QUARTERS, FEDERAL PRISON AREA, OFF ARE/ AFAO ROAD, ADO-EKITI, EKITI STATE, NIGERIA

If you have any questions or need to modify your booking, please contact us as soon as possible.

We look forward to welcoming you!

Best regards,
The Tay and Tos Team
  `.trim();
}

/**
 * Generate HTML version of the email
 */
function generateHtmlEmail(booking, user, checkInDate, checkOutDate, duration) {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #F15A29; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #F15A29; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #555; }
        .detail-value { color: #333; }
        .confirmation-code { 
          background: #F15A29; 
          color: white; 
          padding: 15px; 
          border-radius: 8px; 
          text-align: center; 
          font-size: 20px; 
          font-weight: bold; 
          margin: 20px 0; 
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          border: 2px solid #fff;
        }
        .confirmation-code .code { 
          font-size: 24px; 
          letter-spacing: 2px; 
          font-family: 'Courier New', monospace;
          background: rgba(255,255,255,0.2);
          padding: 8px 12px;
          border-radius: 4px;
          margin: 5px 0;
          display: inline-block;
        }
        .copy-instruction {
          font-size: 14px;
          margin-top: 10px;
          opacity: 0.9;
        }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .contact-info { background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .button { display: inline-block; background: #F15A29; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Thank you for choosing Tay and Tos Accommodation</p>
            <div class="confirmation-code">
                <span class="code">${booking.confirmation_code}</span>
                <p class="copy-instruction">Click to copy code</p>
            </div>
        </div>
        
        <div class="content">
            <p>Dear <strong>${user.first_name} ${user.last_name}</strong>,</p>
            
            <p>Your booking has been successfully confirmed! We're excited to welcome you to our accommodation.</p>
            
            <div class="booking-details">
                <h3>📋 Booking Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Confirmation Code:</span>
                    <span class="detail-value"><strong>${booking.confirmation_code}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Room:</span>
                    <span class="detail-value">${booking.room}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Check-in:</span>
                    <span class="detail-value">${checkInDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Check-out:</span>
                    <span class="detail-value">${checkOutDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Duration:</span>
                    <span class="detail-value">${duration} night${duration > 1 ? 's' : ''}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Guests:</span>
                    <span class="detail-value">${booking.number_of_guests}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                </div>
                ${booking.special_requests ? `
                <div class="detail-row">
                    <span class="detail-label">Special Requests:</span>
                    <span class="detail-value">${booking.special_requests}</span>
                </div>
                ` : ''}
            </div>
            
            <div class="contact-info">
              <h3>Contact Us</h3>
              <h4>Email: divinetay-toscorporations@gmail.com</h4>
              <h4>Phone: +234 814 074 9365</h4>
              <h4>Phone: +234 803 843 6811</h4>
              <h4>Address: NO. 5, UNITY QUARTERS, FEDERAL PRISON AREA, OFF ARE/ AFAO ROAD, ADO-EKITI, EKITI STATE, NIGERIA</h4>
            </div>
            
            <p><strong>Important Notes:</strong></p>
            <ul>
                <li>Check-in time: 12:00 PM</li>
                <li>Check-out time: 12:00 PM</li>
                <li>Please bring a valid ID for check-in</li>
                <li>Contact us immediately if you need to modify your booking</li>
            </ul>
            
            <p>We look forward to providing you with a comfortable and memorable stay!</p>
            
            <p>Best regards,<br>
            <strong>The Tay and Tos Team</strong></p>
        </div>
        
        <div class="footer">
            <p>This is an automated confirmation email. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>
  `.trim();
}

/**
 * Send new user confirmation email to user
 * @param {Object} user - User object with email and name
 * @returns {Promise} - SendGrid response
 */
const sendNewUserConfirmationEmail = async (user) => {
  try {
    // Log configuration for debugging
    console.log('SendGrid Configuration for New User:');
    console.log('- API Key present:', !!process.env.SENDGRID_API_KEY);
    console.log('- API Key format:', process.env.SENDGRID_API_KEY?.startsWith('SG.') ? 'Valid' : 'Invalid');
    console.log('- From Email:', EMAIL_CONFIG.from);
    console.log('- To Email:', user.email);
    
    // Validate configuration
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY environment variable not set');
    }
    
    if (!process.env.SENDGRID_API_KEY.startsWith('SG.')) {
      throw new Error('SENDGRID_API_KEY format invalid - should start with SG.');
    }
    
    if (!EMAIL_CONFIG.from) {
      throw new Error('FROM_EMAIL environment variable not set');
    }

    // Create email content
    const emailContent = {
      to: user.email,
      from: EMAIL_CONFIG.from,
      fromName: EMAIL_CONFIG.fromName,
      subject: `🎉 Welcome to Tay and Tos Accommodation!`,
      text: generateNewUserTextEmail(user),
      html: generateNewUserHtmlEmail(user)
    };

    console.log('Sending new user confirmation email with content:', {
      to: emailContent.to,
      from: emailContent.from,
      subject: emailContent.subject
    });

    // Send email
    const response = await sgMail.send(emailContent);
    console.log(`New user confirmation email sent to ${user.email}`);
    return response;
  } catch (error) {
    console.error('Error sending new user confirmation email:', error);
    
    // Enhanced error logging for SendGrid issues
    if (error.code === 403) {
      console.error('SendGrid 403 Forbidden Error Details for New User:');
      console.error('- This usually means:');
      console.error('  1. Invalid or expired API key');
      console.error('  2. Sender email not verified in SendGrid');
      console.error('  3. API key lacks "Mail Send" permissions');
      console.error('  4. SendGrid account restrictions');
      console.error('- Current configuration:');
      console.error('  - API Key present:', !!process.env.SENDGRID_API_KEY);
      console.error('  - API Key format:', process.env.SENDGRID_API_KEY?.startsWith('SG.') ? 'Valid' : 'Invalid');
      console.error('  - From Email:', EMAIL_CONFIG.from);
      console.error('  - To Email:', user.email);
    }
    
    throw error;
  }
};

/**
 * Generate plain text version of the new user confirmation email
 */
function generateNewUserTextEmail(user) {
  return `
Dear ${user.first_name} ${user.last_name},

🎉 Welcome to Tay and Tos Accommodation!

Your account has been successfully created.

Please save this code for your records and bring it with you for check-in.

ACCOUNT DETAILS:
- Email: ${user.email}
- Name: ${user.first_name} ${user.last_name}

ARRIVAL INFORMATION:
- Check-in time: 12:00 PM
- Check-out time: 12:00 PM
- Please bring a valid ID for check-in

CONTACT INFORMATION:
- Phone: +234 814 074 9365
- Phone: +234 803 843 6811
- Email: divinetay-toscorporations@gmail.com
- Address: NO. 5, UNITY QUARTERS, FEDERAL PRISON AREA, OFF ARE/ AFAO ROAD, ADO-EKITI, EKITI STATE, NIGERIA

If you have any questions or need to modify your booking, please contact us as soon as possible.

We look forward to welcoming you!

Best regards,
The Tay and Tos Team
  `.trim();
}

/**
 * Generate HTML version of the new user confirmation email
 */
function generateNewUserHtmlEmail(user) {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Tay and Tos Accommodation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #F15A29; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #F15A29; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #555; }
        .detail-value { color: #333; }
        .confirmation-code { 
          background: #F15A29; 
          color: white; 
          padding: 15px; 
          border-radius: 8px; 
          text-align: center; 
          font-size: 20px; 
          font-weight: bold; 
          margin: 20px 0; 
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          border: 2px solid #fff;
        }
        .confirmation-code .code { 
          font-size: 24px; 
          letter-spacing: 2px; 
          font-family: 'Courier New', monospace;
          background: rgba(255,255,255,0.2);
          padding: 8px 12px;
          border-radius: 4px;
          margin: 5px 0;
          display: inline-block;
        }
        .copy-instruction {
          font-size: 14px;
          margin-top: 10px;
          opacity: 0.9;
        }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .contact-info { background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .button { display: inline-block; background: #F15A29; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome to Tay and Tos Accommodation!</h1>
            <p>Thank you for choosing Tay and Tos Accommodation</p>
            <div class="confirmation-code">
                <span class="code">Your Account Details</span>
                <p class="copy-instruction">Click to copy code</p>
            </div>
        </div>
        
        <div class="content">
            <p>Dear <strong>${user.first_name} ${user.last_name}</strong>,</p>
            
            <p>Your account has been successfully created! We're excited to welcome you to our accommodation.</p>
            
            <div class="booking-details">
                <h3>📋 Account Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value"><strong>${user.email}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${user.first_name} ${user.last_name}</span>
                </div>
            </div>
            
            <div class="contact-info">
              <h3>Contact Us</h3>
              <h4>Email: divinetay-toscorporations@gmail.com</h4>
              <h4>Phone: +234 814 074 9365</h4>
              <h4>Phone: +234 803 843 6811</h4>
              <h4>Address: NO. 5, UNITY QUARTERS, FEDERAL PRISON AREA, OFF ARE/ AFAO ROAD, ADO-EKITI, EKITI STATE, NIGERIA</h4>
            </div>
            
            <p><strong>Important Notes:</strong></p>
            <ul>
                <li>Check-in time: 12:00 PM</li>
                <li>Check-out time: 12:00 PM</li>
                <li>Please bring a valid ID for check-in</li>
                <li>Contact us immediately if you need to modify your booking</li>
            </ul>
            
            <p>We look forward to providing you with a comfortable and memorable stay!</p>
            
            <p>Best regards,<br>
            <strong>The Tay and Tos Team</strong></p>
        </div>
        
        <div class="footer">
            <p>This is an automated confirmation email. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>
  `.trim();
}

/**
 * Send booking confirmation email endpoint for authenticated users
 */
router.post('/send-booking-confirmation', authenticateToken, async (req, res) => {
  try {
    const { booking, user } = req.body;
    
    if (!booking || !user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Booking and user information are required' 
      });
    }
    
    await sendBookingConfirmationEmail(booking, user);
    
    res.json({ 
      success: true, 
      message: 'Booking confirmation email sent successfully' 
    });
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send booking confirmation email', 
      error: error.message 
    });
  }
});

/**
 * Test email endpoint (for development/testing)
 */
router.post('/test', authenticateToken, async (req, res) => {
  try {
    const testBooking = {
      confirmation_code: 'TEST123',
      room: 'Master Bedroom',
      check_in_date: '2024-01-15',
      check_out_date: '2024-01-17',
      number_of_guests: 2,
      status: 'confirmed',
      special_requests: 'Early check-in if possible'
    };
    
    const testUser = {
      email: 'akpatilucan@gmail.com',
      first_name: 'John',
      last_name: 'Doe'
    };
    
    await sendBookingConfirmationEmail(testBooking, testUser);
    res.json({ success: true, message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send test email', error: error.message });
  }
});

/**
 * Send new user confirmation email endpoint
 */
router.post('/send-new-user-confirmation', authenticateToken, async (req, res) => {
  try {
    const { user } = req.body;
    
    if (!user || !user.email || !user.first_name || !user.last_name) {
      return res.status(400).json({ 
        success: false, 
        message: 'User information with email, first_name, and last_name are required' 
      });
    }
    
    await sendNewUserConfirmationEmail(user);
    
    res.json({ 
      success: true, 
      message: 'New user confirmation email sent successfully' 
    });
  } catch (error) {
    console.error('Error sending new user confirmation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send new user confirmation email', 
      error: error.message 
    });
  }
});

/**
 * Test new user email endpoint (for development/testing)
 */
router.post('/test-new-user', authenticateToken, async (req, res) => {
  try {
    const testUser = {
      email: 'akpatilucan@gmail.com',
      first_name: 'John',
      last_name: 'Doe'
    };
    
    await sendNewUserConfirmationEmail(testUser);
    res.json({ success: true, message: 'Test new user email sent successfully' });
  } catch (error) {
    console.error('Test new user email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send test new user email', error: error.message });
  }
});

/**
 * Test SendGrid connection and configuration
 */
router.get('/test-connection', async (req, res) => {
  try {
    console.log('Testing SendGrid connection...');
    console.log('API Key present:', !!process.env.SENDGRID_API_KEY);
    console.log('API Key starts with SG.:', process.env.SENDGRID_API_KEY?.startsWith('SG.'));
    console.log('From Email:', process.env.FROM_EMAIL || 'Not set');
    
    // Test basic SendGrid configuration
    if (!process.env.SENDGRID_API_KEY) {
      return res.status(400).json({ 
        success: false, 
        error: 'SENDGRID_API_KEY environment variable not set' 
      });
    }
    
    if (!process.env.SENDGRID_API_KEY.startsWith('SG.')) {
      return res.status(400).json({ 
        success: false, 
        error: 'SENDGRID_API_KEY format invalid - should start with SG.' 
      });
    }
    
    // Test SendGrid API key validity
    try {
      const testResponse = await sgMail.send({
        to: 'test@example.com',
        from: process.env.FROM_EMAIL || 'noreply@tayandtos.com',
        subject: 'SendGrid Test',
        text: 'This is a test email to verify SendGrid configuration.',
        html: '<p>This is a test email to verify SendGrid configuration.</p>'
      });
      
      res.json({ 
        success: true, 
        message: 'SendGrid connection successful',
        details: {
          apiKeyPresent: !!process.env.SENDGRID_API_KEY,
          apiKeyFormat: 'Valid',
          fromEmail: process.env.FROM_EMAIL || 'noreply@tayandtos.com',
          testEmailSent: true
        }
      });
    } catch (sendError) {
      console.error('SendGrid test failed:', sendError);
      
      if (sendError.code === 403) {
        res.status(400).json({ 
          success: false, 
          error: 'SendGrid 403 Forbidden - Check API key and sender verification',
          details: {
            code: sendError.code,
            message: sendError.message,
            apiKeyPresent: !!process.env.SENDGRID_API_KEY,
            apiKeyFormat: process.env.SENDGRID_API_KEY?.startsWith('SG.') ? 'Valid' : 'Invalid',
            fromEmail: process.env.FROM_EMAIL || 'Not set',
            suggestions: [
              'Verify your SendGrid API key is correct',
              'Ensure the API key has "Mail Send" permissions',
              'Verify your sender email in SendGrid dashboard',
              'Check if your SendGrid account is active'
            ]
          }
        });
      } else {
        res.status(400).json({ 
          success: false, 
          error: 'SendGrid test failed',
          details: {
            code: sendError.code,
            message: sendError.message
          }
        });
      }
    }
  } catch (error) {
    console.error('Error testing SendGrid connection:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to test SendGrid connection',
      details: error.message 
    });
  }
});

module.exports = {
  router,
  sendBookingConfirmationEmail,
  sendNewUserConfirmationEmail
};

