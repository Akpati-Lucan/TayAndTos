function generateText(booking, user, checkInDate, checkOutDate, duration) {
    return `
  Dear ${user.first_name} ${user.last_name},
  
  🎉 Your booking has been confirmed!
  Confirmation Code: ${booking.confirmation_code}
  
  Check-in: ${checkInDate}
  Check-out: ${checkOutDate}
  Duration: ${duration} night${duration > 1 ? 's' : ''}
  
  We look forward to hosting you!
  The Tay and Tos Team
    `.trim();
  }
  
  function generateHtml(booking, user, checkInDate, checkOutDate, duration) {
    return `
  <!DOCTYPE html>
  <html>
    <body>
      <h1>🎉 Booking Confirmed</h1>
      <p>Dear ${user.first_name} ${user.last_name},</p>
      <p>Your booking (Code: <b>${booking.confirmation_code}</b>) is confirmed.</p>
      <ul>
        <li>Room: ${booking.room}</li>
        <li>Check-in: ${checkInDate}</li>
        <li>Check-out: ${checkOutDate}</li>
        <li>Guests: ${booking.number_of_guests}</li>
      </ul>
      <p>Thanks,<br>The Tay and Tos Team</p>
    </body>
  </html>
    `.trim();
  }
  
  module.exports = { generateText, generateHtml };
  