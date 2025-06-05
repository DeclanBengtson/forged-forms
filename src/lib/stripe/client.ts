import { loadStripe, Stripe } from '@stripe/stripe-js';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set in environment variables');
}

let stripePromise: Promise<Stripe | null>;

// Initialize Stripe.js
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

// Redirect to Stripe Checkout
export async function redirectToCheckout(sessionId: string) {
  const stripe = await getStripe();
  if (!stripe) {
    throw new Error('Stripe failed to initialize');
  }

  const { error } = await stripe.redirectToCheckout({
    sessionId,
  });

  if (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
}

// Check subscription status helper
export type SubscriptionStatus = 'free' | 'starter' | 'pro' | 'enterprise';

export function getSubscriptionDisplayName(status: SubscriptionStatus): string {
  switch (status) {
    case 'free':
      return 'Free Plan';
    case 'starter':
      return 'Starter Plan';
    case 'pro':
      return 'Pro Plan';
    case 'enterprise':
      return 'Enterprise Plan';
    default:
      return 'Unknown Plan';
  }
}

export function getSubscriptionFeatures(status: SubscriptionStatus): string[] {
  switch (status) {
    case 'free':
      return [
        '250 submissions per month',
        '3 forms maximum',
        'Basic email notifications',
        'Community support'
      ];
    case 'starter':
      return [
        '2,000 submissions per month',
        'Unlimited forms',
        'Email notifications',
        'Email support',
        'Form analytics'
      ];
    case 'pro':
      return [
        '10,000 submissions per month',
        'Unlimited forms',
        'Priority email notifications',
        'Priority support',
        'Advanced analytics',
        'Custom form styling',
        'API access'
      ];
    case 'enterprise':
      return [
        'Unlimited submissions',
        'Unlimited forms',
        'Real-time notifications',
        'Dedicated support',
        'Custom integrations',
        'Advanced analytics',
        'Team management',
        'SLA guarantee'
      ];
    default:
      return [];
  }
} 