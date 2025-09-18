function generateText(user) {
    return `
  Dear ${user.first_name} ${user.last_name},
  
  🎉 Welcome to Tay and Tos Accommodation!
  
  Your account has been successfully created.
  We look forward to hosting you!
  
  Best regards,
  The Tay and Tos Team
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
    </body>
  </html>
    `.trim();
  }
  
  export { generateText, generateHtml };
  export default { generateText, generateHtml };

  