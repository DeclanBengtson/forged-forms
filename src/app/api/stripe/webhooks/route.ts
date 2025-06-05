import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';

// In-memory store for processed webhook events (Issue #2: Idempotency)
// In production, consider using Redis or database for distributed systems
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

// Webhook event handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = (await headers()).get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature header');
      return NextResponse.json(
        { error: 'Missing signature header' },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
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
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Issue #2: Implement idempotency checking
    const eventData = processedEvents.get(event.id);
    if (eventData?.processed) {
      console.log(`Duplicate webhook event ${event.id} - already processed`);
      return NextResponse.json({ 
        received: true, 
        duplicate: true,
        message: 'Event already processed' 
      });
    }

    // Mark event as being processed
    processedEvents.set(event.id, { timestamp: Date.now(), processed: false });

    // Handle the event with comprehensive error handling (Issue #3)
    console.log(`Processing webhook: ${event.type} (ID: ${event.id})`);

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
          console.log(`Unhandled event type: ${event.type}`);
      }

      // Mark event as successfully processed
      processedEvents.set(event.id, { timestamp: Date.now(), processed: true });
      
      // Clean up old events periodically
      if (Math.random() < 0.01) { // 1% chance to clean up
        cleanupOldEvents();
      }

      console.log(`Successfully processed webhook: ${event.type} (ID: ${event.id})`);
      return NextResponse.json({ received: true, eventId: event.id });

    } catch (error) {
      // Issue #3: Comprehensive error handling
      console.error(`Error processing webhook ${event.type} (ID: ${event.id}):`, error);
      
      // Remove from processed events to allow retry
      processedEvents.delete(event.id);
      
      // Log detailed error information
      const errorDetails = {
        eventId: event.id,
        eventType: event.type,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      };
      console.error('Webhook processing failed:', errorDetails);

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
    console.error('Webhook handler error:', error);
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
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('customer_id', customerId)
      .single();
    
    if (error) {
      console.error('Error finding user by customer ID:', error);
      return null;
    }
    
    return data?.user_id;
  } catch (error) {
    console.error('Database error in getUserByCustomerId:', error);
    return null;
  }
}

// Issue #4: Comprehensive failed payment handling
async function sendFailedPaymentNotification(userId: string, invoice: Stripe.Invoice) {
  try {
    // Get user email for notification
    const supabase = await createClient();
    const { data: authUser } = await supabase.auth.admin.getUserById(userId);
    
    if (!authUser.user?.email) {
      console.error(`No email found for user ${userId}`);
      return;
    }

    // Here you would integrate with your email service (SendGrid, etc.)
    // For now, we'll log the notification
    console.log(`FAILED PAYMENT NOTIFICATION for ${authUser.user.email}:`, {
      userId,
      invoiceId: invoice.id,
      amount: (invoice.amount_due / 100).toFixed(2),
      currency: invoice.currency,
      dueDate: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
    });

    // TODO: Implement actual email sending
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
    console.error('Error sending failed payment notification:', error);
  }
}

// Issue #4: Set grace period for failed payments
async function setPaymentGracePeriod(userId: string, graceDays: number = 3) {
  try {
    const supabase = await createClient();
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

    console.log(`Set grace period for user ${userId} until ${gracePeriodEnd.toISOString()}`);
  } catch (error) {
    console.error('Error setting grace period:', error);
  }
}

// Webhook event handlers with improved error handling
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Processing subscription created:', subscription.id);
  
  try {
    const userId = await getUserByCustomerId(subscription.customer as string);
    if (!userId) {
      throw new Error(`User not found for customer: ${subscription.customer}`);
    }

    const supabase = await createClient();
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

    console.log(`Successfully updated user ${userId} to ${subscriptionTier} subscription`);
  } catch (error) {
    console.error('Error handling subscription created:', error);
    throw error; // Re-throw to trigger retry
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Processing subscription updated:', subscription.id);
  
  try {
    const userId = await getUserByCustomerId(subscription.customer as string);
    if (!userId) {
      throw new Error(`User not found for customer: ${subscription.customer}`);
    }

    const supabase = await createClient();
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

    console.log(`Successfully updated user ${userId} subscription to ${subscriptionTier}`);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing subscription deleted:', subscription.id);
  
  try {
    const userId = await getUserByCustomerId(subscription.customer as string);
    if (!userId) {
      throw new Error(`User not found for customer: ${subscription.customer}`);
    }

    const supabase = await createClient();

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

    console.log(`Successfully downgraded user ${userId} to free tier`);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
    throw error;
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Processing payment succeeded:', invoice.id);
  
  try {
    const userId = await getUserByCustomerId(invoice.customer as string);
    if (!userId) {
      console.error('User not found for customer:', invoice.customer);
      return;
    }

    // Clear any grace period on successful payment
    const supabase = await createClient();
    await supabase
      .from('user_profiles')
      .update({
        payment_grace_period_end: null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    console.log(`Payment succeeded for user ${userId}, amount: ${(invoice.amount_paid / 100).toFixed(2)} ${invoice.currency.toUpperCase()}`);
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
    throw error;
  }
}

// Issue #4: Complete failed payment handling implementation
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Processing payment failed:', invoice.id);
  
  try {
    const userId = await getUserByCustomerId(invoice.customer as string);
    if (!userId) {
      throw new Error(`User not found for customer: ${invoice.customer}`);
    }

    const amount = (invoice.amount_due / 100).toFixed(2);
    const currency = invoice.currency.toUpperCase();
    
    console.log(`Payment failed for user ${userId}, amount: ${amount} ${currency}`);

    // 1. Send notification email to user
    await sendFailedPaymentNotification(userId, invoice);

    // 2. Set grace period (3 days by default)
    await setPaymentGracePeriod(userId, 3);

    // 3. Log the failed payment for tracking
    console.log(`Failed payment details:`, {
      userId,
      invoiceId: invoice.id,
      amount,
      currency,
      attemptCount: invoice.attempt_count,
      nextPaymentAttempt: invoice.next_payment_attempt 
        ? new Date(invoice.next_payment_attempt * 1000).toISOString() 
        : null,
    });

    // 4. If this is the final attempt, handle accordingly
    if (invoice.attempt_count >= 4) { // Stripe default is 4 attempts
      console.log(`Final payment attempt failed for user ${userId}, invoice ${invoice.id}`);
      // The subscription will be cancelled automatically by Stripe
      // Our subscription.deleted webhook will handle the downgrade
    }

  } catch (error) {
    console.error('Error handling payment failed:', error);
    throw error;
  }
} 