-- =====================================
-- CLEAR ALL DATA FROM ALL TABLES
-- =====================================
-- Use this script to reset all data for testing
-- WARNING: This will permanently delete ALL data!

-- Method 1: Delete in correct order (respects foreign keys)
-- =====================================

-- Delete submissions first (no foreign key dependencies)
DELETE FROM public.submissions;

-- Delete forms (depends on auth.users, but submissions are already gone)
DELETE FROM public.forms;

-- Delete user profiles (depends on auth.users)
DELETE FROM public.user_profiles;

-- Delete auth users last (this would cascade, but we already cleaned up)
DELETE FROM auth.users;

-- Reset auto-increment sequences (if any)
-- =====================================
-- Note: PostgreSQL uses UUIDs by default, so sequences aren't typically needed
-- But if you have any custom sequences, reset them here:
-- ALTER SEQUENCE IF EXISTS your_sequence_name RESTART WITH 1;

-- =====================================
-- Alternative Method 2: TRUNCATE CASCADE (faster, more thorough)
-- =====================================
-- Uncomment the lines below if you prefer to use TRUNCATE
-- This is faster and resets any sequences automatically

-- TRUNCATE TABLE auth.users CASCADE;
-- TRUNCATE TABLE public.user_profiles CASCADE;
-- TRUNCATE TABLE public.forms CASCADE;
-- TRUNCATE TABLE public.submissions CASCADE;

-- =====================================
-- Alternative Method 3: Individual TRUNCATE (safest)
-- =====================================
-- Uncomment these if you want to truncate tables individually

-- TRUNCATE TABLE public.submissions;
-- TRUNCATE TABLE public.forms;
-- TRUNCATE TABLE public.user_profiles;
-- TRUNCATE TABLE auth.users;

-- =====================================
-- Verification Queries
-- =====================================
-- Run these to verify all data is cleared:

SELECT 'auth.users' as table_name, COUNT(*) as record_count FROM auth.users
UNION ALL
SELECT 'user_profiles' as table_name, COUNT(*) as record_count FROM public.user_profiles
UNION ALL
SELECT 'forms' as table_name, COUNT(*) as record_count FROM public.forms
UNION ALL
SELECT 'submissions' as table_name, COUNT(*) as record_count FROM public.submissions;

-- Expected result: All counts should be 0 