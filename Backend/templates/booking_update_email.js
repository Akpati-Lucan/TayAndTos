function generateBookingUpdateEmailContent(booking, user, checkInDate, checkOutDate, duration) {
  const plainText = generateText(booking, user, checkInDate, checkOutDate, duration);
  const html = generateHtml(booking, user, checkInDate, checkOutDate, duration);
  
  return { plainText, html };
}

function generateText(booking, user, checkInDate, checkOutDate, duration) {
  return `Dear ${user.first_name} ${user.last_name},

Your booking has been successfully updated!
Confirmation Code: ${booking.confirmation_code}

Updated Details:
Check-in: ${checkInDate}
Check-out: ${checkOutDate}
Duration: ${duration} night${duration > 1 ? 's' : ''}
Room: ${booking.room}
Number of Guests: ${booking.number_of_guests}
${booking.special_requests ? `Special Requests: ${booking.special_requests}` : ''}

We look forward to hosting you!
The Tay and Tos Team`;
}

function generateHtml(booking, user, checkInDate, checkOutDate, duration) {
  return `<!DOCTYPE html>
<html>
<body>
  <h1>✅ Booking Updated</h1>
  <p>Dear ${user.first_name} ${user.last_name},</p>
  <p>Your booking (Code: <b>${booking.confirmation_code}</b>) has been successfully updated.</p>
  <h3>Updated Details:</h3>
  <ul>
    <li>Room: ${booking.room}</li>
    <li>Check-in: ${checkInDate}</li>
    <li>Check-out: ${checkOutDate}</li>
    <li>Guests: ${booking.number_of_guests}</li>
    ${booking.special_requests ? `<li>Special Requests: ${booking.special_requests}</li>` : ''}
  </ul>
  <p>Thanks,<br>The Tay and Tos Team</p>
</body>
</html>`;
}

export {
  generateBookingUpdateEmailContent
};
