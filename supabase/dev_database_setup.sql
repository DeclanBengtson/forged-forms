-- =====================================
-- FORGED FORMS - DEV DATABASE SETUP SCRIPT
-- =====================================
-- Complete database setup script for development environment
-- This script creates all tables, functions, policies, and indexes from scratch
-- Version: Consolidated from all migrations as of 2024

-- Step 1: Clean up any existing objects safely
-- =====================================

-- Drop functions first (they might reference tables)
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS get_form_by_slug(TEXT) CASCADE;
DROP FUNCTION IF EXISTS get_form_by_id(UUID) CASCADE;
DROP FUNCTION IF EXISTS validate_form_submission(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_projects_with_form_counts(UUID) CASCADE;
DROP FUNCTION IF EXISTS ensure_default_project(UUID) CASCADE;
DROP FUNCTION IF EXISTS migrate_existing_forms_to_default_project() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Drop tables completely (CASCADE handles all dependencies)
DROP TABLE IF EXISTS public.submissions CASCADE;
DROP TABLE IF EXISTS public.forms CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Step 2: Create tables from scratch
-- =====================================

-- User profiles table with subscription management
CREATE TABLE public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  subscription_status VARCHAR(50) DEFAULT 'free' CHECK (subscription_status IN ('free', 'starter', 'pro', 'enterprise')),
  subscription_id VARCHAR(255), -- Stripe subscription ID
  customer_id VARCHAR(255), -- Stripe customer ID
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  trial_end TIMESTAMP WITH TIME ZONE,
  payment_grace_period_end TIMESTAMP WITH TIME ZONE, -- For failed payment handling
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forms table (UUID-based, with project relationship)
CREATE TABLE public.forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  email_notifications BOOLEAN, -- No default per migration 006
  notification_email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissions table
CREATE TABLE public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT
);

-- Step 3: Add foreign key constraints to auth.users (if it exists)
-- =====================================
DO $$
BEGIN
  -- Add foreign key constraints only if auth.users table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'auth' AND table_name = 'users'
  ) THEN
    ALTER TABLE public.user_profiles 
    ADD CONSTRAINT user_profiles_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    
    ALTER TABLE public.projects 
    ADD CONSTRAINT projects_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    
    ALTER TABLE public.forms 
    ADD CONSTRAINT forms_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    
    RAISE NOTICE 'Foreign key constraints to auth.users added successfully';
  ELSE
    RAISE NOTICE 'auth.users table not found - skipping foreign key constraints';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Could not add foreign key constraints: %', SQLERRM;
END $$;

-- Step 4: Create indexes for better performance
-- =====================================
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_subscription_status ON public.user_profiles(subscription_status);
CREATE INDEX idx_user_profiles_customer_id ON public.user_profiles(customer_id);
CREATE INDEX idx_user_profiles_grace_period ON public.user_profiles(payment_grace_period_end);

CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_name ON public.projects(user_id, name);

CREATE INDEX idx_forms_user_id ON public.forms(user_id);
CREATE INDEX idx_forms_project_id ON public.forms(project_id);

CREATE INDEX idx_submissions_form_id ON public.submissions(form_id);
CREATE INDEX idx_submissions_submitted_at ON public.submissions(submitted_at DESC);

-- Step 5: Enable Row Level Security
-- =====================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Step 6: Create functions
-- =====================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to get form by id (used for public submissions)
CREATE OR REPLACE FUNCTION get_form_by_id(form_id UUID)
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
  WHERE f.id = form_id AND f.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Function to get projects with form counts
CREATE OR REPLACE FUNCTION get_projects_with_form_counts(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  name VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  form_count BIGINT
) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.created_at,
    p.updated_at,
    COUNT(f.id) as form_count
  FROM public.projects p
  LEFT JOIN public.forms f ON p.id = f.project_id AND f.user_id = user_uuid
  WHERE p.user_id = user_uuid
  GROUP BY p.id, p.name, p.description, p.created_at, p.updated_at
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to ensure user has a default project
CREATE OR REPLACE FUNCTION ensure_default_project(user_uuid UUID)
RETURNS UUID
SECURITY DEFINER
AS $$
DECLARE
  default_project_id UUID;
BEGIN
  -- Check if user already has any projects
  SELECT id INTO default_project_id
  FROM public.projects 
  WHERE user_id = user_uuid 
  LIMIT 1;
  
  -- If no projects exist, create a default one
  IF default_project_id IS NULL THEN
    INSERT INTO public.projects (user_id, name, description)
    VALUES (user_uuid, 'My Forms', 'Default project for organizing your forms')
    RETURNING id INTO default_project_id;
  END IF;
  
  RETURN default_project_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create default project for existing users with forms but no projects
CREATE OR REPLACE FUNCTION migrate_existing_forms_to_default_project()
RETURNS void
SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
  default_project_id UUID;
BEGIN
  -- Find users who have forms but no projects
  FOR user_record IN 
    SELECT DISTINCT f.user_id
    FROM public.forms f
    LEFT JOIN public.projects p ON p.user_id = f.user_id
    WHERE p.id IS NULL AND f.project_id IS NULL
  LOOP
    -- Create default project for this user
    SELECT ensure_default_project(user_record.user_id) INTO default_project_id;
    
    -- Assign all their orphaned forms to the default project
    UPDATE public.forms 
    SET project_id = default_project_id 
    WHERE user_id = user_record.user_id AND project_id IS NULL;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user creation (creates user profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create triggers
-- =====================================

-- Triggers to automatically update updated_at timestamps
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON public.user_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forms_updated_at 
  BEFORE UPDATE ON public.forms 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON public.projects 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to create user profile on auth user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 8: Create Row Level Security Policies
-- =====================================

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Projects table policies
CREATE POLICY "Users can view their own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

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

-- Allow all submissions - application handles validation (from migration 003_simple_submission_rls)
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

-- Step 9: Grant permissions
-- =====================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.projects TO authenticated;
GRANT ALL ON public.forms TO authenticated;
GRANT ALL ON public.submissions TO authenticated;

-- Grant specific permissions for anonymous users (for form submissions)
GRANT SELECT ON public.forms TO anon;
GRANT INSERT ON public.submissions TO anon;

-- Grant function execution permissions
GRANT EXECUTE ON FUNCTION update_updated_at_column() TO authenticated;
GRANT EXECUTE ON FUNCTION get_form_by_id(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_projects_with_form_counts(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION ensure_default_project(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION migrate_existing_forms_to_default_project() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;

-- Step 10: Final success message
-- =====================================
DO $$
BEGIN
  RAISE NOTICE '=====================================';
  RAISE NOTICE 'FORGED FORMS DEV DATABASE SETUP COMPLETE';
  RAISE NOTICE '=====================================';
  RAISE NOTICE 'Successfully created:';
  RAISE NOTICE '✓ 4 tables (user_profiles, projects, forms, submissions)';
  RAISE NOTICE '✓ 10 indexes for performance';
  RAISE NOTICE '✓ Row Level Security policies';
  RAISE NOTICE '✓ 6 helper functions';
  RAISE NOTICE '✓ 4 triggers for automatic operations';
  RAISE NOTICE '✓ Proper permissions for anon and authenticated users';
  RAISE NOTICE '✓ All migration changes consolidated';
  RAISE NOTICE '=====================================';
  RAISE NOTICE 'Database ready for development!';
  RAISE NOTICE '=====================================';
END $$;