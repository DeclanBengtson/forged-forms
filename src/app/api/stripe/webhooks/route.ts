import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/server';
import { createServerClient } from '@supabase/ssr';

// In-memory store for processed webhook events (Issue #2: Idempotency)
// TODO: In production, use Redis or database for distributed systems
const processedEvents = new Map<string, { timestamp: number; processed: boolean }>();

// Clean up old processed events (older than 24 hours)
const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
const cleanupOldEvents = () => {
  const now = Date.now();
  for (const [eventId, data] of processedEvents.entries()) {
    if (now - data.timestamp > CLEANUP_INTERVAL) {
      processedEvents.delete(eventId);
    }
  }
};

// Create a service role client that bypasses RLS for webhook operations
const createServiceClient = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role bypasses RLS 
    {
      cookies: {
        getAll: () => [],
        setAll: () => {}
      }
    }
  )
}

// Webhook event handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = (await headers()).get('stripe-signature');

    if (!signature) {
      console.error('[WEBHOOK] Missing Stripe signature header');
      return NextResponse.json(
        { error: 'Missing signature header' },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('[WEBHOOK] Missing STRIPE_WEBHOOK_SECRET environment variable');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('[WEBHOOK] Signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Issue #2: Implement idempotency checking
    const eventData = processedEvents.get(event.id);
    if (eventData?.processed) {
      return NextResponse.json({ 
        received: true, 
        duplicate: true,
        message: 'Event already processed' 
      });
    }

    // Mark event as being processed
    processedEvents.set(event.id, { timestamp: Date.now(), processed: false });

    // Handle the event with comprehensive error handling
    try {
      switch (event.type) {
        case 'customer.subscription.created':
          await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
          break;
        
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;
        
        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;
        
        case 'invoice.payment_succeeded':
          await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;
        
        case 'invoice.payment_failed':
          await handlePaymentFailed(event.data.object as Stripe.Invoice);
          break;
        
        default:
          // Only log unhandled events in development
          if (process.env.NODE_ENV === 'development') {
            console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
          }
      }

      // Mark event as successfully processed
      processedEvents.set(event.id, { timestamp: Date.now(), processed: true });
      
      // Clean up old events periodically
      if (Math.random() < 0.01) { // 1% chance to clean up
        cleanupOldEvents();
      }

      return NextResponse.json({ received: true, eventId: event.id });

    } catch (error) {
      // Issue #3: Comprehensive error handling
      console.error(`[WEBHOOK] Error processing ${event.type} (${event.id}):`, error);
      
      // Remove from processed events to allow retry
      processedEvents.delete(event.id);
      
      // Log structured error information for monitoring
      const errorDetails = {
        eventId: event.id,
        eventType: event.type,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
      console.error('[WEBHOOK] Processing failed:', errorDetails);

      // Return 500 to trigger Stripe's retry mechanism
      return NextResponse.json(
        { 
          error: 'Webhook handler failed', 
          eventId: event.id,
          retryable: true
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('[WEBHOOK] Handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Helper function to get subscription tier from Stripe price
function getSubscriptionTierFromPrice(priceId: string): 'free' | 'starter' | 'pro' | 'enterprise' {
  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) {
    return 'starter';
  } else if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
    return 'pro';
  } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
    return 'enterprise';
  }
  return 'free';
}

// Helper function to get user by customer ID with error handling
async function getUserByCustomerId(customerId: string) {
  try {
    // Use service role client to bypass RLS in webhook context
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('customer_id', customerId)
      .single();
    
    if (error) {
      console.error('[WEBHOOK] Error finding user by customer ID:', error);
      return null;
    }
    
    return data?.user_id;
  } catch (error) {
    console.error('[WEBHOOK] Database error in getUserByCustomerId:', error);
    return null;
  }
}

// Issue #4: Comprehensive failed payment handling
async function sendFailedPaymentNotification(userId: string, invoice: Stripe.Invoice) {
  try {
    // Get user email for notification
    // Use service role client to bypass RLS in webhook context
    const supabase = createServiceClient();
    const { data: authUser } = await supabase.auth.admin.getUserById(userId);
    
    if (!authUser.user?.email) {
      console.error(`[WEBHOOK] No email found for user ${userId}`);
      return;
    }

    // Log notification details for monitoring
    console.log('[WEBHOOK] Failed payment notification:', {
      userId,
      email: authUser.user.email,
      invoiceId: invoice.id,
      amount: (invoice.amount_due / 100).toFixed(2),
      currency: invoice.currency,
    });

    // TODO: Implement actual email sending service integration
    // await sendEmail({
    //   to: authUser.user.email,
    //   subject: 'Payment Failed - Action Required',
    //   template: 'failed-payment',
    //   data: {
    //     amount: (invoice.amount_due / 100).toFixed(2),
    //     currency: invoice.currency,
    //     invoiceUrl: invoice.hosted_invoice_url,
    //   }
    // });

  } catch (error) {
    console.error('[WEBHOOK] Error sending failed payment notification:', error);
  }
}

// Issue #4: Set grace period for failed payments
async function setPaymentGracePeriod(userId: string, graceDays: number = 3) {
  try {
    // Use service role client to bypass RLS in webhook context
    const supabase = createServiceClient();
    const gracePeriodEnd = new Date();
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + graceDays);

    // Update user profile with grace period information
    await supabase
      .from('user_profiles')
      .update({
        payment_grace_period_end: gracePeriodEnd.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    console.log(`[WEBHOOK] Set ${graceDays}-day grace period for user ${userId}`);
  } catch (error) {
    console.error('[WEBHOOK] Error setting grace period:', error);
  }
}

// Webhook event handlers with improved error handling
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const userId = await getUserByCustomerId(subscription.customer as string);
    if (!userId) {
      throw new Error(`User not found for customer: ${subscription.customer}`);
    }

    // Use service role client to bypass RLS in webhook context
    const supabase = createServiceClient();
    const priceId = subscription.items.data[0]?.price.id;
    const subscriptionTier = getSubscriptionTierFromPrice(priceId);

    // Get period info from subscription items (latest Stripe API structure)
    const firstItem = subscription.items.data[0];
    const currentPeriodStart = firstItem?.current_period_start 
      ? new Date(firstItem.current_period_start * 1000).toISOString() 
      : null;
    const currentPeriodEnd = firstItem?.current_period_end 
      ? new Date(firstItem.current_period_end * 1000).toISOString() 
      : null;

    const { error } = await supabase
      .from('user_profiles')
      .update({
        subscription_status: subscriptionTier,
        subscription_id: subscription.id,
        customer_id: subscription.customer as string,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        cancel_at_period_end: subscription.cancel_at_period_end,
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        payment_grace_period_end: null, // Clear any grace period
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Database update failed: ${error.message}`);
    }

    console.log(`[WEBHOOK] Subscription created: ${subscriptionTier} for user ${userId}`);
  } catch (error) {
    console.error('[WEBHOOK] Error handling subscription created:', error);
    throw error; // Re-throw to trigger retry
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const userId = await getUserByCustomerId(subscription.customer as string);
    if (!userId) {
      throw new Error(`User not found for customer: ${subscription.customer}`);
    }

    // Use service role client to bypass RLS in webhook context
    const supabase = createServiceClient();
    const priceId = subscription.items.data[0]?.price.id;
    const subscriptionTier = getSubscriptionTierFromPrice(priceId);

    // Get period info from subscription items (latest Stripe API structure)
    const firstItem = subscription.items.data[0];
    const currentPeriodStart = firstItem?.current_period_start 
      ? new Date(firstItem.current_period_start * 1000).toISOString() 
      : null;
    const currentPeriodEnd = firstItem?.current_period_end 
      ? new Date(firstItem.current_period_end * 1000).toISOString() 
      : null;

    const { error } = await supabase
      .from('user_profiles')
      .update({
        subscription_status: subscriptionTier,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        cancel_at_period_end: subscription.cancel_at_period_end,
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Database update failed: ${error.message}`);
    }

    console.log(`[WEBHOOK] Subscription updated: ${subscriptionTier} for user ${userId}`);
  } catch (error) {
    console.error('[WEBHOOK] Error handling subscription updated:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const userId = await getUserByCustomerId(subscription.customer as string);
    if (!userId) {
      throw new Error(`User not found for customer: ${subscription.customer}`);
    }

    // Use service role client to bypass RLS in webhook context
    const supabase = createServiceClient();

    const { error } = await supabase
      .from('user_profiles')
      .update({
        subscription_status: 'free',
        subscription_id: null,
        current_period_start: null,
        current_period_end: null,
        cancel_at_period_end: false,
        trial_end: null,
        payment_grace_period_end: null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Database update failed: ${error.message}`);
    }

    console.log(`[WEBHOOK] Subscription deleted: user ${userId} downgraded to free`);
  } catch (error) {
    console.error('[WEBHOOK] Error handling subscription deleted:', error);
    throw error;
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const userId = await getUserByCustomerId(invoice.customer as string);
    if (!userId) {
      console.error('[WEBHOOK] User not found for payment succeeded:', invoice.customer);
      return;
    }

    // Clear any grace period on successful payment
    // Use service role client to bypass RLS in webhook context
    const supabase = createServiceClient();
    await supabase
      .from('user_profiles')
      .update({
        payment_grace_period_end: null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    console.log(`[WEBHOOK] Payment succeeded: ${(invoice.amount_paid / 100).toFixed(2)} ${invoice.currency.toUpperCase()} for user ${userId}`);
  } catch (error) {
    console.error('[WEBHOOK] Error handling payment succeeded:', error);
    throw error;
  }
}

// Issue #4: Complete failed payment handling implementation
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const userId = await getUserByCustomerId(invoice.customer as string);
    if (!userId) {
      throw new Error(`User not found for customer: ${invoice.customer}`);
    }

    const amount = (invoice.amount_due / 100).toFixed(2);
    const currency = invoice.currency.toUpperCase();
    
    console.log(`[WEBHOOK] Payment failed: ${amount} ${currency} for user ${userId}, attempt ${invoice.attempt_count}`);

    // 1. Send notification email to user
    await sendFailedPaymentNotification(userId, invoice);

    // 2. Set grace period (3 days by default)
    await setPaymentGracePeriod(userId, 3);

    // 3. If this is the final attempt, log for monitoring
    if (invoice.attempt_count >= 4) { // Stripe default is 4 attempts
      console.warn(`[WEBHOOK] Final payment attempt failed for user ${userId}, invoice ${invoice.id}`);
      // The subscription will be cancelled automatically by Stripe
      // Our subscription.deleted webhook will handle the downgrade
    }

  } catch (error) {
    console.error('[WEBHOOK] Error handling payment failed:', error);
    throw error;
  }
} 