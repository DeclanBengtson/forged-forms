import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/database/users';
import { createPortalSession } from '@/lib/stripe/server';
import { headers } from 'next/headers';

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
    
    if (!profile?.customer_id) {
      return NextResponse.json(
        { error: 'No Stripe customer found. Please subscribe first.' },
        { status: 400 }
      );
    }

    // Get the origin for return URL
    const headersList = await headers();
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create portal session
    const session = await createPortalSession(
      profile.customer_id,
      `${origin}/dashboard`
    );

    return NextResponse.json({
      url: session.url,
    });

  } catch (error) {
    console.error('Error creating portal session:', error);
    
    // Check if this is the specific Stripe portal configuration error
    if (error instanceof Error && error.message.includes('configuration') && error.message.includes('portal')) {
      return NextResponse.json(
        { 
          error: 'Failed to create portal session',
          message: 'Billing portal is currently being configured. Please contact support for assistance with your subscription.'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create portal session',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
} 