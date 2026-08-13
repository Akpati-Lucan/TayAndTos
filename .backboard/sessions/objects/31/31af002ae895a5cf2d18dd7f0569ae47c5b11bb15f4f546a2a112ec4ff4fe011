function generateText(user) {
    return `
  Dear ${user.first_name} ${user.last_name},
  
  🎉 Welcome to Tay and Tos Accommodation!
  
  Your account has been successfully created.
  We look forward to hosting you!
  
  Best regards,
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
    return `
  <!DOCTYPE html>
  <html>
    <body>
      <h1>🎉 Welcome!</h1>
      <p>Dear ${user.first_name} ${user.last_name},</p>
      <p>Your account with email <b>${user.email}</b> has been created.</p>
      <p>We look forward to hosting you!</p>
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
  </html>
    `.trim();
  }
  
  export { generateText, generateHtml };
  export default { generateText, generateHtml };

  