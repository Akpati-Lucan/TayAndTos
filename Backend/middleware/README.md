# Middleware Documentation

This directory contains middleware functions for the TayAndTos backend system. Middleware functions process requests before they reach route handlers, providing authentication, validation, logging, and other cross-cutting concerns.

## 🏗️ Middleware Overview

The middleware system provides:
- **Authentication & Authorization**: JWT token validation and user role checking
- **Request Validation**: Input sanitization and validation
- **Error Handling**: Centralized error processing and logging
- **Security**: CORS, rate limiting, and security headers
- **Logging**: Request/response logging and monitoring
- **Performance**: Request timing and optimization

## 📁 Middleware Files

- **`auth.js`** - JWT authentication middleware
- **`validation.js`** - Request validation middleware
- **`errorHandler.js`** - Centralized error handling
- **`cors.js`** - CORS configuration middleware
- **`rateLimit.js`** - Rate limiting middleware
- **`logging.js`** - Request logging middleware

## 🔐 Authentication Middleware (`auth.js`)

### Purpose
Handles JWT token validation and user authentication for protected routes.

### Implementation

#### JWT Token Validation
```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Invalid or expired token' 
      });
    }
    
    req.user = user;
    next();
  });
};
```

#### Admin Role Verification
```javascript
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.admin) {
    return res.status(403).json({ 
      error: 'Admin access required' 
    });
  }
  next();
};
```

#### Guest Token Validation
```javascript
const validateGuestToken = (req, res, next) => {
  const guestToken = req.headers['guest-token'];
  
  if (!guestToken) {
    return res.status(401).json({ 
      error: 'Guest token required' 
    });
  }

  jwt.verify(guestToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Invalid or expired guest token' 
      });
    }
    
    req.guest = decoded;
    next();
  });
};
```

### Usage Examples

#### Protected Routes
```javascript
// Apply to individual routes
app.get('/bookings', authenticateToken, (req, res) => {
  // Route handler
});

// Apply to route groups
app.use('/admin', authenticateToken, requireAdmin);
app.get('/admin/users', (req, res) => {
  // Admin route handler
});
```

#### Guest Routes
```javascript
// Guest booking routes
app.use('/guest-bookings', validateGuestToken);
app.put('/guest-bookings/:id', (req, res) => {
  // Guest booking update
});
```

## ✅ Validation Middleware (`validation.js`)

### Purpose
Validates and sanitizes request data before processing.

### Implementation

#### User Registration Validation
```javascript
const { body, validationResult } = require('express-validator');

const validateUserRegistration = [
  body('first_name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('last_name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  
  body('phone_number')
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Must be a valid phone number'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array() 
      });
    }
    next();
  }
];
```

#### Booking Validation
```javascript
const validateBooking = [
  body('room')
    .trim()
    .isIn(['standard', 'deluxe', 'suite'])
    .withMessage('Room must be standard, deluxe, or suite'),
  
  body('check_in_date')
    .isISO8601()
    .withMessage('Check-in date must be a valid date')
    .custom((value) => {
      const checkIn = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (checkIn < today) {
        throw new Error('Check-in date cannot be in the past');
      }
      return true;
    }),
  
  body('check_out_date')
    .isISO8601()
    .withMessage('Check-out date must be a valid date')
    .custom((value, { req }) => {
      const checkOut = new Date(value);
      const checkIn = new Date(req.body.check_in_date);
      
      if (checkOut <= checkIn) {
        throw new Error('Check-out date must be after check-in date');
      }
      return true;
    }),
  
  body('number_of_guests')
    .isInt({ min: 1, max: 4 })
    .withMessage('Number of guests must be between 1 and 4'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array() 
      });
    }
    next();
  }
];
```

#### Email Validation
```javascript
const validateEmailRequest = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array() 
      });
    }
    next();
  }
];
```

### Usage Examples

#### Apply to Routes
```javascript
// User registration
app.post('/users/signup', validateUserRegistration, (req, res) => {
  // Registration logic
});

// Booking creation
app.post('/bookings', authenticateToken, validateBooking, (req, res) => {
  // Booking creation logic
});

// Email requests
app.post('/email/resend-confirmation', validateEmailRequest, (req, res) => {
  // Email resend logic
});
```

## 🚨 Error Handling Middleware (`errorHandler.js`)

### Purpose
Centralizes error handling and provides consistent error responses.

### Implementation

#### Global Error Handler
```javascript
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details = null;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    details = err.details;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Resource Not Found';
  } else if (err.name === 'ConflictError') {
    statusCode = 409;
    message = 'Resource Conflict';
  } else if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'Duplicate Entry';
  } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    message = 'Invalid Reference';
  }

  // Send error response
  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      details: details || err.message
    }
  });
};
```

#### Custom Error Classes
```javascript
class ValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

class NotFoundError extends Error {
  constructor(message = 'Resource Not Found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

class ConflictError extends Error {
  constructor(message = 'Resource Conflict') {
    super(message);
    this.name = 'ConflictError';
  }
}
```

### Usage Examples

#### Throwing Custom Errors
```javascript
// In route handlers
app.get('/users/:id', authenticateToken, async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    if (req.user.id !== parseInt(req.params.id) && !req.user.admin) {
      throw new ForbiddenError('Access denied');
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
});
```

#### Apply Error Handler
```javascript
// Apply after all routes
app.use(errorHandler);
```

## 🌐 CORS Middleware (`cors.js`)

### Purpose
Configures Cross-Origin Resource Sharing for the API.

### Implementation

#### CORS Configuration
```javascript
const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'https://tayandtos.com',
      'https://www.tayandtos.com'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'guest-token',
    'X-Requested-With'
  ],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400 // 24 hours
};

const corsMiddleware = cors(corsOptions);
```

### Usage Examples

#### Apply CORS
```javascript
// Apply to all routes
app.use(corsMiddleware);

// Or apply to specific routes
app.use('/api', corsMiddleware);
```

## ⚡ Rate Limiting Middleware (`rateLimit.js`)

### Purpose
Prevents abuse by limiting the number of requests from a single IP address.

### Implementation

#### Rate Limiting Configuration
```javascript
const rateLimit = require('express-rate-limit');

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(15 * 60 / 1000) // seconds
    });
  }
});

// Strict rate limiting for authentication
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.'
  },
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: Math.ceil(15 * 60 / 1000) // seconds
    });
  }
});

// Email rate limiting
const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 email requests per hour
  message: {
    error: 'Too many email requests, please try again later.'
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many email requests, please try again later.',
      retryAfter: Math.ceil(60 * 60 / 1000) // seconds
    });
  }
});
```

### Usage Examples

#### Apply Rate Limiters
```javascript
// Apply general rate limiting to all routes
app.use(generalLimiter);

// Apply strict rate limiting to authentication routes
app.use('/users/login', authLimiter);
app.use('/users/signup', authLimiter);

// Apply email rate limiting
app.use('/email', emailLimiter);
```

## 📝 Logging Middleware (`logging.js`)

### Purpose
Logs request and response information for monitoring and debugging.

### Implementation

#### Request Logging
```javascript
const morgan = require('morgan');

// Custom logging format
const logFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// Development logging
const devLogging = morgan(logFormat, {
  skip: (req, res) => res.statusCode < 400
});

// Production logging
const prodLogging = morgan('combined', {
  skip: (req, res) => res.statusCode < 400,
  stream: {
    write: (message) => {
      // Log to file or external service
      console.log(message.trim());
    }
  }
});

// Custom request logger
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user ? req.user.id : 'guest'
    };
    
    console.log('Request Log:', JSON.stringify(logData, null, 2));
  });
  
  next();
};
```

#### Response Logging
```javascript
const responseLogger = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    const responseData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      status: res.statusCode,
      responseSize: data ? data.length : 0,
      userId: req.user ? req.user.id : 'guest'
    };
    
    console.log('Response Log:', JSON.stringify(responseData, null, 2));
    
    originalSend.call(this, data);
  };
  
  next();
};
```

### Usage Examples

#### Apply Logging
```javascript
// Apply based on environment
if (process.env.NODE_ENV === 'development') {
  app.use(devLogging);
} else {
  app.use(prodLogging);
}

// Apply custom logging
app.use(requestLogger);
app.use(responseLogger);
```

## 🔒 Security Middleware

### Purpose
Adds security headers and protection against common attacks.

### Implementation

#### Security Headers
```javascript
const helmet = require('helmet');

const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});
```

#### XSS Protection
```javascript
const xssProtection = (req, res, next) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
};
```

### Usage Examples

#### Apply Security Middleware
```javascript
// Apply security headers
app.use(securityMiddleware);
app.use(xssProtection);
```

## 📊 Performance Middleware

### Purpose
Optimizes request processing and adds performance monitoring.

### Implementation

#### Request Timing
```javascript
const requestTimer = (req, res, next) => {
  req.startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    
    // Log slow requests
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.url} took ${duration}ms`);
    }
    
    // Add timing header
    res.setHeader('X-Response-Time', `${duration}ms`);
  });
  
  next();
};
```

#### Compression
```javascript
const compression = require('compression');

const compressionMiddleware = compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6,
  threshold: 1024
});
```

### Usage Examples

#### Apply Performance Middleware
```javascript
// Apply compression
app.use(compressionMiddleware);

// Apply request timing
app.use(requestTimer);
```

## 🧪 Testing Middleware

### Purpose
Provides testing utilities and mock middleware for development.

### Implementation

#### Mock Authentication
```javascript
const mockAuth = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    req.user = {
      id: 1,
      email: 'test@example.com',
      admin: true
    };
  }
  next();
};

const mockGuestAuth = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    req.guest = {
      id: 'guest_123',
      email: 'guest@example.com'
    };
  }
  next();
};
```

#### Test Database
```javascript
const testDatabase = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    // Use test database
    req.db = testDbConnection;
  }
  next();
};
```

### Usage Examples

#### Apply Test Middleware
```javascript
// Apply only in test environment
if (process.env.NODE_ENV === 'test') {
  app.use(mockAuth);
  app.use(mockGuestAuth);
  app.use(testDatabase);
}
```

## 📋 Middleware Order

### Recommended Order
```javascript
// 1. Security and CORS
app.use(helmet());
app.use(corsMiddleware);
app.use(xssProtection);

// 2. Compression and parsing
app.use(compressionMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Logging and monitoring
app.use(morgan('combined'));
app.use(requestLogger);
app.use(requestTimer);

// 4. Rate limiting
app.use(generalLimiter);

// 5. Routes
app.use('/users', userRoutes);
app.use('/bookings', bookingRoutes);
app.use('/email', emailRoutes);

// 6. Error handling (last)
app.use(errorHandler);
```

## 🚨 Common Issues & Solutions

### 1. **CORS Errors**
**Issue:** Frontend can't access API
**Solution:** Check CORS configuration and allowed origins

### 2. **Authentication Failures**
**Issue:** Valid tokens being rejected
**Solution:** Verify JWT secret and token format

### 3. **Rate Limiting Too Strict**
**Issue:** Legitimate users being blocked
**Solution:** Adjust rate limit thresholds and windows

### 4. **Validation Errors**
**Issue:** Valid data being rejected
**Solution:** Check validation rules and error messages

### 5. **Performance Issues**
**Issue:** Slow response times
**Solution:** Monitor middleware performance and optimize

## 📚 Related Documentation

- **Main Backend**: See `../README.md` for overall backend documentation
- **Routes**: See `../routes/README.md` for route definitions
- **Controllers**: See `../controllers/README.md` for business logic
- **Services**: See `../sevices/README.md` for external integrations

## 🔄 Middleware Lifecycle

### 1. **Request Processing**
- Security headers
- CORS validation
- Rate limiting check
- Request logging
- Body parsing

### 2. **Authentication**
- Token extraction
- JWT validation
- User role verification
- Guest token validation

### 3. **Validation**
- Input sanitization
- Data validation
- Business rule validation

### 4. **Route Handler**
- Business logic execution
- Database operations
- External service calls

### 5. **Response Processing**
- Response logging
- Performance timing
- Error handling
- Response formatting
