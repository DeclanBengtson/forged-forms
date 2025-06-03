'use client'

import { useState } from 'react'
import { Form } from '@/lib/types/database'
import { deleteForm } from '@/lib/api/client'

interface FormDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onFormDeleted: (slug: string) => void
  form: Form | null
}

export default function FormDeleteModal({ isOpen, onClose, onFormDeleted, form }: FormDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  if (!isOpen || !form) return null

  const handleDelete = async () => {
    if (confirmText !== form.name) return

    setIsDeleting(true)
    try {
      await deleteForm(form.slug)
      onFormDeleted(form.slug)
      onClose()
      setConfirmText('')
    } catch (error) {
      console.error('Failed to delete form:', error)
      // Could add toast notification here
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (!isDeleting) {
      onClose()
      setConfirmText('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Delete Form
              </h2>
            </div>
            {!isDeleting && (
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Content */}
          <div className="mb-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Are you sure you want to delete &quot;{form.name}&quot;?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                This action cannot be undone. This will permanently delete the form and all of its submissions.
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Warning: Data Loss
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    All form submissions will be permanently deleted along with the form.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To confirm deletion, type the form name: <span className="font-semibold">&quot;{form.name}&quot;</span>
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={`Type "${form.name}" to confirm`}
                disabled={isDeleting}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              disabled={isDeleting}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting || confirmText !== form.name}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isDeleting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete Form</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 