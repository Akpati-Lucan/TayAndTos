const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
      `INSERT INTO users (email, first_name, last_name, phone_number, password, admin) 
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
