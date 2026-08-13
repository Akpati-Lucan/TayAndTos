# Email Setup Guide for TayAndTos

## Overview
This guide explains how to set up email notifications using SendGrid for booking confirmations.

## Prerequisites
1. SendGrid account (free tier available)
2. Verified sender email address
3. API key from SendGrid

## Environment Variables

Create a `.env` file in your Backend directory with these variables:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=your_actual_sendgrid_api_key_here
FROM_EMAIL=your_verified_sender_email@domain.com

# Other required variables
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=tayandtos_db
JWT_SECRET=your_jwt_secret_key_here
PORT=8080
```

## SendGrid Setup Steps

### 1. Create SendGrid Account
- Go to [sendgrid.com](https://sendgrid.com)
- Sign up for a free account
- Verify your email address

### 2. Verify Sender Identity
- In SendGrid dashboard, go to Settings > Sender Authentication
- Verify your domain or at least your sender email
- This is required to send emails

### 3. Generate API Key
- Go to Settings > API Keys
- Create a new API key with "Mail Send" permissions
- Copy the API key (it starts with "SG.")

### 4. Update Environment Variables
```bash
# Set your API key
export SENDGRID_API_KEY="SG.your_actual_key_here"
export FROM_EMAIL="your_verified_email@domain.com"

# Or add to your .env file
echo "SENDGRID_API_KEY=SG.your_actual_key_here" >> .env
echo "FROM_EMAIL=your_verified_email@domain.com" >> .env
```

## Testing the Email System

### 1. Test Endpoint
```bash
# Test email sending (requires authentication)
POST /email/test
```

### 2. Manual Email Sending
```bash
# Send booking confirmation email
POST /email/send-booking-confirmation
Body: {
  "booking": {
    "confirmation_code": "ABC123",
    "room": "Master Bedroom",
    "check_in_date": "2024-01-15",
    "check_out_date": "2024-01-17",
    "number_of_guests": 2,
    "status": "confirmed",
    "special_requests": "Early check-in"
  },
  "user": {
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

## Automatic Email Sending

The system now automatically sends confirmation emails when:

1. **User creates a booking** (`POST /bookings`)
2. **Guest creates a booking** (`POST /guest_bookings`)

## Email Templates

The system generates both:
- **Plain text version** - For email clients that don't support HTML
- **HTML version** - Professional-looking email with styling

## Troubleshooting

### Common Issues:

1. **"Unauthorized" error**
   - Check your SendGrid API key
   - Ensure the key has "Mail Send" permissions

2. **"From address not verified" error**
   - Verify your sender email in SendGrid
   - Use a verified domain or email address

3. **Emails not sending**
   - Check console logs for error messages
   - Verify environment variables are loaded
   - Check SendGrid dashboard for delivery status

### Debug Steps:
```bash
# Check if environment variables are loaded
echo $SENDGRID_API_KEY
echo $FROM_EMAIL

# Test SendGrid connection
node -e "
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log('SendGrid configured with key:', process.env.SENDGRID_API_KEY ? 'Present' : 'Missing');
"
```

## Security Notes

- **Never commit API keys to version control**
- **Use environment variables for all sensitive data**
- **Regularly rotate your API keys**
- **Monitor SendGrid usage and delivery rates**

## Support

If you encounter issues:
1. Check SendGrid dashboard for delivery status
2. Review server console logs for error messages
3. Verify all environment variables are set correctly
4. Test with the `/email/test` endpoint first 