# API Routes Documentation

This directory contains all the API route definitions for the TayAndTos backend system. Each route file handles specific functionality and follows RESTful API principles.

## 📁 Route Files

- **`users.js`** - User authentication and management
- **`bookings.js`** - User booking operations
- **`guest_bookings.js`** - Guest booking operations
- **`email_routes.js`** - Email service endpoints

## 🔐 Authentication Routes (`/users`)

### User Registration
```http
POST /users/signup
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone_number": "+1234567890",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone_number": "+1234567890",
    "admin": false,
    "email_verified": false
  }
}
```

### User Login
```http
POST /users/login
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "admin": false
  }
}
```

### Forgot Password
```http
POST /users/forgot-password
```

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset instructions sent to your email"
}
```

### Reset Password
```http
POST /users/reset-password
```

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### Get User Profile
```http
GET /users/profile
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone_number": "+1234567890",
  "admin": false,
  "email_verified": true,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Update User Profile
```http
PUT /users/profile
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "phone_number": "+1987654321"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

### Resend Email Confirmation
```http
POST /users/resend-confirmation
```

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Confirmation email sent successfully"
}
```

## 📅 User Booking Routes (`/bookings`)

### Create New Booking
```http
POST /bookings
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "room": "master-bedroom",
  "check_in_date": "2024-02-01",
  "check_out_date": "2024-02-05",
  "number_of_guests": 2,
  "special_requests": "Early check-in if possible"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {
    "id": 1,
    "user_id": 1,
    "room": "master-bedroom",
    "check_in_date": "2024-02-01",
    "check_out_date": "2024-02-05",
    "number_of_guests": 2,
    "status": "pending",
    "confirmation_code": "ABC123",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get User Bookings
```http
GET /bookings
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "room": "master-bedroom",
    "check_in_date": "2024-02-01",
    "check_out_date": "2024-02-05",
    "number_of_guests": 2,
    "status": "confirmed",
    "confirmation_code": "ABC123",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### Update Booking
```http
PUT /bookings/:id
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "room": "mini-bedroom",
  "check_in_date": "2024-02-02",
  "check_out_date": "2024-02-06",
  "number_of_guests": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking updated successfully"
}
```

### Cancel Booking
```http
DELETE /bookings/:id
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

### Get All Bookings (Admin Only)
```http
GET /bookings/all
Authorization: Bearer <admin_jwt_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "user_name": "John Doe",
    "room": "master-bedroom",
    "check_in_date": "2024-02-01",
    "check_out_date": "2024-02-05",
    "number_of_guests": 2,
    "status": "confirmed",
    "confirmation_code": "ABC123",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

## 🏠 Guest Booking Routes (`/guest_bookings`)

### Create Guest Booking
```http
POST /guest_bookings
```

**Request Body:**
```json
{
  "guest_first_name": "Jane",
  "guest_last_name": "Smith",
  "guest_email": "jane.smith@example.com",
  "guest_phone_number": "+1234567890",
  "room": "childrens-bedroom",
  "check_in_date": "2024-02-01",
  "check_out_date": "2024-02-03",
  "number_of_guests": 1,
  "special_requests": "Extra pillows"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Guest booking created successfully",
  "booking": {
    "id": 1,
    "guest_first_name": "Jane",
    "guest_last_name": "Smith",
    "guest_email": "jane.smith@example.com",
    "room": "childrens-bedroom",
    "check_in_date": "2024-02-01",
    "check_out_date": "2024-02-03",
    "number_of_guests": 1,
    "status": "pending",
    "confirmation_code": "XYZ789",
    "guest_token": "guest_jwt_token_here",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Find Guest Booking
```http
GET /guest_bookings/:confirmation_code
```

**Response:**
```json
{
  "id": 1,
  "guest_first_name": "Jane",
  "guest_last_name": "Smith",
  "guest_email": "jane.smith@example.com",
  "guest_phone_number": "+1234567890",
  "room": "childrens-bedroom",
  "check_in_date": "2024-02-01",
  "check_out_date": "2024-02-03",
  "number_of_guests": 1,
  "status": "confirmed",
  "confirmation_code": "XYZ789",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Update Guest Booking
```http
PUT /guest_bookings/:id
Authorization: Bearer <guest_token>
```

**Request Body:**
```json
{
  "room": "mini-bedroom",
  "check_in_date": "2024-02-02",
  "check_out_date": "2024-02-04",
  "number_of_guests": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Guest booking updated successfully"
}
```

### Cancel Guest Booking
```http
DELETE /guest_bookings/:id
Authorization: Bearer <guest_token>
```

**Request Body:**
```json
{
  "confirmation_code": "XYZ789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Guest booking cancelled successfully"
}
```

## 📧 Email Routes (`/email`)

### Send Booking Confirmation Email
```http
POST /email/send-booking-confirmation
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "booking_id": 1,
  "user_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking confirmation email sent successfully"
}
```

### Send New User Confirmation Email
```http
POST /email/send-new-user-confirmation
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "user_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Welcome email sent successfully"
}
```

### Preview Booking Email (Development)
```http
GET /email/preview/booking
```

**Response:** HTML email preview in browser

### Preview New User Email (Development)
```http
GET /email/preview/new-user
```

**Response:** HTML email preview in browser

## 🔒 Authentication & Authorization

### JWT Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration
- **User tokens**: 24 hours
- **Guest tokens**: 7 days
- **Email tokens**: 1 hour

### Required Headers
```http
Content-Type: application/json
Authorization: Bearer <jwt_token>  # For protected routes
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }  // Optional data payload
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"  // Optional
}
```

## 🚨 Error Handling

### Common HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate data)
- **500**: Internal Server Error

### Validation Errors
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Email is required",
    "Password must be at least 8 characters"
  ]
}
```

## 🧪 Testing Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": "2h 30m 15s"
}
```

## 📝 Usage Examples

### cURL Examples

**User Registration:**
```bash
curl -X POST http://localhost:8080/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone_number": "+1234567890",
    "password": "SecurePass123!"
  }'
```

**Create Booking:**
```bash
curl -X POST http://localhost:8080/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "room": "master-bedroom",
    "check_in_date": "2024-02-01",
    "check_out_date": "2024-02-05",
    "number_of_guests": 2
  }'
```

**Find Guest Booking:**
```bash
curl -X GET http://localhost:8080/guest_bookings/ABC123
```

## 🔧 Development Notes

- All routes include comprehensive error handling
- Input validation is performed on all requests
- Database transactions ensure data consistency
- Email notifications are sent automatically for relevant actions
- Guest bookings use temporary JWT tokens for authentication
- Admin routes require elevated permissions
- Rate limiting is implemented for security
