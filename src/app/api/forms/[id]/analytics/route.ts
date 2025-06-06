import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServerClient } from '@supabase/ssr'
import { getFormById } from '@/lib/database/forms'
import { ApiResponse } from '@/lib/types/database'

// Create a service role client that bypasses RLS
const createServiceClient = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {}
      }
    }
  )
}

// GET /api/forms/[id]/analytics - Get detailed analytics data for a form
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const serviceSupabase = createServiceClient()
    
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

    // Get submissions for analytics (using service client to bypass RLS)
    const { data: submissions } = await serviceSupabase
      .from('submissions')
      .select('submitted_at, data, ip_address')
      .eq('form_id', id)
      .order('submitted_at', { ascending: true })

    if (!submissions) {
      return NextResponse.json({
        success: true,
        data: {
          form: {
            id: form.id,
            name: form.name,
            created_at: form.created_at
          },
          analytics: {
            timeSeriesData: [],
            fieldAnalysis: {},
            hourlyDistribution: Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 })),
            dailyDistribution: Array.from({ length: 7 }, (_, i) => ({ 
              day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i], 
              count: 0 
            })),
            topLocations: []
          }
        }
      })
    }

    // Process submissions for analytics
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Time series data (daily submissions for the last 30 days)
    const dailySubmissions = new Map<string, number>()
    
    // Initialize all days in the last 30 days with 0
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      dailySubmissions.set(dateStr, 0)
    }

    // Field analysis
    const fieldStats = new Map<string, { total: number, filled: number }>()
    
    // Hourly distribution
    const hourlyDistribution = Array.from({ length: 24 }, () => 0)
    
    // Daily distribution (day of week)
    const dailyDistribution = Array.from({ length: 7 }, () => 0)

    // Process each submission
    submissions.forEach((submission: any) => {
      const submissionDate = new Date(submission.submitted_at)
      
      // Time series data
      const dateStr = submissionDate.toISOString().split('T')[0]
      if (dailySubmissions.has(dateStr)) {
        dailySubmissions.set(dateStr, (dailySubmissions.get(dateStr) || 0) + 1)
      }
      
      // Hourly distribution
      const hour = submissionDate.getHours()
      hourlyDistribution[hour]++
      
      // Daily distribution
      const dayOfWeek = submissionDate.getDay()
      dailyDistribution[dayOfWeek]++
      
      // Field analysis
      const formData = submission.data || {}
      Object.keys(formData).forEach(field => {
        if (!fieldStats.has(field)) {
          fieldStats.set(field, { total: 0, filled: 0 })
        }
        const stats = fieldStats.get(field)!
        stats.total++
        if (formData[field] && formData[field].toString().trim() !== '') {
          stats.filled++
        }
      })
    })

    // Convert time series data to array
    const timeSeriesData = Array.from(dailySubmissions.entries())
      .map(([date, count]) => ({
        date,
        submissions: count,
        displayDate: new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Convert field analysis to object
    const fieldAnalysis = Object.fromEntries(
      Array.from(fieldStats.entries()).map(([field, stats]) => [
        field,
        {
          total: stats.total,
          filled: stats.filled,
          completionRate: stats.total > 0 ? (stats.filled / stats.total) * 100 : 0
        }
      ])
    )

    // Format hourly distribution
    const formattedHourlyDistribution = hourlyDistribution.map((count, hour) => ({
      hour: hour === 0 ? '12 AM' : 
            hour < 12 ? `${hour} AM` : 
            hour === 12 ? '12 PM' : 
            `${hour - 12} PM`,
      count
    }))

    // Format daily distribution
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const formattedDailyDistribution = dailyDistribution.map((count, day) => ({
      day: dayNames[day],
      shortDay: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day],
      count
    }))

    const response: ApiResponse = {
      success: true,
      data: {
        form: {
          id: form.id,
          name: form.name,
          created_at: form.created_at
        },
        analytics: {
          timeSeriesData,
          fieldAnalysis,
          hourlyDistribution: formattedHourlyDistribution,
          dailyDistribution: formattedDailyDistribution,
          totalSubmissions: submissions.length
        }
      },
      message: 'Form analytics retrieved successfully'
    }

    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error fetching form analytics:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch analytics'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
} 