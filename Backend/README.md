# TayAndTos Backend API

A comprehensive Node.js/Express.js backend API for the TayAndTos accommodation booking system. This backend provides user management, booking management, email services, and authentication for both registered users and guest users.

## 🏗️ Architecture Overview

The backend follows a modular architecture with clear separation of concerns:

```
Backend/
├── server.js              # Main application entry point
├── db.js                  # Database connection and configuration
├── package.json           # Dependencies and scripts
├── setup.sql              # Database schema and initial data
├── routes/                # API route definitions
├── controllers/           # Business logic handlers
├── sevices/              # Core service implementations
├── config/                # Configuration files
├── middleware/            # Custom middleware functions
├── templates/             # Email templates
├── utils/                 # Utility functions
└── EMAIL_SETUP.md         # Email service configuration guide
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- SendGrid API key (for email services)

### Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the Backend directory:
   ```env
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=tayandtos
   JWT_SECRET=your_jwt_secret_key
   SENDGRID_API_KEY=your_sendgrid_api_key
   PORT=8080
   ```

4. **Set up the database:**
   ```bash
   mysql -u your_username -p your_database_name < setup.sql
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

The server will start on `http://localhost:8080`

## 📚 API Documentation

### Base URL
```
http://localhost:8080
```

### Authentication
Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 🔐 Core Features

### 1. User Management
- **User Registration**: Create new user accounts with email verification
- **User Authentication**: Login/logout with JWT tokens
- **Password Management**: Forgot password and reset functionality
- **User Profiles**: View and update user information
- **Admin Management**: Admin users can manage all users

### 2. Booking Management
- **User Bookings**: Registered users can create and manage bookings
- **Guest Bookings**: Non-registered users can book with temporary tokens
- **Booking Status**: Track booking status (pending, confirmed, cancelled)
- **Admin Controls**: Admins can view, update, and delete all bookings

### 3. Email Services
- **Welcome Emails**: Automatic emails for new user registrations
- **Booking Confirmations**: Email confirmations for all bookings
- **Password Reset**: Secure password reset via email
- **Email Preview**: Development endpoint for testing email templates

### 4. Security Features
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for passwords
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against abuse
- **CORS Support**: Cross-origin resource sharing configuration

## 🗄️ Database Schema

The system uses MySQL with the following main tables:
- `users` - User account information
- `bookings` - User booking records
- `guest_bookings` - Guest booking records
- `email_tokens` - Email verification and reset tokens

## 📧 Email System

### SendGrid Integration
- Automated email sending for user actions
- HTML and plain text email templates
- Email preview functionality for development
- Configurable email templates

### Email Types
1. **Welcome Emails**: New user registration
2. **Booking Confirmations**: Successful booking notifications
3. **Password Reset**: Secure password recovery
4. **Email Verification**: Account activation

## 🔧 Development Features

### Email Preview
Access email previews in the browser for development:
```
GET /email/preview/booking
GET /email/preview/new-user
```

### Health Checks
Monitor API health and status:
```
GET /health
```

### Development Tools
- Hot reloading with nodemon
- Comprehensive error logging
- Request/response logging
- Environment-based configuration

## 🛠️ API Endpoints

### Authentication Routes (`/users`)
- `POST /users/signup` - User registration
- `POST /users/login` - User authentication
- `POST /users/forgot-password` - Password reset request
- `POST /users/reset-password` - Password reset
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile

### Booking Routes (`/bookings`)
- `POST /bookings` - Create new booking
- `GET /bookings` - Get user bookings (admin only)
- `PUT /bookings/:id` - Update booking
- `DELETE /bookings/:id` - Cancel booking

### Guest Booking Routes (`/guest_bookings`)
- `POST /guest_bookings` - Create guest booking
- `GET /guest_bookings/:confirmation_code` - Find guest booking
- `PUT /guest_bookings/:id` - Update guest booking
- `DELETE /guest_bookings/:id` - Cancel guest booking

### Email Routes (`/email`)
- `POST /email/send-booking-confirmation` - Send booking email
- `POST /email/send-new-user-confirmation` - Send welcome email
- `GET /email/preview/booking` - Preview booking email
- `GET /email/preview/new-user` - Preview welcome email

## 🔒 Security Considerations

- **JWT Tokens**: Secure authentication with configurable expiration
- **Password Security**: Bcrypt hashing with salt rounds
- **Input Sanitization**: Protection against SQL injection and XSS
- **Rate Limiting**: API abuse prevention
- **CORS Configuration**: Secure cross-origin requests
- **Environment Variables**: Sensitive data protection

## 📊 Performance Features

- **Database Connection Pooling**: Efficient database connections
- **Query Optimization**: Indexed database queries
- **Response Caching**: Strategic caching for static data
- **Async Operations**: Non-blocking I/O operations
- **Error Handling**: Graceful error responses

## 🧪 Testing

### Manual Testing
Use the provided `email-preview-test.html` file to test email functionality in the browser.

### API Testing
Test endpoints using tools like:
- Postman
- Insomnia
- cURL commands

## 🚀 Deployment

### Production Considerations
1. **Environment Variables**: Secure configuration management
2. **Database Security**: Production database credentials
3. **SSL/TLS**: HTTPS encryption
4. **Monitoring**: Application performance monitoring
5. **Backup**: Regular database backups
6. **Logging**: Production logging configuration

### Deployment Options
- **Traditional VPS**: Manual server setup
- **Cloud Platforms**: AWS, Google Cloud, Azure
- **Containerization**: Docker deployment
- **Serverless**: AWS Lambda, Vercel

## 📝 Contributing

1. Follow the existing code structure
2. Add comprehensive error handling
3. Include input validation
4. Update documentation for new features
5. Test thoroughly before submitting

## 📄 License

This project is proprietary software for TayAndTos accommodation services.

## 🆘 Support

For technical support or questions:
- Check the individual README files in each directory
- Review the API documentation
- Check server logs for error details
- Contact the development team

## 🔄 Version History

- **v1.0.0**: Initial backend implementation
- **v1.1.0**: Added email services and templates
- **v1.2.0**: Implemented guest booking system
- **v1.3.0**: Added admin management features
- **v1.4.0**: Modular architecture refactoring
