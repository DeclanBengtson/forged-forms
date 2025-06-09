'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import DashboardNavigation from '@/components/dashboard/DashboardNavigation'
import SubscriptionStatus from '@/components/dashboard/SubscriptionStatus'

interface ProfileClientProps {
  user: User
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

export default function ProfileClient({ user }: ProfileClientProps) {
  const [loading, setLoading] = useState(false)
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setDataLoading(true)
      
      // Fetch subscription data and usage data in parallel
      const [subscriptionResponse, usageResponse] = await Promise.all([
        fetch('/api/user/subscription'),
        fetch('/api/user/usage')
      ])

      if (subscriptionResponse.ok) {
        const response = await subscriptionResponse.json()
        console.log('Subscription API response:', response)
        
        if (response.success && response.data) {
          // Extract the actual data from the API response
          const subData = response.data
          
          // Validate and set default values for subscription data
          const validatedSubData = {
            subscription: {
              status: subData?.subscription?.status || 'free',
              subscription_id: subData?.subscription?.subscription_id || undefined,
              current_period_end: subData?.subscription?.current_period_end || undefined,
              cancel_at_period_end: subData?.subscription?.cancel_at_period_end || false,
              trial_end: subData?.subscription?.trial_end || undefined
            },
            limits: {
              maxForms: subData?.limits?.maxForms || 3,
              maxSubmissionsPerMonth: subData?.limits?.maxSubmissionsPerMonth || 250,
              maxSubmissionsPerForm: subData?.limits?.maxSubmissionsPerForm || 50,
              emailNotifications: subData?.limits?.emailNotifications ?? true,
              customDomains: subData?.limits?.customDomains ?? false,
              apiAccess: subData?.limits?.apiAccess ?? false,
              exportData: subData?.limits?.exportData ?? false,
              priority_support: subData?.limits?.priority_support ?? false
            }
          }
          
          setSubscriptionData(validatedSubData)
        } else {
          console.error('Subscription API returned error:', response.error)
          throw new Error(response.error || 'Failed to fetch subscription data')
        }
      } else {
        console.error('Failed to fetch subscription data:', subscriptionResponse.status)
        // Set default free tier data if API fails
        setSubscriptionData({
          subscription: {
            status: 'free',
            subscription_id: undefined,
            current_period_end: undefined,
            cancel_at_period_end: false,
            trial_end: undefined
          },
          limits: {
            maxForms: 3,
            maxSubmissionsPerMonth: 250,
            maxSubmissionsPerForm: 50,
            emailNotifications: true,
            customDomains: false,
            apiAccess: false,
            exportData: false,
            priority_support: false
          }
        })
      }

      if (usageResponse.ok) {
        const response = await usageResponse.json()
        console.log('Usage API response:', response)
        
        if (response.success && response.data) {
          // Extract the actual data from the API response
          const usageData = response.data
          
          // Validate and set default values for usage data
          const validatedUsageData = {
            usage: {
              formsCount: usageData?.usage?.formsCount || 0,
              monthlySubmissions: usageData?.usage?.monthlySubmissions || 0,
              submissionsThisWeek: usageData?.usage?.submissionsThisWeek || 0,
              totalSubmissions: usageData?.usage?.totalSubmissions || 0,
              submissionTrend: usageData?.usage?.submissionTrend || []
            }
          }
          
          setUsageData(validatedUsageData)
        } else {
          console.error('Usage API returned error:', response.error)
          throw new Error(response.error || 'Failed to fetch usage data')
        }
      } else {
        console.error('Failed to fetch usage data:', usageResponse.status)
        // Set default usage data if API fails
        setUsageData({
          usage: {
            formsCount: 0,
            monthlySubmissions: 0,
            submissionsThisWeek: 0,
            totalSubmissions: 0,
            submissionTrend: []
          }
        })
      }
    } catch (error) {
      console.error('Error fetching profile data:', error)
      // Set default data if there's a network error
      setSubscriptionData({
        subscription: {
          status: 'free',
          subscription_id: undefined,
          current_period_end: undefined,
          cancel_at_period_end: false,
          trial_end: undefined
        },
        limits: {
          maxForms: 3,
          maxSubmissionsPerMonth: 250,
          maxSubmissionsPerForm: 50,
          emailNotifications: true,
          customDomains: false,
          apiAccess: false,
          exportData: false,
          priority_support: false
        }
      })
      
      setUsageData({
        usage: {
          formsCount: 0,
          monthlySubmissions: 0,
          submissionsThisWeek: 0,
          totalSubmissions: 0,
          submissionTrend: []
        }
      })
    } finally {
      setDataLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleCreateForm = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dot-grid dark:dot-grid-dark">
      {/* Fixed Top Navigation */}
      <DashboardNavigation
        forms={[]}
        selectedForm={null}
        onSelectForm={() => {}}
        onCreateForm={handleCreateForm}
        onDeleteForm={() => {}}
        onLogout={handleLogout}
        user={user}
        loading={loading}
      />

      {/* Main Content */}
      <main className="pt-[65px] pl-8 pr-8">
        <div className="max-w-4xl mx-auto py-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-normal text-gray-900 mb-2">Profile</h1>
            <p className="text-sm text-gray-500">Manage your account settings and subscription</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-sm p-6 hover:border-gray-300 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-normal text-gray-600 uppercase tracking-wide">
                    Account Information
                  </h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="text-sm text-gray-900 py-2 px-3 bg-gray-50 border border-gray-200 rounded-sm">
                      {user.email}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                    <div className="text-xs text-gray-500 font-mono py-2 px-3 bg-gray-50 border border-gray-200 rounded-sm">
                      {user.id}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Created</label>
                    <div className="text-sm text-gray-900 py-2 px-3 bg-gray-50 border border-gray-200 rounded-sm">
                      {new Date(user.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="space-y-6">
              {!dataLoading && subscriptionData && usageData && (
                <div>
                  {/* Error boundary wrapper */}
                  {(() => {
                    try {
                      return (
                        <SubscriptionStatus
                          subscription={subscriptionData.subscription}
                          limits={subscriptionData.limits}
                          usage={usageData.usage}
                        />
                      )
                    } catch (error) {
                      console.error('Error rendering SubscriptionStatus:', error)
                      return (
                        <div className="bg-white border border-gray-200 rounded-sm p-6">
                          <div className="text-center">
                            <h3 className="text-sm font-normal text-gray-600 uppercase tracking-wide mb-4">
                              Subscription
                            </h3>
                            <div className="text-red-600 text-sm mb-4">
                              Unable to load subscription information
                            </div>
                            <a
                              href="/pricing"
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-gray-900 rounded-sm hover:bg-gray-800"
                            >
                              View Plans
                            </a>
                          </div>
                        </div>
                      )
                    }
                  })()}
                </div>
              )}
              
              {dataLoading && (
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
              
              {!dataLoading && (!subscriptionData || !usageData) && (
                <div className="bg-white border border-gray-200 rounded-sm p-6">
                  <div className="text-center">
                    <h3 className="text-sm font-normal text-gray-600 uppercase tracking-wide mb-4">
                      Subscription
                    </h3>
                    <div className="text-gray-600 text-sm mb-4">
                      Unable to load subscription data
                    </div>
                    <button
                      onClick={fetchProfileData}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
                    >
                      Retry
                    </button>
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
                      onClick={handleCreateForm}
                      className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-sm hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded-sm flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-normal text-gray-900">Go to Dashboard</div>
                          <div className="text-xs text-gray-500">View all forms</div>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>

                    <a
                      href="/pricing?from=profile"
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
                          <div className="text-xs text-gray-500">
                            {subscriptionData?.subscription?.status === 'free' ? 'Upgrade subscription' : 'Manage subscription'}
                          </div>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </a>

                    <button
                      onClick={handleLogout}
                      disabled={loading}
                      className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-sm hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 group disabled:opacity-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded-sm flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-normal text-gray-900">
                            {loading ? 'Signing out...' : 'Sign Out'}
                          </div>
                          <div className="text-xs text-gray-500">End current session</div>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 