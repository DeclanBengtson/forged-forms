import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getFormById } from '@/lib/database/forms'
import { getFormSubmissions } from '@/lib/database/submissions'

// GET /api/forms/[id]/submissions/export - Export form submissions as CSV
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Get the form by ID and verify ownership
    const form = await getFormById(id, user.id)
    
    if (!form) {
      return NextResponse.json(
        { success: false, error: 'Form not found' },
        { status: 404 }
      )
    }

    // Get all submissions for this form
    const result = await getFormSubmissions(form.id, user.id, {
      page: 1,
      limit: 10000, // Large limit to get all submissions
      sortBy: 'submitted_at',
      sortOrder: 'desc'
    })

    // Generate CSV content
    const submissions = result.submissions
    
    if (submissions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No submissions to export' },
        { status: 404 }
      )
    }

    // Get all unique field names
    const allFields = new Set<string>()
    submissions.forEach(submission => {
      Object.keys(submission.data).forEach(field => allFields.add(field))
    })
    const fieldNames = Array.from(allFields).sort()

    // Create CSV header
    const csvHeaders = ['Submitted At', 'IP Address', ...fieldNames]
    
    // Create CSV rows
    const csvRows = submissions.map(submission => {
      const row = [
        new Date(submission.submitted_at).toISOString(),
        submission.ip_address || '',
        ...fieldNames.map(field => {
          const value = submission.data[field]
          if (Array.isArray(value)) {
            return `"${value.join(', ')}"`
          }
          return `"${String(value || '')}"`
        })
      ]
      return row.join(',')
    })

    // Combine header and rows
    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n')

    // Generate filename with timestamp
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0] // YYYY-MM-DD format
    const filename = `${form.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-submissions-${dateStr}.csv`

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
    
  } catch (error) {
    console.error('Error exporting submissions:', error)
    
    return NextResponse.json(
      { success: false, error: 'Failed to export submissions' },
      { status: 500 }
    )
  }
} 