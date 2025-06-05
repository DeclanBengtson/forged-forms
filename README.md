# Form Service

A comprehensive form handling service that provides a modern alternative to Formspree, enabling developers to collect form submissions from any website without backend infrastructure. Built with Next.js 15, TypeScript, and Supabase.

## ✨ Features

- 🔐 **Secure Authentication** - Passwordless authentication via magic links (Supabase Auth)
- 📝 **Form Management** - Create and manage unlimited forms through an intuitive dashboard
- 🌐 **Universal Compatibility** - Public form submission endpoints compatible with any HTML/JavaScript framework
- 📧 **Email Notifications** - Professional email notifications via SendGrid with customizable templates
- 📊 **Submission Dashboard** - Beautiful, responsive dashboard to view and manage all form submissions
- 💳 **Subscription Management** - Integrated Stripe billing with multiple pricing tiers
- ⚡ **High Performance** - Built on Next.js 15 with App Router for optimal performance
- 🎨 **Modern UI** - Responsive design with Tailwind CSS and dark mode support
- 🔒 **Row Level Security** - Database-level security ensuring user data isolation
- 📈 **Analytics** - Form submission analytics and insights

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 with PostCSS
- **Authentication**: Supabase Auth (Magic Links)
- **Database**: PostgreSQL via Supabase with Row Level Security
- **Email Service**: SendGrid with HTML templates
- **Payments**: Stripe for subscription management
- **Hosting**: Optimized for Vercel deployment

### Database Schema
- **Forms Table**: Stores form configurations with user isolation
- **Submissions Table**: JSONB storage for flexible form data
- **User Management**: Integrated with Supabase Auth
- **RLS Policies**: Comprehensive security at database level

## 💰 Pricing Tiers

| Plan | Price | Submissions/Month | Forms | Features |
|------|-------|-------------------|-------|----------|
| **Free** | $0 | 250 | 3 | Basic notifications, Community support |
| **Starter** | $6/mo | 2,000 | Unlimited | Email support, Form analytics |
| **Pro** | $20/mo | 10,000 | Unlimited | Priority support, API access, Custom styling |
| **Enterprise** | Custom | Unlimited | Unlimited | Dedicated support, SLA, Team management |

## ⚙️ Prerequisites

- Node.js 18+ 
- PostgreSQL database (Supabase recommended)
- SendGrid account for email notifications
- Stripe account for payment processing (optional)

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/yourusername/form-service.git
cd form-service
npm install
```

### 2. Environment Setup
```bash
cp env.example .env.local
```

Configure your environment variables:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# SendGrid Configuration  
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email

# Stripe Configuration (Optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Stripe Price IDs
STRIPE_STARTER_PRICE_ID=price_your_starter_price_id
STRIPE_PRO_PRICE_ID=price_your_pro_price_id
STRIPE_ENTERPRISE_PRICE_ID=price_your_enterprise_price_id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup
Run the database migration:
```bash
# Apply the consolidated database schema
psql -d your_database < supabase/consolidated_reset.sql
```

### 4. Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 📖 API Reference

### Form Submission Endpoint
```
POST /api/forms/[form-id]/submit
```
**Note**: Form IDs are UUIDs (e.g., `550e8400-e29b-41d4-a716-446655440000`)

### Management API (Authenticated)
- `GET /api/forms` - List user's forms
- `POST /api/forms` - Create new form
- `GET /api/forms/[id]` - Get form details
- `PUT /api/forms/[id]` - Update form
- `DELETE /api/forms/[id]` - Delete form

### Email Testing
```bash
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## 🎯 Usage Example

### HTML Form Integration
```html
<form action="https://your-domain.com/api/forms/550e8400-e29b-41d4-a716-446655440000/submit" method="POST">
  <input name="name" placeholder="Your Name" required />
  <input name="email" type="email" placeholder="Email" required />
  <textarea name="message" placeholder="Message" required></textarea>
  <button type="submit">Send Message</button>
</form>
```

### JavaScript Integration
```javascript
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('email', 'john@example.com');
formData.append('message', 'Hello World!');

fetch('https://your-domain.com/api/forms/550e8400-e29b-41d4-a716-446655440000/submit', {
  method: 'POST',
  body: formData
});
```

**Pro Tip**: Copy the form URL directly from your dashboard - each form has a unique, secure UUID that prevents unauthorized access.

## 🔧 Development Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── dashboard/      # Dashboard pages
│   ├── auth/           # Authentication pages
│   └── pricing/        # Pricing page
├── components/         # Reusable components
├── lib/               # Utility libraries
│   ├── database/      # Database operations
│   ├── email/         # Email templates & sending
│   ├── stripe/        # Payment processing
│   └── supabase/      # Supabase client configuration
└── types/             # TypeScript type definitions
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run start
```

## 📚 Documentation

- [Email Notifications Setup](./docs/EMAIL_NOTIFICATIONS.md) - Complete SendGrid integration guide
- [Form Management Analysis](./docs/FORM_MANAGEMENT_ANALYSIS.md) - Detailed technical analysis

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- **Community Support**: GitHub Issues
- **Email Support**: Available for Starter+ plans
- **Priority Support**: Available for Pro+ plans

---

**Built with ❤️ for developers who need reliable form handling without the hassle.**
