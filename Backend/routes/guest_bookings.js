const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../db'); // assumes you're exporting pool/query from db.js
const generateConfirmationCode = require('../utils/generate_code');
const jwt = require('jsonwebtoken');
const { sendBookingConfirmationEmail } = require('./email');



// Create a new guest booking
router.post('/', async (req, res) => {
    console.log('Guest booking request received:', req.body);
    try {
      const {
        guest_first_name, guest_last_name, guest_email, guest_phone_number, room, 
        check_in_date, check_out_date, number_of_guests, status, special_requests
      } = req.body;
  
      // Validate required fields
      if (!guest_first_name || !guest_last_name || !guest_email || !room || !check_in_date || !check_out_date || !number_of_guests) {
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
        `INSERT INTO guest_bookings 
         (guest_first_name, guest_last_name, guest_email, guest_phone_number, room, check_in_date, check_out_date, number_of_guests, status, special_requests, confirmation_code) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          guest_first_name, guest_last_name, guest_email, guest_phone_number, room,
          check_in_date, check_out_date, number_of_guests, status, special_requests, confirmation_code
        ]
      );
  
      const [newBooking] = await db.query(
        `SELECT * FROM guest_bookings WHERE booking_id = ?`,
        [result.insertId]
      );

      // Send confirmation email
      try {
        // Create user object for guest booking email
        const guestUser = {
          email: guest_email,
          first_name: guest_first_name,
          last_name: guest_last_name
        };
        
        await sendBookingConfirmationEmail(newBooking[0], guestUser);
        console.log(`Confirmation email sent to guest: ${guest_email}`);
      } catch (emailError) {
        console.error('Failed to send confirmation email to guest:', emailError);
        // Don't fail the booking creation if email fails
        // The booking is still created successfully
      }

      res.status(201).json(newBooking[0]);
  
    } catch (error) {
      console.error('Error creating guest booking:', error);
      res.status(500).json({
        message: 'Error creating guest booking',
        error: error.message
      });
    }
  });


  // Find guest booking and generate temporary token
  router.post('/find-and-token', async (req, res) => {
    try {
      console.log('Received find-and-token request:', req.body);
      const { confirmation_code, email } = req.body;

      if (!confirmation_code || !email) {
        console.log('Missing required fields:', { confirmation_code: !!confirmation_code, email: !!email });
        return res.status(400).json({ message: 'Confirmation code and email are required' });
      }

      console.log('Finding guest booking and generating token:', { confirmation_code, email });

      const [bookings] = await db.query(
        'SELECT * FROM guest_bookings WHERE confirmation_code = ? AND guest_email = ?',
        [confirmation_code, email]
      );

      console.log('Database query result:', { found: bookings.length, bookings });

      if (bookings.length === 0) {
        console.log('No booking found for:', { confirmation_code, email });
        return res.status(404).json({ message: 'No booking found with the provided confirmation code and email' });
      }

      const booking = bookings[0];
      console.log('Found booking:', { booking_id: booking.booking_id, guest_email: booking.guest_email });

      // Check if JWT_SECRET is available, use a fallback if not set
      const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
      if (!process.env.JWT_SECRET) {
        console.warn('JWT_SECRET environment variable is not set, using fallback secret');
      }

      // Generate temporary JWT token for guest user
      const guestToken = jwt.sign(
        {
          guest: true,
          booking_id: booking.booking_id,
          confirmation_code: booking.confirmation_code,
          email: booking.guest_email,
          type: 'guest'
        },
        jwtSecret,
        { expiresIn: '30m' } // 30 minute expiration for security
      );

      console.log('Generated temporary guest token for booking:', booking.booking_id);

      const response = {
        booking: booking,
        guest_token: guestToken,
        expires_in: 1800 // 30 minutes in seconds
      };

      console.log('Sending response:', { booking_id: response.booking.booking_id, has_token: !!response.guest_token });
      res.json(response);

    } catch (error) {
      console.error('Error finding guest booking and generating token:', error);
      res.status(500).json({ message: 'Error finding booking', error: error.message });
    }
  });


  // Debug endpoint to list all guest bookings
  router.get('/debug/all', async (req, res) => {
    try {
      console.log('Debug: Listing all guest bookings');
      const [bookings] = await db.query('SELECT booking_id, guest_email, confirmation_code, status FROM guest_bookings');
      console.log('Debug: Found guest bookings:', bookings);
      res.json({ count: bookings.length, bookings });
    } catch (error) {
      console.error('Debug: Error listing guest bookings:', error);
      res.status(500).json({ message: 'Error listing guest bookings', error: error.message });
    }
  });


  // Soft-delete a guest booking (admin or with confirmation code)
router.delete('/:bookingId', authenticateToken, async (req, res) => {
    try {
      console.log('Guest booking delete request:', req.params.bookingId);
      const bookingId = parseInt(req.params.bookingId, 10);
      if (isNaN(bookingId)) {
        return res.status(400).json({ message: 'Invalid booking ID' });
      }
  
            const confirmation_code = req.body?.confirmation_code;
      const isAdmin = req.user?.admin;
      const isGuestUser = req.user?.guest;
      
      console.log('Guest delete request details:', {
        bookingId,
        isAdmin,
        isGuestUser,
        confirmation_code: confirmation_code ? 'provided' : 'not provided',
        user: req.user
      });
      
      console.log('Full JWT payload (guest):', req.user);

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
      if (!isAdmin) {
        if (isGuestUser) {
          // Guest user with token - verify they own this booking
          console.log('Guest authorization check:', {
            tokenBookingId: req.user.booking_id,
            dbBookingId: bookingId,
            tokenConfirmationCode: req.user.confirmation_code,
            dbConfirmationCode: booking.confirmation_code
          });
          
          if (parseInt(req.user.booking_id) !== bookingId || req.user.confirmation_code !== booking.confirmation_code) {
            console.log('Authorization failed: Guest token does not match booking');
            return res.status(403).json({ message: 'You are not authorized to cancel this booking' });
          }
        } else {
          // Regular user - require confirmation code
          if (!isCodeMatch) {
            return res.status(403).json({ message: 'You are not authorized to cancel this booking' });
          }
        }
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

module.exports = router;
  

// Update a guest booking (admin or guest with confirmation code)
router.put('/:bookingId', authenticateToken, async (req, res) => {
    try {
      console.log('Guest booking update request:', req.params.bookingId, req.body);
      
      const {
        guest_first_name, guest_last_name, guest_email, guest_phone_number, room, check_in_date, check_out_date, number_of_guests, status, special_requests, confirmation_code
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
      const isGuestUser = req.user?.guest || false;

      console.log('Guest booking update authorization check:', {
        bookingId,
        isAdmin,
        isGuestUser,
        confirmation_code: confirmation_code ? 'provided' : 'not provided',
        bookingConfirmationCode: booking.confirmation_code,
        user: req.user
      });

      // Authorization check
      if (!isAdmin) {
        if (isGuestUser) {
          // Guest user with token - verify they own this booking
          console.log('Guest authorization check (update):', {
            tokenBookingId: req.user.booking_id,
            dbBookingId: bookingId,
            tokenConfirmationCode: req.user.confirmation_code,
            dbConfirmationCode: booking.confirmation_code
          });
          
          if (parseInt(req.user.booking_id) !== bookingId || req.user.confirmation_code !== booking.confirmation_code) {
            console.log('Authorization failed: Guest token does not match booking');
            return res.status(403).json({ message: 'You are not authorized to update this booking' });
          }
        } else {
          // Regular user - require confirmation code
          if (!confirmation_code) {
            console.log('Authorization failed: No confirmation code provided');
            return res.status(401).json({ message: 'Confirmation code is required to update booking' });
          }

          if (confirmation_code !== booking.confirmation_code) {
            console.log('Authorization failed: Invalid confirmation code');
            return res.status(403).json({ message: 'Invalid confirmation code' });
          }
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