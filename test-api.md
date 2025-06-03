# API Testing Guide

This guide will walk you through testing all the Form Service API endpoints step by step.

## 🚀 **Prerequisites**

1. **Development server running**: `npm run dev` (should be running on http://localhost:3000)
2. **Supabase configured**: Make sure your `.env.local` has the correct Supabase credentials
3. **Testing tools**: We'll use browser + curl commands

## 📋 **Testing Steps**

### **Step 1: Test Authentication Flow**

1. **Open your browser** and go to: `http://localhost:3000`
2. **Sign up for a new account**:
   - Click "Get Started" or "Sign Up"
   - Enter your email address
   - Check your email for the magic link
   - Click the magic link to complete authentication
3. **Verify you reach the dashboard** at `http://localhost:3000/dashboard`

### **Step 2: Get Session Cookie (for API testing)**

Once logged in, open your browser's Developer Tools:
1. **Go to Application/Storage tab**
2. **Find Cookies** for `localhost:3000` 
3. **Look for Supabase session cookies** (they'll have names like `sb-*`)
4. **Copy the cookie values** - we'll need them for API testing

### **Step 3: Test Protected Endpoints**

Use these curl commands (replace `YOUR_COOKIE` with actual cookie values from Step 2):

#### **3.1 List Forms (should be empty initially)**
```bash
curl -X GET "http://localhost:3000/api/forms" \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SUPABASE_COOKIES_HERE" \
  | jq
```

#### **3.2 Create Your First Form**
```bash
curl -X POST "http://localhost:3000/api/forms" \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SUPABASE_COOKIES_HERE" \
  -d '{
    "name": "Contact Form",
    "description": "Test contact form for API testing",
    "email_notifications": true
  }' | jq
```

Expected response:
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "Contact Form",
    "slug": "contact-form",
    "description": "Test contact form for API testing",
    "email_notifications": true,
    "is_active": true,
    ...
  },
  "message": "Form created successfully"
}
```

#### **3.3 Get Specific Form**
```bash
curl -X GET "http://localhost:3000/api/forms/contact-form" \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SUPABASE_COOKIES_HERE" \
  | jq
```

#### **3.4 Update Form**
```bash
curl -X PUT "http://localhost:3000/api/forms/contact-form" \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SUPABASE_COOKIES_HERE" \
  -d '{
    "description": "Updated description",
    "email_notifications": false
  }' | jq
```

### **Step 4: Test Public Submission Endpoint (No Auth Required)**

This is the key endpoint that external websites will use:

#### **4.1 Test JSON Submission**
```bash
curl -X POST "http://localhost:3000/api/forms/contact-form/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe", 
    "email": "john@example.com",
    "message": "Hello from API test!",
    "source": "API testing"
  }' | jq
```

#### **4.2 Test Form Data Submission**
```bash
curl -X POST "http://localhost:3000/api/forms/contact-form/submit" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=Jane Smith&email=jane@example.com&message=Form data test&phone=123-456-7890" \
  | jq
```

#### **4.3 Test Multiple Values (like checkboxes)**
```bash
curl -X POST "http://localhost:3000/api/forms/contact-form/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "interests": ["web-development", "mobile-apps", "design"],
    "newsletter": true
  }' | jq
```

### **Step 5: Test Submissions Management**

#### **5.1 List Submissions**
```bash
curl -X GET "http://localhost:3000/api/forms/contact-form/submissions" \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SUPABASE_COOKIES_HERE" \
  | jq
```

#### **5.2 List with Pagination**
```bash
curl -X GET "http://localhost:3000/api/forms/contact-form/submissions?page=1&limit=5&sortOrder=desc" \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SUPABASE_COOKIES_HERE" \
  | jq
```

#### **5.3 Get Form Statistics**
```bash
curl -X GET "http://localhost:3000/api/forms/contact-form/stats" \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SUPABASE_COOKIES_HERE" \
  | jq
```

#### **5.4 Export Submissions as CSV**
```bash
curl -X GET "http://localhost:3000/api/forms/contact-form/submissions/export" \
  -H "Cookie: YOUR_SUPABASE_COOKIES_HERE" \
  -o "test-submissions.csv"
```

### **Step 6: Test CORS (Cross-Origin Requests)**

#### **6.1 Test OPTIONS Preflight**
```bash
curl -X OPTIONS "http://localhost:3000/api/forms/contact-form/submit" \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

### **Step 7: Test Error Scenarios**

#### **7.1 Test Nonexistent Form**
```bash
curl -X POST "http://localhost:3000/api/forms/nonexistent-form/submit" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}' \
  | jq
```

#### **7.2 Test Empty Submission**
```bash
curl -X POST "http://localhost:3000/api/forms/contact-form/submit" \
  -H "Content-Type: application/json" \
  -d '{}' \
  | jq
```

#### **7.3 Test Unauthorized Access**
```bash
curl -X GET "http://localhost:3000/api/forms" \
  -H "Content-Type: application/json" \
  | jq
```

### **Step 8: Test Form Management**

#### **8.1 Create Another Form**
```bash
curl -X POST "http://localhost:3000/api/forms" \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SUPABASE_COOKIES_HERE" \
  -d '{
    "name": "Newsletter Signup",
    "slug": "newsletter",
    "description": "Email newsletter subscription form"
  }' | jq
```

#### **8.2 List All Forms (should show both now)**
```bash
curl -X GET "http://localhost:3000/api/forms" \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SUPABASE_COOKIES_HERE" \
  | jq
```

#### **8.3 Delete a Form**
```bash
curl -X DELETE "http://localhost:3000/api/forms/newsletter" \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SUPABASE_COOKIES_HERE" \
  | jq
```

## 🎯 **Expected Results**

If everything is working correctly, you should see:

✅ **Authentication**: Successful login and dashboard access  
✅ **Form Creation**: New forms created with auto-generated slugs  
✅ **Public Submissions**: External submissions working without authentication  
✅ **CORS**: Cross-origin requests properly handled  
✅ **Data Management**: Submissions stored and retrievable with pagination  
✅ **Export**: CSV export functioning  
✅ **Security**: Protected endpoints require authentication  
✅ **Error Handling**: Proper error messages for invalid requests  

## 🔧 **Troubleshooting**

**If you get 401 Unauthorized errors:**
- Make sure you're logged in to the dashboard
- Check that you're including the correct cookies in your requests
- Try logging out and back in to refresh your session

**If forms aren't being created:**
- Check your Supabase configuration in `.env.local`
- Verify the database schema was created correctly
- Check the browser console for any errors

**If submissions fail:**
- Verify the form slug is correct
- Check that the form `is_active` is `true`
- Ensure you're sending valid JSON or form data

## 🌐 **Testing from External Website**

Create a simple HTML file to test cross-origin submissions:

```html
<!DOCTYPE html>
<html>
<head>
    <title>External Form Test</title>
</head>
<body>
    <h1>Test External Form Submission</h1>
    
    <!-- Standard HTML Form -->
    <form action="http://localhost:3000/api/forms/contact-form/submit" method="POST">
        <input name="name" placeholder="Your Name" required>
        <input name="email" type="email" placeholder="Your Email" required>
        <textarea name="message" placeholder="Message" required></textarea>
        <button type="submit">Send via HTML Form</button>
    </form>
    
    <hr>
    
    <!-- JavaScript Fetch -->
    <button onclick="testFetch()">Send via JavaScript Fetch</button>
    
    <script>
        async function testFetch() {
            try {
                const response = await fetch('http://localhost:3000/api/forms/contact-form/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: 'JavaScript User',
                        email: 'js@example.com',
                        message: 'Sent via JavaScript fetch!',
                        timestamp: new Date().toISOString()
                    })
                });
                
                const result = await response.json();
                alert('Success: ' + result.message);
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }
    </script>
</body>
</html>
```

Save this as `test-form.html` and open it in your browser to test external submissions.

## 📊 **Success Metrics**

After testing, you should have:
- ✅ At least 1 form created
- ✅ Multiple submissions from different sources
- ✅ CSV export with actual data
- ✅ Statistics showing correct counts
- ✅ Successful cross-origin submissions 