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
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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

  const handleCancelSubscription = async () => {
    if (!subscription.subscription_id) return;

    setLoading('cancel');
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel subscription');
      }

      await response.json();
      toast.success('Subscription will be canceled at the end of your billing period');
      setShowCancelConfirm(false);
      
      // Refresh the page to show updated cancellation status
      window.location.reload();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to cancel subscription. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleReactivateSubscription = async () => {
    if (!subscription.subscription_id) return;

    setLoading('reactivate');
    try {
      const response = await fetch('/api/stripe/reactivate-subscription', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reactivate subscription');
      }

      toast.success('Subscription has been reactivated');
      
      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to reactivate subscription. Please try again.');
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
  const isPaidSubscription = subscription.status !== 'free' && subscription.subscription_id;
  const isCanceling = subscription.cancel_at_period_end;

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-6 hover:border-gray-300 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-normal text-gray-600 uppercase tracking-wide">
          Subscription
        </h3>
      </div>

      {/* Current Plan */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-medium text-gray-900">
            {getSubscriptionDisplayName(subscription.status)}
          </span>
          {isPaidSubscription && !isCanceling && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          )}
          {isCanceling && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Canceling
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
        
        {isCanceling && (
          <div className="text-sm text-orange-600 mt-2 p-3 bg-orange-50 border border-orange-200 rounded-sm">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="font-medium">Subscription Canceling</p>
                <p className="text-xs mt-1">
                  You&apos;ll keep access to all features until {billingInfo?.replace('Cancels on ', '')}. 
                  After that, you&apos;ll be moved to the free plan.
                </p>
              </div>
            </div>
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
        {/* Reactivate button for canceled subscriptions */}
        {isCanceling && (
          <button
            onClick={handleReactivateSubscription}
            disabled={loading === 'reactivate'}
            className="w-full py-2.5 px-4 rounded-sm font-medium transition-colors bg-green-600 hover:bg-green-700 text-white text-sm disabled:opacity-50"
          >
            {loading === 'reactivate' ? 'Reactivating...' : 'Reactivate Subscription'}
          </button>
        )}

        {/* Upgrade buttons */}
        {shouldShowUpgrade() && !isCanceling && (
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

        {/* Subscription management buttons for paid users */}
        {isPaidSubscription && (
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <button
              onClick={handleManageSubscription}
              disabled={loading === 'manage'}
              className="w-full py-2 px-4 rounded-sm font-medium transition-colors border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 text-sm disabled:opacity-50"
            >
              {loading === 'manage' ? 'Loading...' : 'Manage Billing & Payment'}
            </button>
            
            {!isCanceling && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="w-full py-2 px-4 rounded-sm font-medium transition-colors text-red-600 hover:text-red-700 hover:bg-red-50 text-sm"
              >
                Cancel Subscription
              </button>
            )}
          </div>
        )}
      </div>
      
             {/* Cancel Confirmation Modal */}
       {showCancelConfirm && (
         <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Cancel Subscription</h3>
            </div>
            
            <div className="mb-6 space-y-3 text-sm text-gray-600">
              <p>Are you sure you want to cancel your <strong>{getSubscriptionDisplayName(subscription.status)}</strong> subscription?</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
                <h4 className="font-medium text-blue-900 mb-2">What happens when you cancel:</h4>
                <ul className="text-blue-800 space-y-1 text-xs">
                  <li>• You&apos;ll keep access until {billingInfo?.replace('Renews on ', '') || 'your billing period ends'}</li>
                  <li>• No further charges will be made</li>
                  <li>• You&apos;ll automatically move to the free plan</li>
                  <li>• Your forms and data will be preserved</li>
                  <li>• You can reactivate anytime before the period ends</li>
                </ul>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={loading === 'cancel'}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading === 'cancel' ? 'Canceling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        userSubscription={subscription}
      />
    </div>
  );
} 