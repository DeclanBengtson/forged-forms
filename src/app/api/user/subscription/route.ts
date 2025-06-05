import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile, getSubscriptionLimits } from '@/lib/database/users';

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user profile with subscription details
    const profile = await getUserProfile(user.id);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Get subscription limits
    const limits = getSubscriptionLimits(profile.subscription_status);

    // Return subscription information
    return NextResponse.json({
      subscription: {
        status: profile.subscription_status,
        subscription_id: profile.subscription_id,
        customer_id: profile.customer_id,
        current_period_start: profile.current_period_start,
        current_period_end: profile.current_period_end,
        cancel_at_period_end: profile.cancel_at_period_end,
        trial_end: profile.trial_end,
      },
      limits,
      user_id: user.id,
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 