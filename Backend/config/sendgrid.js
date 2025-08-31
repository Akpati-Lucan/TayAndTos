const sgMail = require('@sendgrid/mail');

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY not set in environment variables");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const EMAIL_CONFIG = {
  from: process.env.FROM_EMAIL || 'noreply@tayandtos.com',
  fromName: 'Tay and Tos Accommodation'
};

module.exports = { sgMail, EMAIL_CONFIG };
