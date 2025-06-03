# Form Service API Documentation

This document describes the REST API endpoints for the Form Service application.

## Authentication

Most endpoints require authentication via Supabase Auth. The user session is automatically handled by Next.js middleware.

**Public Endpoints** (no authentication required):
- `POST /api/forms/[slug]/submit` - Form submission endpoint
- `OPTIONS /api/forms/[slug]/submit` - CORS preflight

**Protected Endpoints** (authentication required):
- All other `/api/forms/*` endpoints

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## Response Format

All API responses follow this structure:

```json
{
  "success": boolean,
  "data": any,          // Present on success
  "error": string,      // Present on error
  "message": string,    // Optional descriptive message
  "pagination": {       // Present on paginated responses
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

## Endpoints

### Forms Management

#### List Forms
```
GET /api/forms
```

Returns all forms for the authenticated user with submission statistics.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "name": "Contact Form",
      "slug": "contact-form",
      "description": "Main contact form",
      "email_notifications": true,
      "notification_email": "user@example.com",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "submission_count": 42,
      "latest_submission": null
    }
  ],
  "message": "Found 1 forms"
}
```

#### Create Form
```
POST /api/forms
```

Creates a new form for the authenticated user.

**Request Body**:
```json
{
  "name": "Contact Form",              // Required
  "description": "Main contact form", // Optional
  "slug": "contact-form",             // Optional - auto-generated if not provided
  "email_notifications": true,       // Optional - defaults to true
  "notification_email": "user@example.com" // Optional - defaults to user email
}
```

**Response**: Same as single form object with 201 status.

#### Get Form
```
GET /api/forms/[slug]
```

Returns a specific form by slug.

**Response**: Single form object.

#### Update Form
```
PUT /api/forms/[slug]
```

Updates a form. Only provided fields are updated.

**Request Body**: Same as create form, but all fields optional.

**Response**: Updated form object.

#### Delete Form
```
DELETE /api/forms/[slug]
```

Deletes a form and all its submissions.

**Response**:
```json
{
  "success": true,
  "message": "Form deleted successfully"
}
```

### Form Submissions

#### Submit to Form (Public)
```
POST /api/forms/[slug]/submit
```

Public endpoint for submitting data to a form. Supports both JSON and form-encoded data.

**Content Types Supported**:
- `application/json`
- `application/x-www-form-urlencoded`
- `multipart/form-data`

**Request Body (JSON)**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello world!",
  "interests": ["web", "mobile"]  // Arrays supported
}
```

**Request Body (Form Data)**:
```
name=John+Doe&email=john@example.com&message=Hello+world!
```

**Response**:
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "data": {
    "id": "submission-uuid",
    "submitted_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**CORS Headers**: This endpoint includes CORS headers for cross-origin requests.

#### List Submissions
```
GET /api/forms/[slug]/submissions
```

Returns paginated submissions for a form.

**Query Parameters**:
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20, max: 100) - Items per page
- `sortBy` (string, default: "submitted_at") - Sort field: "submitted_at" | "id"
- `sortOrder` (string, default: "desc") - Sort order: "asc" | "desc"

**Example**: `/api/forms/contact-form/submissions?page=2&limit=10&sortBy=submitted_at&sortOrder=desc`

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "form_id": "uuid",
      "data": {
        "name": "John Doe",
        "email": "john@example.com",
        "message": "Hello!"
      },
      "submitted_at": "2024-01-01T00:00:00.000Z",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "referrer": "https://example.com"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  },
  "message": "Found 100 submissions"
}
```

#### Export Submissions
```
GET /api/forms/[slug]/submissions/export
```

Exports all submissions for a form as CSV.

**Response**: CSV file download with headers:
```
Content-Type: text/csv
Content-Disposition: attachment; filename="contact-form-submissions-2024-01-01.csv"
```

#### Form Statistics
```
GET /api/forms/[slug]/stats
```

Returns submission statistics for a form.

**Response**:
```json
{
  "success": true,
  "data": {
    "form": {
      "id": "uuid",
      "name": "Contact Form",
      "slug": "contact-form",
      "created_at": "2024-01-01T00:00:00.000Z",
      "is_active": true
    },
    "stats": {
      "total": 100,
      "thisWeek": 15,
      "thisMonth": 45,
      "avgPerDay": 3.2
    }
  },
  "message": "Statistics retrieved successfully"
}
```

## Error Codes

| Status | Description |
|--------|-------------|
| 200    | Success |
| 201    | Created successfully |
| 400    | Bad request - validation error |
| 401    | Unauthorized - authentication required |
| 403    | Forbidden - form inactive or access denied |
| 404    | Not found - form or resource doesn't exist |
| 409    | Conflict - slug already exists |
| 500    | Internal server error |

## Example Usage

### HTML Form Submission
```html
<form action="https://your-domain.com/api/forms/contact-form/submit" method="POST">
  <input name="name" type="text" placeholder="Your Name" required>
  <input name="email" type="email" placeholder="Your Email" required>
  <textarea name="message" placeholder="Your Message" required></textarea>
  <button type="submit">Send Message</button>
</form>
```

### JavaScript Fetch
```javascript
// Submit form data
const response = await fetch('/api/forms/contact-form/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello world!'
  })
});

const result = await response.json();
if (result.success) {
  console.log('Form submitted successfully!');
} else {
  console.error('Error:', result.error);
}
```

### cURL Examples

**Create a form**:
```bash
curl -X POST http://localhost:3000/api/forms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Newsletter Signup",
    "description": "Email newsletter subscription",
    "slug": "newsletter"
  }'
```

**Submit to a form**:
```bash
curl -X POST http://localhost:3000/api/forms/newsletter/submit \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe"
  }'
```

**Export submissions**:
```bash
curl -X GET http://localhost:3000/api/forms/newsletter/submissions/export \
  -o newsletter-submissions.csv
```

## Rate Limiting

Currently, no rate limiting is implemented. For production use, consider implementing rate limiting on the submission endpoints to prevent abuse.

## Security Considerations

1. **CSRF Protection**: Submission endpoints are public and don't require CSRF tokens
2. **Data Sanitization**: All submission data is automatically sanitized
3. **RLS (Row Level Security)**: Database-level security ensures users only access their own data
4. **Input Validation**: Form names, slugs, and emails are validated
5. **CORS**: Submission endpoints include CORS headers for cross-origin requests

## Client SDK

For easier integration, use the provided client SDK:

```javascript
import { formsApi, submissionsApi } from '@/lib/api/client'

// Create a form
const form = await formsApi.create({
  name: 'Contact Form',
  slug: 'contact'
})

// List submissions
const submissions = await submissionsApi.list('contact', {
  page: 1,
  limit: 20
})

// Export submissions
await submissionsApi.downloadCsvExport('contact')
``` 