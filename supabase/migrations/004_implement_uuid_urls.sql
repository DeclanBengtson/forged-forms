-- Migration: Remove slug column and use UUID id for form identification
-- This migration removes the slug field entirely and uses the natural id field (UUID) for form URLs

-- Step 1: Drop the unique constraint on slug
ALTER TABLE public.forms DROP CONSTRAINT IF EXISTS forms_slug_key;

-- Step 2: Drop the slug format constraint
ALTER TABLE public.forms DROP CONSTRAINT IF EXISTS forms_slug_format;

-- Step 3: Remove the slug column entirely
ALTER TABLE public.forms DROP COLUMN IF EXISTS slug;

-- Step 4: Drop the old index on slug
DROP INDEX IF EXISTS idx_forms_slug;

-- Step 5: Update the get_form_by_slug function to get_form_by_id and use id field
DROP FUNCTION IF EXISTS get_form_by_slug(TEXT);

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