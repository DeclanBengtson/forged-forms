'use client';

import { useState } from 'react';

interface UpgradePromptProps {
  subscription: {
    status: 'free' | 'starter' | 'pro' | 'enterprise';
  };
  limits: {
    maxForms: number;
    maxSubmissionsPerMonth: number;
  };
  usage: {
    formsCount: number;
    monthlySubmissions: number;
  };
  onDismiss?: () => void;
}

export default function UpgradePrompt({ subscription, limits, usage, onDismiss }: UpgradePromptProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const getUpgradeReason = () => {
    // Check if approaching form limit
    if (limits.maxForms !== -1 && usage.formsCount >= limits.maxForms * 0.8) {
      return {
        type: 'forms',
        message: `You're using ${usage.formsCount} of ${limits.maxForms} forms`,
        critical: usage.formsCount >= limits.maxForms
      };
    }

    // Check if approaching monthly submission limit
    if (limits.maxSubmissionsPerMonth !== -1 && usage.monthlySubmissions >= limits.maxSubmissionsPerMonth * 0.8) {
      return {
        type: 'submissions',
        message: `You've used ${usage.monthlySubmissions} of ${limits.maxSubmissionsPerMonth} monthly submissions`,
        critical: usage.monthlySubmissions >= limits.maxSubmissionsPerMonth
      };
    }

    // Show general upgrade for free users with any usage
    if (subscription.status === 'free' && (usage.formsCount > 0 || usage.monthlySubmissions > 0)) {
      return {
        type: 'general',
        message: 'Upgrade to unlock unlimited forms and higher submission limits',
        critical: false
      };
    }

    return null;
  };

  const upgradeReason = getUpgradeReason();

  if (!upgradeReason) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const handleUpgrade = () => {
    window.location.href = '/pricing?from=dashboard';
  };

  return (
    <div className={`rounded-lg border p-4 ${
      upgradeReason.critical 
        ? 'bg-red-50 border-red-200' 
        : 'bg-yellow-50 border-yellow-200'
    }`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {upgradeReason.critical ? (
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${
            upgradeReason.critical ? 'text-red-800' : 'text-yellow-800'
          }`}>
            {upgradeReason.critical ? 'Limit Reached' : 'Upgrade Recommended'}
          </h3>
          <div className={`mt-1 text-sm ${
            upgradeReason.critical ? 'text-red-700' : 'text-yellow-700'
          }`}>
            <p>{upgradeReason.message}</p>
          </div>
          <div className="mt-3 flex space-x-3">
            <button
              onClick={handleUpgrade}
              className={`inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                upgradeReason.critical
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
              }`}
            >
              {subscription.status === 'free' ? 'Upgrade Now' : 'View Higher Plans'}
            </button>
            <button
              onClick={handleDismiss}
              className={`inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium ${
                upgradeReason.critical
                  ? 'text-red-700 hover:text-red-600'
                  : 'text-yellow-700 hover:text-yellow-600'
              }`}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 