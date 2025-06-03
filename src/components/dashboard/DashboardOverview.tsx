'use client';

import { Form } from '@/lib/types/database';

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

interface ActivityItem {
  type: 'submission' | 'form_created';
  form: string;
  time: string;
}

export default function DashboardOverview({ forms, onCreateForm, onDeleteForm, user }: DashboardOverviewProps) {
  const stats: DashboardStats = {
    totalForms: forms.length,
    totalSubmissions: 0, // This would come from API in real implementation
    submissionsThisWeek: 0, // This would come from API in real implementation
    activeForms: forms.filter(form => form.is_active).length
  };

  const recentActivity: ActivityItem[] = [
    // This would come from API in real implementation
    // { type: 'submission', form: 'Contact Form', time: '2 minutes ago' },
    // { type: 'form_created', form: 'Newsletter Signup', time: '1 hour ago' },
  ];

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here&apos;s an overview of your form activity and performance.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Forms</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalForms}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Forms</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeForms}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Submissions</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSubmissions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">This Week</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.submissionsThisWeek}</p>
              </div>
            </div>
          </div>
        </div>

        {forms.length === 0 ? (
          // Getting Started Section
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                🚀 Welcome to FormFlow!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                You&apos;re all set up and ready to start collecting form submissions. Create your first form to get started!
              </p>
              
              <button
                onClick={onCreateForm}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Create Your First Form
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Forms */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Your Forms
                  </h2>
                  <button
                    onClick={onCreateForm}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    Create New Form
                  </button>
                </div>
                
                <div className="space-y-3">
                  {forms.slice(0, 5).map((form) => (
                    <div
                      key={form.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          form.is_active ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {form.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            /{form.slug}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            0 submissions
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Created {new Date(form.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => onDeleteForm(form)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                          title={`Delete ${form.name}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {forms.length > 5 && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      And {forms.length - 5} more forms...
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={onCreateForm}
                    className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Create Form</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Set up a new form endpoint</p>
                    </div>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">View Docs</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Integration guide & API reference</p>
                    </div>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Settings</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Account & notification settings</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h3>
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No recent activity
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 dark:text-white">
                            {activity.type === 'submission' ? 'New submission' : 'Form created'} for {activity.form}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 