const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../db'); // assumes you're exporting pool/query from db.js

// Get all bookings with user info
router.get('/', async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT 
        b.*, 
        u.id AS user_id, u.first_name, u.last_name, u.email, u.phone_number
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      ORDER BY b.booking_id DESC
    `);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});



// Create a new booking
router.post('/', async (req, res) => {
  try {
    const { room, check_in_date, check_out_date, number_of_guests, status, special_requests, first_name, last_name, email, phone_number } = req.body;
    let userId = null;
    let guestFirstName = null;
    let guestLastName = null;
    let guestEmail = null;
    let guestPhoneNumber = null;

    // If authenticated, set userId and use latest user info from request body
    if (req.user && req.user.userId) {
      userId = req.user.userId;
      // Use user info from req.user (not from request body)
      first_name = req.user.first_name;
      last_name = req.user.last_name;
      email = req.user.email;
      phone_number = req.user.phone_number;
    } else {
      // Guest booking: require guest info
      userId = 0;
      if (!first_name || !last_name || !email || !phone_number) {
        return res.status(400).json({ message: 'Guest first name, last name, email, and phone number are required' });
      }
      // Use guest info from request body as is
    }

    if (!room) {
      return res.status(400).json({ message: 'Room is required' });
    }

    // Insert booking
    const [result] = await db.query(
      `INSERT INTO bookings 
       (user_id, first_name, last_name, email, phone_number, room, check_in_date, check_out_date, number_of_guests, status, special_requests) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, first_name, last_name, email, phone_number, room, check_in_date, check_out_date, number_of_guests, status, special_requests]
    );

    console.log('Booking created with ID:', result.insertId);

    // Fetch and return created booking
    const [newBooking] = await db.query(
      `SELECT * FROM bookings WHERE booking_id = ?`,
      [result.insertId]
    );

    res.status(201).json(newBooking[0]);

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      message: 'Error creating booking',
      error: error.message
    });
  }
});

  
// Delete a booking (admin only)
router.delete('/:bookingId', async (req, res) => {
    try {
      if (!req.user?.admin) {
        return res.status(403).json({ message: 'Only administrators can delete bookings' });
      }
  
      const [result] = await db.query('DELETE FROM bookings WHERE booking_id = ?', [req.params.bookingId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      res.status(200).json({ message: 'Booking deleted successfully' });
  
    } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({ message: 'Error deleting booking', error: error.message });
    }
  });

  router.put('/:bookingId', authenticateToken, async (req, res) => {
    try {
      const { room, check_in_date, check_out_date, number_of_guests, status, special_requests, first_name, last_name, email, phone_number, guest_first_name, guest_last_name, guest_email, guest_phone_number } = req.body;
      const userId = req.user?.userId;
      const isAdmin = req.user?.admin;

      // Get the booking owner
      const [booking] = await db.query(
        'SELECT user_id FROM bookings WHERE booking_id = ?',
        [req.params.bookingId]
      );

      if (!booking.length) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Check if the user is the owner or an admin
      if (booking[0].user_id !== userId && !isAdmin) {
        return res.status(403).json({ message: 'You are not authorized to update this booking' });
      }

      // Update the booking (user or guest info as appropriate)
      let updateQuery = `UPDATE bookings SET room = ?, check_in_date = ?, check_out_date = ?, number_of_guests = ?, status = ?, special_requests = ?`;
      let queryParams = [room, check_in_date, check_out_date, number_of_guests, status, special_requests];

      if (booking[0].user_id) {
        updateQuery += ', first_name = ?, last_name = ?, email = ?, phone_number = ?';
        queryParams.push(first_name, last_name, email, phone_number);
      } else {
        updateQuery += ', first_name = ?, last_name = ?, email = ?, phone_number = ?';
        queryParams.push(guest_first_name, guest_last_name, guest_email, guest_phone_number);
      }

      updateQuery += ' WHERE booking_id = ?';
      queryParams.push(req.params.bookingId);

      await db.query(updateQuery, queryParams);

      // Return updated booking
      const [updatedBooking] = await db.query(
        `SELECT * FROM bookings WHERE booking_id = ?`,
        [req.params.bookingId]
      );

      res.json(updatedBooking[0]);

    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ message: 'Error updating booking', error: error.message });
    }
  });

  module.exports = router;