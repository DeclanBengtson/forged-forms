import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getFormById } from '@/lib/database/forms'
import { getFormSubmissions } from '@/lib/database/submissions'
import { PaginatedResponse } from '@/lib/types/database'
import { withRateLimit, getUserIdFromRequest, getUserTierFromRequest } from '@/lib/middleware/rate-limit'

// GET /api/forms/[id]/submissions - Get submissions for a form
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

    // Apply rate limiting for API calls
    const rateLimitResponse = await withRateLimit(
      'api',
      getUserIdFromRequest,
      getUserTierFromRequest
    )(request)
    
    if (rateLimitResponse) {
      return rateLimitResponse
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

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const sortBy = searchParams.get('sortBy') as 'submitted_at' | 'id' || 'submitted_at'
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc'

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, error: 'Invalid pagination parameters' },
        { status: 400 }
      )
    }

    // Get submissions with pagination
    const result = await getFormSubmissions(form.id, user.id, {
      page,
      limit,
      sortBy,
      sortOrder
    })

    const response: PaginatedResponse<any> = {
      success: true,
      data: result.submissions,
      pagination: result.pagination,
      message: `Found ${result.pagination.total} submissions`
    }

    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error fetching submissions:', error)
    
    const response: PaginatedResponse<any> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch submissions',
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
      }
    }
    
    return NextResponse.json(response, { status: 500 })
  }
} 