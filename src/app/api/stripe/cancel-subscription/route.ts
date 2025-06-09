import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/database/users';
import { stripe } from '@/lib/stripe/server';

export async function POST(_request: NextRequest) {
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

    // Get user profile
    const profile = await getUserProfile(user.id);
    
    if (!profile?.subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      );
    }

    // Cancel the subscription at period end
    const subscription = await stripe.subscriptions.update(
      profile.subscription_id,
      {
        cancel_at_period_end: true,
      }
    );

    // Update the user's profile to reflect the cancellation
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating user profile:', updateError);
      return NextResponse.json(
        { error: 'Failed to update subscription status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Subscription will be canceled at the end of the billing period',
      subscription: {
        id: subscription.id,
        cancel_at_period_end: subscription.cancel_at_period_end
      }
    });

  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
} 