import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/database/users';
import { ApiResponse } from '@/lib/types/database';
import { withRateLimit, getUserIdFromRequest, getUserTierFromRequest } from '@/lib/middleware/rate-limit';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Apply rate limiting for API calls
    const rateLimitResponse = await withRateLimit(
      'api',
      getUserIdFromRequest,
      getUserTierFromRequest
    )(request);
    
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Calculate usage metrics
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    
    // Get all user forms
    const { data: userForms, error: formsError } = await supabase
      .from('forms')
      .select('id')
      .eq('user_id', user.id);
    
    if (formsError) {
      throw new Error(`Failed to get user forms: ${formsError.message}`);
    }
    
    const formIds = userForms?.map(f => f.id) || [];
    
    // Calculate metrics in parallel
    let monthlySubmissions = 0;
    let submissionsThisWeek = 0;
    let totalSubmissions = 0;
    
    if (formIds.length > 0) {
      const [monthlyCount, weeklyCount, totalCount] = await Promise.all([
        supabase
          .from('submissions')
          .select('*', { count: 'exact', head: true })
          .in('form_id', formIds)
          .gte('submitted_at', startOfMonth.toISOString()),
        supabase
          .from('submissions')
          .select('*', { count: 'exact', head: true })
          .in('form_id', formIds)
          .gte('submitted_at', startOfWeek.toISOString()),
        supabase
          .from('submissions')
          .select('*', { count: 'exact', head: true })
          .in('form_id', formIds)
      ]);
      
      monthlySubmissions = monthlyCount.count || 0;
      submissionsThisWeek = weeklyCount.count || 0;
      totalSubmissions = totalCount.count || 0;
    }
    
    // Get user profile for subscription info
    const profile = await getUserProfile(user.id);
    
    const response: ApiResponse = {
      success: true,
      data: {
        usage: {
          formsCount: formIds.length,
          monthlySubmissions,
          submissionsThisWeek,
          totalSubmissions
        },
        subscription: {
          status: profile?.subscription_status || 'free',
          current_period_end: profile?.current_period_end
        }
      },
      message: 'Usage data retrieved successfully'
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error fetching usage data:', error);
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch usage data'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
} 