import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserForms } from '@/lib/database/forms'
import { exportSubmissionsToCSV } from '@/lib/database/submissions'

// GET /api/forms/[slug]/submissions/export - Export submissions as CSV
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
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

    const { slug } = await params

    // Find the form by slug
    const userForms = await getUserForms(user.id)
    const form = userForms.find(f => f.slug === slug)
    
    if (!form) {
      return NextResponse.json(
        { success: false, error: 'Form not found' },
        { status: 404 }
      )
    }

    // Export submissions to CSV
    const csvContent = await exportSubmissionsToCSV(form.id, user.id)

    // Create filename with form name and current date
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0] // YYYY-MM-DD format
    const filename = `${form.slug}-submissions-${dateStr}.csv`

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    })
    
  } catch (error) {
    console.error('Error exporting submissions:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to export submissions' 
      },
      { status: 500 }
    )
  }
} 