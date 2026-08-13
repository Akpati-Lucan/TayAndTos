import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY not set in environment variables");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const EMAIL_CONFIG = {
  from: process.env.FROM_EMAIL || 'support@tayandtoscorporations.com',
  fromName: 'Tay and Tos Accommodation'
};

console.log("SENDGRID_API_KEY:", process.env.SENDGRID_API_KEY ? "✅ loaded" : "❌ missing");
console.log("FROM_EMAIL:", process.env.FROM_EMAIL);

export { sgMail, EMAIL_CONFIG };
export default { sgMail, EMAIL_CONFIG };
