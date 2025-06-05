'use client';

import { useState, useEffect } from 'react';
import { Form } from '@/lib/types/database';
import SubscriptionStatus from './SubscriptionStatus';

interface DashboardOverviewProps {
  forms: Form[];
  onCreateForm: () => void;
  onDeleteForm: (form: Form) => void;
  user: { email?: string };
}

interface DashboardStats {
  totalForms: number;
  totalSubmissions: number;
  submissionsThisWeek: number;
  activeForms: number;
}

interface SubscriptionData {
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
}

interface UsageData {
  usage: {
    formsCount: number;
    monthlySubmissions: number;
    submissionsThisWeek: number;
    totalSubmissions: number;
    submissionTrend: Array<{ date: string; count: number }>;
  };
}

// Utility function to format UUID for display
function formatUUID(uuid: string): string {
  return `${uuid.substring(0, 8)}...${uuid.substring(uuid.length - 8)}`
}

export default function DashboardOverview({ forms, onCreateForm, onDeleteForm, user }: DashboardOverviewProps) {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch subscription data and usage data in parallel
      const [subscriptionResponse, usageResponse] = await Promise.all([
        fetch('/api/user/subscription'),
        fetch('/api/user/usage')
      ]);

      if (subscriptionResponse.ok) {
        const subData = await subscriptionResponse.json();
        setSubscriptionData(subData);
      }

      if (usageResponse.ok) {
        const usageData = await usageResponse.json();
        setUsageData(usageData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats: DashboardStats = {
    totalForms: forms.length,
    totalSubmissions: usageData?.usage.totalSubmissions || 0,
    submissionsThisWeek: usageData?.usage.submissionsThisWeek || 0,
    activeForms: forms.filter(form => form.is_active).length
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-2xl font-medium text-gray-900 mb-3">
            {user.email?.split('@')[0]}
          </h1>
          <p className="text-sm text-gray-500 font-light">
            Dashboard overview and workspace management
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-sm p-6 hover:border-gray-300 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-normal text-gray-400 uppercase tracking-wide mb-2">Forms</div>
                <div className="text-2xl font-medium text-gray-900">{stats.totalForms}</div>
              </div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-6 hover:border-gray-300 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-normal text-gray-400 uppercase tracking-wide mb-2">Active</div>
                <div className="text-2xl font-medium text-gray-900">{stats.activeForms}</div>
              </div>
              <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-6 hover:border-gray-300 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-normal text-gray-400 uppercase tracking-wide mb-2">Submissions</div>
                <div className="text-2xl font-medium text-gray-900">{loading ? '...' : stats.totalSubmissions}</div>
              </div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-6 hover:border-gray-300 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-normal text-gray-400 uppercase tracking-wide mb-2">This Week</div>
                <div className="text-2xl font-medium text-gray-900">{loading ? '...' : stats.submissionsThisWeek}</div>
              </div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {forms.length === 0 ? (
          // Getting Started Section with Subscription Info
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-sm p-16 hover:border-gray-300 transition-all duration-300">
                <div className="text-center max-w-md mx-auto">
                  <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-sm flex items-center justify-center mx-auto mb-6">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    No forms yet
                  </h2>
                  <p className="text-sm text-gray-500 font-light mb-8 leading-relaxed">
                    Create your first form endpoint to start collecting submissions and managing your data workflow.
                  </p>
                  
                  <button
                    onClick={onCreateForm}
                    className="inline-flex items-center px-5 py-2.5 text-sm font-normal text-white bg-gray-900 border border-gray-900 rounded-sm hover:bg-gray-800 hover:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300"
                  >
                    <svg className="w-3.5 h-3.5 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Create Form
                  </button>
                </div>
              </div>
            </div>

            {/* Subscription Status for New Users */}
            <div className="space-y-6">
              {!loading && subscriptionData && usageData && (
                <SubscriptionStatus
                  subscription={subscriptionData.subscription}
                  limits={subscriptionData.limits}
                  usage={usageData.usage}
                />
              )}
              
              {loading && (
                <div className="bg-white border border-gray-200 rounded-sm p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Forms */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-sm hover:border-gray-300 transition-all duration-300">
                <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
                  <div className="text-sm font-normal text-gray-600 uppercase tracking-wide">
                    Forms
                  </div>
                  <button
                    onClick={onCreateForm}
                    className="text-xs font-normal text-gray-500 hover:text-gray-700 transition-colors duration-300"
                  >
                    + New
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {forms.slice(0, 5).map((form) => (
                      <div
                        key={form.id}
                        className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0 group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-2 h-2 rounded-full ${
                            form.is_active ? 'bg-gray-900' : 'bg-gray-300'
                          }`} />
                          <div>
                            <div className="font-normal text-sm text-gray-900">
                              {form.name}
                            </div>
                            <div className="text-xs text-gray-400 font-mono mt-1">
                              ID: {formatUUID(form.id)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-xs font-normal text-gray-900">
                              {loading ? '...' : '0'}
                            </div>
                            <div className="text-xs text-gray-400 font-normal">
                              {new Date(form.created_at).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                          </div>
                          <button
                            onClick={() => onDeleteForm(form)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-300"
                            title={`Delete ${form.name}`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {forms.length > 5 && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-400 font-normal text-center">
                        +{forms.length - 5} more forms
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subscription Status & Quick Actions */}
            <div className="space-y-6">
              {/* Subscription Status */}
              {!loading && subscriptionData && usageData && (
                <SubscriptionStatus
                  subscription={subscriptionData.subscription}
                  limits={subscriptionData.limits}
                  usage={usageData.usage}
                />
              )}
              
              {loading && (
                <div className="bg-white border border-gray-200 rounded-sm p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-white border border-gray-200 rounded-sm hover:border-gray-300 transition-all duration-300">
                <div className="px-6 py-6 border-b border-gray-100">
                  <div className="text-sm font-normal text-gray-600 uppercase tracking-wide">
                    Quick Actions
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <button
                      onClick={onCreateForm}
                      className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-sm hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded-sm flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-normal text-gray-900">Create New Form</div>
                          <div className="text-xs text-gray-500">Set up a new endpoint</div>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>

                    <a
                      href="/pricing?from=dashboard"
                      className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-sm hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded-sm flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.94" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-normal text-gray-900">View Plans</div>
                          <div className="text-xs text-gray-500">Upgrade or manage</div>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 