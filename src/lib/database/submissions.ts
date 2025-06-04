import { createClient } from '@/lib/supabase/server'
import { Submission, SubmissionInsert, PublicFormSubmission } from '@/lib/types/database'
import { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Sanitize form submission data
export function sanitizeSubmissionData(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(data)) {
    // Skip system fields and potential security risks
    if (key.startsWith('_') || key.includes('password') || key.includes('token')) {
      continue
    }
    
    // Sanitize string values
    if (typeof value === 'string') {
      sanitized[key] = value.trim().slice(0, 5000) // Limit length
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value
    } else if (Array.isArray(value)) {
      // Handle arrays (like multi-select inputs)
      sanitized[key] = value
        .filter(item => typeof item === 'string')
        .map(item => item.trim().slice(0, 1000))
        .slice(0, 50) // Limit array size
    }
  }
  
  return sanitized
}

// Extract client information from request
export function extractClientInfo(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwardedFor?.split(',')[0] || realIp || null
  
  return {
    ip_address: ip,
    user_agent: request.headers.get('user-agent') || null,
    referrer: request.headers.get('referer') || null
  }
}

// Create a service role client that bypasses RLS for form submissions
const createServiceClient = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role bypasses RLS
    {
      cookies: {
        getAll: () => [],
        setAll: () => {}
      }
    }
  )
}

// Create a new submission
export async function createSubmission(
  formId: string,
  data: PublicFormSubmission,
  clientInfo: {
    ip_address?: string | null
    user_agent?: string | null
    referrer?: string | null
  }
): Promise<Submission> {
  // Use service role client for form submissions (bypasses RLS issues)
  const serviceSupabase = createServiceClient()
  
  console.log('Creating submission for form:', formId)
  
  // Sanitize the submission data
  const sanitizedData = sanitizeSubmissionData(data)
  
  const submissionData: SubmissionInsert = {
    form_id: formId,
    data: sanitizedData,
    ip_address: clientInfo.ip_address,
    user_agent: clientInfo.user_agent,
    referrer: clientInfo.referrer
  }

  const { data: submission, error } = await serviceSupabase
    .from('submissions')
    .insert(submissionData)
    .select()
    .single()

  if (error) {
    console.error('Submission insert failed:', error.message)
    throw new Error(`Failed to create submission: ${error.message}`)
  }

  console.log('Submission created successfully, ID:', submission.id)
  return submission
}

// Get submissions for a form with pagination
export async function getFormSubmissions(
  formId: string,
  userId: string,
  options: {
    page?: number
    limit?: number
    sortBy?: 'submitted_at' | 'id'
    sortOrder?: 'asc' | 'desc'
  } = {}
): Promise<{
  submissions: Submission[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}> {
  const supabase = await createClient()
  
  const page = options.page || 1
  const limit = Math.min(options.limit || 20, 100) // Max 100 per page
  const offset = (page - 1) * limit
  const sortBy = options.sortBy || 'submitted_at'
  const sortOrder = options.sortOrder || 'desc'

  // First, verify the user owns this form
  const { data: form, error: formError } = await supabase
    .from('forms')
    .select('id')
    .eq('id', formId)
    .eq('user_id', userId)
    .single()

  if (formError || !form) {
    throw new Error('Form not found or access denied')
  }

  // Get total count
  const { count, error: countError } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('form_id', formId)

  if (countError) {
    throw new Error(`Failed to count submissions: ${countError.message}`)
  }

  // Get submissions with pagination
  const { data: submissions, error: submissionsError } = await supabase
    .from('submissions')
    .select('*')
    .eq('form_id', formId)
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(offset, offset + limit - 1)

  if (submissionsError) {
    throw new Error(`Failed to fetch submissions: ${submissionsError.message}`)
  }

  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    submissions: submissions || [],
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  }
}

// Get a single submission
export async function getSubmission(
  submissionId: string,
  userId: string
): Promise<Submission | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      *,
      forms!inner(user_id)
    `)
    .eq('id', submissionId)
    .eq('forms.user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Submission not found
    }
    throw new Error(`Failed to fetch submission: ${error.message}`)
  }

  return data
}

// Delete a submission
export async function deleteSubmission(
  submissionId: string,
  userId: string
): Promise<void> {
  const supabase = await createClient()
  
  // First get the form IDs that belong to the user
  const { data: userForms, error: formsError } = await supabase
    .from('forms')
    .select('id')
    .eq('user_id', userId)

  if (formsError) {
    throw new Error(`Failed to verify form ownership: ${formsError.message}`)
  }

  const formIds = userForms?.map(form => form.id) || []

  if (formIds.length === 0) {
    throw new Error('No forms found for user')
  }

  // Delete the submission if it belongs to one of the user's forms
  const { error } = await supabase
    .from('submissions')
    .delete()
    .eq('id', submissionId)
    .in('form_id', formIds)

  if (error) {
    throw new Error(`Failed to delete submission: ${error.message}`)
  }
}

// Get submission statistics for a form
export async function getSubmissionStats(
  formId: string,
  userId: string
): Promise<{
  total: number
  thisWeek: number
  thisMonth: number
  avgPerDay: number
}> {
  const supabase = await createClient()
  
  // Verify user owns the form
  const { data: form, error: formError } = await supabase
    .from('forms')
    .select('id, created_at')
    .eq('id', formId)
    .eq('user_id', userId)
    .single()

  if (formError || !form) {
    throw new Error('Form not found or access denied')
  }

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Get total count
  const { count: total } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('form_id', formId)

  // Get this week's count
  const { count: thisWeek } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('form_id', formId)
    .gte('submitted_at', weekAgo.toISOString())

  // Get this month's count
  const { count: thisMonth } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('form_id', formId)
    .gte('submitted_at', monthAgo.toISOString())

  // Calculate average per day since form creation
  const formCreated = new Date(form.created_at)
  const daysSinceCreated = Math.max(1, Math.ceil((now.getTime() - formCreated.getTime()) / (24 * 60 * 60 * 1000)))
  const avgPerDay = (total || 0) / daysSinceCreated

  return {
    total: total || 0,
    thisWeek: thisWeek || 0,
    thisMonth: thisMonth || 0,
    avgPerDay: Math.round(avgPerDay * 100) / 100
  }
}

// Export submissions to CSV format
export async function exportSubmissionsToCSV(
  formId: string,
  userId: string
): Promise<string> {
  const supabase = await createClient()
  
  // Verify user owns the form
  const { data: form, error: formError } = await supabase
    .from('forms')
    .select('id, name')
    .eq('id', formId)
    .eq('user_id', userId)
    .single()

  if (formError || !form) {
    throw new Error('Form not found or access denied')
  }

  // Get all submissions
  const { data: submissions, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('form_id', formId)
    .order('submitted_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch submissions: ${error.message}`)
  }

  if (!submissions || submissions.length === 0) {
    return 'No submissions found'
  }

  // Extract all unique field names from all submissions
  const allFields = new Set<string>()
  submissions.forEach(submission => {
    Object.keys(submission.data).forEach(field => allFields.add(field))
  })

  // Create CSV headers
  const headers = ['Submission ID', 'Submitted At', 'IP Address', ...Array.from(allFields)]
  
  // Create CSV rows
  const rows = submissions.map(submission => {
    const row = [
      submission.id,
      new Date(submission.submitted_at).toLocaleString(),
      submission.ip_address || ''
    ]
    
    // Add data fields in consistent order
    allFields.forEach(field => {
      const value = submission.data[field]
      if (Array.isArray(value)) {
        row.push(value.join(', '))
      } else {
        row.push(String(value || ''))
      }
    })
    
    return row
  })

  // Convert to CSV format
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  return csvContent
} 