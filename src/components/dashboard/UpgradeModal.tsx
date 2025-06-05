'use client';

import { useState, useEffect } from 'react';
import { getSubscriptionFeatures, redirectToCheckout } from '@/lib/stripe/client';
import { toast } from 'react-hot-toast';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSubscription: {
    status: 'free' | 'starter' | 'pro' | 'enterprise';
    subscription_id?: string;
  } | null;
}

const PRICING_PLANS = {
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

export default function UpgradeModal({ isOpen, onClose, userSubscription }: UpgradeModalProps) {
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handlePlanSelect = async (plan: 'starter' | 'pro' | 'enterprise') => {
    if (plan === 'enterprise') {
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
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      toast.success('Redirecting to checkout...');
      await redirectToCheckout(sessionId);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const canUpgrade = (plan: string) => {
    if (!userSubscription) return true;
    if (plan === 'starter') return userSubscription.status === 'free';
    if (plan === 'pro') return ['free', 'starter'].includes(userSubscription.status);
    if (plan === 'enterprise') return ['free', 'starter', 'pro'].includes(userSubscription.status);
    return false;
  };

  const handleViewAllPlans = () => {
    onClose();
    window.location.href = '/pricing?from=dashboard';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Upgrade Your Plan</h2>
              <p className="text-sm text-gray-600 mt-1">Choose a plan that fits your needs</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Current Plan */}
          {userSubscription && (
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="text-sm text-gray-600">Current Plan</div>
              <div className="text-lg font-medium text-gray-900 capitalize">
                {userSubscription.status}
              </div>
            </div>
          )}

          {/* Plans */}
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(PRICING_PLANS).map(([key, plan]) => (
                <div
                  key={key}
                  className={`relative rounded-lg border-2 p-6 ${
                    plan.popular
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 text-xs font-medium rounded-full">
                        Recommended
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 ml-2 text-sm">
                        {plan.billing}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.slice(0, 5).map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <svg
                          className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0"
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
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                    {plan.features.length > 5 && (
                      <li className="text-sm text-gray-500 ml-6">
                        +{plan.features.length - 5} more features
                      </li>
                    )}
                  </ul>

                  {canUpgrade(key) ? (
                    <button
                      onClick={() => handlePlanSelect(key as 'starter' | 'pro' | 'enterprise')}
                      disabled={loading === key}
                      className={`w-full py-2.5 px-4 rounded-md font-medium transition-colors disabled:opacity-50 text-sm ${
                        plan.popular
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                    >
                      {loading === key ? 'Loading...' : `Upgrade to ${plan.name}`}
                    </button>
                  ) : (
                    <div className="text-center py-2.5 px-4 rounded-md border border-gray-200 text-sm text-gray-500">
                      {userSubscription?.status === key ? 'Current Plan' : 'Contact Support'}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center">
              <button
                onClick={handleViewAllPlans}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all plans and features →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 