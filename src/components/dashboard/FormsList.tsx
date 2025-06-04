'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Form } from '@/lib/types/database'
import { deleteForm, getFormStats, apiHelpers } from '@/lib/api/client'

interface FormsListProps {
  forms: Form[]
  onFormDeleted: (slug: string) => void
  onFormUpdated: () => void
}

export default function FormsList({ forms, onFormDeleted, onFormUpdated: _onFormUpdated }: FormsListProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [formStats, setFormStats] = useState<Record<string, any>>({})

  const handleDelete = async (form: Form) => {
    if (!confirm(`Are you sure you want to delete "${form.name}"? This action cannot be undone and will delete all submissions.`)) {
      return
    }

    setLoadingStates(prev => ({ ...prev, [form.slug]: true }))
    
    try {
      await deleteForm(form.slug)
      onFormDeleted(form.slug)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete form')
    } finally {
      setLoadingStates(prev => ({ ...prev, [form.slug]: false }))
    }
  }

  const handleCopyUrl = (slug: string) => {
    const url = apiHelpers.getFormSubmissionUrl(slug)
    navigator.clipboard.writeText(url)
    alert('Form submission URL copied to clipboard!')
  }

  const handleExportCsv = async (slug: string) => {
    setLoadingStates(prev => ({ ...prev, [`export-${slug}`]: true }))
    
    try {
      await apiHelpers.downloadCsvExport(slug)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to export submissions')
    } finally {
      setLoadingStates(prev => ({ ...prev, [`export-${slug}`]: false }))
    }
  }

  const loadFormStats = async (slug: string) => {
    if (formStats[slug]) return // Already loaded

    try {
      const result = await getFormStats(slug)
      if (result.success) {
        setFormStats(prev => ({ ...prev, [slug]: result.data.stats }))
      }
    } catch (error) {
      console.error('Failed to load form stats:', error)
    }
  }

  if (forms.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">📝</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          No forms yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Create your first form to start collecting submissions from your website or application.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {forms.map((form) => (
          <div key={form.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {form.name}
                  </h3>
                  {form.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {form.description}
                    </p>
                  )}
                </div>
                <div className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  form.is_active 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {form.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>

              {/* URL Preview */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Form URL:</div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-2 text-xs font-mono text-gray-700 dark:text-gray-300 break-all">
                  /api/forms/{form.slug}/submit
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formStats[form.slug]?.total ?? '-'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Submissions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formStats[form.slug]?.thisWeek ?? '-'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">This Week</div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Link
                    href={`/dashboard/forms/${form.slug}`}
                    className="flex-1 bg-blue-600 text-white text-sm px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-center"
                    onMouseEnter={() => loadFormStats(form.slug)}
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleCopyUrl(form.slug)}
                    className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    title="Copy form URL"
                  >
                    📋
                  </button>
                </div>

                <div className="flex space-x-2">
                  <Link
                    href={`/dashboard/forms/${form.slug}/edit`}
                    className="flex-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleExportCsv(form.slug)}
                    disabled={loadingStates[`export-${form.slug}`]}
                    className="flex-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    {loadingStates[`export-${form.slug}`] ? 'Exporting...' : 'Export CSV'}
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(form)}
                  disabled={loadingStates[form.slug]}
                  className="w-full text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-300 dark:border-red-600 px-3 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                >
                  {loadingStates[form.slug] ? 'Deleting...' : 'Delete Form'}
                </button>
              </div>

              {/* Created Date */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Created {new Date(form.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 