-- Fix RLS policy for form submissions
-- This migration allows anonymous users to submit to active forms while maintaining security

-- Drop the existing submission policy that's causing issues
DROP POLICY IF EXISTS "Anyone can submit to forms" ON public.submissions;

-- Create a new policy that allows anonymous users to insert submissions
-- This policy uses a SECURITY DEFINER function to bypass RLS when checking form existence
CREATE POLICY "Anyone can submit to active forms" ON public.submissions
  FOR INSERT 
  WITH CHECK (
    -- Use the existing SECURITY DEFINER function to validate the form
    EXISTS (
      SELECT 1 
      FROM get_form_by_slug((
        SELECT slug 
        FROM public.forms 
        WHERE id = submissions.form_id
      ))
      WHERE is_active = true
    )
  );

-- Alternative approach: Create a simpler policy using a new SECURITY DEFINER function
-- Drop the previous policy first
DROP POLICY IF EXISTS "Anyone can submit to active forms" ON public.submissions;

-- Create a SECURITY DEFINER function to validate form submissions
CREATE OR REPLACE FUNCTION validate_form_submission(form_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.forms 
    WHERE id = form_id 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql;

-- Create a new policy using the SECURITY DEFINER function
CREATE POLICY "Anyone can submit to active forms" ON public.submissions
  FOR INSERT 
  WITH CHECK (validate_form_submission(form_id));

-- Grant execute permission on the function to anonymous users
GRANT EXECUTE ON FUNCTION validate_form_submission(UUID) TO anon, authenticated; 