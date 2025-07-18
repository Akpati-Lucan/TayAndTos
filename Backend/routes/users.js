const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { authenticateToken } = require('../middleware/auth');


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


// Fetch current user's profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT id, email, first_name, last_name, phone_number, admin 
       FROM users WHERE id = ?`,
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update current user's profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { first_name, last_name, phone_number } = req.body;

    if (!first_name || !last_name || !phone_number) {
      return res.status(400).json({ message: 'First name, last name, and phone number are required' });
    }

    const [result] = await db.query(
      'UPDATE users SET first_name = ?, last_name = ?, phone_number = ? WHERE id = ?',
      [first_name, last_name, phone_number, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [users] = await db.query(
      'SELECT id, email, first_name, last_name, phone_number, admin FROM users WHERE id = ?',
      [req.user.userId]
    );

    res.json(users[0]);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
});

// Update current user's password
router.put('/profile/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    // Optional: enforce minimum length manually too
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters long' });
    }

    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({ message: 'Password must be strong (e.g., include uppercase, numbers, and symbols)' });
    }

    const [users] = await db.query(
      'SELECT password_hash FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(currentPassword, users[0].password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const isSamePassword = await bcrypt.compare(newPassword, users[0].password_hash);
    if (isSamePassword) {
      return res.status(400).json({ message: 'New password must be different from current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hashedPassword, req.user.userId]
    );

    res.json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
});



router.put('/:userId', authenticateToken, async (req, res) => {
  try {
    if (!req.user.admin) {
      return res.status(403).json({ message: 'Only admins can update other users' });
    }

    const userId = req.params.userId;
    const {
      email = '', first_name = '', last_name = '', phone_number = '', password
    } = req.body;

    if (!email || !first_name || !last_name || !phone_number) {
      return res.status(400).json({ message: 'Email, first name, last name, and phone number are required' });
    }

    // Optional: Enforce password strength if password is being updated
    if (password && password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Check for duplicate email (excluding current user)
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE email = ? AND id != ?',
      [email, userId]
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Build query
    let updateQuery = 'UPDATE users SET email = ?, first_name = ?, last_name = ?, phone_number = ?';
    const queryParams = [email.trim(), first_name.trim(), last_name.trim(), phone_number.trim()];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += ', password_hash = ?';
      queryParams.push(hashedPassword);
    }

    updateQuery += ' WHERE id = ?';
    queryParams.push(userId);

    const [result] = await db.query(updateQuery, queryParams);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [users] = await db.query(
      'SELECT id, email, first_name, last_name, phone_number, admin FROM users WHERE id = ?',
      [userId]
    );

    res.json(users[0]);

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});


// Delete a specific user (admin only)
router.delete('/:userId', authenticateToken, async (req, res) => {
  try {
    if (!req.user.admin) {
      return res.status(403).json({ message: 'Only admins can delete users' });
    }

    const userId = parseInt(req.params.userId);

    // Prevent deleting own account
    if (userId === req.user.userId) {
      return res.status(400).json({ message: 'Admins cannot delete their own account' });
    }

    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    await db.query('DELETE FROM users WHERE id = ?', [userId]);

    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;