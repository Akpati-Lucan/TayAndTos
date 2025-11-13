function generatePasswordResetEmailContent(user, resetToken, resetUrl) {
  const plainText = generateText(user, resetToken, resetUrl);
  const html = generateHtml(user, resetToken, resetUrl);
  
  return { plainText, html };
}

function generateText(user, resetToken, resetUrl) {
  return `Hello ${user.first_name},

You have requested to reset your password for your TayAndTos account.

To reset your password, please click on the following link:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you did not request this password reset, please ignore this email.

Thanks,
The Tay and Tos Team
------------------------------
Contact Us:
Email: support@tayandtoscorporations.com
Phone: +234 814 074 9365
Phone: +234 803 843 6811
Address: NO. 5, UNITY QUARTERS, FEDERAL PRISON AREA, OFF ARE/AFAO ROAD, ADO-EKITI, EKITI STATE, NIGERIA
`.trim();
}

function generateHtml(user, resetToken, resetUrl) {
  return `<!DOCTYPE html>
<html>
<body>
  <h1>🔐 Password Reset</h1>
  <p>Hello ${user.first_name},</p>
  <p>You have requested to reset your password for your TayAndTos account.</p>
  <p>Click the link below to reset your password:</p>
  <p><a href="${resetUrl}">Reset Password</a></p>
  <p><strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>
  <p>If you did not request this password reset, please ignore this email.</p>
  <p>Thanks,<br>The Tay and Tos Team</p>
  <p>Best regards,<br>The Tay and Tos Team</p>

    <hr>
    <div style="background-color:#f8f8f8; padding:15px; font-size:0.9em; color:#555; border-radius:5px;">
      <h3 style="margin-top:0;">Contact Us</h3>
      <p>Email: <a href="mailto:support@tayandtoscorporations.com" style="color:#1a73e8;">support@tayandtoscorporations.com</a></p>
      <p>Phone: +234 814 074 9365</p>
      <p>Phone: +234 803 843 6811</p>
      <p>Address: NO. 5, UNITY QUARTERS, FEDERAL PRISON AREA, OFF ARE/AFAO ROAD, ADO-EKITI, EKITI STATE, NIGERIA</p>
    </div>
</body>
</html>`;
}

export {
  generatePasswordResetEmailContent
};
