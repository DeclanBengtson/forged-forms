# Phase 1 Setup Guide: Database Schema

This guide will help you set up the database schema for the Form Service MVP.

## 📋 Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Node.js 18+**: Make sure you have Node.js installed
3. **Git**: For version control

## 🗄️ Database Setup

### Step 1: Create Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in your project details:
   - Name: `form-service` (or your preferred name)
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
4. Wait for the project to be created (~2 minutes)

### Step 2: Run Database Migration

1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** to execute the migration

This will create:
- `forms` table with user authentication
- `submissions` table for form data
- Row Level Security (RLS) policies
- Database functions and triggers
- Proper indexes for performance

### Step 3: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **Anon Public Key** (under "Project API keys")

### Step 4: Configure Environment Variables

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## 🔑 Database Schema Overview

### Tables Created

#### `forms` table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `name` (VARCHAR) - Display name for the form
- `slug` (VARCHAR, UNIQUE) - URL-safe identifier for public endpoints
- `description` (TEXT) - Optional form description
- `email_notifications` (BOOLEAN) - Enable/disable email notifications
- `notification_email` (VARCHAR) - Email to send notifications to
- `is_active` (BOOLEAN) - Form active status
- `created_at`, `updated_at` (TIMESTAMP)

#### `submissions` table
- `id` (UUID, Primary Key)
- `form_id` (UUID, Foreign Key to forms)
- `data` (JSONB) - The actual form submission data
- `submitted_at` (TIMESTAMP) - When the form was submitted
- `ip_address` (INET) - Submitter's IP address
- `user_agent` (TEXT) - Submitter's browser info
- `referrer` (TEXT) - Where the submission came from

### Security Features

#### Row Level Security (RLS)
- **Forms**: Users can only access their own forms
- **Submissions**: Users can only view submissions for their own forms
- **Public Access**: Anonymous users can submit to active forms

#### Database Functions
- `get_form_by_slug()` - Safely retrieve form info for public submissions
- `update_updated_at_column()` - Automatically update timestamps

## 🧪 Testing the Setup

### Verify Database Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see `forms` and `submissions` tables
3. Check the **Authentication** → **Policies** tab to see RLS policies

### Test User Authentication

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`
3. Try signing up with your email
4. Check your email for the magic link
5. After signing in, you should reach the dashboard

## 🔧 Troubleshooting

### Common Issues

**RLS Policy Errors**
- Make sure you ran the full migration script
- Check that RLS is enabled on both tables

**Authentication Issues**
- Verify your Supabase URL and anon key are correct
- Check that your email is confirmed in Supabase Auth

**Connection Issues**
- Ensure your Supabase project is not paused
- Check your internet connection and firewall settings

### Verify Setup with SQL

Run this query in Supabase SQL Editor to verify everything is set up:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('forms', 'submissions');

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('forms', 'submissions');

-- Check if policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('forms', 'submissions');
```

Expected results:
- 2 tables: `forms` and `submissions`
- RLS enabled (`rowsecurity = true`) for both tables
- Multiple policies for each table

## ✅ What's Next

Once Phase 1 is complete, you're ready for:

- **Phase 2**: Form Management API routes
- **Phase 3**: Dashboard form creation UI
- **Phase 4**: Public form submission endpoints
- **Phase 5**: Email notifications

The database foundation is now solid and secure! 🎉 