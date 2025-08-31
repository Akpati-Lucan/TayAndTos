# Services Documentation

This directory contains the service layer of the TayAndTos backend system. Services handle the core business operations and provide a clean interface between controllers and external systems.

## 🏗️ Architecture Role

Services act as the **core business logic layer** that handles:

```
Controllers → Services → External Systems (Database, Email, etc.)
```

### Responsibilities
- **Business Logic**: Implement core application functionality
- **External Integration**: Handle database operations, email sending, etc.
- **Data Processing**: Transform and validate data
- **Error Handling**: Provide consistent error handling for external operations
- **Reusability**: Share business logic across multiple controllers

## 📁 Service Files

- **`email_service.js`** - Email sending and template management

## 📧 Email Service (`email_service.js`)

### Overview
The email service manages all email-related operations including sending emails via SendGrid, generating email content from templates, and handling email delivery.

### Core Functions

#### 1. `sendBookingConfirmationEmail(booking, user)`
Sends booking confirmation emails to users.

**Parameters:**
- `booking` - Booking object with all booking details
- `user` - User object with user information

**Process:**
1. Generates email content using booking template
2. Sends email via SendGrid API
3. Handles delivery confirmation
4. Returns success/error status

**Returns:** Promise resolving to email delivery status

#### 2. `sendNewUserConfirmationEmail(user)`
Sends welcome emails to newly registered users.

**Parameters:**
- `user` - User object with user information

**Process:**
1. Generates welcome email content using user template
2. Sends email via SendGrid API
3. Handles delivery confirmation
4. Returns success/error status

**Returns:** Promise resolving to email delivery status

#### 3. `sendGuestBookingConfirmationEmail(booking)`
Sends confirmation emails for guest bookings.

**Parameters:**
- `booking` - Guest booking object with all details

**Process:**
1. Generates guest-specific email content
2. Sends email via SendGrid API
3. Handles delivery confirmation
4. Returns success/error status

**Returns:** Promise resolving to email delivery status

#### 4. `sendTestEmail()`
Sends a test email to verify SendGrid connectivity.

**Process:**
1. Generates test email content
2. Sends via SendGrid API
3. Validates connection status

**Returns:** Promise resolving to connection test result

### Email Template Integration

The service integrates with email templates to generate dynamic content:

```javascript
// Generate email content from template
const emailContent = await generateBookingEmailContent(booking, user);

// Send email with generated content
const result = await sendEmailViaSendGrid(emailContent);
```

### SendGrid Integration

#### Configuration
```javascript
// SendGrid configuration
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

#### Email Sending Process
```javascript
const msg = {
  to: recipientEmail,
  from: process.env.FROM_EMAIL,
  subject: emailSubject,
  text: plainTextContent,
  html: htmlContent
};

const result = await sgMail.send(msg);
```

#### Error Handling
```javascript
try {
  await sgMail.send(msg);
  return { success: true, message: "Email sent successfully" };
} catch (error) {
  console.error('SendGrid error:', error);
  return { success: false, error: error.message };
}
```

## 🔧 Service Design Patterns

### 1. **Single Responsibility Principle**
Each service handles one specific domain:

```javascript
// Email service only handles email operations
class EmailService {
  sendEmail() { /* email logic */ }
  generateTemplate() { /* template logic */ }
  validateEmail() { /* validation logic */ }
}
```

### 2. **Promise-Based Operations**
All external operations return promises:

```javascript
async function sendEmail(emailData) {
  try {
    const result = await sendGridAPI.send(emailData);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### 3. **Error Handling Pattern**
Consistent error handling across all services:

```javascript
try {
  // Service operation
  const result = await externalOperation();
  return { success: true, data: result };
} catch (error) {
  console.error('Service error:', error);
  return { success: false, error: error.message };
}
```

### 4. **Data Validation Pattern**
Validate data before processing:

```javascript
function validateEmailData(emailData) {
  if (!emailData.to || !emailData.subject) {
    throw new Error('Missing required email fields');
  }
  return true;
}
```

## 📊 Data Flow

### Email Sending Flow
```
1. Controller calls email service
2. Service validates input data
3. Service generates email content from template
4. Service sends email via SendGrid
5. Service handles response/errors
6. Service returns result to controller
7. Controller formats response for client
```

### Template Generation Flow
```
1. Service receives data (booking, user, etc.)
2. Service loads appropriate email template
3. Service populates template with data
4. Service generates HTML and plain text versions
5. Service returns formatted email content
```

## 🔒 Security Considerations

### Input Validation
- Validate all input parameters
- Sanitize email addresses
- Prevent email injection attacks
- Validate template data

### API Security
- Secure SendGrid API key storage
- Rate limiting for email sending
- Email content validation
- Spam prevention measures

### Error Handling
- Don't expose sensitive information in errors
- Log errors securely
- Implement proper error boundaries
- Handle API failures gracefully

## 🧪 Testing Services

### Unit Testing
Test individual service functions:

```javascript
// Mock SendGrid
jest.mock('@sendgrid/mail');

// Test email service
test('sendEmail sends email successfully', async () => {
  const result = await emailService.sendEmail(testData);
  expect(result.success).toBe(true);
});
```

### Integration Testing
Test with real external services:

```javascript
// Test with real SendGrid (use test API key)
test('real SendGrid integration', async () => {
  const result = await emailService.sendTestEmail();
  expect(result.success).toBe(true);
});
```

### Mock Testing
Test without external dependencies:

```javascript
// Mock external dependencies
const mockSendGrid = {
  send: jest.fn().mockResolvedValue({ success: true })
};

// Test service with mock
test('service works with mock', async () => {
  const result = await emailService.sendEmail(testData, mockSendGrid);
  expect(result.success).toBe(true);
});
```

## 📝 Adding New Services

### 1. **Create Service File**
```javascript
// new_service.js
class NewService {
  async someMethod(data) {
    try {
      // Business logic here
      const result = await externalOperation(data);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new NewService();
```

### 2. **Follow Service Patterns**
- Use async/await for external operations
- Implement consistent error handling
- Return standardized response objects
- Include comprehensive logging

### 3. **Add Error Handling**
```javascript
try {
  // Service operation
  const result = await externalOperation();
  return { success: true, data: result };
} catch (error) {
  console.error('Service error:', error);
  return { success: false, error: error.message };
}
```

### 4. **Include Validation**
```javascript
function validateInput(data) {
  if (!data.requiredField) {
    throw new Error('Missing required field');
  }
  return true;
}
```

## 🔧 Development Best Practices

### 1. **Error Logging**
Always log errors for debugging:
```javascript
console.error('Service error:', error);
```

### 2. **Input Validation**
Validate all inputs before processing:
```javascript
if (!data.requiredField) {
  throw new Error('Missing required field');
}
```

### 3. **Async Operations**
Use async/await for external operations:
```javascript
const result = await externalAPI.call();
```

### 4. **Response Consistency**
Maintain consistent response format:
```javascript
return { success: true, data: result };
// or
return { success: false, error: error.message };
```

### 5. **Documentation**
Document all service methods and their parameters.

## 📊 Performance Considerations

### 1. **External API Calls**
- Implement timeout handling
- Use connection pooling where possible
- Implement retry logic for failed calls
- Cache responses when appropriate

### 2. **Memory Management**
- Avoid storing large objects in memory
- Use streams for large data processing
- Implement proper cleanup
- Monitor memory usage

### 3. **Error Handling**
- Fail fast for validation errors
- Implement proper error boundaries
- Use appropriate error types
- Handle partial failures gracefully

## 🚨 Common Issues & Solutions

### 1. **SendGrid API Errors**
**Issue:** API key invalid or rate limit exceeded
**Solution:** Validate API key and implement rate limiting

### 2. **Template Rendering Errors**
**Issue:** Template compilation failures
**Solution:** Validate templates and add error boundaries

### 3. **Email Delivery Failures**
**Issue:** Emails not being delivered
**Solution:** Check SendGrid configuration and implement delivery tracking

### 4. **Service Timeout Errors**
**Issue:** External API calls timing out
**Solution:** Implement timeout handling and retry logic

## 📚 Related Documentation

- **Controllers**: See `../controllers/README.md` for controller documentation
- **Templates**: See `../templates/README.md` for email template documentation
- **Configuration**: See `../config/README.md` for service configuration
- **Database**: See `../README.md` for database operations

## 🔄 Service Lifecycle

### 1. **Initialization**
- Load configuration
- Initialize external connections
- Validate service dependencies

### 2. **Operation**
- Receive requests from controllers
- Process business logic
- Interact with external systems
- Return results

### 3. **Cleanup**
- Close external connections
- Clean up resources
- Log service statistics

## 📈 Monitoring & Metrics

### 1. **Performance Metrics**
- Response times
- Success/failure rates
- Error counts
- Resource usage

### 2. **Health Checks**
- External service connectivity
- Service availability
- Error rate monitoring
- Performance degradation detection

### 3. **Logging**
- Operation logs
- Error logs
- Performance logs
- Audit logs
