'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Form, Submission } from '@/lib/types/database'
import { getForm, getFormStats, listSubmissions, deleteForm, apiHelpers } from '@/lib/api/client'

interface FormDetailClientProps {
  id: string
  user: User
}

interface FormStats {
  total_submissions: number
  submissions_this_week: number
  submissions_this_month: number
  latest_submission: string | null
}

export default function FormDetailClient({ id, user: _user }: FormDetailClientProps) {
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
      const result = await listSubmissions(id, { page, limit: 10, sortOrder: 'desc' })
      if (result.success && result.data) {
        setSubmissions(result.data)
      }
    } catch (err) {
      console.error('Failed to load submissions:', err)
    } finally {
      setSubmissionsLoading(false)
    }
  }, [id])

  const loadFormData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Load form details and stats in parallel
      const [formResult, statsResult] = await Promise.all([
        getForm(id),
        getFormStats(id)
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
  }, [id, loadSubmissions])

  useEffect(() => {
    loadFormData()
  }, [loadFormData])

  const handleDeleteForm = async () => {
    if (!form) return
    
    if (!confirm(`Are you sure you want to delete "${form.name}"? This action cannot be undone and will delete all submissions.`)) {
      return
    }

    try {
      await deleteForm(id)
      router.push('/dashboard')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete form')
    }
  }

  const handleCopyUrl = () => {
    const url = apiHelpers.getFormSubmissionUrl(id)
    navigator.clipboard.writeText(url)
    alert('Form submission URL copied to clipboard!')
  }

  const handleExportCsv = async () => {
    try {
      await apiHelpers.downloadCsvExport(id)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to export submissions')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-16">
          <div className="w-8 h-8 mx-auto mb-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 font-normal">Loading form details...</p>
        </div>
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-16">
          <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-sm flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div className="text-sm text-gray-700 font-normal mb-1">{error || 'Form not found'}</div>
          <Link 
            href="/dashboard"
            className="text-sm font-normal text-gray-500 hover:text-gray-700 transition-colors duration-300"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const formUrl = apiHelpers.getFormSubmissionUrl(id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-sm font-normal text-gray-500 hover:text-gray-700 transition-colors duration-300">
                ← Dashboard
              </Link>
              <div className="w-px h-4 bg-gray-300"></div>
              <h1 className="text-xl font-medium text-gray-900">
                {form.name}
              </h1>
              <div className={`w-2 h-2 rounded-full ${
                form.is_active ? 'bg-gray-900' : 'bg-gray-300'
              }`} />
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCopyUrl}
                className="inline-flex items-center px-5 py-2.5 text-sm font-normal text-gray-700 border border-gray-200 rounded-sm hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300"
              >
                Copy URL
              </button>
              <Link
                href={`/dashboard/forms/${id}/edit`}
                className="inline-flex items-center px-5 py-2.5 text-sm font-normal text-gray-700 border border-gray-200 rounded-sm hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-sm p-6 hover:border-gray-300 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-normal text-gray-400 uppercase tracking-wide mb-2">Total</div>
                <div className="text-2xl font-medium text-gray-900">{stats?.total_submissions ?? 0}</div>
              </div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-sm p-6 hover:border-gray-300 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-normal text-gray-400 uppercase tracking-wide mb-2">This Week</div>
                <div className="text-2xl font-medium text-gray-900">{stats?.submissions_this_week ?? 0}</div>
              </div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-sm p-6 hover:border-gray-300 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-normal text-gray-400 uppercase tracking-wide mb-2">This Month</div>
                <div className="text-2xl font-medium text-gray-900">{stats?.submissions_this_month ?? 0}</div>
              </div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-sm p-6 hover:border-gray-300 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-normal text-gray-400 uppercase tracking-wide mb-2">Latest</div>
                <div className="text-sm font-normal text-gray-900">
                  {stats?.latest_submission 
                    ? new Date(stats.latest_submission).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })
                    : 'Never'
                  }
                </div>
              </div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-sm hover:border-gray-300 transition-all duration-300">
          <div className="border-b border-gray-100">
            <nav className="flex px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'submissions', label: 'Submissions' },
                { id: 'settings', label: 'Settings' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-8 border-b-2 text-sm font-normal transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-12">
                {/* Form Details */}
                <div>
                  <div className="text-sm font-normal text-gray-600 uppercase tracking-wide mb-6">Form Details</div>
                  <div className="bg-gray-50 border border-gray-200 rounded-sm p-6 space-y-6">
                    <div>
                      <label className="text-xs font-normal text-gray-400 uppercase tracking-wide">Form URL</label>
                      <div className="mt-2 font-mono text-sm text-gray-900 bg-white border border-gray-200 rounded-sm px-4 py-3">
                        {formUrl}
                      </div>
                    </div>
                    
                    {form.description && (
                      <div>
                        <label className="text-xs font-normal text-gray-400 uppercase tracking-wide">Description</label>
                        <div className="mt-2 text-sm font-normal text-gray-900">
                          {form.description}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-normal text-gray-400 uppercase tracking-wide">Email Notifications</label>
                        <div className="mt-2 text-sm font-normal text-gray-900">
                          {form.email_notifications ? 'Enabled' : 'Disabled'}
                        </div>
                      </div>
                      
                      {form.notification_email && (
                        <div>
                          <label className="text-xs font-normal text-gray-400 uppercase tracking-wide">Notification Email</label>
                          <div className="mt-2 text-sm font-normal text-gray-900">
                            {form.notification_email}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Example Implementation */}
                <div>
                  <div className="text-sm font-normal text-gray-600 uppercase tracking-wide mb-6">Example Implementation</div>
                  <div className="bg-gray-50 border border-gray-200 rounded-sm p-6 space-y-8">
                    <div>
                      <div className="text-xs font-normal text-gray-400 uppercase tracking-wide mb-3">HTML Form</div>
                      <pre className="text-xs font-mono text-gray-600 overflow-x-auto bg-white border border-gray-200 rounded-sm p-4">
{`<form action="${formUrl}" method="POST">
  <input name="name" placeholder="Name" required>
  <input name="email" type="email" placeholder="Email" required>
  <textarea name="message" placeholder="Message"></textarea>
  <button type="submit">Submit</button>
</form>`}
                      </pre>
                    </div>
                    
                    <div>
                      <div className="text-xs font-normal text-gray-400 uppercase tracking-wide mb-3">JavaScript Fetch</div>
                      <pre className="text-xs font-mono text-gray-600 overflow-x-auto bg-white border border-gray-200 rounded-sm p-4">
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
              </div>
            )}

            {activeTab === 'submissions' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <div className="text-sm font-normal text-gray-600 uppercase tracking-wide">Recent Submissions</div>
                  <button
                    onClick={handleExportCsv}
                    className="inline-flex items-center px-5 py-2.5 text-sm font-normal text-gray-700 border border-gray-200 rounded-sm hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300"
                  >
                    Export CSV
                  </button>
                </div>

                {submissionsLoading ? (
                  <div className="text-center py-16">
                    <div className="w-8 h-8 mx-auto mb-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 font-normal">Loading submissions...</p>
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-sm flex items-center justify-center mx-auto mb-4">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="text-sm font-normal text-gray-700 mb-1">No submissions yet</div>
                    <p className="text-xs text-gray-500 font-light">
                      Share your form URL to start receiving submissions
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="bg-gray-50 border border-gray-200 rounded-sm p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="text-xs font-normal text-gray-400">
                            {new Date(submission.submitted_at).toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {Object.entries(submission.data).map(([key, value]) => (
                            <div key={key} className="flex">
                              <div className="font-normal text-sm text-gray-500 w-24 flex-shrink-0">
                                {key}:
                              </div>
                              <div className="font-normal text-sm text-gray-900 flex-1">
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
              <div className="space-y-12">
                <div>
                  <div className="text-sm font-normal text-gray-600 uppercase tracking-wide mb-6">Form Settings</div>
                  <div className="space-y-4">
                    <Link
                      href={`/dashboard/forms/${id}/edit`}
                      className="block bg-gray-50 border border-gray-200 rounded-sm p-6 hover:bg-gray-100 hover:border-gray-300 transition-all duration-300"
                    >
                      <div className="font-normal text-sm text-gray-900">Edit Form Details</div>
                      <div className="text-xs text-gray-500 font-light mt-2">
                        Update form name, description, and notification settings
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border-t border-gray-200 pt-12">
                  <div className="text-sm font-normal text-gray-600 uppercase tracking-wide mb-6">Danger Zone</div>
                  <div className="bg-red-50 border border-red-200 rounded-sm p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-normal text-sm text-red-900">Delete this form</div>
                        <div className="text-xs text-red-700 font-light mt-2">
                          This action cannot be undone. All submissions will be permanently deleted.
                        </div>
                      </div>
                      <button
                        onClick={handleDeleteForm}
                        className="inline-flex items-center px-5 py-2.5 text-sm font-normal text-white bg-red-600 border border-red-600 rounded-sm hover:bg-red-700 hover:border-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300"
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