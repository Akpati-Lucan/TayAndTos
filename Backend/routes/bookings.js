const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../db'); // assumes you're exporting pool/query from db.js

// Get all bookings with user info
router.get('/', async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT 
        b.booking_id AS id, b.room, b.check_in_date, b.check_out_date, b.number_of_guests, b.status, b.special_requests,
        u.id AS user_id, u.first_name, u.last_name, u.email, u.phone_number
      FROM bookings b
      JOIN users u ON b.user_id = u.id
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
      const { room, check_in_date, check_out_date, number_of_guests, status, special_requests } = req.body;
      const userId = req.user?.userId; // From auth middleware
  
      console.log('Creating booking with data:', {
        room, check_in_date, check_out_date, number_of_guests, status, special_requests, userId
      });
  
      if (!room) {
        return res.status(400).json({ message: 'Room is required' });
      }
  
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
  
      // Insert booking
      const [result] = await db.query(
        `INSERT INTO bookings 
         (room, check_in_date, check_out_date, number_of_guests, status, special_requests, user_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [room, check_in_date, check_out_date, number_of_guests, status, special_requests, userId]
      );
  
      console.log('Booking created with ID:', result.insertId);
  
      // Fetch and return created booking
      const [newBooking] = await db.query(
        `SELECT b.*, CONCAT(u.first_name, ' ', u.last_name) AS creator_name 
         FROM bookings b 
         JOIN users u ON b.user_id = u.id 
         WHERE b.booking_id = ?`,
        [result.insertId]
      );
  
      console.log('Retrieved new booking:', newBooking[0]);
  
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

  router.put('/:bookingId', async (req, res) => {
    try {
      const { room, check_in_date, check_out_date, number_of_guests, status, special_requests } = req.body;
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
  
      // Update the booking
      await db.query(
        `UPDATE bookings 
         SET room = ?, check_in_date = ?, check_out_date = ?, number_of_guests = ?, status = ?, special_requests = ? 
         WHERE booking_id = ?`,
        [room, check_in_date, check_out_date, number_of_guests, status, special_requests, req.params.bookingId]
      );
  
      // Return updated booking with user info
      const [updatedBooking] = await db.query(
        `SELECT b.*, CONCAT(u.first_name, ' ', u.last_name) AS creator_name 
         FROM bookings b 
         JOIN users u ON b.user_id = u.id 
         WHERE b.booking_id = ?`,
        [req.params.bookingId]
      );
  
      res.json(updatedBooking[0]);
  
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ message: 'Error updating booking', error: error.message });
    }
  });

  module.exports = router;