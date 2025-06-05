import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';

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

    // Handle the event
    console.log(`Received webhook: ${event.type}`);

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

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Helper function to get subscription tier from Stripe price
function getSubscriptionTierFromPrice(priceId: string): 'free' | 'pro' | 'enterprise' {
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
    return 'pro';
  } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
    return 'enterprise';
  }
  return 'free';
}

// Helper function to get user by customer ID
async function getUserByCustomerId(customerId: string) {
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
}

// Webhook event handlers
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Processing subscription created:', subscription.id);
  
  try {
    const userId = await getUserByCustomerId(subscription.customer as string);
    if (!userId) {
      console.error('User not found for customer:', subscription.customer);
      return;
    }

    const supabase = await createClient();
    const priceId = subscription.items.data[0]?.price.id;
    const subscriptionTier = getSubscriptionTierFromPrice(priceId);

    // Get current period from the first subscription item
    const firstItem = subscription.items.data[0];
    const currentPeriodStart = firstItem?.current_period_start 
      ? new Date(firstItem.current_period_start * 1000).toISOString() 
      : null;
    const currentPeriodEnd = firstItem?.current_period_end 
      ? new Date(firstItem.current_period_end * 1000).toISOString() 
      : null;

    await supabase
      .from('user_profiles')
      .update({
        subscription_status: subscriptionTier,
        subscription_id: subscription.id,
        customer_id: subscription.customer as string,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        cancel_at_period_end: subscription.cancel_at_period_end,
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
      })
      .eq('user_id', userId);

    console.log(`Updated user ${userId} to ${subscriptionTier} subscription`);
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Processing subscription updated:', subscription.id);
  
  try {
    const userId = await getUserByCustomerId(subscription.customer as string);
    if (!userId) {
      console.error('User not found for customer:', subscription.customer);
      return;
    }

    const supabase = await createClient();
    const priceId = subscription.items.data[0]?.price.id;
    const subscriptionTier = getSubscriptionTierFromPrice(priceId);

    // Get current period from the first subscription item
    const firstItem = subscription.items.data[0];
    const currentPeriodStart = firstItem?.current_period_start 
      ? new Date(firstItem.current_period_start * 1000).toISOString() 
      : null;
    const currentPeriodEnd = firstItem?.current_period_end 
      ? new Date(firstItem.current_period_end * 1000).toISOString() 
      : null;

    await supabase
      .from('user_profiles')
      .update({
        subscription_status: subscriptionTier,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        cancel_at_period_end: subscription.cancel_at_period_end,
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
      })
      .eq('user_id', userId);

    console.log(`Updated user ${userId} subscription to ${subscriptionTier}`);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing subscription deleted:', subscription.id);
  
  try {
    const userId = await getUserByCustomerId(subscription.customer as string);
    if (!userId) {
      console.error('User not found for customer:', subscription.customer);
      return;
    }

    const supabase = await createClient();

    await supabase
      .from('user_profiles')
      .update({
        subscription_status: 'free',
        subscription_id: null,
        current_period_start: null,
        current_period_end: null,
        cancel_at_period_end: false,
        trial_end: null,
      })
      .eq('user_id', userId);

    console.log(`Downgraded user ${userId} to free tier`);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
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

    // Payment succeeded - subscription should remain active
    // If needed, you can send confirmation emails or update payment status here
    console.log(`Payment succeeded for user ${userId}, amount: ${(invoice.amount_paid / 100).toFixed(2)}`);
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Processing payment failed:', invoice.id);
  
  try {
    const userId = await getUserByCustomerId(invoice.customer as string);
    if (!userId) {
      console.error('User not found for customer:', invoice.customer);
      return;
    }

    // Payment failed - you might want to:
    // 1. Send notification email
    // 2. Set a grace period
    // 3. Update user status to indicate payment issues
    
    console.log(`Payment failed for user ${userId}, amount: ${(invoice.amount_due / 100).toFixed(2)}`);
    
    // TODO: Implement notification system for failed payments
    // This could include email notifications or in-app notifications
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
} 