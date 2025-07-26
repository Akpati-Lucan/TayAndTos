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
        gb.*,
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


router.post('/bookings', async (req, res) => {
  try {
    const {
      user_id,
      room,
      check_in_date,
      check_out_date,
      number_of_guests,
      status = 'pending',
      special_requests = ''
    } = req.body;

    if (!user_id || !room || !check_in_date || !check_out_date || !number_of_guests) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (new Date(check_out_date) <= new Date(check_in_date)) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    const [conflicts] = await db.query(
      `SELECT * FROM bookings 
       WHERE room = ? AND status != 'cancelled'
       AND (check_in_date < ? AND check_out_date > ?)`,
      [room, check_out_date, check_in_date]
    );

    if (conflicts.length > 0) {
      return res.status(409).json({ message: 'Room is already booked for the selected dates' });
    }

    const [result] = await db.query(
      `INSERT INTO bookings 
       (user_id, room, check_in_date, check_out_date, number_of_guests, status, special_requests) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, room, check_in_date, check_out_date, number_of_guests, status, special_requests]
    );

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


// Create a new guest booking
router.post('/guest_bookings', async (req, res) => {
  try {
    const {
      guest_first_name, 
      guest_last_name,
      guest_email,  
      guest_phone_number,
      room = 'guest',
      check_in_date,
      check_out_date,
      number_of_guests,
      status = 'pending',
      special_requests = ''
    } = req.body;

    // Validate required fields
    if (!guest_first_name || !guest_last_name || !guest_email || !room || !check_in_date || !check_out_date || !number_of_guests) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (new Date(check_out_date) <= new Date(check_in_date)) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Optional: prevent double bookings across guest + user tables
    const [conflicts] = await db.query(
      `SELECT * FROM guest_bookings 
       WHERE room = ? 
       AND (check_in_date < ? AND check_out_date > ?)`,
      [room, check_out_date, check_in_date]
    );

    if (conflicts.length > 0) {
      return res.status(409).json({ message: 'Room is already booked for the selected dates' });
    }

    // Insert booking
    const [result] = await db.query(
      `INSERT INTO guest_bookings 
       (guest_first_name, guest_last_name, guest_email, guest_phone_number, room, check_in_date, check_out_date, number_of_guests, status, special_requests) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [guest_first_name, guest_last_name, guest_email, guest_phone_number, room, check_in_date, check_out_date, number_of_guests, status, special_requests]
    );

    const [newBooking] = await db.query(
      `SELECT * FROM guest_bookings WHERE booking_id = ?`,
      [result.insertId]
    );

    res.status(201).json(newBooking[0]);

  } catch (error) {
    console.error('Error creating guest booking:', error);
    res.status(500).json({
      message: 'Error creating guest booking',
      error: error.message
    });
  }
});


  
// Soft-delete a booking (admin, owner, or with confirmation code)
router.delete('/:bookingId', async (req, res) => {
  try {
    const bookingId = parseInt(req.params.bookingId, 10);
    if (isNaN(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const { confirmation_code } = req.body;
    const userId = req.user?.userId;
    const isAdmin = req.user?.admin;

    // Retrieve the booking
    const [bookings] = await db.query(
      'SELECT user_id, confirmation_code, status FROM bookings WHERE booking_id = ?',
      [bookingId]
    );

    if (!bookings.length) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = bookings[0];

    // Already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    const isOwner = booking.user_id === userId;
    const isCodeMatch = confirmation_code && confirmation_code === booking.confirmation_code;

    // Authorization
    if (!isAdmin && !isOwner && !isCodeMatch) {
      return res.status(403).json({ message: 'You are not authorized to cancel this booking' });
    }

    // Soft delete: update status to 'cancelled'
    await db.query(
      'UPDATE bookings SET status = ? WHERE booking_id = ?',
      ['cancelled', bookingId]
    );

    res.status(200).json({ message: 'Booking cancelled successfully' });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
});

// Soft-delete a guest booking (admin or with confirmation code)
router.delete('/guest_bookings/:bookingId', async (req, res) => {
  try {
    const bookingId = parseInt(req.params.bookingId, 10);
    if (isNaN(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const { confirmation_code } = req.body;
    const isAdmin = req.user?.admin;

    // Get the guest booking
    const [bookings] = await db.query(
      'SELECT confirmation_code, status FROM guest_bookings WHERE booking_id = ?',
      [bookingId]
    );

    if (!bookings.length) {
      return res.status(404).json({ message: 'Guest booking not found' });
    }

    const booking = bookings[0];

    // Already cancelled?
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    const isCodeMatch = confirmation_code && confirmation_code === booking.confirmation_code;

    // Authorization check
    if (!isAdmin && !isCodeMatch) {
      return res.status(403).json({ message: 'You are not authorized to cancel this booking' });
    }

    // Soft delete (update status)
    await db.query(
      'UPDATE guest_bookings SET status = ? WHERE booking_id = ?',
      ['cancelled', bookingId]
    );

    res.status(200).json({ message: 'Guest booking cancelled successfully' });

  } catch (error) {
    console.error('Error cancelling guest booking:', error);
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
});



// Update a user booking (authenticated user, admin, or with confirmation code)
router.put('/bookings/:bookingId', async (req, res) => {
  try {
    const {
      room,
      check_in_date,
      check_out_date,
      number_of_guests,
      status,
      special_requests,
      confirmation_code // guests or unauthenticated users can provide this
    } = req.body;

    const bookingId = parseInt(req.params.bookingId, 10);
    if (isNaN(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    // Fetch the booking
    const [result] = await db.query(
      'SELECT * FROM bookings WHERE booking_id = ?',
      [bookingId]
    );

    if (!result.length) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = result[0];
    const isAuthenticated = !!req.user;
    const isOwner = req.user?.userId === booking.user_id;
    const isAdmin = req.user?.admin;

    // Authorization logic:
    if (!isAdmin && !isOwner) {
      if (!confirmation_code || confirmation_code !== booking.confirmation_code) {
        return res.status(403).json({
          message: 'You are not authorized to update this booking'
        });
      }
    }

    // Optional date validation
    if (check_in_date && check_out_date && new Date(check_out_date) <= new Date(check_in_date)) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Update booking
    await db.query(
      `UPDATE bookings 
       SET room = ?, check_in_date = ?, check_out_date = ?, number_of_guests = ?, status = ?, special_requests = ? 
       WHERE booking_id = ?`,
      [
        room || booking.room,
        check_in_date || booking.check_in_date,
        check_out_date || booking.check_out_date,
        number_of_guests || booking.number_of_guests,
        status || booking.status,
        special_requests || booking.special_requests,
        bookingId
      ]
    );

    // Return updated booking
    const [updatedBooking] = await db.query(
      'SELECT * FROM bookings WHERE booking_id = ?',
      [bookingId]
    );

    res.json(updatedBooking[0]);

  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
});



// Update a guest booking (admin or guest with confirmation code)
router.put('/guest_bookings/:bookingId', async (req, res) => {
  try {
    const {
      guest_first_name,
      guest_last_name,
      guest_email,
      guest_phone_number,
      room,
      check_in_date,
      check_out_date,
      number_of_guests,
      status,
      special_requests,
      confirmation_code // guests include this to authenticate
    } = req.body;

    const bookingId = parseInt(req.params.bookingId, 10);
    if (isNaN(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    // Retrieve booking
    const [bookings] = await db.query(
      'SELECT * FROM guest_bookings WHERE booking_id = ?',
      [bookingId]
    );

    if (!bookings.length) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = bookings[0];
    const isAdmin = req.user?.admin || false;

    // Authorization check
    if (!isAdmin) {
      if (!confirmation_code) {
        return res.status(401).json({ message: 'Confirmation code is required to update booking' });
      }

      if (confirmation_code !== booking.confirmation_code) {
        return res.status(403).json({ message: 'Invalid confirmation code' });
      }
    }

    // Optional: Validate date consistency
    if (check_in_date && check_out_date && new Date(check_out_date) <= new Date(check_in_date)) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Prepare update query with fallback to existing values
    const updateQuery = `
      UPDATE guest_bookings SET
        guest_first_name = ?, 
        guest_last_name = ?, 
        guest_email = ?, 
        guest_phone_number = ?, 
        room = ?, 
        check_in_date = ?, 
        check_out_date = ?, 
        number_of_guests = ?, 
        status = ?, 
        special_requests = ?
      WHERE booking_id = ?`;

    const queryParams = [
      guest_first_name || booking.guest_first_name,
      guest_last_name || booking.guest_last_name,
      guest_email || booking.guest_email,
      guest_phone_number || booking.guest_phone_number,
      room || booking.room,
      check_in_date || booking.check_in_date,
      check_out_date || booking.check_out_date,
      number_of_guests || booking.number_of_guests,
      status || booking.status,
      special_requests || booking.special_requests,
      bookingId
    ];

    await db.query(updateQuery, queryParams);

    // Return updated booking
    const [updated] = await db.query(
      'SELECT * FROM guest_bookings WHERE booking_id = ?',
      [bookingId]
    );

    res.status(200).json(updated[0]);

  } catch (error) {
    console.error('Error updating guest booking:', error);
    res.status(500).json({ message: 'Error updating guest booking', error: error.message });
  }
});







  module.exports = router;