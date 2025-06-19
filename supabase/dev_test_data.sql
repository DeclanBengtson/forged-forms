-- =====================================
-- FORGED FORMS - DEV TEST DATA SCRIPT
-- =====================================
-- Optional script to populate development database with test data
-- Run this AFTER running dev_database_setup.sql

-- Step 1: Create test users (if using local auth)
-- =====================================
-- Note: In a real Supabase environment, users are created through auth
-- This is mainly for local development with custom auth setup

-- Step 2: Create test user profiles
-- =====================================
-- Insert test user profiles (replace UUIDs with your actual test user IDs)
INSERT INTO public.user_profiles (
  user_id, 
  full_name, 
  subscription_status,
  created_at
) VALUES 
(
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  'Test User Free',
  'free',
  NOW() - INTERVAL '30 days'
),
(
  'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
  'Test User Pro',
  'pro',
  NOW() - INTERVAL '15 days'
),
(
  'cccccccc-dddd-eeee-ffff-aaaaaaaaaaaa',
  'Test User Starter',
  'starter',
  NOW() - INTERVAL '7 days'
)
ON CONFLICT (user_id) DO NOTHING;

-- Step 3: Create test projects
-- =====================================
INSERT INTO public.projects (
  id,
  user_id,
  name,
  description,
  created_at
) VALUES
-- Free user projects
(
  'proj-aaaa-1111-2222-3333-444444444444',
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  'My First Project',
  'Basic project for testing forms',
  NOW() - INTERVAL '25 days'
),
-- Pro user projects
(
  'proj-bbbb-1111-2222-3333-444444444444',
  'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
  'Marketing Campaigns',
  'Forms for marketing lead generation',
  NOW() - INTERVAL '12 days'
),
(
  'proj-bbbb-2222-3333-4444-555555555555',
  'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
  'Customer Feedback',
  'Collect customer feedback and surveys',
  NOW() - INTERVAL '10 days'
),
-- Starter user projects
(
  'proj-cccc-1111-2222-3333-444444444444',
  'cccccccc-dddd-eeee-ffff-aaaaaaaaaaaa',
  'Event Registration',
  'Forms for event management',
  NOW() - INTERVAL '5 days'
)
ON CONFLICT (id) DO NOTHING;

-- Step 4: Create test forms
-- =====================================
INSERT INTO public.forms (
  id,
  user_id,
  project_id,
  name,
  description,
  email_notifications,
  notification_email,
  is_active,
  created_at
) VALUES
-- Free user forms
(
  'form-aaaa-1111-2222-3333-444444444444',
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  'proj-aaaa-1111-2222-3333-444444444444',
  'Contact Form',
  'Basic contact form for the website',
  true,
  'test-free@example.com',
  true,
  NOW() - INTERVAL '20 days'
),
(
  'form-aaaa-2222-3333-4444-555555555555',
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  'proj-aaaa-1111-2222-3333-444444444444',
  'Newsletter Signup',
  'Simple newsletter subscription form',
  false,
  null,
  true,
  NOW() - INTERVAL '18 days'
),
-- Pro user forms
(
  'form-bbbb-1111-2222-3333-444444444444',
  'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
  'proj-bbbb-1111-2222-3333-444444444444',
  'Lead Generation Form',
  'Advanced form for capturing marketing leads',
  true,
  'marketing@example.com',
  true,
  NOW() - INTERVAL '8 days'
),
(
  'form-bbbb-2222-3333-4444-555555555555',
  'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
  'proj-bbbb-2222-3333-4444-555555555555',
  'Customer Survey',
  'Post-purchase customer satisfaction survey',
  true,
  'feedback@example.com',
  true,
  NOW() - INTERVAL '6 days'
),
(
  'form-bbbb-3333-4444-5555-666666666666',
  'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
  'proj-bbbb-1111-2222-3333-444444444444',
  'Product Demo Request',
  'Form for scheduling product demonstrations',
  true,
  'sales@example.com',
  false,
  NOW() - INTERVAL '4 days'
),
-- Starter user forms
(
  'form-cccc-1111-2222-3333-444444444444',
  'cccccccc-dddd-eeee-ffff-aaaaaaaaaaaa',
  'proj-cccc-1111-2222-3333-444444444444',
  'Event Registration',
  'Registration form for upcoming conference',
  true,
  'events@example.com',
  true,
  NOW() - INTERVAL '3 days'
)
ON CONFLICT (id) DO NOTHING;

-- Step 5: Create test submissions
-- =====================================
INSERT INTO public.submissions (
  form_id,
  data,
  submitted_at,
  ip_address,
  user_agent
) VALUES
-- Contact form submissions
(
  'form-aaaa-1111-2222-3333-444444444444',
  '{"name": "John Doe", "email": "john@example.com", "message": "Hello, I''d like to learn more about your services."}',
  NOW() - INTERVAL '15 days',
  '192.168.1.100',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
),
(
  'form-aaaa-1111-2222-3333-444444444444',
  '{"name": "Jane Smith", "email": "jane@example.com", "message": "Can you provide a quote for custom development?"}',
  NOW() - INTERVAL '12 days',
  '192.168.1.101',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
),
(
  'form-aaaa-1111-2222-3333-444444444444',
  '{"name": "Bob Johnson", "email": "bob@example.com", "message": "I''m interested in your pricing plans."}',
  NOW() - INTERVAL '5 days',
  '192.168.1.102',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
),
-- Newsletter signups
(
  'form-aaaa-2222-3333-4444-555555555555',
  '{"email": "subscriber1@example.com", "interests": ["web-development", "design"]}',
  NOW() - INTERVAL '10 days',
  '192.168.1.103',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
),
(
  'form-aaaa-2222-3333-4444-555555555555',
  '{"email": "subscriber2@example.com", "interests": ["marketing"]}',
  NOW() - INTERVAL '7 days',
  '192.168.1.104',
  'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36'
),
-- Lead generation submissions
(
  'form-bbbb-1111-2222-3333-444444444444',
  '{"company": "Acme Corp", "name": "Sarah Wilson", "email": "sarah@acme.com", "phone": "+1234567890", "budget": "10000-50000", "timeline": "Q2 2024"}',
  NOW() - INTERVAL '6 days',
  '192.168.1.105',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
),
(
  'form-bbbb-1111-2222-3333-444444444444',
  '{"company": "TechStart Inc", "name": "Mike Chen", "email": "mike@techstart.com", "phone": "+1987654321", "budget": "5000-10000", "timeline": "Q1 2024"}',
  NOW() - INTERVAL '3 days',
  '192.168.1.106',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
),
-- Customer survey submissions
(
  'form-bbbb-2222-3333-4444-555555555555',
  '{"rating": 5, "recommend": true, "feedback": "Excellent service and support!", "product": "Pro Plan"}',
  NOW() - INTERVAL '4 days',
  '192.168.1.107',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
),
(
  'form-bbbb-2222-3333-4444-555555555555',
  '{"rating": 4, "recommend": true, "feedback": "Good overall, could use more features", "product": "Starter Plan"}',
  NOW() - INTERVAL '2 days',
  '192.168.1.108',
  'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
),
-- Event registration submissions
(
  'form-cccc-1111-2222-3333-444444444444',
  '{"name": "Alice Brown", "email": "alice@example.com", "company": "Design Co", "dietary_restrictions": "vegetarian", "workshop_preference": "Advanced CSS"}',
  NOW() - INTERVAL '2 days',
  '192.168.1.109',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
),
(
  'form-cccc-1111-2222-3333-444444444444',
  '{"name": "David Lee", "email": "david@example.com", "company": "DevStudio", "dietary_restrictions": "none", "workshop_preference": "JavaScript Fundamentals"}',
  NOW() - INTERVAL '1 day',
  '192.168.1.110',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
);

-- Step 6: Verification queries
-- =====================================

-- Show summary of created test data
DO $$
BEGIN
  RAISE NOTICE '=====================================';
  RAISE NOTICE 'DEV TEST DATA SETUP COMPLETE';
  RAISE NOTICE '=====================================';
  RAISE NOTICE 'Created test data:';
  RAISE NOTICE '✓ 3 user profiles (free, starter, pro)';
  RAISE NOTICE '✓ 4 projects across different users';
  RAISE NOTICE '✓ 7 forms with various configurations';
  RAISE NOTICE '✓ 11 form submissions with realistic data';
  RAISE NOTICE '=====================================';
  RAISE NOTICE 'Test User IDs:';
  RAISE NOTICE 'Free User: aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  RAISE NOTICE 'Pro User:  bbbbbbbb-cccc-dddd-eeee-ffffffffffff';
  RAISE NOTICE 'Starter:   cccccccc-dddd-eeee-ffff-aaaaaaaaaaaa';
  RAISE NOTICE '=====================================';
END $$;

-- Display summary statistics
SELECT 
  'User Profiles' as table_name, 
  COUNT(*) as record_count,
  string_agg(DISTINCT subscription_status, ', ') as subscription_types
FROM public.user_profiles

UNION ALL

SELECT 
  'Projects' as table_name, 
  COUNT(*) as record_count,
  null as subscription_types
FROM public.projects

UNION ALL

SELECT 
  'Forms' as table_name, 
  COUNT(*) as record_count,
  COUNT(CASE WHEN is_active THEN 1 END)::text || ' active' as subscription_types
FROM public.forms

UNION ALL

SELECT 
  'Submissions' as table_name, 
  COUNT(*) as record_count,
  COUNT(DISTINCT form_id)::text || ' forms' as subscription_types
FROM public.submissions; 