# Google Analytics Setup Guide

This guide explains how to set up Google Analytics 4 (GA4) tracking for ForgedForms.

## Quick Setup

1. **Create GA4 Property**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new GA4 property for your website
   - Copy your Measurement ID (format: `G-XXXXXXXXXX`)

2. **Add Environment Variable**
   ```bash
   # Add to your .env.local file
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-YOUR_MEASUREMENT_ID_HERE
   ```

3. **Deploy**
   - The analytics code is already integrated
   - Deploy your changes to production
   - Analytics will start tracking automatically

## What's Being Tracked

### Page Views
- Automatic page tracking for all routes
- Custom page titles and URLs

### User Events
- **Sign Up**: When users create accounts
- **Login**: When users authenticate
- **Dashboard Views**: When users access the dashboard
- **Form Creation**: When users create new forms
- **Pricing Page Views**: When users view pricing
- **Subscription Events**: Checkout attempts and conversions

### Custom Events
- Form submissions (with form names)
- Button clicks on key CTAs
- Subscription management actions

## Event Details

### Authentication Events
```javascript
analytics.signup('email')     // User registration
analytics.login('email')      // User login
```

### Engagement Events
```javascript
analytics.viewDashboard()           // Dashboard access
analytics.viewPricing()             // Pricing page view
analytics.createForm(formName)      // Form creation
analytics.formSubmit(formName, id)  // Form submission
```

### E-commerce Events
```javascript
analytics.subscribe(plan, value)    // Subscription purchase
analytics.event('begin_checkout')   // Checkout initiation
```

## Development Mode

- Analytics is **disabled** in development by default
- To test in development, add: `NEXT_PUBLIC_GA_DEBUG=true`
- Check browser console for debug logs

## Privacy & Compliance

- No personal data is sent to Google Analytics
- User emails and form content are not tracked
- Only aggregate usage patterns and events
- GDPR compliant with proper cookie consent (implement separately if needed)

## Verifying Setup

1. **Real-time Reports**: Check GA4 Real-time reports after deployment
2. **Debug View**: Use GA4 DebugView with Chrome extension
3. **Console Logs**: Enable debug mode to see events in console

## Custom Analytics

To track additional events, use the analytics helper:

```javascript
import { analytics } from '@/components/analytics/GoogleAnalytics'

// Track custom events
analytics.event('custom_action', {
  category: 'engagement',
  label: 'button_name',
  value: 1
})

// Track button clicks
analytics.clickButton('Get Started', 'hero_section')
```

## Advanced Configuration

### Enhanced E-commerce
For detailed subscription tracking, events include:
- Item names (subscription plans)
- Values (subscription amounts)
- Currency (USD)

### Custom Parameters
All events support custom parameters for detailed analysis:
```javascript
analytics.event('form_submit', {
  form_id: 'uuid',
  form_name: 'Contact Form',
  user_plan: 'pro'
})
```

## Troubleshooting

### Common Issues
1. **No data in GA4**: Check measurement ID and deployment
2. **Events not firing**: Enable debug mode and check console
3. **CSP errors**: Ensure Google Analytics domains are allowed

### Debug Mode
```bash
# Add to .env.local for testing
NEXT_PUBLIC_GA_DEBUG=true
```

### Required Domains in CSP
The following domains are already configured in `next.config.ts`:
- `https://www.googletagmanager.com`
- `https://www.google-analytics.com`
- `https://analytics.google.com`

## Analytics Dashboard

Key metrics to monitor in GA4:
- **User Acquisition**: How users find your site
- **Engagement**: Page views, session duration
- **Conversions**: Sign-ups, subscriptions
- **Form Performance**: Creation and submission rates
- **Revenue**: Subscription revenue tracking 