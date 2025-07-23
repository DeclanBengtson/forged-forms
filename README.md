# ForgedForms

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
- 🚀 **Caching** - Vercel KV-powered caching for optimal performance

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 with PostCSS
- **Authentication**: Supabase Auth (Magic Links)
- **Database**: PostgreSQL via Supabase with Row Level Security
- **Cache Layer**: Vercel KV (powered by Upstash) for serverless-optimized performance
- **Email Service**: SendGrid with HTML templates
- **Payments**: Stripe for subscription management
- **Hosting**: Optimized for Vercel deployment with Edge Runtime

### Database Schema
- **User Profiles**: User management with subscription tracking
- **Projects**: Form organization and grouping
- **Forms**: Form configurations with user isolation
- **Submissions**: JSONB storage for flexible form data
- **RLS Policies**: Comprehensive security at database level

### Performance Features
- **⚡ Edge Runtime**: Sub-100ms response times globally
- **📦 Intelligent Caching**: 70-85% cache hit rate with Vercel KV
- **🛡️ Rate Limiting**: Consistent protection across serverless instances
- **🚀 Optimized Database**: Reduced query load with smart caching
- **📊 Real-time Monitoring**: Performance tracking and analytics

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
- Vercel account for deployment (recommended)

## 🚀 Complete Setup Guide

### 1. Clone and Install
```bash
git clone https://github.com/yourusername/forged-forms.git
cd forged-forms
npm install
```

### 2. Service Setup

#### A. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your project URL and keys
3. Enable Row Level Security (RLS) on all tables
4. Set up authentication providers (Email is enabled by default)

#### B. SendGrid Setup
1. Create account at [sendgrid.com](https://sendgrid.com)
2. Verify your sender email address
3. Create an API key with "Mail Send" permissions
4. Note your verified sender email

#### C. Stripe Setup (Optional)
1. Create account at [stripe.com](https://stripe.com)
2. Create products for each pricing tier:
   - Starter ($6/month)
   - Pro ($20/month)
   - Enterprise (custom pricing)
3. Note the price IDs for each product
4. Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhooks`
5. Configure webhook events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`

#### D. Vercel KV Setup (Production)
1. Add Vercel KV storage to your Vercel project
2. Environment variables are automatically provided
3. For local development, use Redis or in-memory fallback

### 3. Environment Setup
```bash
cp env.example .env.local
```

Configure your environment variables:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

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

# Vercel KV Configuration (Auto-provided in production)
KV_REST_API_URL=https://your-kv-instance.kv.vercel-storage.com
KV_REST_API_TOKEN=your-vercel-kv-token

# Google Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Database Setup

#### For Development (Fresh Start)
```bash
# Apply the development database setup
psql -d your_database < supabase/dev_database_setup.sql

# Optional: Add test data
psql -d your_database < supabase/dev_test_data.sql
```

#### For Production (Clean Reset)
```bash
# Apply the consolidated database schema
psql -d your_database < supabase/consolidated_reset.sql
```

#### Database Migration System
The project uses a migration system for schema updates:
- `supabase/migrations/` - Individual migration files
- `supabase/consolidated_reset.sql` - Complete schema for fresh installs
- `supabase/dev_database_setup.sql` - Development setup with test data

### 5. Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

### 6. Testing Your Setup

#### Test Email Configuration
```bash
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

#### Test Database Connection
```bash
curl http://localhost:3000/api/health
```

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
- `GET /api/forms/[id]/submissions` - Get form submissions
- `GET /api/forms/[id]/analytics` - Get form analytics

### Health Check
- `GET /api/health` - System health status

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

## 🔧 Development Workflow

### Available Scripts
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Development Best Practices

#### Database Changes
1. Create new migration file in `supabase/migrations/`
2. Test locally with `dev_database_setup.sql`
3. Update `consolidated_reset.sql` for production

#### Environment Variables
- Use `env.example` as template
- Never commit `.env.local` files
- Test all required variables with `npm run build`

#### Testing
- Test form submissions with various data types
- Verify email notifications work
- Check rate limiting behavior
- Test subscription flows

### Troubleshooting

#### Common Issues
1. **Database Connection**: Check Supabase credentials and RLS policies
2. **Email Not Working**: Verify SendGrid API key and sender email
3. **Stripe Webhooks**: Ensure webhook endpoint is accessible
4. **Rate Limiting**: Check Vercel KV configuration in production

#### Debug Mode
```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev

# Test specific components
curl http://localhost:3000/api/health
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   │   ├── auth/       # Authentication endpoints
│   │   ├── dashboard/  # Dashboard API
│   │   ├── forms/      # Form management API
│   │   ├── stripe/     # Payment processing
│   │   └── user/       # User management
│   ├── dashboard/      # Dashboard pages
│   ├── auth/           # Authentication pages
│   └── pricing/        # Pricing page
├── components/         # Reusable components
│   ├── dashboard/      # Dashboard components
│   ├── analytics/      # Analytics components
│   └── templates/      # Form templates
├── lib/               # Utility libraries
│   ├── database/      # Database operations
│   ├── email/         # Email templates & sending
│   ├── stripe/        # Payment processing
│   ├── supabase/      # Supabase client configuration
│   ├── redis.ts       # Vercel KV caching
│   └── middleware/    # Rate limiting & security
├── types/             # TypeScript type definitions
└── utils/             # Utility functions

supabase/
├── migrations/        # Database migration files
├── consolidated_reset.sql  # Complete schema
├── dev_database_setup.sql  # Development setup
└── dev_test_data.sql      # Test data
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add Vercel KV storage to your project
3. Configure all environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Environment Variables for Production
Ensure all required variables are set in your deployment platform:
- Supabase credentials
- SendGrid API key
- Stripe keys and webhook secret
- Vercel KV credentials (auto-provided)
- Google Analytics ID (optional)

### Manual Deployment
```bash
npm run build
npm run start
```

## 📚 Additional Documentation

- [Analytics Setup](./docs/ANALYTICS_SETUP.md) - Google Analytics configuration
- [Database Schema](./supabase/consolidated_reset.sql) - Complete database schema
- [API Documentation](./src/app/api/) - Detailed API endpoints

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
