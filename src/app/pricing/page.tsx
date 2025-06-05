'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getSubscriptionFeatures, redirectToCheckout } from '@/lib/stripe/client';
import Navigation from '@/components/navigation';

interface UserSubscription {
  status: 'free' | 'starter' | 'pro' | 'enterprise';
  subscription_id?: string;
  cancel_at_period_end?: boolean;
}

const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: '$0',
    billing: 'forever',
    features: getSubscriptionFeatures('free'),
    popular: false,
  },
  starter: {
    name: 'Starter',
    price: '$6',
    billing: 'per month',
    features: getSubscriptionFeatures('starter'),
    popular: true,
  },
  pro: {
    name: 'Pro',
    price: '$20',
    billing: 'per month',
    features: getSubscriptionFeatures('pro'),
    popular: false,
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    billing: 'contact us',
    features: getSubscriptionFeatures('enterprise'),
    popular: false,
  },
};

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      try {
        const response = await fetch('/api/user/subscription');
        if (response.ok) {
          const data = await response.json();
          setUserSubscription(data.subscription);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      }
    }
  };

  const handlePlanSelect = async (plan: 'starter' | 'pro' | 'enterprise') => {
    if (!user) {
      router.push('/login?redirect=/pricing');
      return;
    }

    if (plan === 'enterprise') {
      // For enterprise, redirect to contact form or email
      window.location.href = 'mailto:sales@forgedforms.com?subject=Enterprise Plan Inquiry';
      return;
    }

    setLoading(plan);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      await redirectToCheckout(sessionId);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    setLoading('manage');

    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      alert('Failed to open subscription management. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const isCurrentPlan = (plan: string) => {
    return userSubscription?.status === plan;
  };

  const canUpgrade = (plan: string) => {
    if (!userSubscription) return true;
    if (plan === 'starter') return userSubscription.status === 'free';
    if (plan === 'pro') return ['free', 'starter'].includes(userSubscription.status);
    if (plan === 'enterprise') return ['free', 'starter', 'pro'].includes(userSubscription.status);
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Start with our free plan and upgrade as your form needs grow. 
              All plans include our core features with increasing limits and premium support.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {Object.entries(PRICING_PLANS).map(([key, plan]) => (
              <div
                key={key}
                className={`relative rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? 'ring-2 ring-blue-500 transform scale-105 bg-white dark:bg-gray-800'
                    : 'bg-white dark:bg-gray-800 hover:scale-105'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className={`p-6 ${plan.popular ? 'pt-12' : ''}`}>
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2 text-sm">
                        {plan.billing}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-4 h-4 text-green-500 mt-0.5 mr-3 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <div className="text-center">
                    {isCurrentPlan(key) ? (
                      <div>
                        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 py-3 px-4 rounded-lg font-medium mb-4 text-sm">
                          Current Plan
                          {userSubscription?.cancel_at_period_end && (
                            <div className="text-xs mt-1">
                              (Cancelling at period end)
                            </div>
                          )}
                        </div>
                        {userSubscription?.subscription_id && (
                          <button
                            onClick={handleManageSubscription}
                            disabled={loading === 'manage'}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium disabled:opacity-50 text-sm"
                          >
                            {loading === 'manage' ? 'Loading...' : 'Manage Subscription'}
                          </button>
                        )}
                      </div>
                    ) : key === 'free' ? (
                      <div className="text-gray-600 dark:text-gray-400 py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-sm">
                        Always Free
                      </div>
                    ) : key === 'enterprise' ? (
                      <button
                        onClick={() => handlePlanSelect(key as 'starter' | 'pro' | 'enterprise')}
                        className="w-full py-3 px-4 rounded-lg font-medium transition-colors bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm"
                      >
                        Contact Sales
                      </button>
                    ) : canUpgrade(key) ? (
                      <button
                        onClick={() => handlePlanSelect(key as 'starter' | 'pro' | 'enterprise')}
                        disabled={loading === key}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm ${
                          plan.popular
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white'
                        }`}
                      >
                        {loading === key ? 'Loading...' : `Upgrade to ${plan.name}`}
                      </button>
                    ) : (
                      <div className="text-gray-500 dark:text-gray-400 py-3 px-4 rounded-lg border border-gray-200 dark:border-gray-700 text-sm">
                        Contact for Downgrade
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Can I change plans anytime?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                  and we&apos;ll prorate any charges.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  What happens if I exceed my limits?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We&apos;ll notify you when you approach your limits. You can upgrade your plan or 
                  wait until the next billing cycle for your limits to reset.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Is there a trial period?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes! All paid plans come with a 7-day free trial. You can cancel anytime during 
                  the trial without being charged.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  How does Enterprise pricing work?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Enterprise plans are customized based on your specific needs, volume, and requirements. 
                  Contact our sales team for a personalized quote.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 