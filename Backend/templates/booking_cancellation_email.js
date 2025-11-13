function generateBookingCancellationEmailContent(booking, user, checkInDate, checkOutDate, duration) {
  const plainText = generateText(booking, user, checkInDate, checkOutDate, duration);
  const html = generateHtml(booking, user, checkInDate, checkOutDate, duration);
  
  return { plainText, html };
}

function generateText(booking, user, checkInDate, checkOutDate, duration) {
  return `Dear ${user.first_name} ${user.last_name},

Your booking has been successfully cancelled.
Confirmation Code: ${booking.confirmation_code}

Cancelled Booking Details:
Check-in: ${checkInDate}
Check-out: ${checkOutDate}
Duration: ${duration} night${duration > 1 ? 's' : ''}
Room: ${booking.room}
Number of Guests: ${booking.number_of_guests}

If you have any questions about this cancellation, please contact our support team.

We hope to welcome you back in the future!
Thanks,
The Tay and Tos Team

------------------------------
Contact Us:
Email: support@tayandtoscorporations.com
Phone: +234 814 074 9365
Phone: +234 803 843 6811
Address: NO. 5, UNITY QUARTERS, FEDERAL PRISON AREA, OFF ARE/AFAO ROAD, ADO-EKITI, EKITI STATE, NIGERIA
`;
}

function generateHtml(booking, user, checkInDate, checkOutDate, duration) {
  return `<!DOCTYPE html>
<html>
<body>
  <h1>❌ Booking Cancelled</h1>
  <p>Dear ${user.first_name} ${user.last_name},</p>
  <p>Your booking (Code: <b>${booking.confirmation_code}</b>) has been successfully cancelled.</p>
  <h3>Cancelled Booking Details:</h3>
  <ul>
    <li>Room: ${booking.room}</li>
    <li>Check-in: ${checkInDate}</li>
    <li>Check-out: ${checkOutDate}</li>
    <li>Guests: ${booking.number_of_guests}</li>
  </ul>
  <p>If you have any questions about this cancellation, please contact our support team.</p>
  <p>We hope to welcome you back in the future!</p>

  <hr>
  <p>Thanks,<br>The Tay and Tos Team</p>

  <div>
    <h3>Contact Us</h3>
    <p>Email: <a href="mailto:support@tayandtoscorporations.com">support@tayandtoscorporations.com</a></p>
    <p>Phone: +234 814 074 9365</p>
    <p>Phone: +234 803 843 6811</p>
    <p>Address: NO. 5, UNITY QUARTERS, FEDERAL PRISON AREA, OFF ARE/AFAO ROAD, ADO-EKITI, EKITI STATE, NIGERIA</p>
  </div>
</body>
</html>`;
}

export {
  generateBookingCancellationEmailContent
};
