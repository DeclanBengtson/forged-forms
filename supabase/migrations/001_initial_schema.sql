-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

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
CREATE INDEX idx_forms_user_id ON public.forms(user_id);
CREATE INDEX idx_forms_slug ON public.forms(slug);
CREATE INDEX idx_submissions_form_id ON public.submissions(form_id);
CREATE INDEX idx_submissions_submitted_at ON public.submissions(submitted_at DESC);

-- Enable RLS on tables
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for forms table
-- Users can only see their own forms
CREATE POLICY "Users can view their own forms" ON public.forms
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only create forms for themselves
CREATE POLICY "Users can create their own forms" ON public.forms
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own forms
CREATE POLICY "Users can update their own forms" ON public.forms
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own forms
CREATE POLICY "Users can delete their own forms" ON public.forms
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for submissions table
-- Users can view submissions for their own forms
CREATE POLICY "Users can view submissions for their forms" ON public.submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.forms 
      WHERE forms.id = submissions.form_id 
      AND forms.user_id = auth.uid()
    )
  );

-- Anyone can insert submissions (for public form submissions)
CREATE POLICY "Anyone can submit to forms" ON public.submissions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.forms 
      WHERE forms.id = submissions.form_id 
      AND forms.is_active = true
    )
  );

-- Users can delete submissions from their own forms
CREATE POLICY "Users can delete submissions from their forms" ON public.submissions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.forms 
      WHERE forms.id = submissions.form_id 
      AND forms.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at on forms table
CREATE TRIGGER update_forms_updated_at 
  BEFORE UPDATE ON public.forms 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.forms TO authenticated;
GRANT ALL ON public.submissions TO authenticated;
GRANT SELECT ON public.forms TO anon;
GRANT INSERT ON public.submissions TO anon; 