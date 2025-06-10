-- Add projects functionality
-- Create projects table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add project_id to forms table (only if it doesn't exist)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'forms' AND column_name = 'project_id') THEN
        ALTER TABLE public.forms 
        ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_name ON public.projects(user_id, name);
CREATE INDEX IF NOT EXISTS idx_forms_project_id ON public.forms(project_id);

-- Enable RLS on projects table (only if not already enabled)
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE c.relname = 'projects' AND n.nspname = 'public' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- RLS Policies for projects table (create only if they don't exist)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Users can view their own projects') THEN
        CREATE POLICY "Users can view their own projects" ON public.projects
          FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Users can create their own projects') THEN
        CREATE POLICY "Users can create their own projects" ON public.projects
          FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Users can update their own projects') THEN
        CREATE POLICY "Users can update their own projects" ON public.projects
          FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Users can delete their own projects') THEN
        CREATE POLICY "Users can delete their own projects" ON public.projects
          FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Trigger to automatically update updated_at on projects table (create only if it doesn't exist)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_projects_updated_at') THEN
        CREATE TRIGGER update_projects_updated_at 
          BEFORE UPDATE ON public.projects 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Grant necessary permissions
GRANT ALL ON public.projects TO authenticated;

-- Function to get projects with form counts (create or replace to ensure it exists)
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

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_projects_with_form_counts(UUID) TO authenticated;

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

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION ensure_default_project(UUID) TO authenticated;

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

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION migrate_existing_forms_to_default_project() TO authenticated;

-- Run the migration for existing users
SELECT migrate_existing_forms_to_default_project(); 