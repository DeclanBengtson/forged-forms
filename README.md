# Form Service

A lightweight Formspree alternative that allows users to create forms, receive submissions, and manage them through a web dashboard — all without writing backend code.

## ✨ Features

- 🔐 **Secure Authentication** - User authentication via email magic links (Supabase Auth)
- 📝 **Form Management** - Create and manage forms through an intuitive web interface
- 🌐 **Universal Compatibility** - Public form submission endpoints (HTML/JS compatible)
- 📧 **Email Notifications** - Automatic email notifications on form submission via SendGrid
- 📊 **Submission Dashboard** - Beautiful dashboard to view and manage all submissions
- ⚡ **Lightning Fast** - Built on Next.js with optimized performance
- 🎨 **Beautiful Design** - Modern, responsive UI with Tailwind CSS

## 🧱 Tech Stack

- **Fullstack App**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Auth**: Supabase Auth (magic links)
- **Database**: PostgreSQL (via Supabase)
- **Email**: SendGrid with professional templates
- **Hosting**: Vercel (Frontend + API routes)

## 📧 Email Notifications

ForgedForms includes a comprehensive email notification system powered by SendGrid:

- **Beautiful HTML Templates** - Professional, responsive email designs
- **Automatic Formatting** - Form data is automatically formatted for readability
- **Rich Metadata** - Includes submission details, IP addresses, and referrer info
- **Test Functionality** - Built-in testing to verify your configuration
- **Error Handling** - Graceful handling ensures form submissions work even if email fails

For detailed setup instructions, see our [Email Notifications Guide](./docs/EMAIL_NOTIFICATIONS.md).

## ⚙️ Prerequisites (Local Dev)

- Node.js 18+
- PostgreSQL 
- SendGrid account (free tier available)

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/form-service.git
   cd form-service
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your configuration:
   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # SendGrid Configuration  
   SENDGRID_API_KEY=your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=your_verified_sender_email

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Test email notifications** (optional):
   ```bash
   curl -X POST http://localhost:3000/api/email/test \
     -H "Content-Type: application/json" \
     -d '{"email": "your-email@example.com"}'
   ```

## 📖 Documentation

- [Email Notifications Setup](./docs/EMAIL_NOTIFICATIONS.md) - Complete guide to SendGrid integration
- [API Reference](./docs/API.md) - Full API documentation
- [Deployment Guide](./docs/DEPLOYMENT.md) - Deploy to Vercel, Netlify, or other platforms

## 🎯 Usage Example

Once set up, using ForgedForms is incredibly simple:

```html
<form action="https://your-domain.com/api/forms/contact-form/submit" method="POST">
  <input name="name" placeholder="Your Name" required />
  <input name="email" type="email" placeholder="Email" required />
  <textarea name="message" placeholder="Message" required></textarea>
  <button type="submit">Send Message</button>
</form>
```

That's it! Form submissions will be:
- ✅ Stored in your database
- ✅ Available in your dashboard  
- ✅ Sent via email notification (if enabled)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

**Made with ❤️ by developers, for developers.**
