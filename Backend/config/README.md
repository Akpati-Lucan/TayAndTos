# Configuration Documentation

This directory contains configuration files for the TayAndTos backend system. These files manage environment-specific settings, external service configurations, and application parameters.

## 🏗️ Configuration Overview

The configuration system provides:
- **Environment Management**: Different settings for development, staging, and production
- **External Service Integration**: API keys, database connections, and third-party services
- **Security Management**: Sensitive configuration handling
- **Flexibility**: Easy configuration changes without code modifications
- **Centralization**: All configuration in one place

## 📁 Configuration Files

- **`sendgrid.js`** - SendGrid email service configuration

## 📧 SendGrid Configuration (`sendgrid.js`)

### Purpose
Configures the SendGrid email service for sending transactional emails.

### Configuration Details

#### API Key Setup
```javascript
const sgMail = require('@sendgrid/mail');

// Set API key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

#### Email Configuration
```javascript
// Default sender email
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@tayandtos.com';

// Email service configuration
const emailConfig = {
  apiKey: process.env.SENDGRID_API_KEY,
  fromEmail: FROM_EMAIL,
  replyTo: process.env.REPLY_TO_EMAIL || 'support@tayandtos.com'
};
```

### Environment Variables

#### Required Variables
```env
# SendGrid API Key (required)
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Sender Email Address (required)
FROM_EMAIL=noreply@tayandtos.com
```

#### Optional Variables
```env
# Reply-to Email Address
REPLY_TO_EMAIL=support@tayandtos.com

# Email Service Timeout (in milliseconds)
EMAIL_TIMEOUT=10000

# Maximum Retry Attempts
EMAIL_MAX_RETRIES=3
```

## 🔧 Environment Configuration

### Development Environment
Create a `.env` file in the Backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tayandtos
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_development_jwt_secret_key
JWT_EXPIRES_IN=24h

# Email Configuration
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@tayandtos.com
REPLY_TO_EMAIL=support@tayandtos.com

# Server Configuration
PORT=8080
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

### Production Environment
```env
# Database Configuration
DB_HOST=production_db_host
DB_USER=production_user
DB_PASSWORD=production_password
DB_NAME=tayandtos_prod
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_production_jwt_secret_key
JWT_EXPIRES_IN=24h

# Email Configuration
SENDGRID_API_KEY=your_production_sendgrid_api_key
FROM_EMAIL=noreply@tayandtos.com
REPLY_TO_EMAIL=support@tayandtos.com

# Server Configuration
PORT=8080
NODE_ENV=production

# CORS Configuration
CORS_ORIGIN=https://tayandtos.com

# Logging
LOG_LEVEL=error

# Security
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX_REQUESTS=100
```

### Staging Environment
```env
# Database Configuration
DB_HOST=staging_db_host
DB_USER=staging_user
DB_PASSWORD=staging_password
DB_NAME=tayandtos_staging
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_staging_jwt_secret_key
JWT_EXPIRES_IN=24h

# Email Configuration
SENDGRID_API_KEY=your_staging_sendgrid_api_key
FROM_EMAIL=noreply@tayandtos.com
REPLY_TO_EMAIL=support@tayandtos.com

# Server Configuration
PORT=8080
NODE_ENV=staging

# CORS Configuration
CORS_ORIGIN=https://staging.tayandtos.com

# Logging
LOG_LEVEL=info
```

## 🔐 Security Configuration

### JWT Configuration
```javascript
// JWT settings
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  algorithm: 'HS256'
};

// Guest JWT settings (longer expiration)
const guestJwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '7d',
  algorithm: 'HS256'
};
```

### Database Security
```javascript
// Database connection with SSL (production)
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000
};
```

### CORS Configuration
```javascript
// CORS settings
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

## 📊 Database Configuration

### Connection Pooling
```javascript
// MySQL connection pool configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  charset: 'utf8mb4'
});
```

### Environment-Specific Settings
```javascript
// Development settings
if (process.env.NODE_ENV === 'development') {
  pool.config.connectionLimit = 5;
  pool.config.debug = true;
}

// Production settings
if (process.env.NODE_ENV === 'production') {
  pool.config.connectionLimit = 20;
  pool.config.ssl = { rejectUnauthorized: false };
}
```

## 📧 Email Service Configuration

### SendGrid Setup
```javascript
// SendGrid configuration
const sendGridConfig = {
  apiKey: process.env.SENDGRID_API_KEY,
  fromEmail: process.env.FROM_EMAIL,
  replyTo: process.env.REPLY_TO_EMAIL,
  timeout: parseInt(process.env.EMAIL_TIMEOUT) || 10000,
  maxRetries: parseInt(process.env.EMAIL_MAX_RETRIES) || 3
};
```

### Email Templates
```javascript
// Email template configuration
const emailTemplateConfig = {
  baseUrl: process.env.BASE_URL || 'http://localhost:8080',
  companyName: 'TayAndTos',
  supportEmail: process.env.SUPPORT_EMAIL || 'support@tayandtos.com',
  logoUrl: process.env.LOGO_URL || 'https://tayandtos.com/logo.png'
};
```

## 🚀 Server Configuration

### Express Server Settings
```javascript
// Server configuration
const serverConfig = {
  port: process.env.PORT || 8080,
  host: process.env.HOST || '0.0.0.0',
  environment: process.env.NODE_ENV || 'development'
};
```

### Middleware Configuration
```javascript
// Rate limiting configuration
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: 'Too many requests from this IP'
};

// Body parser configuration
const bodyParserConfig = {
  limit: '10mb',
  extended: true
};
```

## 🔍 Configuration Validation

### Environment Variable Validation
```javascript
// Validate required environment variables
function validateEnvironment() {
  const required = [
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'JWT_SECRET',
    'SENDGRID_API_KEY'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
```

### Configuration Health Check
```javascript
// Configuration health check
function checkConfiguration() {
  const config = {
    database: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    },
    email: {
      service: 'SendGrid',
      fromEmail: process.env.FROM_EMAIL
    },
    security: {
      jwtSecret: process.env.JWT_SECRET ? 'Configured' : 'Missing',
      environment: process.env.NODE_ENV
    }
  };

  return config;
}
```

## 🧪 Testing Configuration

### Test Environment
```env
# Test environment variables
NODE_ENV=test
DB_NAME=tayandtos_test
JWT_SECRET=test_jwt_secret
SENDGRID_API_KEY=test_api_key
FROM_EMAIL=test@tayandtos.com
```

### Configuration Testing
```javascript
// Test configuration loading
describe('Configuration', () => {
  test('loads database configuration', () => {
    expect(process.env.DB_HOST).toBeDefined();
    expect(process.env.DB_NAME).toBeDefined();
  });

  test('loads email configuration', () => {
    expect(process.env.SENDGRID_API_KEY).toBeDefined();
    expect(process.env.FROM_EMAIL).toBeDefined();
  });
});
```

## 📝 Configuration Management

### Adding New Configuration

#### 1. **Environment Variable**
```env
# Add to .env file
NEW_SERVICE_API_KEY=your_api_key
NEW_SERVICE_URL=https://api.service.com
```

#### 2. **Configuration File**
```javascript
// config/new_service.js
const newServiceConfig = {
  apiKey: process.env.NEW_SERVICE_API_KEY,
  baseUrl: process.env.NEW_SERVICE_URL,
  timeout: parseInt(process.env.NEW_SERVICE_TIMEOUT) || 5000
};

module.exports = newServiceConfig;
```

#### 3. **Usage in Application**
```javascript
// In your service file
const newServiceConfig = require('../config/new_service');

async function callNewService() {
  const response = await fetch(newServiceConfig.baseUrl, {
    headers: {
      'Authorization': `Bearer ${newServiceConfig.apiKey}`
    },
    timeout: newServiceConfig.timeout
  });
  return response.json();
}
```

### Configuration Updates

#### 1. **Environment Changes**
- Update `.env` file
- Restart application
- Test configuration

#### 2. **Code Changes**
- Modify configuration files
- Update validation logic
- Test configuration loading

#### 3. **Deployment Updates**
- Update production environment variables
- Verify configuration in production
- Monitor application health

## 🔒 Security Best Practices

### Environment Variables
- Never commit `.env` files to version control
- Use strong, unique secrets for each environment
- Rotate secrets regularly
- Use different secrets for different environments

### API Keys
- Store API keys securely
- Use environment variables for sensitive data
- Implement key rotation
- Monitor API key usage

### Database Security
- Use strong passwords
- Implement connection encryption (SSL)
- Limit database access
- Regular security updates

## 📊 Monitoring & Logging

### Configuration Monitoring
```javascript
// Log configuration on startup
console.log('Environment:', process.env.NODE_ENV);
console.log('Database Host:', process.env.DB_HOST);
console.log('Email Service:', process.env.SENDGRID_API_KEY ? 'Configured' : 'Missing');
```

### Health Checks
```javascript
// Configuration health check endpoint
app.get('/config/health', (req, res) => {
  const config = checkConfiguration();
  res.json({
    status: 'healthy',
    configuration: config,
    timestamp: new Date().toISOString()
  });
});
```

## 🚨 Common Issues & Solutions

### 1. **Missing Environment Variables**
**Issue:** Application fails to start due to missing variables
**Solution:** Check `.env` file and validate all required variables

### 2. **Invalid API Keys**
**Issue:** External service calls fail
**Solution:** Verify API keys and service configuration

### 3. **Database Connection Issues**
**Issue:** Database connection failures
**Solution:** Check database credentials and network connectivity

### 4. **Configuration Loading Errors**
**Issue:** Configuration not loading properly
**Solution:** Validate configuration file syntax and environment setup

## 📚 Related Documentation

- **Main Backend**: See `../README.md` for overall backend documentation
- **Email Service**: See `../sevices/README.md` for email service configuration
- **Database**: See `../README.md` for database configuration details
- **Environment Setup**: See `../EMAIL_SETUP.md` for email service setup

## 🔄 Configuration Lifecycle

### 1. **Development**
- Set up local environment
- Configure development services
- Test configuration locally

### 2. **Testing**
- Validate configuration
- Test all services
- Verify security settings

### 3. **Staging**
- Deploy to staging environment
- Test configuration in staging
- Validate external service integration

### 4. **Production**
- Deploy to production
- Monitor configuration health
- Regular security audits

### 5. **Maintenance**
- Update configuration as needed
- Rotate secrets and keys
- Monitor configuration health
- Backup configuration data
