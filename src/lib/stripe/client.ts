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
export type SubscriptionStatus = 'free' | 'pro' | 'enterprise';

export function getSubscriptionDisplayName(status: SubscriptionStatus): string {
  switch (status) {
    case 'free':
      return 'Free Plan';
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
        '10 form submissions per month',
        'Basic email notifications',
        'Community support'
      ];
    case 'pro':
      return [
        '500 form submissions per month',
        'Priority email notifications',
        'Email support',
        'Custom form styling',
        'Analytics dashboard'
      ];
    case 'enterprise':
      return [
        'Unlimited form submissions',
        'Advanced email notifications',
        'Priority support',
        'Custom integrations',
        'Advanced analytics',
        'Team management'
      ];
    default:
      return [];
  }
} 