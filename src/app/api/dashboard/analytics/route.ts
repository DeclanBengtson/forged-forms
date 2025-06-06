import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServerClient } from '@supabase/ssr'
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

// GET /api/dashboard/analytics - Get dashboard analytics for all user forms
export async function GET(_request: NextRequest) {
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

    // Get all user forms
    const { data: forms } = await supabase
      .from('forms')
      .select('id, name, created_at, is_active')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!forms || forms.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          analytics: {
            totalForms: 0,
            activeForms: 0,
            totalSubmissions: 0,
            submissionsThisWeek: 0,
            submissionsThisMonth: 0,
            topPerformingForms: [],
            recentActivity: [],
            formPerformanceChart: [],
            submissionTrends: []
          }
        }
      })
    }

    // Get all submissions for user's forms
    const formIds = forms.map(form => form.id)
    const { data: submissions } = await serviceSupabase
      .from('submissions')
      .select('form_id, submitted_at, data')
      .in('form_id', formIds)
      .order('submitted_at', { ascending: false })

    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Calculate basic stats
    const totalSubmissions = submissions?.length || 0
    const submissionsThisWeek = submissions?.filter(s => 
      new Date(s.submitted_at) >= weekAgo
    ).length || 0
    const submissionsThisMonth = submissions?.filter(s => 
      new Date(s.submitted_at) >= monthAgo
    ).length || 0

    // Form performance analysis
    const formStats = new Map<string, { submissions: number, name: string, lastSubmission?: Date }>()
    
    // Initialize form stats
    forms.forEach(form => {
      formStats.set(form.id, { 
        submissions: 0, 
        name: form.name, 
        lastSubmission: undefined 
      })
    })

    // Count submissions per form
    submissions?.forEach(submission => {
      const stats = formStats.get(submission.form_id)
      if (stats) {
        stats.submissions++
        const submissionDate = new Date(submission.submitted_at)
        if (!stats.lastSubmission || submissionDate > stats.lastSubmission) {
          stats.lastSubmission = submissionDate
        }
      }
    })

    // Top performing forms
    const topPerformingForms = Array.from(formStats.entries())
      .map(([id, stats]) => ({
        id,
        name: stats.name,
        submissions: stats.submissions,
        lastSubmission: stats.lastSubmission?.toISOString() || null
      }))
      .sort((a, b) => b.submissions - a.submissions)
      .slice(0, 5)

    // Recent activity (last 10 submissions)
    const recentActivity = submissions?.slice(0, 10).map(submission => {
      const form = forms.find(f => f.id === submission.form_id)
      return {
        formName: form?.name || 'Unknown Form',
        formId: submission.form_id,
        submittedAt: submission.submitted_at,
        fieldsCount: Object.keys(submission.data || {}).length
      }
    }) || []

    // Form performance chart (last 7 days)
    const chartData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      const daySubmissions = submissions?.filter(s => 
        s.submitted_at.startsWith(dateStr)
      ).length || 0
      
      chartData.push({
        date: dateStr,
        submissions: daySubmissions,
        displayDate: date.toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric' 
        })
      })
    }

    // Submission trends (daily for last 30 days)
    const submissionTrends = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      const daySubmissions = submissions?.filter(s => 
        s.submitted_at.startsWith(dateStr)
      ).length || 0
      
      submissionTrends.push({
        date: dateStr,
        submissions: daySubmissions,
        displayDate: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      })
    }

    const response: ApiResponse = {
      success: true,
      data: {
        analytics: {
          totalForms: forms.length,
          activeForms: forms.filter(f => f.is_active).length,
          totalSubmissions,
          submissionsThisWeek,
          submissionsThisMonth,
          topPerformingForms,
          recentActivity,
          formPerformanceChart: chartData,
          submissionTrends
        }
      },
      message: 'Dashboard analytics retrieved successfully'
    }

    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch dashboard analytics'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
} 