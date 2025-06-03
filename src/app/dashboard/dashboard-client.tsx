'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

interface DashboardClientProps {
  user: User
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                FormFlow
              </h1>
              <span className="ml-4 text-gray-600 dark:text-gray-400">Dashboard</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </div>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to your Dashboard
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your forms and view submissions
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Forms</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Submissions</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📧</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">This Week</h3>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🚀</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Ready to create your first form?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Create a form endpoint to start collecting submissions from your website or application.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Create Your First Form
          </button>
        </div>
      </main>
    </div>
  )
} 