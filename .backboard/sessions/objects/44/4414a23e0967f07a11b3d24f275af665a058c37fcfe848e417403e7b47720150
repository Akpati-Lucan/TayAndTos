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
  <p>We look forward to hosting you!</p>
  <p>Thanks,<br>The Tay and Tos Team</p>

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
  generateBookingUpdateEmailContent
};
