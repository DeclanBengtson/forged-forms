import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/database/users';
import { createCustomer, createCheckoutSession } from '@/lib/stripe/server';
import { headers } from 'next/headers';

// Define price mapping for different subscription tiers
const PRICE_MAPPING = {
  starter: process.env.STRIPE_STARTER_PRICE_ID,
  pro: process.env.STRIPE_PRO_PRICE_ID,
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID,
};

export async function POST(request: NextRequest) {
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

    // Parse request body - only accept plan, not priceId for security
    const { plan } = await request.json();

    // Validate the plan
    if (!plan || !['starter', 'pro', 'enterprise'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid subscription plan' },
        { status: 400 }
      );
    }

    // Get the price ID from server-side mapping only (no client override)
    const finalPriceId = PRICE_MAPPING[plan as keyof typeof PRICE_MAPPING];
    
    if (!finalPriceId) {
      return NextResponse.json(
        { error: 'Price ID not configured for this plan' },
        { status: 400 }
      );
    }

    // Get user profile and email
    const profile = await getUserProfile(user.id);
    const email = user.email || user.user_metadata?.email;
    
    if (!email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      );
    }

    let customerId = profile?.customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await createCustomer(
        email,
        user.user_metadata?.full_name || user.user_metadata?.name
      );
      customerId = customer.id;
      // Log customer creation for audit purposes
      console.log(`[STRIPE] Created customer ${customerId} for user ${user.id}`);
    }

    // Always ensure customer_id is linked to user profile (for both new and existing customers)
    const { error: updateError } = await supabase
      .from('user_profiles')
      .upsert({ 
        user_id: user.id,
        customer_id: customerId,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (updateError) {
      console.error('[STRIPE] Error linking customer to user profile:', updateError);
      return NextResponse.json(
        { error: 'Failed to link customer ID to user profile' },
        { status: 500 }
      );
    }

    // Get the origin for success/cancel URLs
    const headersList = await headers();
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create checkout session
    const session = await createCheckoutSession(
      customerId,
      finalPriceId,
      `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      `${origin}/pricing?canceled=true`
    );

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 