import { NextRequest, NextResponse } from 'next/server'
import { getCachedForm } from '@/lib/cache/forms'
import { createSubmission, extractClientInfo } from '@/lib/database/submissions'
import { ApiResponse } from '@/lib/types/database'
import { sendFormSubmissionNotification } from '@/lib/email/sendgrid'
import { validateFormSubmission } from '@/lib/validation'
import { apiLogger } from '@/lib/logger'
import { withRateLimit, getIPAddress } from '@/lib/middleware/rate-limit-redis'

// Configure for Node.js runtime to support winston and sendgrid
// export const runtime = 'edge'  // Disabled: incompatible with winston/sendgrid dependencies

// Prefer regions close to your database for lower latency
export const preferredRegion = ['iad1'] // US East - adjust based on your Supabase region

// POST /api/forms/[id]/submit - Public endpoint for form submissions
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now()
  
  try {
    const { id } = await params
    const endpoint = `/api/forms/${id}/submit`

    // Apply rate limiting for form submissions (IP-based)
    const rateLimitResponse = await withRateLimit(
      'submission',
      getIPAddress,
      async () => 'free' // Public submissions use free tier limits
    )(request);
    
    if (rateLimitResponse) {
      apiLogger.warn('Rate limit exceeded for form submission', endpoint, {
        formId: id,
        ip: getIPAddress(request)
      });
      return rateLimitResponse;
    }

    // Get form by ID (with Upstash Redis caching for performance)
    const form = await getCachedForm(id)
    
    if (!form) {
      return NextResponse.json(
        { success: false, error: 'Form not found' },
        { status: 404 }
      )
    }

    if (!form.is_active) {
      return NextResponse.json(
        { success: false, error: 'Form is not accepting submissions' },
        { status: 403 }
      )
    }

    // Parse submission data with efficient processing
    let submissionData: Record<string, string | string[]>

    // Handle both JSON and form-encoded data
    const contentType = request.headers.get('content-type') || ''
    
    if (contentType.includes('application/json')) {
      submissionData = await request.json()
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      submissionData = {}
      
      for (const [key, value] of formData.entries()) {
        if (submissionData[key]) {
          // Handle multiple values for the same key (e.g., checkboxes)
          if (Array.isArray(submissionData[key])) {
            (submissionData[key] as string[]).push(value.toString())
          } else {
            submissionData[key] = [submissionData[key] as string, value.toString()]
          }
        } else {
          submissionData[key] = value.toString()
        }
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Unsupported content type' },
        { status: 400 }
      )
    }

    // Validate that we have some data
    if (!submissionData || Object.keys(submissionData).length === 0) {
      apiLogger.warn('Empty form submission received', endpoint, { formId: id });
      return NextResponse.json(
        { success: false, error: 'No form data provided' },
        { status: 400 }
      )
    }

    // Validate and sanitize form data
    const validationResult = validateFormSubmission(submissionData);
    if (!validationResult.success) {
      apiLogger.warn('Invalid form submission data', endpoint, {
        formId: id,
        errors: validationResult.error.errors.map(e => e.message)
      });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid form data',
          details: validationResult.error.errors.map(e => e.message)
        },
        { status: 400 }
      )
    }

    // Use validated and sanitized data
    submissionData = validationResult.data;

    // Extract client information
    const clientInfo = extractClientInfo(request)

    // Create the submission (optimized for serverless)
    const submission = await createSubmission(form.id, submissionData, clientInfo)

    // Send email notification asynchronously (non-blocking)
    if (form.email_notifications && form.notification_email) {
      // Use Promise.resolve().then() to make it truly async without awaiting
      Promise.resolve().then(async () => {
        try {
          await sendFormSubmissionNotification({
            form,
            submission,
            submissionData
          })
          apiLogger.info('Email notification sent successfully', endpoint, { 
            formId: id, 
            submissionId: submission.id 
          });
        } catch (error) {
          // Log error but don't affect the submission response
          apiLogger.error('Failed to send email notification', endpoint, error, {
            formId: id,
            submissionId: submission.id
          });
        }
      })
    }

    const responseTime = Date.now() - startTime

    const response: ApiResponse = {
      success: true,
      message: 'Form submitted successfully',
      data: {
        id: submission.id,
        submitted_at: submission.submitted_at
      }
    }

    // Add performance and CORS headers
    const responseHeaders = new Headers()
    responseHeaders.set('Access-Control-Allow-Origin', '*')
    responseHeaders.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type')
    responseHeaders.set('X-Response-Time', `${responseTime}ms`)

    return NextResponse.json(response, { 
      status: 201,
      headers: responseHeaders
    })
    
  } catch (error) {
    const responseTime = Date.now() - startTime
    apiLogger.error('Error processing form submission', `/api/forms/${(await params).id}/submit`, error);
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process submission'
    }
    
    // Add CORS headers even for errors
    const responseHeaders = new Headers()
    responseHeaders.set('Access-Control-Allow-Origin', '*')
    responseHeaders.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type')
    responseHeaders.set('X-Response-Time', `${responseTime}ms`)
    
    return NextResponse.json(response, { 
      status: 500,
      headers: responseHeaders
    })
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  )
} 