# Utilities Documentation

This directory contains utility functions and helper methods for the TayAndTos backend system. These utilities provide common functionality, data processing, and helper methods used across different parts of the application.

## 🏗️ Utilities Overview

The utilities system provides:
- **Data Processing**: Formatting, validation, and transformation functions
- **Date & Time**: Date manipulation and formatting utilities
- **String Operations**: String manipulation and validation helpers
- **File Operations**: File handling and processing utilities
- **Security Utilities**: Password hashing, token generation, and security helpers
- **Database Helpers**: Query builders and database utility functions
- **Email Utilities**: Email formatting and validation helpers
- **Common Helpers**: Frequently used utility functions

## 📁 Utility Files

- **`dateUtils.js`** - Date and time manipulation utilities
- **`stringUtils.js`** - String processing and validation utilities
- **`validationUtils.js`** - Data validation and sanitization utilities
- **`securityUtils.js`** - Security and encryption utilities
- **`databaseUtils.js`** - Database helper functions
- **`emailUtils.js`** - Email formatting and validation utilities
- **`fileUtils.js`** - File handling and processing utilities
- **`commonUtils.js`** - General utility functions

## 📅 Date Utilities (`dateUtils.js`)

### Purpose
Provides date and time manipulation, formatting, and validation functions.

### Implementation

#### Date Formatting
```javascript
// Format date to readable string
const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day);
};

// Format date with time
const formatDateTime = (date) => {
  const d = new Date(date);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
```

#### Date Validation
```javascript
// Check if date is valid
const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

// Check if date is in the future
const isFutureDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  return d > now;
};

// Check if date is in the past
const isPastDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  return d < now;
};

// Check if date is today
const isToday = (date) => {
  const d = new Date(date);
  const today = new Date();
  
  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear();
};
```

#### Date Calculations
```javascript
// Calculate days between two dates
const daysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const timeDiff = end.getTime() - start.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  return daysDiff;
};

// Add days to date
const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

// Subtract days from date
const subtractDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
};

// Get start of week
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

// Get end of week
const getEndOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + 6;
  return new Date(d.setDate(diff));
};
```

#### Time Utilities
```javascript
// Get current timestamp
const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

// Get timestamp in seconds
const getTimestampSeconds = () => {
  return Math.floor(Date.now() / 1000);
};

// Format relative time
const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};
```

### Usage Examples

#### Date Formatting
```javascript
const today = new Date();
console.log(formatDate(today)); // "2024-01-15"
console.log(formatDateTime(today)); // "2024-01-15 14:30:25"
console.log(formatRelativeTime(today)); // "just now"
```

#### Date Validation
```javascript
const checkInDate = '2024-02-01';
const checkOutDate = '2024-02-05';

if (isFutureDate(checkInDate) && isFutureDate(checkOutDate)) {
  const days = daysBetween(checkInDate, checkOutDate);
  console.log(`Stay duration: ${days} days`);
}
```

## 🔤 String Utilities (`stringUtils.js`)

### Purpose
Provides string manipulation, validation, and formatting functions.

### Implementation

#### String Validation
```javascript
// Check if string is empty or whitespace
const isEmpty = (str) => {
  return !str || str.trim().length === 0;
};

// Check if string contains only letters
const isAlpha = (str) => {
  return /^[a-zA-Z\s]+$/.test(str);
};

// Check if string contains only letters and numbers
const isAlphanumeric = (str) => {
  return /^[a-zA-Z0-9\s]+$/.test(str);
};

// Check if string is a valid email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Check if string is a valid phone number
const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
};
```

#### String Formatting
```javascript
// Capitalize first letter
const capitalize = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Capitalize first letter of each word
const capitalizeWords = (str) => {
  if (!str) return str;
  return str.split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

// Convert to title case
const toTitleCase = (str) => {
  if (!str) return str;
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// Truncate string to specified length
const truncate = (str, length, suffix = '...') => {
  if (!str || str.length <= length) return str;
  return str.substring(0, length) + suffix;
};

// Generate random string
const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};
```

#### String Sanitization
```javascript
// Remove HTML tags
const stripHtml = (str) => {
  if (!str) return str;
  return str.replace(/<[^>]*>/g, '');
};

// Escape HTML entities
const escapeHtml = (str) => {
  if (!str) return str;
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  
  return str.replace(/[&<>"'/]/g, (match) => htmlEscapes[match]);
};

// Normalize whitespace
const normalizeWhitespace = (str) => {
  if (!str) return str;
  return str.replace(/\s+/g, ' ').trim();
};

// Remove special characters
const removeSpecialChars = (str) => {
  if (!str) return str;
  return str.replace(/[^a-zA-Z0-9\s]/g, '');
};
```

### Usage Examples

#### String Validation
```javascript
const firstName = 'John';
const email = 'john@example.com';

if (isAlpha(firstName) && isValidEmail(email)) {
  console.log('Valid input');
}
```

#### String Formatting
```javascript
const name = 'john doe';
console.log(capitalizeWords(name)); // "John Doe"
console.log(toTitleCase(name)); // "John Doe"

const longText = 'This is a very long text that needs to be truncated';
console.log(truncate(longText, 20)); // "This is a very long..."
```

## ✅ Validation Utilities (`validationUtils.js`)

### Purpose
Provides data validation and sanitization functions.

### Implementation

#### Input Validation
```javascript
// Validate required fields
const validateRequired = (data, requiredFields) => {
  const errors = [];
  
  requiredFields.forEach(field => {
    if (!data[field] || isEmpty(data[field])) {
      errors.push(`${field} is required`);
    }
  });
  
  return errors;
};

// Validate email format
const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!isValidEmail(email)) return 'Invalid email format';
  return null;
};

// Validate password strength
const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/(?=.*[a-z])/.test(password)) return 'Password must contain lowercase letter';
  if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain uppercase letter';
  if (!/(?=.*\d)/.test(password)) return 'Password must contain number';
  if (!/(?=.*[@$!%*?&])/.test(password)) return 'Password must contain special character';
  return null;
};

// Validate phone number
const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  if (!isValidPhone(phone)) return 'Invalid phone number format';
  return null;
};
```

#### Data Sanitization
```javascript
// Sanitize user input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
};

// Sanitize object properties
const sanitizeObject = (obj) => {
  const sanitized = {};
  
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeInput(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  });
  
  return sanitized;
};

// Validate and sanitize user data
const validateAndSanitizeUser = (userData) => {
  const errors = [];
  const sanitized = {};
  
  // Validate required fields
  const requiredErrors = validateRequired(userData, ['first_name', 'last_name', 'email', 'password']);
  errors.push(...requiredErrors);
  
  // Validate email
  const emailError = validateEmail(userData.email);
  if (emailError) errors.push(emailError);
  
  // Validate password
  const passwordError = validatePassword(userData.password);
  if (passwordError) errors.push(passwordError);
  
  // Validate phone if provided
  if (userData.phone_number) {
    const phoneError = validatePhone(userData.phone_number);
    if (phoneError) errors.push(phoneError);
  }
  
  // Sanitize data if no errors
  if (errors.length === 0) {
    sanitized.first_name = capitalizeWords(userData.first_name);
    sanitized.last_name = capitalizeWords(userData.last_name);
    sanitized.email = userData.email.toLowerCase().trim();
    sanitized.phone_number = userData.phone_number ? userData.phone_number.trim() : null;
    sanitized.password = userData.password;
  }
  
  return { errors, sanitized };
};
```

### Usage Examples

#### Input Validation
```javascript
const userData = {
  first_name: 'john',
  last_name: 'doe',
  email: 'john@example.com',
  password: 'Password123!',
  phone_number: '+1234567890'
};

const { errors, sanitized } = validateAndSanitizeUser(userData);

if (errors.length > 0) {
  console.log('Validation errors:', errors);
} else {
  console.log('Sanitized data:', sanitized);
}
```

## 🔒 Security Utilities (`securityUtils.js`)

### Purpose
Provides security-related utility functions for password hashing, token generation, and security validation.

### Implementation

#### Password Hashing
```javascript
const bcrypt = require('bcrypt');

// Hash password
const hashPassword = async (password, saltRounds = 10) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw new Error('Password hashing failed');
  }
};

// Compare password with hash
const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Generate secure random password
const generateSecurePassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one character from each category
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  password += '0123456789'[Math.floor(Math.random() * 10)];
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
  
  // Fill remaining length
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};
```

#### Token Generation
```javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate JWT token
const generateJWT = (payload, secret, options = {}) => {
  const defaultOptions = {
    expiresIn: '24h',
    issuer: 'tayandtos',
    audience: 'tayandtos-users'
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  try {
    return jwt.sign(payload, secret, finalOptions);
  } catch (error) {
    throw new Error('JWT generation failed');
  }
};

// Verify JWT token
const verifyJWT = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('JWT verification failed');
  }
};

// Generate random token
const generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate confirmation code
const generateConfirmationCode = (length = 6) => {
  return Math.random().toString().substr(2, length);
};
```

#### Security Validation
```javascript
// Validate password strength
const validatePasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  const strength = score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong';
  
  return { checks, score, strength };
};

// Check for common passwords
const isCommonPassword = (password) => {
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];
  
  return commonPasswords.includes(password.toLowerCase());
};

// Validate email security
const validateEmailSecurity = (email) => {
  const domain = email.split('@')[1];
  const disposableDomains = [
    'tempmail.org', 'guerrillamail.com', 'mailinator.com'
  ];
  
  return !disposableDomains.includes(domain);
};
```

### Usage Examples

#### Password Security
```javascript
const password = 'MySecurePass123!';
const { checks, score, strength } = validatePasswordStrength(password);

console.log(`Password strength: ${strength} (${score}/5)`);
console.log('Checks:', checks);

if (strength === 'weak') {
  console.log('Please choose a stronger password');
}
```

#### Token Generation
```javascript
const user = { id: 1, email: 'user@example.com' };
const token = generateJWT(user, process.env.JWT_SECRET, { expiresIn: '7d' });

console.log('Generated token:', token);
```

## 🗄️ Database Utilities (`databaseUtils.js`)

### Purpose
Provides database helper functions and query utilities.

### Implementation

#### Query Builders
```javascript
// Build WHERE clause
const buildWhereClause = (conditions, operator = 'AND') => {
  if (!conditions || Object.keys(conditions).length === 0) {
    return { sql: '', params: [] };
  }
  
  const clauses = [];
  const params = [];
  
  Object.keys(conditions).forEach(key => {
    if (conditions[key] !== undefined && conditions[key] !== null) {
      clauses.push(`${key} = ?`);
      params.push(conditions[key]);
    }
  });
  
  const sql = clauses.length > 0 ? `WHERE ${clauses.join(` ${operator} `)}` : '';
  
  return { sql, params };
};

// Build SELECT query
const buildSelectQuery = (table, fields = '*', conditions = {}, orderBy = '', limit = '') => {
  const fieldList = Array.isArray(fields) ? fields.join(', ') : fields;
  const { sql: whereClause, params } = buildWhereClause(conditions);
  
  let query = `SELECT ${fieldList} FROM ${table}`;
  if (whereClause) query += ` ${whereClause}`;
  if (orderBy) query += ` ORDER BY ${orderBy}`;
  if (limit) query += ` LIMIT ${limit}`;
  
  return { query, params };
};

// Build INSERT query
const buildInsertQuery = (table, data) => {
  const fields = Object.keys(data);
  const placeholders = fields.map(() => '?').join(', ');
  const values = Object.values(data);
  
  const query = `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders})`;
  
  return { query, params: values };
};

// Build UPDATE query
const buildUpdateQuery = (table, data, conditions) => {
  const setFields = Object.keys(data).map(field => `${field} = ?`).join(', ');
  const setValues = Object.values(data);
  
  const { sql: whereClause, params: whereParams } = buildWhereClause(conditions);
  
  const query = `UPDATE ${table} SET ${setFields} ${whereClause}`;
  const params = [...setValues, ...whereParams];
  
  return { query, params };
};
```

#### Database Helpers
```javascript
// Execute query with error handling
const executeQuery = async (pool, query, params = []) => {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database operation failed');
  }
};

// Get single record
const getOne = async (pool, table, conditions = {}) => {
  const { query, params } = buildSelectQuery(table, '*', conditions, '', '1');
  const results = await executeQuery(pool, query, params);
  return results[0] || null;
};

// Get multiple records
const getMany = async (pool, table, conditions = {}, orderBy = '', limit = '') => {
  const { query, params } = buildSelectQuery(table, '*', conditions, orderBy, limit);
  return await executeQuery(pool, query, params);
};

// Insert record
const insert = async (pool, table, data) => {
  const { query, params } = buildInsertQuery(table, data);
  const result = await executeQuery(pool, query, params);
  return result.insertId;
};

// Update record
const update = async (pool, table, data, conditions) => {
  const { query, params } = buildUpdateQuery(table, data, conditions);
  const result = await executeQuery(pool, query, params);
  return result.affectedRows;
};

// Delete record
const remove = async (pool, table, conditions) => {
  const { sql: whereClause, params } = buildWhereClause(conditions);
  const query = `DELETE FROM ${table} ${whereClause}`;
  const result = await executeQuery(pool, query, params);
  return result.affectedRows;
};
```

### Usage Examples

#### Database Operations
```javascript
// Get user by email
const user = await getOne(pool, 'users', { email: 'user@example.com' });

// Get all active bookings
const bookings = await getMany(pool, 'bookings', { status: 'active' }, 'created_at DESC');

// Insert new user
const userId = await insert(pool, 'users', {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  password: hashedPassword
});

// Update user
const updated = await update(pool, 'users', 
  { last_login: new Date() }, 
  { id: userId }
);
```

## 📧 Email Utilities (`emailUtils.js`)

### Purpose
Provides email formatting, validation, and processing utilities.

### Implementation

#### Email Validation
```javascript
// Validate email format
const isValidEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate email domain
const isValidEmailDomain = (email) => {
  const domain = email.split('@')[1];
  const validDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  return validDomains.includes(domain);
};

// Check if email is disposable
const isDisposableEmail = (email) => {
  const domain = email.split('@')[1];
  const disposableDomains = [
    'tempmail.org', 'guerrillamail.com', 'mailinator.com',
    '10minutemail.com', 'throwaway.email'
  ];
  
  return disposableDomains.includes(domain);
};

// Comprehensive email validation
const validateEmailComprehensive = (email) => {
  if (!email) return { valid: false, error: 'Email is required' };
  if (!isValidEmailFormat(email)) return { valid: false, error: 'Invalid email format' };
  if (isDisposableEmail(email)) return { valid: false, error: 'Disposable email not allowed' };
  
  return { valid: true, error: null };
};
```

#### Email Formatting
```javascript
// Format email subject
const formatEmailSubject = (type, data = {}) => {
  const subjects = {
    'welcome': 'Welcome to TayAndTos!',
    'booking_confirmation': `Booking Confirmation - ${data.room || 'Room'}`,
    'password_reset': 'Password Reset Request',
    'email_confirmation': 'Confirm Your Email Address'
  };
  
  return subjects[type] || 'TayAndTos Notification';
};

// Format email greeting
const formatEmailGreeting = (firstName, type = 'default') => {
  const greetings = {
    'welcome': `Welcome, ${firstName}!`,
    'booking': `Dear ${firstName},`,
    'default': `Hello ${firstName},`
  };
  
  return greetings[type] || greetings.default;
};

// Format email signature
const formatEmailSignature = () => {
  return `
    <br><br>
    Best regards,<br>
    The TayAndTos Team<br>
    <br>
    <small>
      This is an automated email. Please do not reply directly to this message.<br>
      For support, contact us at support@tayandtos.com
    </small>
  `;
};
```

#### Email Content Processing
```javascript
// Process email template variables
const processEmailTemplate = (template, variables) => {
  let processed = template;
  
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`\\[${key}\\]`, 'g');
    processed = processed.replace(regex, variables[key]);
  });
  
  return processed;
};

// Generate email preview
const generateEmailPreview = (template, variables) => {
  const processed = processEmailTemplate(template, variables);
  
  return {
    subject: variables.subject || 'Email Preview',
    html: processed,
    text: stripHtml(processed),
    variables: variables
  };
};

// Validate email template
const validateEmailTemplate = (template) => {
  const errors = [];
  
  if (!template) {
    errors.push('Template is required');
  }
  
  if (typeof template !== 'string') {
    errors.push('Template must be a string');
  }
  
  if (template.length < 10) {
    errors.push('Template is too short');
  }
  
  // Check for required variables
  const requiredVars = ['[User Name]', '[Room Type]', '[Check-in Date]'];
  requiredVars.forEach(varName => {
    if (!template.includes(varName)) {
      errors.push(`Missing required variable: ${varName}`);
    }
  });
  
  return errors;
};
```

### Usage Examples

#### Email Validation
```javascript
const email = 'user@example.com';
const validation = validateEmailComprehensive(email);

if (!validation.valid) {
  console.log('Email validation error:', validation.error);
}
```

#### Email Template Processing
```javascript
const template = 'Hello [User Name], your [Room Type] booking is confirmed for [Check-in Date].';
const variables = {
  'User Name': 'John Doe',
  'Room Type': 'Deluxe Suite',
  'Check-in Date': '2024-02-01'
};

const processed = processEmailTemplate(template, variables);
console.log(processed);
// Output: "Hello John Doe, your Deluxe Suite booking is confirmed for 2024-02-01."
```

## 📁 File Utilities (`fileUtils.js`)

### Purpose
Provides file handling, processing, and management utilities.

### Implementation

#### File Operations
```javascript
const fs = require('fs').promises;
const path = require('path');

// Check if file exists
const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

// Read file content
const readFile = async (filePath, encoding = 'utf8') => {
  try {
    const content = await fs.readFile(filePath, encoding);
    return content;
  } catch (error) {
    throw new Error(`Failed to read file: ${filePath}`);
  }
};

// Write file content
const writeFile = async (filePath, content, encoding = 'utf8') => {
  try {
    await fs.writeFile(filePath, content, encoding);
    return true;
  } catch (error) {
    throw new Error(`Failed to write file: ${filePath}`);
  }
};

// Create directory if it doesn't exist
const ensureDirectory = async (dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return true;
  } catch (error) {
    throw new Error(`Failed to create directory: ${dirPath}`);
  }
};
```

#### File Validation
```javascript
// Validate file extension
const isValidFileExtension = (filename, allowedExtensions) => {
  const extension = path.extname(filename).toLowerCase();
  return allowedExtensions.includes(extension);
};

// Validate file size
const isValidFileSize = (fileSize, maxSize) => {
  return fileSize <= maxSize;
};

// Generate unique filename
const generateUniqueFilename = (originalName, prefix = '') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = path.extname(originalName);
  const name = path.basename(originalName, extension);
  
  return `${prefix}${name}_${timestamp}_${random}${extension}`;
};
```

### Usage Examples

#### File Operations
```javascript
const filePath = './templates/email_template.html';

if (await fileExists(filePath)) {
  const content = await readFile(filePath);
  console.log('File content:', content);
}

// Create backup
const backupPath = `./backups/${generateUniqueFilename('email_template.html', 'backup_')}`;
await ensureDirectory('./backups');
await writeFile(backupPath, content);
```

## 🔧 Common Utilities (`commonUtils.js`)

### Purpose
Provides general utility functions used throughout the application.

### Implementation

#### General Helpers
```javascript
// Deep clone object
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  const cloned = {};
  Object.keys(obj).forEach(key => {
    cloned[key] = deepClone(obj[key]);
  });
  
  return cloned;
};

// Merge objects
const mergeObjects = (target, ...sources) => {
  sources.forEach(source => {
    if (source) {
      Object.keys(source).forEach(key => {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          target[key] = mergeObjects(target[key] || {}, source[key]);
        } else {
          target[key] = source[key];
        }
      });
    }
  });
  
  return target;
};

// Generate UUID
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Sleep function
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
```

#### Array Utilities
```javascript
// Remove duplicates from array
const removeDuplicates = (array, key = null) => {
  if (key) {
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }
  
  return [...new Set(array)];
};

// Group array by key
const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

// Sort array by multiple keys
const sortByMultiple = (array, keys) => {
  return array.sort((a, b) => {
    for (const key of keys) {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
    }
    return 0;
  });
};
```

### Usage Examples

#### Object Operations
```javascript
const user = { name: 'John', preferences: { theme: 'dark' } };
const clonedUser = deepClone(user);

const updates = { preferences: { language: 'en' } };
const mergedUser = mergeObjects(user, updates);

console.log('Cloned user:', clonedUser);
console.log('Merged user:', mergedUser);
```

#### Array Operations
```javascript
const users = [
  { id: 1, name: 'John', role: 'user' },
  { id: 2, name: 'Jane', role: 'admin' },
  { id: 3, name: 'Bob', role: 'user' }
];

const uniqueUsers = removeDuplicates(users, 'id');
const groupedByRole = groupBy(users, 'role');
const sortedUsers = sortByMultiple(users, ['role', 'name']);

console.log('Unique users:', uniqueUsers);
console.log('Grouped by role:', groupedByRole);
console.log('Sorted users:', sortedUsers);
```

## 🚨 Common Issues & Solutions

### 1. **Date Formatting Issues**
**Issue:** Incorrect date formats
**Solution:** Use consistent date formatting functions and validate input

### 2. **String Validation Problems**
**Issue:** Invalid data passing validation
**Solution:** Implement comprehensive validation with proper error messages

### 3. **Security Vulnerabilities**
**Issue:** Weak password validation
**Solution:** Use strong validation rules and security utilities

### 4. **Database Query Errors**
**Issue:** Malformed SQL queries
**Solution:** Use query builders and parameterized queries

### 5. **File Operation Failures**
**Issue:** File read/write errors
**Solution:** Implement proper error handling and file validation

## 📚 Related Documentation

- **Main Backend**: See `../README.md` for overall backend documentation
- **Middleware**: See `../middleware/README.md` for middleware functions
- **Services**: See `../sevices/README.md` for service layer utilities
- **Controllers**: See `../controllers/README.md` for controller utilities

## 🔄 Utility Lifecycle

### 1. **Development**
- Create utility functions
- Test functionality
- Document usage

### 2. **Integration**
- Import into modules
- Test integration
- Optimize performance

### 3. **Maintenance**
- Update utilities as needed
- Add new functionality
- Maintain backward compatibility

### 4. **Testing**
- Unit test utilities
- Integration testing
- Performance testing
