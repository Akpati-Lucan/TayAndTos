# Controllers Documentation

This directory contains the controller layer of the TayAndTos backend system. Controllers handle the business logic and coordinate between routes and services.

## 🏗️ Architecture Role

Controllers act as the **business logic layer** between routes and services:

```
Routes → Controllers → Services → Database
```

### Responsibilities
- **Request Validation**: Validate incoming request data
- **Business Logic**: Implement application-specific rules
- **Service Coordination**: Orchestrate multiple service calls
- **Response Formatting**: Structure API responses consistently
- **Error Handling**: Catch and format errors appropriately

## 📁 Controller Files

- **`email_controller.js`** - Email service business logic

## 📧 Email Controller (`email_controller.js`)

### Overview
The email controller manages all email-related operations including sending confirmation emails, welcome emails, and providing email previews for development.

### Methods

#### 1. `sendBookingConfirmationEmail(req, res)`
Sends booking confirmation emails to users after successful booking creation.

**Parameters:**
- `req.body.booking_id` - ID of the booking
- `req.body.user_id` - ID of the user

**Business Logic:**
- Validates booking and user existence
- Generates email content using templates
- Sends email via SendGrid service
- Handles email sending errors gracefully

**Response:**
```json
{
  "success": true,
  "message": "Booking confirmation email sent successfully"
}
```

#### 2. `sendNewUserConfirmationEmail(req, res)`
Sends welcome emails to newly registered users.

**Parameters:**
- `req.body.user_id` - ID of the new user

**Business Logic:**
- Validates user existence and email verification status
- Generates welcome email content
- Sends email via SendGrid service
- Updates user email verification status

**Response:**
```json
{
  "success": true,
  "message": "Welcome email sent successfully"
}
```

#### 3. `sendGuestBookingConfirmation(req, res)`
Sends confirmation emails for guest bookings.

**Parameters:**
- `req.body.booking_id` - ID of the guest booking

**Business Logic:**
- Validates guest booking existence
- Generates guest-specific email content
- Sends email via SendGrid service
- Handles guest booking email logic

**Response:**
```json
{
  "success": true,
  "message": "Guest booking confirmation email sent successfully"
}
```

#### 4. `previewBookingEmail(req, res)`
Provides HTML preview of booking confirmation emails for development.

**Business Logic:**
- Generates sample booking data
- Renders email template with sample data
- Returns HTML preview in browser

**Response:** HTML email preview

#### 5. `previewNewUserEmail(req, res)`
Provides HTML preview of welcome emails for development.

**Business Logic:**
- Generates sample user data
- Renders welcome email template
- Returns HTML preview in browser

**Response:** HTML email preview

#### 6. `testEmailConnection(req, res)`
Tests SendGrid email service connectivity.

**Business Logic:**
- Attempts to send a test email
- Validates SendGrid configuration
- Returns connection status

**Response:**
```json
{
  "success": true,
  "message": "Email service connection test successful"
}
```

## 🔧 Controller Design Patterns

### 1. **Service Layer Pattern**
Controllers delegate actual work to service functions:

```javascript
// Controller calls service
const result = await sendBookingConfirmationEmail(booking, user);

// Service handles the actual email sending
async function sendBookingConfirmationEmail(booking, user) {
  // Email sending logic here
}
```

### 2. **Error Handling Pattern**
Consistent error handling across all controllers:

```javascript
try {
  // Business logic here
  const result = await someService();
  res.json({
    success: true,
    message: "Operation successful",
    data: result
  });
} catch (error) {
  console.error('Controller error:', error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: error.message
  });
}
```

### 3. **Validation Pattern**
Input validation before processing:

```javascript
// Validate required fields
if (!req.body.booking_id || !req.body.user_id) {
  return res.status(400).json({
    success: false,
    message: "Missing required fields: booking_id and user_id"
  });
}
```

### 4. **Response Standardization**
Consistent response format:

```javascript
// Success response
res.json({
  success: true,
  message: "Operation completed successfully",
  data: result // Optional
});

// Error response
res.status(errorCode).json({
  success: false,
  message: "Error description",
  error: error.message // Optional
});
```

## 📊 Data Flow

### Email Sending Flow
```
1. Route receives request
2. Controller validates input
3. Controller calls email service
4. Service generates email content
5. Service sends via SendGrid
6. Controller formats response
7. Route sends response to client
```

### Email Preview Flow
```
1. Route receives preview request
2. Controller generates sample data
3. Controller calls template service
4. Template renders with sample data
5. Controller returns HTML response
6. Browser displays email preview
```

## 🔒 Security Considerations

### Input Validation
- All request parameters are validated
- SQL injection prevention through parameterized queries
- XSS protection in email content generation

### Authentication
- JWT token validation for protected endpoints
- User permission checks for admin operations
- Guest token validation for guest booking operations

### Error Handling
- Sensitive information is not exposed in error messages
- Detailed errors are logged server-side only
- Client receives generic error messages

## 🧪 Testing Controllers

### Unit Testing
Test individual controller methods with mock services:

```javascript
// Mock the email service
jest.mock('../services/email_service');

// Test controller method
test('sendBookingConfirmationEmail sends email successfully', async () => {
  // Test implementation
});
```

### Integration Testing
Test controller with real services:

```javascript
// Test full email flow
test('complete email sending flow', async () => {
  // Test with real database and email service
});
```

### Manual Testing
Use the email preview endpoints for manual testing:

```bash
# Test booking email preview
curl http://localhost:8080/email/preview/booking

# Test new user email preview
curl http://localhost:8080/email/preview/new-user
```

## 📝 Adding New Controllers

### 1. **Create Controller File**
```javascript
// new_controller.js
const express = require('express');
const router = express.Router();

// Controller methods
const someMethod = async (req, res) => {
  try {
    // Business logic here
    res.json({ success: true, message: "Success" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { someMethod };
```

### 2. **Follow Naming Conventions**
- Use descriptive method names
- Follow camelCase naming
- Include error handling
- Add input validation

### 3. **Implement Error Handling**
```javascript
try {
  // Business logic
} catch (error) {
  console.error('Controller error:', error);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
}
```

### 4. **Add Documentation**
- Document all methods
- Include parameter descriptions
- Document response formats
- Add usage examples

## 🔧 Development Best Practices

### 1. **Single Responsibility**
Each controller method should handle one specific operation.

### 2. **Error Logging**
Always log errors for debugging:
```javascript
console.error('Controller error:', error);
```

### 3. **Input Validation**
Validate all inputs before processing:
```javascript
if (!req.body.requiredField) {
  return res.status(400).json({
    success: false,
    message: "Missing required field"
  });
}
```

### 4. **Async/Await**
Use async/await for asynchronous operations:
```javascript
const result = await someService();
```

### 5. **Response Consistency**
Maintain consistent response format across all controllers.

## 📊 Performance Considerations

### 1. **Database Queries**
- Minimize database calls in controllers
- Use service layer for data operations
- Implement caching where appropriate

### 2. **Error Handling**
- Fail fast for validation errors
- Implement proper error boundaries
- Use appropriate HTTP status codes

### 3. **Memory Management**
- Avoid storing large objects in memory
- Use streams for large data processing
- Implement proper cleanup

## 🚨 Common Issues & Solutions

### 1. **Email Sending Failures**
**Issue:** SendGrid API errors
**Solution:** Implement retry logic and fallback mechanisms

### 2. **Template Rendering Errors**
**Issue:** Email template compilation failures
**Solution:** Validate templates and add error boundaries

### 3. **Validation Errors**
**Issue:** Invalid input data
**Solution:** Comprehensive input validation and clear error messages

### 4. **Service Layer Errors**
**Issue:** Service function failures
**Solution:** Proper error propagation and logging

## 📚 Related Documentation

- **Routes**: See `../routes/README.md` for API endpoint documentation
- **Services**: See `../sevices/README.md` for service layer documentation
- **Templates**: See `../templates/README.md` for email template documentation
- **Database**: See `../README.md` for database schema information
