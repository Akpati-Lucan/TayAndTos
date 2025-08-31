# Email Templates Documentation

This directory contains email templates for the TayAndTos backend system. These templates generate both HTML and plain text versions of emails for various system notifications.

## 🏗️ Template System Overview

The email template system provides:
- **Dynamic Content**: Personalized emails with user/booking data
- **Multi-format Support**: HTML and plain text versions
- **Consistent Branding**: Unified visual identity across all emails
- **Easy Maintenance**: Centralized template management
- **Development Support**: Preview functionality for testing

## 📁 Template Files

- **`booking_email.js`** - Booking confirmation email templates
- **`new_user_email.js`** - Welcome email templates for new users

## 📧 Booking Email Template (`booking_email.js`)

### Purpose
Generates confirmation emails for both user and guest bookings.

### Template Functions

#### `generateBookingEmailContent(booking, user)`
Creates email content for user booking confirmations.

**Parameters:**
- `booking` - Booking object with all booking details
- `user` - User object with user information

**Returns:**
```javascript
{
  subject: "Booking Confirmation - TayAndTos",
  text: "Plain text version of email",
  html: "HTML version of email"
}
```

#### `generateGuestBookingEmailContent(booking)`
Creates email content for guest booking confirmations.

**Parameters:**
- `booking` - Guest booking object with all details

**Returns:**
```javascript
{
  subject: "Guest Booking Confirmation - TayAndTos",
  text: "Plain text version of email",
  html: "HTML version of email"
}
```

### Template Variables

#### User Booking Variables
- `user.first_name` - User's first name
- `user.last_name` - User's last name
- `user.email` - User's email address
- `booking.room` - Room type (e.g., "master-bedroom")
- `booking.check_in_date` - Check-in date
- `booking.check_out_date` - Check-out date
- `booking.number_of_guests` - Number of guests
- `booking.confirmation_code` - Unique confirmation code
- `booking.status` - Booking status
- `booking.special_requests` - Special requests (if any)

#### Guest Booking Variables
- `booking.guest_first_name` - Guest's first name
- `booking.guest_last_name` - Guest's last name
- `booking.guest_email` - Guest's email address
- `booking.guest_phone_number` - Guest's phone number
- `booking.room` - Room type
- `booking.check_in_date` - Check-in date
- `booking.check_out_date` - Check-out date
- `booking.number_of_guests` - Number of guests
- `booking.confirmation_code` - Unique confirmation code
- `booking.status` - Booking status
- `booking.special_requests` - Special requests (if any)

### Email Content Structure

#### HTML Version
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Booking Confirmation</title>
</head>
<body>
    <div class="email-container">
        <header>
            <h1>TayAndTos</h1>
        </header>
        <main>
            <h2>Booking Confirmation</h2>
            <p>Dear [User Name],</p>
            <p>Your booking has been confirmed!</p>
            <!-- Booking details -->
            <div class="booking-details">
                <h3>Booking Information</h3>
                <p><strong>Room:</strong> [Room Type]</p>
                <p><strong>Check-in:</strong> [Check-in Date]</p>
                <p><strong>Check-out:</strong> [Check-out Date]</p>
                <p><strong>Guests:</strong> [Number of Guests]</p>
                <p><strong>Confirmation Code:</strong> [Code]</p>
            </div>
        </main>
        <footer>
            <p>Thank you for choosing TayAndTos!</p>
        </footer>
    </div>
</body>
</html>
```

#### Plain Text Version
```
TayAndTos - Booking Confirmation

Dear [User Name],

Your booking has been confirmed!

Booking Information:
- Room: [Room Type]
- Check-in: [Check-in Date]
- Check-out: [Check-out Date]
- Guests: [Number of Guests]
- Confirmation Code: [Code]

Thank you for choosing TayAndTos!
```

## 👋 New User Email Template (`new_user_email.js`)

### Purpose
Generates welcome emails for newly registered users.

### Template Functions

#### `generateNewUserEmailContent(user)`
Creates welcome email content for new users.

**Parameters:**
- `user` - User object with user information

**Returns:**
```javascript
{
  subject: "Welcome to TayAndTos!",
  text: "Plain text version of email",
  html: "HTML version of email"
}
```

### Template Variables

#### User Variables
- `user.first_name` - User's first name
- `user.last_name` - User's last name
- `user.email` - User's email address
- `user.phone_number` - User's phone number

### Email Content Structure

#### HTML Version
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to TayAndTos</title>
</head>
<body>
    <div class="email-container">
        <header>
            <h1>TayAndTos</h1>
        </header>
        <main>
            <h2>Welcome to TayAndTos!</h2>
            <p>Dear [User Name],</p>
            <p>Thank you for joining TayAndTos!</p>
            <p>We're excited to have you as part of our community.</p>
            <!-- Account information -->
            <div class="account-info">
                <h3>Your Account</h3>
                <p><strong>Email:</strong> [User Email]</p>
                <p><strong>Phone:</strong> [User Phone]</p>
            </div>
            <p>You can now book accommodations and manage your reservations.</p>
        </main>
        <footer>
            <p>Welcome aboard!</p>
        </footer>
    </div>
</body>
</html>
```

#### Plain Text Version
```
Welcome to TayAndTos!

Dear [User Name],

Thank you for joining TayAndTos!

We're excited to have you as part of our community.

Your Account:
- Email: [User Email]
- Phone: [User Phone]

You can now book accommodations and manage your reservations.

Welcome aboard!
```

## 🎨 Template Styling

### CSS Classes
The HTML templates use consistent CSS classes for styling:

```css
.email-container {
    max-width: 600px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    line-height: 1.6;
}

header {
    background-color: #1C1C1C;
    color: white;
    padding: 20px;
    text-align: center;
}

main {
    padding: 30px 20px;
    background-color: #ffffff;
}

.booking-details, .account-info {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
}

footer {
    background-color: #f8f9fa;
    padding: 20px;
    text-align: center;
    color: #666;
}
```

### Color Scheme
- **Primary**: #1C1C1C (Dark gray for headers)
- **Secondary**: #F15A29 (Orange for accents)
- **Background**: #ffffff (White for main content)
- **Light Background**: #f8f9fa (Light gray for sections)
- **Text**: #333333 (Dark gray for main text)
- **Muted Text**: #666666 (Gray for secondary text)

## 🔧 Template Development

### Creating New Templates

#### 1. **Template Structure**
```javascript
// new_template.js
function generateNewTemplateContent(data) {
    const subject = `Template Subject - TayAndTos`;
    
    const text = `
Plain text version of the email
with dynamic content: ${data.field}
    `.trim();
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Template Title</title>
</head>
<body>
    <div class="email-container">
        <header>
            <h1>TayAndTos</h1>
        </header>
        <main>
            <h2>Template Heading</h2>
            <p>Dynamic content: ${data.field}</p>
        </main>
        <footer>
            <p>Footer content</p>
        </footer>
    </div>
</body>
</html>
    `.trim();
    
    return { subject, text, html };
}

module.exports = { generateNewTemplateContent };
```

#### 2. **Template Integration**
```javascript
// In email_service.js
const { generateNewTemplateContent } = require('../templates/new_template');

async function sendNewTemplateEmail(data) {
    const emailContent = generateNewTemplateContent(data);
    // Send email logic
}
```

### Modifying Existing Templates

#### 1. **Content Updates**
- Modify the template functions
- Update HTML structure
- Adjust plain text formatting
- Test with preview endpoints

#### 2. **Styling Updates**
- Update CSS classes
- Modify color scheme
- Adjust layout and spacing
- Ensure responsive design

## 🧪 Template Testing

### Preview Endpoints
Test templates in the browser using preview endpoints:

```bash
# Preview booking email
GET /email/preview/booking

# Preview new user email
GET /email/preview/new-user
```

### Manual Testing
1. **Generate Sample Data**: Create realistic test data
2. **Render Templates**: Generate email content
3. **Check Formatting**: Verify HTML and text versions
4. **Test Variables**: Ensure all dynamic content works
5. **Validate HTML**: Check for valid HTML structure

### Automated Testing
```javascript
// Test template generation
test('generateBookingEmailContent creates valid email', () => {
    const testBooking = { /* test data */ };
    const testUser = { /* test data */ };
    
    const result = generateBookingEmailContent(testBooking, testUser);
    
    expect(result.subject).toBeDefined();
    expect(result.text).toBeDefined();
    expect(result.html).toBeDefined();
    expect(result.html).toContain(testUser.first_name);
});
```

## 📱 Responsive Design

### Mobile Considerations
- Use responsive CSS
- Test on various screen sizes
- Ensure readability on mobile devices
- Optimize for email clients

### Email Client Compatibility
- Test with major email clients
- Use inline CSS where necessary
- Avoid complex CSS features
- Ensure fallback styling

## 🔒 Security Considerations

### Content Sanitization
- Sanitize all dynamic content
- Prevent XSS attacks
- Validate template variables
- Escape HTML characters

### Data Privacy
- Don't include sensitive information
- Use minimal required data
- Implement data masking if needed
- Follow privacy regulations

## 📊 Template Performance

### Optimization Techniques
- Minimize template size
- Use efficient string concatenation
- Cache compiled templates
- Optimize HTML structure

### Monitoring
- Track template generation time
- Monitor email delivery rates
- Log template rendering errors
- Measure user engagement

## 🚨 Common Issues & Solutions

### 1. **Template Rendering Errors**
**Issue:** Template compilation failures
**Solution:** Validate template syntax and variable usage

### 2. **Email Formatting Issues**
**Issue:** Emails not displaying correctly
**Solution:** Test with multiple email clients and use inline CSS

### 3. **Dynamic Content Problems**
**Issue:** Variables not being populated
**Solution:** Verify data structure and template variable names

### 4. **Email Delivery Issues**
**Issue:** Emails not being delivered
**Solution:** Check SendGrid configuration and email content

## 📚 Related Documentation

- **Email Service**: See `../sevices/README.md` for email service documentation
- **Controllers**: See `../controllers/README.md` for email controller documentation
- **Configuration**: See `../config/README.md` for SendGrid configuration
- **Routes**: See `../routes/README.md` for email route documentation

## 🔄 Template Lifecycle

### 1. **Development**
- Create template structure
- Implement dynamic content
- Add styling and branding
- Test with sample data

### 2. **Testing**
- Preview in browser
- Test with real data
- Validate email clients
- Performance testing

### 3. **Deployment**
- Deploy to production
- Monitor email delivery
- Track user engagement
- Gather feedback

### 4. **Maintenance**
- Update content as needed
- Modify styling
- Add new features
- Performance optimization

## 📈 Analytics & Metrics

### 1. **Email Performance**
- Open rates
- Click-through rates
- Delivery rates
- Bounce rates

### 2. **Template Effectiveness**
- User engagement
- Conversion rates
- A/B testing results
- User feedback

### 3. **Technical Metrics**
- Template generation time
- Email size
- Delivery success rate
- Error rates
