# Email Notifications with SendGrid

ForgedForms supports automatic email notifications when form submissions are received. This feature uses SendGrid to deliver professional, beautifully formatted emails to form owners.

## Features

- 🎨 **Beautiful HTML emails** with responsive design
- 📱 **Mobile-friendly** templates that look great on all devices
- 🔧 **Automatic formatting** of form data into readable emails
- 📊 **Submission metadata** including IP address, user agent, and referrer
- ⚡ **Reliable delivery** through SendGrid's robust infrastructure
- 🧪 **Test functionality** to verify your configuration

## Setup Instructions

### 1. Create a SendGrid Account

1. Sign up for a free SendGrid account at [sendgrid.com](https://sendgrid.com)
2. Verify your account through the email confirmation
3. Complete the account setup process

### 2. Create an API Key

1. Log into your SendGrid dashboard
2. Navigate to **Settings** > **API Keys**
3. Click **Create API Key**
4. Choose **Restricted Access** and give it a name like "ForgedForms"
5. Grant the following permissions:
   - **Mail Send**: Full Access
   - **Mail Settings**: Full Access (optional, for advanced features)
6. Copy the generated API key (you won't be able to see it again!)

### 3. Verify a Sender Email

1. In SendGrid dashboard, go to **Settings** > **Sender Authentication**
2. Choose **Single Sender Verification**
3. Add the email address you want to send notifications from
4. Verify the email through the confirmation link sent to that address

### 4. Configure Environment Variables

Add the following variables to your `.env.local` file:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

**Important**: 
- Replace `your_sendgrid_api_key_here` with your actual API key
- Replace `noreply@yourdomain.com` with your verified sender email
- Keep your API key secure and never commit it to version control

## How to Use

### 1. Enable Email Notifications for a Form

When creating or editing a form in the dashboard:

1. Check the **"Enable email notifications"** checkbox
2. Enter your notification email address
3. Save the form

### 2. Test Your Configuration

You can test your SendGrid setup using the API:

```bash
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com"}'
```

Or use this JavaScript snippet:

```javascript
fetch('/api/email/test', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'your-email@example.com'
  })
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Test email sent successfully!');
  } else {
    console.error('Failed to send test email:', data.error);
  }
});
```

### 3. Form Submission Flow

When a form is submitted:

1. **Form validation** - Data is validated and processed
2. **Database storage** - Submission is saved to the database
3. **Email notification** - If enabled, an email is sent to the form owner
4. **Response** - Success response is returned to the user

The email notification process is **non-blocking**, meaning form submissions will still work even if email delivery fails.

## Email Template Preview

### What the Form Owner Receives

```
Subject: New submission for "Contact Form"
From: ForgedForms <noreply@yourdomain.com>

You have received a new form submission for "Contact Form".

Submission Details:
==================

Name: John Doe
Email: john.doe@example.com
Phone: +1 (555) 123-4567
Company: Acme Corporation
Message: Hello! I'm interested in learning more about your services...

Submission Info:
===============
Submitted at: December 15, 2024 at 2:30 PM PST
Form: Contact Form (contact-form)
IP Address: 192.168.1.1
Referrer: https://example.com/contact

---
This email was sent by ForgedForms because you have email notifications 
enabled for this form.
```

The HTML version includes beautiful styling with:
- Professional ForgedForms branding
- Responsive design for mobile devices
- Clean formatting with proper spacing
- Color-coded sections for easy reading
- Clickable links where appropriate

## Advanced Configuration

### Custom From Name

You can customize the sender name by modifying the email service:

```typescript
// In src/lib/email/sendgrid.ts
const msg = {
  from: {
    email: fromEmail,
    name: 'Your Company Name' // Customize this
  },
  // ... rest of the configuration
}
```

### Email Validation

The system automatically validates email addresses using regex:
- Checks for proper format (user@domain.com)
- Prevents empty or malformed addresses
- Provides clear error messages

### Error Handling

Email delivery errors are handled gracefully:
- Form submissions continue to work if email fails
- Errors are logged for debugging
- No user-facing errors for email delivery issues

## API Reference

### Test Email Endpoint

**POST** `/api/email/test`

Send a test email to verify SendGrid configuration.

**Request Body:**
```json
{
  "email": "test@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Test email sent successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to send test email. Check your SendGrid configuration."
}
```

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify the API key is correct and not truncated
   - Check that the key has Mail Send permissions
   - Ensure the key is set in the correct environment file

2. **Sender Email Not Verified**
   - Check SendGrid dashboard for verification status
   - Look for verification emails in spam folder
   - Ensure the FROM_EMAIL matches your verified sender

3. **Emails Not Being Received**
   - Check spam/junk folders
   - Verify the notification email address is correct
   - Test the configuration using the test endpoint

4. **Form Notifications Not Enabled**
   - Ensure `email_notifications` is set to `true` for the form
   - Verify `notification_email` is set and valid
   - Check that environment variables are loaded correctly

### Debug Mode

To debug email issues, check the server logs for:
- SendGrid API responses
- Email validation errors
- Configuration warnings

Example log messages:
```
Email notification sent successfully for form: contact-form
SendGrid not configured. Skipping email notification.
Failed to send email notification: Invalid API key
```

## Security Considerations

- **Never expose API keys** in client-side code
- Use environment variables for all sensitive configuration
- Regularly rotate your SendGrid API keys
- Monitor SendGrid usage for unusual activity
- Use HTTPS for all email-related API calls

## Pricing

SendGrid offers:
- **Free tier**: 100 emails/day forever
- **Paid plans**: Starting at $14.95/month for 40,000 emails
- **Pay-as-you-go**: $0.0006 per email after free tier

For most ForgedForms users, the free tier should be sufficient for moderate form submission volumes.

## Support

If you encounter issues with email notifications:

1. Check this documentation first
2. Verify your SendGrid configuration
3. Test using the provided endpoints  
4. Check server logs for error messages
5. Contact support with specific error details

---

**Next Steps**: After setting up email notifications, consider configuring [webhooks](./WEBHOOKS.md) for real-time integrations or exploring [advanced form validation](./VALIDATION.md) options. 