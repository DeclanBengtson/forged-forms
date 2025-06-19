'use client';

import { useState, useEffect } from 'react';
import { Form } from '@/lib/types/database';
import { getDashboardAnalytics } from '@/lib/api/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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



// Utility function to format UUID for display
function formatUUID(uuid: string): string {
  return `${uuid.substring(0, 8)}...${uuid.substring(uuid.length - 8)}`
}

export default function DashboardOverview({ forms, onCreateForm, onDeleteForm, user }: DashboardOverviewProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [_analyticsLoading, setAnalyticsLoading] = useState(false);

  // Load analytics when component mounts and there are forms
  useEffect(() => {
    if (forms.length > 0) {
      loadAnalytics();
    }
  }, [forms.length]);

  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const result = await getDashboardAnalytics();
      if (result.success && result.data) {
        setAnalytics(result.data.analytics);
      }
    } catch (err) {
      console.error('Failed to load dashboard analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const stats: DashboardStats = {
    totalForms: analytics?.totalForms || forms.length,
    totalSubmissions: analytics?.totalSubmissions || 0,
    submissionsThisWeek: analytics?.submissionsThisWeek || 0,
    activeForms: analytics?.activeForms || forms.filter(form => form.is_active).length
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
                <div className="text-2xl font-medium text-gray-900">{stats.totalSubmissions}</div>
              </div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-6 hover:border-gray-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-normal text-gray-400 uppercase tracking-wide mb-2">This Week</div>
                <div className="text-2xl font-medium text-gray-900">{stats.submissionsThisWeek}</div>
              </div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Analytics Section - Only show when there are forms and submissions */}
        {forms.length > 0 && analytics && analytics.totalSubmissions > 0 && (
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Analytics Overview</h2>
              <p className="text-sm text-gray-500 font-light">
                Insights across all your forms
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Submission Trends Chart */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 rounded-sm p-6 hover:border-gray-300 transition-all duration-300">
                  <h3 className="text-sm font-normal text-gray-600 uppercase tracking-wide mb-4">
                    Submission Trends (Last 7 Days)
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.formPerformanceChart}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="displayDate" 
                          stroke="#6b7280"
                          fontSize={11}
                        />
                        <YAxis stroke="#6b7280" fontSize={11} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="submissions" 
                          stroke="#1f2937" 
                          strokeWidth={2}
                          dot={{ fill: '#1f2937', r: 3 }}
                          activeDot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Top Performing Forms */}
              <div>
                <div className="bg-white border border-gray-200 rounded-sm p-6 hover:border-gray-300 transition-all duration-300">
                  <h3 className="text-sm font-normal text-gray-600 uppercase tracking-wide mb-4">
                    Top Performing Forms
                  </h3>
                  <div className="space-y-3">
                    {analytics.topPerformingForms.slice(0, 5).map((form: any, index: number) => (
                      <div key={form.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-gray-100 border border-gray-200 rounded-sm flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                          </div>
                          <div>
                            <div className="text-sm font-normal text-gray-900 truncate max-w-32">
                              {form.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {form.submissions} submissions
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            {analytics.recentActivity.length > 0 && (
              <div className="mt-8">
                <div className="bg-white border border-gray-200 rounded-sm p-6 hover:border-gray-300 transition-all duration-300">
                  <h3 className="text-sm font-normal text-gray-600 uppercase tracking-wide mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {analytics.recentActivity.slice(0, 5).map((activity: any, index: number) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div>
                            <div className="text-sm font-normal text-gray-900">
                              New submission to <span className="font-medium">{activity.formName}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {activity.fieldsCount} fields • {new Date(activity.submittedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

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
                    className="inline-flex items-center px-5 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
                  >
                    <svg className="w-3.5 h-3.5 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Create Form
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions for New Users */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-sm hover:border-gray-300 transition-all duration-300">
                <div className="px-6 py-6 border-b border-gray-100">
                  <div className="text-sm font-normal text-gray-600 uppercase tracking-wide">
                    Quick Actions
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <a
                      href="/dashboard/profile"
                      className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-sm hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded-sm flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-normal text-gray-900">View Profile</div>
                          <div className="text-xs text-gray-500">Manage subscription & settings</div>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </a>

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
                
                <div className="p-8">
                  <div className="space-y-4">
                    {forms.slice(0, 5).map((form) => (
                      <div
                        key={form.id}
                        className="flex items-center justify-between pt-6 pb-4 border-b border-gray-100 last:border-b-0 group"
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
                              {analytics?.topPerformingForms?.find((f: any) => f.id === form.id)?.submissions || 0}
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

            {/* Quick Actions */}
            <div className="space-y-6">
              {/* Profile Link */}
              <div className="bg-white border border-gray-200 rounded-sm hover:border-gray-300 transition-all duration-300">
                <div className="px-6 py-6 border-b border-gray-100">
                  <div className="text-sm font-normal text-gray-600 uppercase tracking-wide">
                    Account
                  </div>
                </div>
                
                <div className="p-6">
                  <a
                    href="/dashboard/profile"
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-sm hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded-sm flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-normal text-gray-900">View Profile</div>
                        <div className="text-xs text-gray-500">Manage subscription & settings</div>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </a>
                </div>
              </div>

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