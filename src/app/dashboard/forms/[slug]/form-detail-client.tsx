'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Form, Submission } from '@/lib/types/database'
import { getForm, getFormStats, listSubmissions, deleteForm, apiHelpers } from '@/lib/api/client'

interface FormDetailClientProps {
  slug: string
  user: User
}

interface FormStats {
  total_submissions: number
  submissions_this_week: number
  submissions_this_month: number
  latest_submission: string | null
}

export default function FormDetailClient({ slug, user: _user }: FormDetailClientProps) {
  const [form, setForm] = useState<Form | null>(null)
  const [stats, setStats] = useState<FormStats | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [submissionsLoading, setSubmissionsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'settings'>('overview')
  const router = useRouter()

  const loadSubmissions = useCallback(async (page = 1) => {
    setSubmissionsLoading(true)
    
    try {
      const result = await listSubmissions(slug, { page, limit: 10, sortOrder: 'desc' })
      if (result.success && result.data) {
        setSubmissions(result.data)
      }
    } catch (err) {
      console.error('Failed to load submissions:', err)
    } finally {
      setSubmissionsLoading(false)
    }
  }, [slug])

  const loadFormData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Load form details and stats in parallel
      const [formResult, statsResult] = await Promise.all([
        getForm(slug),
        getFormStats(slug)
      ])

      if (formResult.success && formResult.data) {
        setForm(formResult.data)
      } else {
        setError('Form not found')
        return
      }

      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data.stats)
      }

      // Load recent submissions
      loadSubmissions()
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load form data')
    } finally {
      setLoading(false)
    }
  }, [slug, loadSubmissions])

  useEffect(() => {
    loadFormData()
  }, [loadFormData])

  const handleDeleteForm = async () => {
    if (!form) return
    
    if (!confirm(`Are you sure you want to delete "${form.name}"? This action cannot be undone and will delete all submissions.`)) {
      return
    }

    try {
      await deleteForm(slug)
      router.push('/dashboard')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete form')
    }
  }

  const handleCopyUrl = () => {
    const url = apiHelpers.getFormSubmissionUrl(slug)
    navigator.clipboard.writeText(url)
    alert('Form submission URL copied to clipboard!')
  }

  const handleExportCsv = async () => {
    try {
      await apiHelpers.downloadCsvExport(slug)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to export submissions')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading form details...</div>
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">{error || 'Form not found'}</div>
          <Link 
            href="/dashboard"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const formUrl = apiHelpers.getFormSubmissionUrl(slug)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mr-4">
                ← Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {form.name}
              </h1>
              <div className={`ml-3 px-2 py-1 text-xs rounded-full ${
                form.is_active 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {form.is_active ? 'Active' : 'Inactive'}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyUrl}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Copy URL
              </button>
              <Link
                href={`/dashboard/forms/${slug}/edit`}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Submissions</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats?.total_submissions ?? 0}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">This Week</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats?.submissions_this_week ?? 0}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">This Month</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats?.submissions_this_month ?? 0}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Latest Submission</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {stats?.latest_submission 
                ? new Date(stats.latest_submission).toLocaleDateString()
                : 'Never'
              }
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'submissions', label: 'Submissions' },
                { id: 'settings', label: 'Settings' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Form Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Form Details</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Form URL</label>
                      <div className="mt-1 font-mono text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border rounded px-3 py-2">
                        {formUrl}
                      </div>
                    </div>
                    
                    {form.description && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                        <div className="mt-1 text-sm text-gray-900 dark:text-white">
                          {form.description}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Notifications</label>
                        <div className="mt-1 text-sm text-gray-900 dark:text-white">
                          {form.email_notifications ? 'Enabled' : 'Disabled'}
                        </div>
                      </div>
                      
                      {form.notification_email && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Notification Email</label>
                          <div className="mt-1 text-sm text-gray-900 dark:text-white">
                            {form.notification_email}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Example Implementation */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Example Implementation</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">HTML Form</h4>
                    <pre className="text-sm text-gray-600 dark:text-gray-400 overflow-x-auto bg-white dark:bg-gray-800 rounded border p-3">
{`<form action="${formUrl}" method="POST">
  <input name="name" placeholder="Name" required>
  <input name="email" type="email" placeholder="Email" required>
  <textarea name="message" placeholder="Message"></textarea>
  <button type="submit">Submit</button>
</form>`}
                    </pre>
                    
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 mt-4">JavaScript Fetch</h4>
                    <pre className="text-sm text-gray-600 dark:text-gray-400 overflow-x-auto bg-white dark:bg-gray-800 rounded border p-3">
{`fetch('${formUrl}', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello!'
  })
})`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Submissions</h3>
                  <button
                    onClick={handleExportCsv}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Export CSV
                  </button>
                </div>

                {submissionsLoading ? (
                  <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                    Loading submissions...
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500 dark:text-gray-400">No submissions yet</div>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      Share your form URL to start receiving submissions
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(submission.submitted_at).toLocaleString()}
                          </div>
                          {submission.ip_address && (
                            <div className="text-xs text-gray-400 dark:text-gray-500">
                              IP: {submission.ip_address}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          {Object.entries(submission.data).map(([key, value]) => (
                            <div key={key} className="flex">
                              <div className="font-medium text-gray-700 dark:text-gray-300 w-24 flex-shrink-0">
                                {key}:
                              </div>
                              <div className="text-gray-900 dark:text-white flex-1">
                                {Array.isArray(value) ? value.join(', ') : String(value)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Form Settings</h3>
                  <div className="space-y-4">
                    <Link
                      href={`/dashboard/forms/${slug}/edit`}
                      className="block bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <div className="font-medium text-blue-900 dark:text-blue-300">Edit Form Details</div>
                      <div className="text-sm text-blue-700 dark:text-blue-400">
                        Update form name, description, and notification settings
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-medium text-red-900 dark:text-red-300 mb-4">Danger Zone</h3>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-red-900 dark:text-red-300">Delete this form</div>
                        <div className="text-sm text-red-700 dark:text-red-400 mt-1">
                          This action cannot be undone. All submissions will be permanently deleted.
                        </div>
                      </div>
                      <button
                        onClick={handleDeleteForm}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Delete Form
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 