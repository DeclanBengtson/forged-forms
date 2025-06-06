import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile, getSubscriptionLimits } from '@/lib/database/users';
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

    // Get user profile
    const profile = await getUserProfile(user.id);
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Get subscription limits
    const limits = getSubscriptionLimits(profile.subscription_status);
    
    const response: ApiResponse = {
      success: true,
      data: {
        subscription: {
          status: profile.subscription_status,
          subscription_id: profile.subscription_id,
          customer_id: profile.customer_id,
          current_period_start: profile.current_period_start,
          current_period_end: profile.current_period_end,
          cancel_at_period_end: profile.cancel_at_period_end,
          trial_end: profile.trial_end
        },
        limits
      },
      message: 'Subscription information retrieved successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching subscription information:', error);
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch subscription information'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
} 