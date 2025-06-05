'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Form } from '@/lib/types/database'
import { deleteForm, getFormStats, apiHelpers } from '@/lib/api/client'

interface FormsListProps {
  forms: Form[]
  onFormDeleted: (id: string) => void
  onFormUpdated: () => void
}

// Utility function to format UUID for display
function formatUUID(uuid: string): string {
  return `${uuid.substring(0, 8)}...${uuid.substring(uuid.length - 8)}`
}

// Utility function to copy URL with feedback
function copyToClipboard(text: string, successMessage: string = 'Copied to clipboard!') {
  navigator.clipboard.writeText(text).then(() => {
    // You could add a toast notification here
    alert(successMessage)
  }).catch(() => {
    alert('Failed to copy to clipboard')
  })
}

export default function FormsList({ forms, onFormDeleted, onFormUpdated: _onFormUpdated }: FormsListProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [formStats, setFormStats] = useState<Record<string, any>>({})

  const handleDelete = async (form: Form) => {
    if (!confirm(`Are you sure you want to delete "${form.name}"? This action cannot be undone and will delete all submissions.`)) {
      return
    }

    setLoadingStates(prev => ({ ...prev, [form.id]: true }))
    
    try {
      await deleteForm(form.id)
      onFormDeleted(form.id)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete form')
    } finally {
      setLoadingStates(prev => ({ ...prev, [form.id]: false }))
    }
  }

  const handleCopyUrl = (id: string) => {
    const url = apiHelpers.getFormSubmissionUrl(id)
    copyToClipboard(url, 'Form submission URL copied to clipboard!')
  }

  const handleCopyId = (id: string) => {
    copyToClipboard(id, 'Form ID copied to clipboard!')
  }

  const handleExportCsv = async (id: string) => {
    setLoadingStates(prev => ({ ...prev, [`export-${id}`]: true }))
    
    try {
      await apiHelpers.downloadCsvExport(id)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to export submissions')
    } finally {
      setLoadingStates(prev => ({ ...prev, [`export-${id}`]: false }))
    }
  }

  const loadFormStats = async (id: string) => {
    if (formStats[id]) return // Already loaded

    try {
      const result = await getFormStats(id)
      if (result.success) {
        setFormStats(prev => ({ ...prev, [id]: result.data.stats }))
      }
    } catch (error) {
      console.error('Failed to load form stats:', error)
    }
  }

  if (forms.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-sm p-12 text-center">
        <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-sm flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No forms yet
        </h3>
        <p className="text-sm text-gray-500 font-light mb-6 max-w-md mx-auto">
          Create your first form to start collecting submissions from your website or application.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {forms.map((form) => (
          <div key={form.id} className="bg-white border border-gray-200 rounded-sm hover:border-gray-300 transition-all duration-300">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {form.name}
                  </h3>
                  {form.description && (
                    <p className="text-sm text-gray-500 font-light mt-1 line-clamp-2">
                      {form.description}
                    </p>
                  )}
                </div>
                <div className={`ml-2 px-2 py-1 text-xs font-normal rounded-sm ${
                  form.is_active 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'bg-gray-50 text-gray-500'
                }`}>
                  {form.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>

              {/* Form ID Display */}
              <div className="mb-4">
                <div className="text-xs text-gray-400 font-normal uppercase tracking-wide mb-1">Form ID:</div>
                <div className="bg-gray-50 border border-gray-200 rounded-sm p-2 flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-700 truncate">
                    {formatUUID(form.id)}
                  </span>
                  <button
                    onClick={() => handleCopyId(form.id)}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy Form ID"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* URL Preview */}
              <div className="mb-4">
                <div className="text-xs text-gray-400 font-normal uppercase tracking-wide mb-1">Form URL:</div>
                <div className="bg-gray-50 border border-gray-200 rounded-sm p-2 text-xs font-mono text-gray-700 break-all">
                  /api/forms/{formatUUID(form.id)}/submit
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-medium text-gray-900">
                    {formStats[form.id]?.total ?? '-'}
                  </div>
                  <div className="text-xs text-gray-400 font-normal">Submissions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-medium text-gray-900">
                    {formStats[form.id]?.thisWeek ?? '-'}
                  </div>
                  <div className="text-xs text-gray-400 font-normal">This Week</div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Link
                    href={`/dashboard/forms/${form.id}`}
                    className="flex-1 bg-gray-900 text-white text-sm font-normal px-3 py-2.5 rounded-sm hover:bg-gray-800 transition-all duration-300 text-center"
                    onMouseEnter={() => loadFormStats(form.id)}
                  >
                    View Details
                  </Link>
                  
                  <button
                    onClick={() => handleCopyUrl(form.id)}
                    className="px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                    title="Copy form URL"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
                    </svg>
                  </button>
                </div>

                <div className="flex space-x-2">
                  <Link
                    href={`/dashboard/forms/${form.id}/edit`}
                    className="flex-1 text-sm font-normal text-gray-700 border border-gray-200 px-3 py-2.5 rounded-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleExportCsv(form.id)}
                    disabled={loadingStates[`export-${form.id}`]}
                    className="flex-1 text-sm font-normal text-gray-700 border border-gray-200 px-3 py-2.5 rounded-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 disabled:opacity-50"
                  >
                    {loadingStates[`export-${form.id}`] ? 'Exporting...' : 'Export CSV'}
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(form)}
                  disabled={loadingStates[form.id]}
                  className="w-full text-sm font-normal text-red-700 border border-red-200 px-3 py-2.5 rounded-sm hover:bg-red-50 hover:border-red-300 transition-all duration-300 disabled:opacity-50"
                >
                  {loadingStates[form.id] ? 'Deleting...' : 'Delete Form'}
                </button>
              </div>

              {/* Created Date */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-400 font-normal">
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