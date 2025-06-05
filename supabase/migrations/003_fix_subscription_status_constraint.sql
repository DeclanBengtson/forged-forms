-- Fix subscription status constraint to include 'starter' plan
-- This fixes Issue #1: Database Schema Mismatch

-- Drop the existing constraint
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_subscription_status_check;

-- Add the updated constraint that includes 'starter'
ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_subscription_status_check 
CHECK (subscription_status IN ('free', 'starter', 'pro', 'enterprise'));

-- Add payment grace period field for failed payment handling (Issue #4)
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS payment_grace_period_end TIMESTAMP WITH TIME ZONE;

-- Create index for grace period queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_grace_period ON public.user_profiles(payment_grace_period_end);

-- Ensure any existing data is valid (this is safe since we're adding 'starter')
-- No data migration needed as we're expanding the allowed values 