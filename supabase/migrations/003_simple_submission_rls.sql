-- Simple fix for form submission RLS
-- Allow anonymous users to submit to any form, let application handle ALL validation

-- Drop any existing submission policies
DROP POLICY IF EXISTS "Anyone can submit to forms" ON public.submissions;
DROP POLICY IF EXISTS "Anyone can submit to active forms" ON public.submissions;
DROP POLICY IF EXISTS "Allow anonymous form submissions" ON public.submissions;

-- Drop the complex validation function if it exists
DROP FUNCTION IF EXISTS validate_form_submission(UUID);

-- Create the simplest possible policy: allow all submissions
-- The application layer already handles:
-- 1. Checking if form exists (getFormBySlug)
-- 2. Checking if form is active (form.is_active)
-- 3. All other validation
CREATE POLICY "Allow all form submissions" ON public.submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true); 