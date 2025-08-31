function generatePasswordResetEmailContent(user, resetToken, resetUrl) {
  const plainText = generateText(user, resetToken, resetUrl);
  const html = generateHtml(user, resetToken, resetUrl);
  
  return { plainText, html };
}

function generateText(user, resetToken, resetUrl) {
  return `Hello ${user.first_name},

You have requested to reset your password for your TayAndTos account.

To reset your password, please click on the following link:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you did not request this password reset, please ignore this email. Your password will remain unchanged.

If you have any questions or need assistance, please contact our support team.

Best regards,
The TayAndTos Team

---
This is an automated email. Please do not reply to this message.`;
}

function generateHtml(user, resetToken, resetUrl) {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Password Reset Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #333;
        }
        .message {
            font-size: 16px;
            margin-bottom: 30px;
            color: #555;
        }
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
        }
        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        .expiry-notice {
            background-color: #e3f2fd;
            border: 1px solid #bbdefb;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            color: #1976d2;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🔐 Password Reset</h1>
        </div>
        
        <div class="content">
            <div class="greeting">Hello ${user.first_name},</div>
            
            <div class="message">
                You have requested to reset your password for your TayAndTos account.
            </div>
            
            <div style="text-align: center;">
                <a href="${resetUrl}" class="reset-button">
                    Reset My Password
                </a>
            </div>
            
            <div class="expiry-notice">
                <strong>⏰ Important:</strong> This password reset link will expire in 1 hour for security reasons.
            </div>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you did not request this password reset, please ignore this email. Your password will remain unchanged.
            </div>
            
            <div style="margin-top: 30px;">
                <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            </div>
        </div>
        
        <div class="footer">
            <p>If you have any questions or need assistance, please contact our support team.</p>
            <p><strong>Best regards,<br>The TayAndTos Team</strong></p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #999;">
                This is an automated email. Please do not reply to this message.
            </p>
        </div>
    </div>
</body>
</html>`;
}

module.exports = {
  generatePasswordResetEmailContent
};
