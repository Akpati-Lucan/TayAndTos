const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../db'); // assumes you're exporting pool/query from db.js
const generateConfirmationCode = require('../utils/generate_code');
const { sendBookingConfirmationEmail } = require('../sevices/email_service');

// Get all bookings (user + guest)
router.get('/', async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT 
        CONCAT('user_', b.booking_id) as booking_id, u.first_name, u.last_name, u.email, u.phone_number, b.room, b.check_in_date, 
        b.check_out_date, b.number_of_guests, b.status, b.special_requests, b.confirmation_code,
        'user' AS type, b.booking_id as original_id
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id

      UNION ALL

      SELECT 
        CONCAT('guest_', gb.booking_id) as booking_id, gb.guest_first_name AS first_name, gb.guest_last_name AS last_name, gb.guest_email AS email,
        gb.guest_phone_number AS phone_number, gb.room, gb.check_in_date, gb.check_out_date, gb.number_of_guests,
        gb.status, gb.special_requests, gb.confirmation_code,
        'guest' AS type, gb.booking_id as original_id
      FROM guest_bookings gb

      ORDER BY original_id DESC
    `);

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Debug endpoint to check users in database
router.get('/debug/users', async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, email, first_name, last_name FROM users ORDER BY id');
    res.json({
      totalUsers: users.length,
      users: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to check room availability
router.get('/debug/room-availability/:room', async (req, res) => {
  try {
    const { room } = req.params;
    const { check_in, check_out } = req.query;
    
    console.log(`Checking availability for room: ${room}, check_in: ${check_in}, check_out: ${check_out}`);
    
    // Get all bookings for this room
    const [userBookings] = await db.query(
      `SELECT * FROM bookings WHERE room = ? ORDER BY check_in_date`,
      [room]
    );
    
    const [guestBookings] = await db.query(
      `SELECT * FROM guest_bookings WHERE room = ? ORDER BY check_in_date`,
      [room]
    );
    
    res.json({
      room,
      userBookings,
      guestBookings,
      totalBookings: userBookings.length + guestBookings.length
    });
  } catch (error) {
    console.error('Error checking room availability:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get current user's bookings (authenticated users only)
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching bookings for user ID:', req.user.userId);
    
    // First, let's check if the user exists
    const [users] = await db.query('SELECT id, email FROM users WHERE id = ?', [req.user.userId]);
    if (users.length === 0) {
      console.log('User not found:', req.user.userId);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', users[0]);
    
    // Check total bookings in the database
    const [totalBookings] = await db.query('SELECT COUNT(*) as total FROM bookings');
    console.log('Total bookings in database:', totalBookings[0].total);
    
    const [bookings] = await db.query(`
      SELECT 
        booking_id as id, room, check_in_date, check_out_date, number_of_guests, 
        status, special_requests, confirmation_code, created_at
      FROM bookings 
      WHERE user_id = ? 
      ORDER BY check_in_date DESC
    `, [req.user.userId]);

    console.log('Found bookings for user:', bookings.length);
    console.log('Bookings data:', bookings);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Error fetching user bookings', error: error.message });
  }
});



// Create a new user booking
router.post('/', async (req, res) => {
  console.log('User booking request received:', req.body);
  try {
    const {
      user_id, room, check_in_date, check_out_date, number_of_guests, status = 'pending', special_requests = ''
    } = req.body;

    // Validate that the user exists
    if (user_id) {
      const [users] = await db.query('SELECT id, email FROM users WHERE id = ?', [user_id]);
      if (users.length === 0) {
        console.log('User not found in database:', user_id);
        return res.status(400).json({ 
          message: 'Invalid user ID. User not found in database.',
          user_id: user_id
        });
      }
      console.log('User found:', users[0]);
    }

    if (!user_id || !room || !check_in_date || !check_out_date || !number_of_guests) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (new Date(check_out_date) <= new Date(check_in_date)) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Check for conflicts in both bookings and guest_bookings tables
    const [userConflicts] = await db.query(
      `SELECT * FROM bookings 
       WHERE room = ? AND status != 'cancelled'
       AND (
         (check_in_date <= ? AND check_out_date > ?) OR
         (check_in_date < ? AND check_out_date >= ?) OR
         (check_in_date >= ? AND check_out_date <= ?)
       )`,
      [room, check_out_date, check_in_date, check_out_date, check_in_date, check_in_date, check_out_date]
    );

    const [guestConflicts] = await db.query(
      `SELECT * FROM guest_bookings 
       WHERE room = ? AND status != 'cancelled'
       AND (
         (check_in_date <= ? AND check_out_date > ?) OR
         (check_in_date < ? AND check_out_date >= ?) OR
         (check_in_date >= ? AND check_out_date <= ?)
       )`,
      [room, check_out_date, check_in_date, check_out_date, check_in_date, check_in_date, check_out_date]
    );

    const conflicts = [...userConflicts, ...guestConflicts];

    if (conflicts.length > 0) {
      return res.status(409).json({ message: 'Room is already booked for the selected dates' });
    }

    // Generate confirmation code
    const confirmation_code = generateConfirmationCode();

    // Insert booking
    const [result] = await db.query(
      `INSERT INTO bookings 
       (user_id, room, check_in_date, check_out_date, number_of_guests, status, special_requests, confirmation_code) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, room, check_in_date, check_out_date, number_of_guests, status, special_requests, confirmation_code]
    );

    // Fetch and return created booking
    const [newBooking] = await db.query(
      `SELECT * FROM bookings WHERE booking_id = ?`,
      [result.insertId]
    );

    // Send confirmation email
    try {
      // Get user details for the email
      const [userDetails] = await db.query(
        'SELECT id, email, first_name, last_name FROM users WHERE id = ?',
        [user_id]
      );
      
      if (userDetails.length > 0) {
        const user = userDetails[0];
        await sendBookingConfirmationEmail(newBooking[0], user);
        console.log(`Confirmation email sent to ${user.email}`);
      }
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the booking creation if email fails
      // The booking is still created successfully
    }

    res.status(201).json(newBooking[0]);

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      message: 'Error creating booking',
      error: error.message
    });
  }
});


  
// Soft-delete a booking (admin, owner, or with confirmation code)
router.delete('/:bookingId', authenticateToken, async (req, res) => {
  try {
    console.log('User booking delete request:', req.params.bookingId);
    const bookingId = parseInt(req.params.bookingId, 10);
    if (isNaN(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const confirmation_code = req.body?.confirmation_code;
    const userId = req.user?.userId;
    const isAdmin = req.user?.admin;
    
    console.log('Delete request details:', {
      bookingId,
      userId,
      isAdmin,
      confirmation_code: confirmation_code ? 'provided' : 'not provided',
      user: req.user
    });
    
    console.log('Full JWT payload:', req.user);

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

    // Authorization - Admin can delete any booking, owner can delete their own, or with confirmation code
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



// Update a user booking (authenticated user, admin, or with confirmation code)
router.put('/:bookingId', authenticateToken, async (req, res) => {
  try {
    console.log('User booking update request:', req.params.bookingId, req.body);
    
    const {
      room, check_in_date, check_out_date, number_of_guests, status, special_requests, confirmation_code
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

    console.log('Update authorization check:', {
      bookingId,
      bookingUserId: booking.user_id,
      currentUserId: req.user?.userId,
      isOwner,
      isAdmin,
      isAuthenticated,
      confirmation_code: confirmation_code ? 'provided' : 'not provided',
      bookingConfirmationCode: booking.confirmation_code
    });

    // Authorization logic:
    if (!isAdmin && !isOwner) {
      if (!confirmation_code || confirmation_code !== booking.confirmation_code) {
        console.log('Authorization failed: User is not admin, not owner, and no valid confirmation code');
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




// Find booking by confirmation code and email
router.post('/find', async (req, res) => {
  try {
    const { confirmation_code, email } = req.body;

    if (!confirmation_code || !email) {
      return res.status(400).json({ message: 'Confirmation code and email are required' });
    }

    console.log('Searching for booking with confirmation code:', confirmation_code, 'and email:', email);

    // Search in user bookings first
    const [userBookings] = await db.query(`
      SELECT 
        b.booking_id, b.room, b.check_in_date, b.check_out_date, b.number_of_guests, 
        b.status, b.special_requests, b.confirmation_code, b.created_at,
        u.email, u.first_name, u.last_name, u.phone_number,
        'user' as type
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE b.confirmation_code = ? AND u.email = ?
    `, [confirmation_code, email]);

    // Search in guest bookings
    const [guestBookings] = await db.query(`
      SELECT 
        booking_id, room, check_in_date, check_out_date, number_of_guests, 
        status, special_requests, confirmation_code, created_at,
        guest_email as email, guest_first_name as first_name, guest_last_name as last_name, 
        guest_phone_number as phone_number,
        'guest' as type
      FROM guest_bookings
      WHERE confirmation_code = ? AND guest_email = ?
    `, [confirmation_code, email]);

    const allBookings = [...userBookings, ...guestBookings];

    if (allBookings.length === 0) {
      return res.status(404).json({ message: 'No booking found with the provided confirmation code and email' });
    }

    // Return the first matching booking
    const booking = allBookings[0];
    console.log('Found booking:', booking);
    res.json(booking);

  } catch (error) {
    console.error('Error finding booking:', error);
    res.status(500).json({ message: 'Error finding booking', error: error.message });
  }
});

// Update booking by confirmation code (for guests and users)
router.put('/update-by-confirmation', async (req, res) => {
  try {
    const {
      confirmation_code,
      room,
      check_in_date,
      check_out_date,
      number_of_guests,
      special_requests
    } = req.body;

    if (!confirmation_code) {
      return res.status(400).json({ message: 'Confirmation code is required' });
    }

    console.log('Updating booking with confirmation code:', confirmation_code);

    // --- Try updating a user booking first ---
    const [userBookings] = await db.query(
      'SELECT booking_id, user_id FROM bookings WHERE confirmation_code = ?',
      [confirmation_code]
    );

    if (userBookings.length > 0) {
      const booking = userBookings[0];

      if (check_in_date && check_out_date && new Date(check_out_date) <= new Date(check_in_date)) {
        return res.status(400).json({ message: 'Check-out date must be after check-in date' });
      }

      if (room && check_in_date && check_out_date) {
        const [conflicts] = await db.query(
          `SELECT * FROM bookings 
           WHERE room = ? AND booking_id != ? AND status != 'cancelled'
           AND (check_in_date < ? AND check_out_date > ?)`,
          [room, booking.booking_id, check_out_date, check_in_date]
        );

        if (conflicts.length > 0) {
          return res.status(409).json({ message: 'Room is already booked for the selected dates' });
        }
      }

      await db.query(
        `UPDATE bookings 
         SET room = ?, 
             check_in_date = ?, 
             check_out_date = ?, 
             number_of_guests = ?, 
             special_requests = ?
         WHERE booking_id = ?`,
        [
          room ?? null,
          check_in_date ?? null,
          check_out_date ?? null,
          number_of_guests ?? null,
          special_requests ?? '',
          booking.booking_id
        ]
      );

      const [updated] = await db.query(`
        SELECT 
          b.booking_id, b.room, b.check_in_date, b.check_out_date, b.number_of_guests, 
          b.status, b.special_requests, b.confirmation_code, b.created_at,
          u.email, u.first_name, u.last_name, u.phone_number,
          'user' AS type
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        WHERE b.booking_id = ?
      `, [booking.booking_id]);

      return res.json(updated[0]);
    }

    // --- Try guest booking if no user booking matched ---
    const [guestBookings] = await db.query(
      'SELECT booking_id FROM guest_bookings WHERE confirmation_code = ?',
      [confirmation_code]
    );

    if (guestBookings.length === 0) {
      return res.status(404).json({ message: 'No booking found with the provided confirmation code' });
    }

    const booking = guestBookings[0];

    if (check_in_date && check_out_date && new Date(check_out_date) <= new Date(check_in_date)) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    if (room && check_in_date && check_out_date) {
      const [conflicts] = await db.query(
        `SELECT * FROM guest_bookings 
         WHERE room = ? AND booking_id != ? AND status != 'cancelled'
         AND (check_in_date < ? AND check_out_date > ?)`,
        [room, booking.booking_id, check_out_date, check_in_date]
      );

      if (conflicts.length > 0) {
        return res.status(409).json({ message: 'Room is already booked for the selected dates' });
      }
    }

    await db.query(
      `UPDATE guest_bookings 
       SET room = ?, 
           check_in_date = ?, 
           check_out_date = ?, 
           number_of_guests = ?, 
           special_requests = ?
       WHERE booking_id = ?`,
      [
        room ?? null,
        check_in_date ?? null,
        check_out_date ?? null,
        number_of_guests ?? null,
        special_requests ?? '',
        booking.booking_id
      ]
    );

    const [updated] = await db.query(`
      SELECT 
        booking_id, room, check_in_date, check_out_date, number_of_guests, 
        status, special_requests, confirmation_code, created_at,
        guest_email AS email, guest_first_name AS first_name, guest_last_name AS last_name, 
        guest_phone_number AS phone_number,
        'guest' AS type
      FROM guest_bookings
      WHERE booking_id = ?
    `, [booking.booking_id]);

    return res.json(updated[0]);

  } catch (error) {
    console.error('Error updating booking by confirmation code:', error);
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
});

// Cancel booking by confirmation code
router.delete('/cancel-by-confirmation', async (req, res) => {
  try {
    const { confirmation_code } = req.body;

    if (!confirmation_code) {
      return res.status(400).json({ message: 'Confirmation code is required' });
    }

    console.log('Cancelling booking with confirmation code:', confirmation_code);

    // Check if it's a user booking
    const [userBookings] = await db.query(
      'SELECT booking_id, status FROM bookings WHERE confirmation_code = ?',
      [confirmation_code]
    );

    if (userBookings.length > 0) {
      const booking = userBookings[0];
      
      if (booking.status === 'cancelled') {
        return res.status(400).json({ message: 'Booking is already cancelled' });
      }

      await db.query(
        'UPDATE bookings SET status = ? WHERE booking_id = ?',
        ['cancelled', booking.booking_id]
      );

      res.json({ message: 'Booking cancelled successfully' });
    } else {
      // Check if it's a guest booking
      const [guestBookings] = await db.query(
        'SELECT booking_id, status FROM guest_bookings WHERE confirmation_code = ?',
        [confirmation_code]
      );

      if (guestBookings.length === 0) {
        return res.status(404).json({ message: 'No booking found with the provided confirmation code' });
      }

      const booking = guestBookings[0];
      
      if (booking.status === 'cancelled') {
        return res.status(400).json({ message: 'Booking is already cancelled' });
      }

      await db.query(
        'UPDATE guest_bookings SET status = ? WHERE booking_id = ?',
        ['cancelled', booking.booking_id]
      );

      res.json({ message: 'Booking cancelled successfully' });
    }

  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
});

module.exports = router;