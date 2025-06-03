'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { Form } from '@/lib/types/database'
import { listForms } from '@/lib/api/client'
import FormCreateModal from '@/components/dashboard/FormCreateModal'
import FormsList from '@/components/dashboard/FormsList'

interface DashboardClientProps {
  user: User
}

interface DashboardStats {
  totalForms: number
  totalSubmissions: number
  submissionsThisWeek: number
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [loading, setLoading] = useState(false)
  const [forms, setForms] = useState<Form[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalForms: 0,
    totalSubmissions: 0,
    submissionsThisWeek: 0
  })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [formsLoading, setFormsLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  // Load forms and stats on component mount
  useEffect(() => {
    loadForms()
  }, [])

  const loadForms = async () => {
    setFormsLoading(true)
    try {
      const result = await listForms()
      if (result.success && result.data) {
        setForms(result.data)
        
        // Calculate basic stats from forms data
        const totalForms = result.data.length
        // Note: We'll enhance this with real submission counts when we implement form stats
        setStats({
          totalForms,
          totalSubmissions: 0, // Will be calculated from API
          submissionsThisWeek: 0 // Will be calculated from API
        })
      }
    } catch (error) {
      console.error('Failed to load forms:', error)
    } finally {
      setFormsLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleFormCreated = (newForm: Form) => {
    setForms(prev => [newForm, ...prev])
    setStats(prev => ({ ...prev, totalForms: prev.totalForms + 1 }))
  }

  const handleFormDeleted = (slug: string) => {
    setForms(prev => prev.filter(form => form.slug !== slug))
    setStats(prev => ({ ...prev, totalForms: prev.totalForms - 1 }))
  }

  const handleFormUpdated = () => {
    loadForms() // Reload forms when one is updated
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
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your forms and view submissions
            </p>
          </div>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Create Form
          </button>
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
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formsLoading ? '...' : stats.totalForms}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Submissions</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.totalSubmissions}
                </p>
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
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.submissionsThisWeek}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Forms Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Forms
            </h3>
            {forms.length > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {forms.length} form{forms.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {formsLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <div className="text-gray-600 dark:text-gray-400">Loading forms...</div>
            </div>
          ) : (
            <FormsList 
              forms={forms}
              onFormDeleted={handleFormDeleted}
              onFormUpdated={handleFormUpdated}
            />
          )}
        </div>

        {/* Getting Started Section (only show if no forms) */}
        {!formsLoading && forms.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              🚀 Getting Started
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  1. Create your first form
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Click "Create Form" to set up a new form endpoint. You'll get a unique URL that can receive submissions.
                </p>
                
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  2. Integrate with your website
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Use the provided endpoint URL in your HTML forms or JavaScript to start collecting submissions.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Example HTML Form:
                </h4>
                <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
{`<form action="YOUR_FORM_URL" method="POST">
  <input name="name" placeholder="Name" required>
  <input name="email" type="email" placeholder="Email" required>
  <textarea name="message" placeholder="Message"></textarea>
  <button type="submit">Submit</button>
</form>`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Form Modal */}
      <FormCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onFormCreated={handleFormCreated}
      />
    </div>
  )
} 