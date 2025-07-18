const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./middleware/auth');

router.post('/signup', async (req, res) => {
  try {
    const { email, first_name, last_name, phone_number, password } = req.body;

    // Validate required fields
    if (!email || !first_name || !last_name || !phone_number || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for existing email
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      `INSERT INTO users (email, first_name, last_name, phone_number, password_hash, admin) 
       VALUES (?, ?, ?, ?, ?, false)`,
      [email, first_name, last_name, phone_number, hashedPassword]
    );

    const newUser = {
      id: result.insertId,
      email,
      first_name,
      last_name,
      phone_number,
      admin: false
    };

    // Generate token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, admin: newUser.admin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});


// Public routes
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('Login attempt for email:', email);
  
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      const user = users[0];
  
      if (!user) {
        console.log('User not found');
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        console.log('Invalid password for:', email);
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const token = jwt.sign(
        { userId: user.id, email: user.email, admin: user.admin },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
  
      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          admin: user.admin
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error logging in' });
    }
  });


// Fetch all users
router.get('/', authenticateToken, async (req, res) => {
    try {
      if (!req.user?.admin) {
        return res.status(403).json({ message: 'Only admins can access all users' });
      }
  
      console.log('Fetching users...');
      const [users] = await db.query(
        `SELECT 
           u.id, u.email, u.first_name, u.last_name, u.phone_number, u.admin,
           (SELECT COUNT(*) FROM bookings WHERE user_id = u.id) AS booking_count
         FROM users u
         ORDER BY u.first_name ASC`
      );
      console.log('Fetched users:', users.length);
  
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ 
        message: 'Error fetching users', 
        error: error.message,
        details: error.stack 
      });
    }
  });