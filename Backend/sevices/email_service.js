const { sgMail, EMAIL_CONFIG } = require('../config/sendgrid');
const bookingTemplate = require('../templates/booking_email');
const newUserTemplate = require('../templates/new_user_email');

async function sendBookingConfirmation(booking, user) {
  const checkInDate = new Date(booking.check_in_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const checkOutDate = new Date(booking.check_out_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const duration = Math.ceil((new Date(booking.check_out_date) - new Date(booking.check_in_date)) / (1000*60*60*24));

  const msg = {
    to: user.email,
    from: { email: EMAIL_CONFIG.from, name: EMAIL_CONFIG.fromName },
    subject: `Booking Confirmed! Code: ${booking.confirmation_code}`,
    text: bookingTemplate.generateText(booking, user, checkInDate, checkOutDate, duration),
    html: bookingTemplate.generateHtml(booking, user, checkInDate, checkOutDate, duration)
  };

  return sgMail.send(msg);
}

async function sendNewUserConfirmation(user) {
  const msg = {
    to: user.email,
    from: { email: EMAIL_CONFIG.from, name: EMAIL_CONFIG.fromName },
    subject: `🎉 Welcome to Tay and Tos!`,
    text: newUserTemplate.generateText(user),
    html: newUserTemplate.generateHtml(user)
  };

  return sgMail.send(msg);
}

module.exports = { 
  sendBookingConfirmation, 
  sendNewUserConfirmation,
  sendBookingConfirmationEmail: sendBookingConfirmation, // Alias for backward compatibility
  sendNewUserConfirmationEmail: sendNewUserConfirmation // Alias for backward compatibility
};
