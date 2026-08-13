import { sgMail, EMAIL_CONFIG } from '../config/sendgrid.js';
import * as bookingTemplate from '../templates/booking_email.js';
import * as newUserTemplate from '../templates/new_user_email.js';
import * as passwordResetTemplate from '../templates/password_reset_email.js';
import * as passwordResetConfirmationTemplate from '../templates/password_reset_confirmation_email.js';
import * as bookingUpdateTemplate from '../templates/booking_update_email.js';
import * as bookingCancellationTemplate from '../templates/booking_cancellation_email.js';

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

async function sendPasswordResetEmail(user, resetToken, resetUrl) {
  const { plainText, html } = passwordResetTemplate.generatePasswordResetEmailContent(user, resetToken, resetUrl);
  
  const msg = {
    to: user.email,
    from: { email: EMAIL_CONFIG.from, name: EMAIL_CONFIG.fromName },
    subject: `🔐 Password Reset Request - TayAndTos`,
    text: plainText,
    html: html
  };

  return sgMail.send(msg);
}

async function sendPasswordResetConfirmationEmail(user) {
  const { plainText, html } = passwordResetConfirmationTemplate.generatePasswordResetConfirmationEmailContent(user);
  
  const msg = {
    to: user.email,
    from: { email: EMAIL_CONFIG.from, name: EMAIL_CONFIG.fromName },
    subject: `✅ Password Reset Successful - TayAndTos`,
    text: plainText,
    html: html
  };

  return sgMail.send(msg);
}

async function sendBookingUpdateConfirmation(booking, user) {
  const checkInDate = new Date(booking.check_in_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const checkOutDate = new Date(booking.check_out_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const duration = Math.ceil((new Date(booking.check_out_date) - new Date(booking.check_in_date)) / (1000*60*60*24));

  const { plainText, html } = bookingUpdateTemplate.generateBookingUpdateEmailContent(booking, user, checkInDate, checkOutDate, duration);
  
  const msg = {
    to: user.email,
    from: { email: EMAIL_CONFIG.from, name: EMAIL_CONFIG.fromName },
    subject: `✅ Booking Updated - Code: ${booking.confirmation_code}`,
    text: plainText,
    html: html
  };

  return sgMail.send(msg);
}

async function sendBookingCancellationEmail(booking, user) {
  const checkInDate = new Date(booking.check_in_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const checkOutDate = new Date(booking.check_out_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const duration = Math.ceil((new Date(booking.check_out_date) - new Date(booking.check_in_date)) / (1000*60*60*24));

  const { plainText, html } = bookingCancellationTemplate.generateBookingCancellationEmailContent(booking, user, checkInDate, checkOutDate, duration);
  
  const msg = {
    to: user.email,
    from: { email: EMAIL_CONFIG.from, name: EMAIL_CONFIG.fromName },
    subject: `❌ Booking Cancelled - Code: ${booking.confirmation_code}`,
    text: plainText,
    html: html
  };

  return sgMail.send(msg);
}

export { 
  sendBookingConfirmation, 
  sendNewUserConfirmation,
  sendPasswordResetEmail,
  sendPasswordResetConfirmationEmail,
  sendBookingUpdateConfirmation,
  sendBookingCancellationEmail
};

// Aliases for backward compatibility
export const sendBookingConfirmationEmail = sendBookingConfirmation;
export const sendNewUserConfirmationEmail = sendNewUserConfirmation;

export default {
  sendBookingConfirmation, 
  sendNewUserConfirmation,
  sendPasswordResetEmail,
  sendPasswordResetConfirmationEmail,
  sendBookingUpdateConfirmation,
  sendBookingCancellationEmail,
  sendBookingConfirmationEmail: sendBookingConfirmation,
  sendNewUserConfirmationEmail: sendNewUserConfirmation
};
