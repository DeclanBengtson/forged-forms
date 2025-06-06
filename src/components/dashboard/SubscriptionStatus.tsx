'use client';

import { useState } from 'react';
import { getSubscriptionDisplayName } from '@/lib/stripe/client';
import { toast } from 'react-hot-toast';
import UpgradeModal from './UpgradeModal';

interface SubscriptionStatusProps {
  subscription: {
    status: 'free' | 'starter' | 'pro' | 'enterprise';
    subscription_id?: string;
    current_period_end?: string;
    cancel_at_period_end?: boolean;
    trial_end?: string;
  };
  limits: {
    maxForms: number;
    maxSubmissionsPerMonth: number;
    maxSubmissionsPerForm: number;
    emailNotifications: boolean;
    customDomains: boolean;
    apiAccess: boolean;
    exportData: boolean;
    priority_support: boolean;
  };
  usage: {
    formsCount: number;
    monthlySubmissions: number;
    submissionsThisWeek: number;
  };
}

interface UsageBarProps {
  label: string;
  current: number;
  limit: number;
  className?: string;
}

function UsageBar({ label, current, limit, className = '' }: UsageBarProps) {
  const percentage = limit === -1 ? 0 : Math.min((current / limit) * 100, 100);
  const isUnlimited = limit === -1;
  const isNearLimit = percentage > 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">
          {current} {isUnlimited ? '' : `/ ${limit.toLocaleString()}`}
          {isUnlimited && <span className="text-green-600 ml-1">∞</span>}
        </span>
      </div>
      {!isUnlimited && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isAtLimit
                ? 'bg-red-500'
                : isNearLimit
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
      {isAtLimit && (
        <p className="text-xs text-red-600">Limit reached</p>
      )}
      {isNearLimit && !isAtLimit && (
        <p className="text-xs text-yellow-600">Approaching limit</p>
      )}
    </div>
  );
}

export default function SubscriptionStatus({ subscription, limits, usage }: SubscriptionStatusProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleManageSubscription = async () => {
    if (!subscription.subscription_id) return;

    setLoading('manage');
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create portal session');
      }

      const { url } = await response.json();
      toast.success('Opening subscription management...');
      window.location.href = url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to open subscription management. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleUpgrade = () => {
    window.location.href = '/pricing?from=dashboard';
  };

  const shouldShowUpgrade = () => {
    return subscription.status === 'free' || 
           (subscription.status === 'starter' && (usage.monthlySubmissions / limits.maxSubmissionsPerMonth) > 0.8) ||
           (usage.formsCount >= limits.maxForms && limits.maxForms !== -1);
  };

  const getTrialInfo = () => {
    if (!subscription.trial_end) return null;
    
    const trialEnd = new Date(subscription.trial_end);
    const now = new Date();
    const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft > 0) {
      return `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left in trial`;
    }
    return null;
  };

  const getBillingInfo = () => {
    if (subscription.status === 'free') return null;
    
    if (subscription.current_period_end) {
      const endDate = new Date(subscription.current_period_end);
      const formatted = endDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
      
      if (subscription.cancel_at_period_end) {
        return `Cancels on ${formatted}`;
      }
      return `Renews on ${formatted}`;
    }
    
    return null;
  };

  const trialInfo = getTrialInfo();
  const billingInfo = getBillingInfo();

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-6 hover:border-gray-300 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-normal text-gray-600 uppercase tracking-wide">
          Subscription
        </h3>
        {subscription.status !== 'free' && (
          <button
            onClick={handleManageSubscription}
            disabled={loading === 'manage'}
            className="text-xs font-normal text-gray-500 hover:text-gray-700 transition-colors duration-300 disabled:opacity-50"
          >
            {loading === 'manage' ? 'Loading...' : 'Manage'}
          </button>
        )}
      </div>

      {/* Current Plan */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-medium text-gray-900">
            {getSubscriptionDisplayName(subscription.status)}
          </span>
          {subscription.status !== 'free' && subscription.status !== 'enterprise' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          )}
        </div>
        
        {trialInfo && (
          <div className="text-sm text-blue-600 mb-2">
            🎉 {trialInfo}
          </div>
        )}
        
        {billingInfo && (
          <div className="text-sm text-gray-500">
            {billingInfo}
          </div>
        )}
        
        {subscription.cancel_at_period_end && (
          <div className="text-sm text-orange-600 mt-1">
            ⚠️ Subscription will cancel at period end
          </div>
        )}
      </div>

      {/* Usage Overview */}
      <div className="space-y-4 mb-6">
        <UsageBar
          label="Forms"
          current={usage.formsCount}
          limit={limits.maxForms}
        />
        <UsageBar
          label="Monthly Submissions"
          current={usage.monthlySubmissions}
          limit={limits.maxSubmissionsPerMonth}
        />
      </div>


      {/* Action Buttons */}
      <div className="space-y-3">
        {shouldShowUpgrade() && (
          <div className="space-y-2">
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full py-2.5 px-4 rounded-sm font-medium transition-colors bg-gray-900 hover:bg-gray-800 text-white text-sm"
            >
              {subscription.status === 'free' ? 'Quick Upgrade' : 'Upgrade to Higher Tier'}
            </button>
            <button
              onClick={handleUpgrade}
              className="w-full py-2 px-4 rounded-sm font-medium transition-colors border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 text-sm"
            >
              View All Plans
            </button>
          </div>
        )}
        
        {subscription.status === 'free' && !shouldShowUpgrade() && (
          <div className="text-center space-y-2">
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full py-2.5 px-4 rounded-sm font-medium transition-colors bg-gray-900 hover:bg-gray-800 text-white text-sm"
            >
              Upgrade Plan
            </button>
            <button
              onClick={handleUpgrade}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              View all plans
            </button>
          </div>
        )}
      </div>
      
      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        userSubscription={subscription}
      />
    </div>
  );
} 