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
The Tay and Tos Team`;
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
</body>
</html>`;
}

module.exports = {
  generatePasswordResetEmailContent
};
