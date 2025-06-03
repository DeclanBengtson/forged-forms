#!/usr/bin/env node

/**
 * API Endpoint Testing Script
 * 
 * This script automates testing of all Form Service API endpoints.
 * Run with: node test-endpoints.js
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_EMAIL = 'test@example.com'; // Change this to your test email

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// HTTP request helper
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const lib = isHttps ? https : http;
    
    const req = lib.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsedData = res.headers['content-type']?.includes('application/json') 
            ? JSON.parse(data) 
            : data;
          resolve({ status: res.statusCode, data: parsedData, headers: res.headers });
        } catch (error) {
          resolve({ status: res.statusCode, data, headers: res.headers });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Logging helpers
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name, success, details = '') {
  const icon = success ? '✅' : '❌';
  const color = success ? 'green' : 'red';
  log(`${icon} ${name}`, color);
  if (details) {
    log(`   ${details}`, 'blue');
  }
}

function logSection(title) {
  log(`\n${colors.bold}${colors.blue}=== ${title} ===${colors.reset}`);
}

// Test suite
class APITester {
  constructor() {
    this.cookies = '';
    this.testFormSlug = 'test-contact-form';
    this.testFormId = null;
  }

  async runAllTests() {
    try {
      log(`${colors.bold}🧪 Starting API Endpoint Tests${colors.reset}\n`);
      
      // Note: Authentication tests require manual setup
      logSection('Authentication Required');
      log('⚠️  Please log in to http://localhost:3000/dashboard first', 'yellow');
      log('⚠️  Then copy session cookies and paste them when prompted', 'yellow');
      
      // Test public endpoints first (no auth required)
      await this.testPublicEndpoints();
      
      // Test protected endpoints (require auth)
      await this.testProtectedEndpoints();
      
      // Summary
      logSection('Testing Complete');
      log('🎉 All tests completed! Check the results above.', 'green');
      
    } catch (error) {
      log(`❌ Test suite failed: ${error.message}`, 'red');
    }
  }

  async testPublicEndpoints() {
    logSection('Public Endpoints (No Auth Required)');
    
    // Test CORS preflight
    await this.testCORSPreflight();
    
    // Test form submission to non-existent form (should fail)
    await this.testNonExistentFormSubmission();
    
    // Test empty submission (should fail)
    await this.testEmptySubmission();
  }

  async testProtectedEndpoints() {
    logSection('Protected Endpoints (Auth Required)');
    
    // Get session cookies
    await this.getSessionCookies();
    
    if (!this.cookies) {
      log('❌ No session cookies provided. Skipping protected endpoint tests.', 'red');
      return;
    }
    
    // Test form management
    await this.testListForms();
    await this.testCreateForm();
    await this.testGetForm();
    await this.testUpdateForm();
    
    // Test form submissions
    await this.testFormSubmissions();
    await this.testListSubmissions();
    await this.testFormStats();
    await this.testExportSubmissions();
    
    // Cleanup
    await this.testDeleteForm();
  }

  async getSessionCookies() {
    return new Promise((resolve) => {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question('Enter your session cookies (or press Enter to skip): ', (cookies) => {
        this.cookies = cookies.trim();
        readline.close();
        resolve();
      });
    });
  }

  async testCORSPreflight() {
    try {
      const response = await makeRequest(`${BASE_URL}/api/forms/test-form/submit`, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'https://example.com',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      
      const hasCORSHeaders = response.headers['access-control-allow-origin'] === '*';
      logTest('CORS Preflight', hasCORSHeaders, `Status: ${response.status}`);
    } catch (error) {
      logTest('CORS Preflight', false, error.message);
    }
  }

  async testNonExistentFormSubmission() {
    try {
      const response = await makeRequest(`${BASE_URL}/api/forms/nonexistent-form/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'data' })
      });
      
      const isCorrectError = response.status === 404 && response.data.error === 'Form not found';
      logTest('Non-existent Form Submission', isCorrectError, `Status: ${response.status}`);
    } catch (error) {
      logTest('Non-existent Form Submission', false, error.message);
    }
  }

  async testEmptySubmission() {
    try {
      const response = await makeRequest(`${BASE_URL}/api/forms/test-form/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      // Should fail with 400 or 404 (form not found)
      const isCorrectError = response.status >= 400;
      logTest('Empty Submission', isCorrectError, `Status: ${response.status}`);
    } catch (error) {
      logTest('Empty Submission', false, error.message);
    }
  }

  async testListForms() {
    try {
      const response = await makeRequest(`${BASE_URL}/api/forms`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': this.cookies
        }
      });
      
      const isSuccess = response.status === 200 && response.data.success;
      logTest('List Forms', isSuccess, `Status: ${response.status}, Forms: ${response.data.data?.length || 0}`);
    } catch (error) {
      logTest('List Forms', false, error.message);
    }
  }

  async testCreateForm() {
    try {
      const formData = {
        name: 'Test Contact Form',
        description: 'Automated test form',
        email_notifications: true
      };
      
      const response = await makeRequest(`${BASE_URL}/api/forms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': this.cookies
        },
        body: JSON.stringify(formData)
      });
      
      const isSuccess = response.status === 201 && response.data.success;
      if (isSuccess) {
        this.testFormSlug = response.data.data.slug;
        this.testFormId = response.data.data.id;
      }
      
      logTest('Create Form', isSuccess, `Status: ${response.status}, Slug: ${this.testFormSlug}`);
    } catch (error) {
      logTest('Create Form', false, error.message);
    }
  }

  async testGetForm() {
    try {
      const response = await makeRequest(`${BASE_URL}/api/forms/${this.testFormSlug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': this.cookies
        }
      });
      
      const isSuccess = response.status === 200 && response.data.success;
      logTest('Get Form', isSuccess, `Status: ${response.status}`);
    } catch (error) {
      logTest('Get Form', false, error.message);
    }
  }

  async testUpdateForm() {
    try {
      const updateData = {
        description: 'Updated by automated test',
        email_notifications: false
      };
      
      const response = await makeRequest(`${BASE_URL}/api/forms/${this.testFormSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': this.cookies
        },
        body: JSON.stringify(updateData)
      });
      
      const isSuccess = response.status === 200 && response.data.success;
      logTest('Update Form', isSuccess, `Status: ${response.status}`);
    } catch (error) {
      logTest('Update Form', false, error.message);
    }
  }

  async testFormSubmissions() {
    try {
      // Test JSON submission
      const submissionData = {
        name: 'Test User',
        email: 'testuser@example.com',
        message: 'This is an automated test submission',
        source: 'automated-test'
      };
      
      const response = await makeRequest(`${BASE_URL}/api/forms/${this.testFormSlug}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });
      
      const isSuccess = response.status === 201 && response.data.success;
      logTest('Form Submission (JSON)', isSuccess, `Status: ${response.status}`);
      
      // Test form-encoded submission
      const formData = 'name=Form User&email=formuser@example.com&message=Form encoded test';
      const response2 = await makeRequest(`${BASE_URL}/api/forms/${this.testFormSlug}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });
      
      const isSuccess2 = response2.status === 201 && response2.data.success;
      logTest('Form Submission (Form Data)', isSuccess2, `Status: ${response2.status}`);
      
    } catch (error) {
      logTest('Form Submissions', false, error.message);
    }
  }

  async testListSubmissions() {
    try {
      const response = await makeRequest(`${BASE_URL}/api/forms/${this.testFormSlug}/submissions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': this.cookies
        }
      });
      
      const isSuccess = response.status === 200 && response.data.success;
      const submissionCount = response.data.data?.length || 0;
      logTest('List Submissions', isSuccess, `Status: ${response.status}, Count: ${submissionCount}`);
    } catch (error) {
      logTest('List Submissions', false, error.message);
    }
  }

  async testFormStats() {
    try {
      const response = await makeRequest(`${BASE_URL}/api/forms/${this.testFormSlug}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': this.cookies
        }
      });
      
      const isSuccess = response.status === 200 && response.data.success;
      logTest('Form Statistics', isSuccess, `Status: ${response.status}`);
    } catch (error) {
      logTest('Form Statistics', false, error.message);
    }
  }

  async testExportSubmissions() {
    try {
      const response = await makeRequest(`${BASE_URL}/api/forms/${this.testFormSlug}/submissions/export`, {
        method: 'GET',
        headers: { 'Cookie': this.cookies }
      });
      
      const isSuccess = response.status === 200 && response.headers['content-type'] === 'text/csv';
      logTest('Export Submissions', isSuccess, `Status: ${response.status}, Type: ${response.headers['content-type']}`);
    } catch (error) {
      logTest('Export Submissions', false, error.message);
    }
  }

  async testDeleteForm() {
    try {
      const response = await makeRequest(`${BASE_URL}/api/forms/${this.testFormSlug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': this.cookies
        }
      });
      
      const isSuccess = response.status === 200 && response.data.success;
      logTest('Delete Form', isSuccess, `Status: ${response.status}`);
    } catch (error) {
      logTest('Delete Form', false, error.message);
    }
  }
}

// Run the tests
if (require.main === module) {
  const tester = new APITester();
  tester.runAllTests().catch(console.error);
}

module.exports = APITester; 