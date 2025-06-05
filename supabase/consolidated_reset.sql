-- =====================================
-- FORM SERVICE DATABASE RESET SCRIPT
-- =====================================
-- This script consolidates all migrations into one complete database setup
-- Run this to completely reset and recreate your form service database

-- Clean up existing objects first
-- =====================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own forms" ON public.forms;
DROP POLICY IF EXISTS "Users can create their own forms" ON public.forms;
DROP POLICY IF EXISTS "Users can update their own forms" ON public.forms;
DROP POLICY IF EXISTS "Users can delete their own forms" ON public.forms;
DROP POLICY IF EXISTS "Users can view submissions for their forms" ON public.submissions;
DROP POLICY IF EXISTS "Anyone can submit to forms" ON public.submissions;
DROP POLICY IF EXISTS "Anyone can submit to active forms" ON public.submissions;
DROP POLICY IF EXISTS "Allow anonymous form submissions" ON public.submissions;
DROP POLICY IF EXISTS "Allow all form submissions" ON public.submissions;
DROP POLICY IF EXISTS "Users can delete submissions from their forms" ON public.submissions;

-- Drop triggers
DROP TRIGGER IF EXISTS update_forms_updated_at ON public.forms;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS get_form_by_slug(TEXT);
DROP FUNCTION IF EXISTS validate_form_submission(UUID);

-- Drop tables (CASCADE will handle foreign key constraints)
DROP TABLE IF EXISTS public.submissions CASCADE;
DROP TABLE IF EXISTS public.forms CASCADE;

-- Create tables
-- =====================================

-- Create forms table
CREATE TABLE public.forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  email_notifications BOOLEAN DEFAULT true,
  notification_email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure slug is URL-safe
  CONSTRAINT forms_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Create submissions table
CREATE TABLE public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT
);

-- Create indexes for better performance
-- =====================================
CREATE INDEX idx_forms_user_id ON public.forms(user_id);
CREATE INDEX idx_forms_slug ON public.forms(slug);
CREATE INDEX idx_submissions_form_id ON public.submissions(form_id);
CREATE INDEX idx_submissions_submitted_at ON public.submissions(submitted_at DESC);

-- Enable Row Level Security
-- =====================================
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create functions
-- =====================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to get form by slug (used for public submissions)
CREATE OR REPLACE FUNCTION get_form_by_slug(form_slug TEXT)
RETURNS TABLE (
  id UUID,
  name VARCHAR(255),
  is_active BOOLEAN,
  email_notifications BOOLEAN,
  notification_email VARCHAR(255),
  user_id UUID
) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT f.id, f.name, f.is_active, f.email_notifications, f.notification_email, f.user_id
  FROM public.forms f
  WHERE f.slug = form_slug AND f.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
-- =====================================

-- Trigger to automatically update updated_at on forms table
CREATE TRIGGER update_forms_updated_at 
  BEFORE UPDATE ON public.forms 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies
-- =====================================

-- Forms table policies
CREATE POLICY "Users can view their own forms" ON public.forms
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own forms" ON public.forms
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forms" ON public.forms
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forms" ON public.forms
  FOR DELETE USING (auth.uid() = user_id);

-- Submissions table policies
CREATE POLICY "Users can view submissions for their forms" ON public.submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.forms 
      WHERE forms.id = submissions.form_id 
      AND forms.user_id = auth.uid()
    )
  );

-- Simple submission policy (final state from your last migration)
-- Allow all submissions - application handles validation
CREATE POLICY "Allow all form submissions" ON public.submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete submissions from their forms" ON public.submissions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.forms 
      WHERE forms.id = submissions.form_id 
      AND forms.user_id = auth.uid()
    )
  );

-- Grant permissions
-- =====================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.forms TO authenticated;
GRANT ALL ON public.submissions TO authenticated;
GRANT SELECT ON public.forms TO anon;
GRANT INSERT ON public.submissions TO anon;
GRANT EXECUTE ON FUNCTION get_form_by_slug(TEXT) TO anon, authenticated;

-- =====================================
-- RESET COMPLETE
-- =====================================
-- Your form service database is now ready with:
-- ✓ Clean table structure
-- ✓ Proper indexes for performance
-- ✓ Row Level Security policies
-- ✓ Helper functions for form operations
-- ✓ Simple submission policy (application handles validation) 