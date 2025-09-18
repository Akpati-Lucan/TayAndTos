function generatePasswordResetConfirmationEmailContent(user) {
  const plainText = generateText(user);
  const html = generateHtml(user);
  
  return { plainText, html };
}

function generateText(user) {
  return `Hello ${user.first_name},

Your password has been successfully reset for your TayAndTos account.

If you did not perform this action, please contact our support team immediately.

Thanks,
The Tay and Tos Team`;
}

function generateHtml(user) {
  return `<!DOCTYPE html>
<html>
<body>
  <h1>✅ Password Reset Successful</h1>
  <p>Hello ${user.first_name},</p>
  <p>Your password has been successfully reset for your TayAndTos account.</p>
  <p>If you did not perform this action, please contact our support team immediately.</p>
  <p>Thanks,<br>The Tay and Tos Team</p>
</body>
</html>`;
}

export {
  generatePasswordResetConfirmationEmailContent
};
