-- Remove default value for email_notifications column
-- This ensures that user's explicit choice is preserved rather than being overridden by a database default

ALTER TABLE public.forms 
ALTER COLUMN email_notifications DROP DEFAULT;

-- Update the consolidated_reset.sql comment for future reference
-- Note: The consolidated_reset.sql should also be updated to remove "DEFAULT true" from email_notifications 