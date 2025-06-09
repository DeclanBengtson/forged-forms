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
        { error: 'No subscription found' },
        { status: 400 }
      );
    }

    // Reactivate the subscription by removing the cancellation
    const subscription = await stripe.subscriptions.update(
      profile.subscription_id,
      {
        cancel_at_period_end: false,
      }
    );

    // Update the user's profile to reflect the reactivation
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        cancel_at_period_end: false,
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
      message: 'Subscription has been reactivated',
      subscription: {
        id: subscription.id,
        cancel_at_period_end: subscription.cancel_at_period_end
      }
    });

  } catch (error) {
    console.error('Error reactivating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to reactivate subscription' },
      { status: 500 }
    );
  }
} 