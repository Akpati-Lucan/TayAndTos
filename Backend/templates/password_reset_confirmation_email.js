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
The Tay and Tos Team

------------------------------
Contact Us:
Email: support@tayandtoscorporations.com
Phone: +234 814 074 9365
Phone: +234 803 843 6811
Address: NO. 5, UNITY QUARTERS, FEDERAL PRISON AREA, OFF ARE/AFAO ROAD, ADO-EKITI, EKITI STATE, NIGERIA
  `.trim();
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
  generatePasswordResetConfirmationEmailContent
};
