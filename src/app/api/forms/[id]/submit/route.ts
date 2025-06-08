import { NextRequest, NextResponse } from 'next/server'
import { getCachedForm } from '@/lib/cache/forms'
import { createSubmission, extractClientInfo } from '@/lib/database/submissions'
import { ApiResponse } from '@/lib/types/database'
import { sendFormSubmissionNotification } from '@/lib/email/sendgrid'
import { validateFormSubmissionOptimized } from '@/lib/validation'
import { apiLogger } from '@/lib/logger'
import { withRateLimit, getIPAddress } from '@/lib/middleware/rate-limit-redis'

// Configure for Node.js runtime to support winston and sendgrid
// export const runtime = 'edge'  // Disabled: incompatible with winston/sendgrid dependencies

// Prefer regions close to your database for lower latency
export const preferredRegion = ['syd1'] // Sydney - matching Supabase Oceania region

// **OPTIMIZATION: Circuit breaker for external services**
interface CircuitBreakerState {
  failures: number;
  lastFailTime: number;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

const circuitBreakers = new Map<string, CircuitBreakerState>();
const CIRCUIT_BREAKER_THRESHOLD = 5;
const CIRCUIT_BREAKER_TIMEOUT = 30000; // 30 seconds

function updateCircuitBreaker(service: string, success: boolean): boolean {
  const now = Date.now();
  let breaker = circuitBreakers.get(service) || { failures: 0, lastFailTime: 0, state: 'CLOSED' };
  
  if (success) {
    breaker.failures = 0;
    breaker.state = 'CLOSED';
  } else {
    breaker.failures++;
    breaker.lastFailTime = now;
    
    if (breaker.failures >= CIRCUIT_BREAKER_THRESHOLD) {
      breaker.state = 'OPEN';
    }
  }
  
  // Check if we should transition from OPEN to HALF_OPEN
  if (breaker.state === 'OPEN' && now - breaker.lastFailTime > CIRCUIT_BREAKER_TIMEOUT) {
    breaker.state = 'HALF_OPEN';
  }
  
  circuitBreakers.set(service, breaker);
  return breaker.state !== 'OPEN';
}

// **OPTIMIZATION: Performance monitoring**
const performanceMetrics = {
  rateLimitTime: 0,
  cacheTime: 0,
  validationTime: 0,
  dbTime: 0,
  totalTime: 0
};

function trackPerformance(operation: string, startTime: number): number {
  const duration = Date.now() - startTime;
  (performanceMetrics as any)[`${operation}Time`] = duration;
  return duration;
}

// POST /api/forms/[id]/submit - Public endpoint for form submissions
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now()
  let formData: Record<string, string | string[]> | null = null;
  
  try {
    const { id } = await params
    const endpoint = `/api/forms/${id}/submit`

    // **OPTIMIZATION 1: Parallel execution of independent operations**
    const [rateLimitResponse, form, submissionDataResult] = await Promise.allSettled([
      // Rate limiting
      withRateLimit(
        'submission',
        getIPAddress,
        async () => 'free'
      )(request),
      
      // Form cache lookup
      getCachedForm(id),
      
      // Request body parsing (independent of other operations)
      parseRequestBody(request)
    ]);

    // Handle rate limiting
    if (rateLimitResponse.status === 'fulfilled' && rateLimitResponse.value) {
      apiLogger.warn('Rate limit exceeded for form submission', endpoint, {
        formId: id,
        ip: getIPAddress(request)
      });
      return rateLimitResponse.value;
    }

    // Handle form lookup
    if (form.status === 'rejected' || !form.value) {
      updateCircuitBreaker('database', false);
      return NextResponse.json(
        { success: false, error: 'Form not found' },
        { status: 404 }
      )
    }
    updateCircuitBreaker('database', true);

    if (!form.value.is_active) {
      return NextResponse.json(
        { success: false, error: 'Form is not accepting submissions' },
        { status: 403 }
      )
    }

    // Handle request body parsing
    if (submissionDataResult.status === 'rejected') {
      return NextResponse.json(
        { success: false, error: 'Failed to parse request body' },
        { status: 400 }
      )
    }

    formData = submissionDataResult.value;

    // **OPTIMIZATION 2: Fast validation with early termination**
    const validationResult = validateFormSubmissionOptimized(formData, true);
    if (!validationResult.success) {
      apiLogger.warn('Invalid form submission data', endpoint, {
        formId: id,
        error: validationResult.error?.message
      });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid form data',
          details: validationResult.error?.message
        },
        { status: 400 }
      )
    }

    // **OPTIMIZATION 3: Check circuit breaker before database operations**
    if (!updateCircuitBreaker('database', true)) {
      apiLogger.error('Database circuit breaker is OPEN', endpoint, { formId: id });
      return NextResponse.json(
        { success: false, error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    // Extract client information and create submission
    const clientInfo = await extractClientInfoAsync(request);
    
    let submission;
    try {
      submission = await createSubmission(form.value!.id, validationResult.data!, clientInfo);
      updateCircuitBreaker('database', true);
    } catch (error) {
      updateCircuitBreaker('database', false);
      throw error;
    }

    // **OPTIMIZATION 4: Non-blocking email notification with circuit breaker**
    if (form.value!.email_notifications && form.value!.notification_email) {
      // Check email service circuit breaker
      if (updateCircuitBreaker('email', true)) {
        setImmediate(async () => {
          try {
            await sendFormSubmissionNotification({
              form: form.value!,
              submission,
              submissionData: validationResult.data!
            });
            updateCircuitBreaker('email', true);
            apiLogger.info('Email notification sent successfully', endpoint, { 
              formId: id, 
              submissionId: submission.id 
            });
          } catch (error) {
            updateCircuitBreaker('email', false);
            apiLogger.error('Failed to send email notification', endpoint, error, {
              formId: id,
              submissionId: submission.id
            });
          }
        });
      } else {
        apiLogger.warn('Email service circuit breaker is OPEN, skipping notification', endpoint, {
          formId: id,
          submissionId: submission.id
        });
      }
    }

    const responseTime = Date.now() - startTime

    // **OPTIMIZATION 5: Pre-built response data**
    const responseData: ApiResponse = {
      success: true,
      message: 'Form submitted successfully',
      data: {
        id: submission.id,
        submitted_at: submission.submitted_at
      }
    }

    // **OPTIMIZATION: Performance monitoring**
    const metricsStart = Date.now();

    // Log metrics at the end:
    apiLogger.info('Performance metrics', endpoint, {
      formId: id,
      metrics: performanceMetrics,
      totalResponseTime: responseTime
    });

    return new NextResponse(JSON.stringify(responseData), {
      status: 201,
      headers: getOptimizedHeaders(responseTime)
    });
    
  } catch (error) {
    const responseTime = Date.now() - startTime
    
    // **OPTIMIZATION 6: Structured error logging with context**
    const errorContext = {
      formId: (await params).id,
      hasFormData: formData !== null,
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    apiLogger.error('Error processing form submission', `/api/forms/${errorContext.formId}/submit`, error, errorContext);
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process submission'
    }
    
    return new NextResponse(JSON.stringify(response), {
      status: 500,
      headers: getOptimizedHeaders(responseTime)
    });
  }
}

// **OPTIMIZATION 6: Optimized request body parsing with streaming**
async function parseRequestBody(request: NextRequest): Promise<Record<string, string | string[]>> {
  const contentType = request.headers.get('content-type') || '';
  
  if (contentType.includes('application/json')) {
    return await request.json();
  } 
  
  if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const submissionData: Record<string, string | string[]> = {};
    
    // **OPTIMIZATION: Use Map for O(1) lookups instead of object property access**
    const dataMap = new Map<string, string | string[]>();
    
    for (const [key, value] of formData.entries()) {
      const existingValue = dataMap.get(key);
      const stringValue = value.toString();
      
      if (existingValue) {
        if (Array.isArray(existingValue)) {
          existingValue.push(stringValue);
        } else {
          dataMap.set(key, [existingValue, stringValue]);
        }
      } else {
        dataMap.set(key, stringValue);
      }
    }
    
    // Convert Map back to object
    dataMap.forEach((value, key) => {
      submissionData[key] = value;
    });
    
    return submissionData;
  }
  
  throw new Error('Unsupported content type');
}

// **OPTIMIZATION 7: Async client info extraction**
async function extractClientInfoAsync(request: NextRequest): Promise<{
  ip_address?: string | null;
  user_agent?: string | null;
  referrer?: string | null;
}> {
  return {
    ip_address: getIPAddress(request),
    user_agent: request.headers.get('user-agent'),
    referrer: request.headers.get('referer')
  };
}

// **OPTIMIZATION 8: Pre-built headers object**
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
} as const;

function getOptimizedHeaders(responseTime: number): HeadersInit {
  return {
    ...CORS_HEADERS,
    'X-Response-Time': `${responseTime}ms`,
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS
  });
} 