// Test script to verify form submission RLS fix
// Run this after applying the migration: node test-submission-fix.js

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function testFormSubmission() {
  console.log('🧪 Testing Form Submission Fix...\n');

  try {
    // Test 1: Try to submit to a non-existent form (should fail gracefully)
    console.log('Test 1: Submitting to non-existent form...');
    const response1 = await fetch(`${API_BASE}/api/forms/non-existent-form/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This should fail gracefully'
      })
    });

    const result1 = await response1.json();
    console.log('Response:', result1);
    
    if (result1.success === false && result1.error === 'Form not found') {
      console.log('✅ Test 1 PASSED: Non-existent form handled correctly\n');
    } else {
      console.log('❌ Test 1 FAILED: Unexpected response\n');
    }

    // Test 2: Submit to an actual form (you'll need to replace 'your-form-slug' with a real form slug)
    console.log('Test 2: Submitting to existing form...');
    console.log('⚠️  Note: Replace "your-form-slug" with an actual form slug from your dashboard\n');
    
    const testFormSlug = 'your-form-slug'; // Replace this with a real form slug
    const response2 = await fetch(`${API_BASE}/api/forms/${testFormSlug}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Testing RLS fix - this should work now!'
      })
    });

    const result2 = await response2.json();
    console.log('Response:', result2);
    
    if (result2.success === true) {
      console.log('✅ Test 2 PASSED: Form submission successful!');
      console.log('🎉 RLS fix is working correctly!\n');
    } else if (result2.error === 'Form not found') {
      console.log('⚠️  Test 2 SKIPPED: Form slug not found (expected if you haven\'t replaced the slug)');
      console.log('   Create a form in your dashboard and update the testFormSlug variable\n');
    } else if (result2.error === 'Form is not accepting submissions') {
      console.log('⚠️  Test 2 INFO: Form exists but is inactive');
      console.log('   Make sure your form is set to active in the dashboard\n');
    } else {
      console.log('❌ Test 2 FAILED: Unexpected error');
      console.log('   This might indicate the RLS fix didn\'t work properly\n');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\nMake sure your Next.js server is running: npm run dev');
  }
}

// Instructions
console.log('📋 Form Submission RLS Fix Test');
console.log('================================\n');
console.log('Before running this test:');
console.log('1. Apply the migration in Supabase SQL Editor');
console.log('2. Make sure your Next.js server is running (npm run dev)');
console.log('3. Create at least one active form in your dashboard');
console.log('4. Update the testFormSlug variable with your form\'s slug\n');

testFormSubmission(); 