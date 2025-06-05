import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getFormById } from '@/lib/database/forms'
import { getSubmissionStats } from '@/lib/database/submissions'
import { ApiResponse } from '@/lib/types/database'

// GET /api/forms/[id]/stats - Get form submission statistics
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

    // Get submission statistics
    const stats = await getSubmissionStats(form.id, user.id)

    const response: ApiResponse = {
      success: true,
      data: {
        form: {
          id: form.id,
          name: form.name,
          is_active: form.is_active,
          created_at: form.created_at
        },
        stats: {
          total: stats.total,
          thisWeek: stats.thisWeek,
          thisMonth: stats.thisMonth,
          avgPerDay: stats.avgPerDay
        }
      },
      message: 'Form statistics retrieved successfully'
    }

    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error fetching form statistics:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch statistics'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
} 