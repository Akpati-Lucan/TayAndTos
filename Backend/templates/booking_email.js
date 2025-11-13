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
  ------------------------------
  Contact Us:
  Email: support@tayandtoscorporations.com
  Phone: +234 814 074 9365
  Phone: +234 803 843 6811
  Address: NO. 5, UNITY QUARTERS, FEDERAL PRISON AREA, OFF ARE/AFAO ROAD, ADO-EKITI, EKITI STATE, NIGERIA
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
       <p>We look forward to hosting you!</p>
    <p>Thanks,<br>The Tay and Tos Team</p>

    <hr>
    <div>
      <h3>Contact Us</h3>
      <p>Email: <a href="mailto:support@tayandtoscorporations.com">support@tayandtoscorporations.com</a></p>
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
  