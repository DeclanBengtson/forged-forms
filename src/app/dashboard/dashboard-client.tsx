'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { Form } from '@/lib/types/database'
import { listForms } from '@/lib/api/client'
import FormCreateModal from '@/components/dashboard/FormCreateModal'
import FormDeleteModal from '@/components/dashboard/FormDeleteModal'
import Sidebar from '@/components/dashboard/Sidebar'
import FormsSidebar from '@/components/dashboard/FormsSidebar'
import DashboardOverview from '@/components/dashboard/DashboardOverview'
import FormDetails from '@/components/dashboard/FormDetails'

interface DashboardClientProps {
  user: User
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [loading, setLoading] = useState(false)
  const [forms, setForms] = useState<Form[]>([])
  const [selectedForm, setSelectedForm] = useState<Form | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [formToDelete, setFormToDelete] = useState<Form | null>(null)
  const [formsLoading, setFormsLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  // Load forms on component mount
  useEffect(() => {
    loadForms()
  }, [])

  const loadForms = async () => {
    setFormsLoading(true)
    try {
      const result = await listForms()
      if (result.success && result.data) {
        setForms(result.data)
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
    setSelectedForm(newForm) // Auto-select the newly created form
  }

  const handleFormDeleted = (slug: string) => {
    setForms(prev => prev.filter(form => form.slug !== slug))
    // If the deleted form was selected, go back to overview
    if (selectedForm?.slug === slug) {
      setSelectedForm(null)
    }
  }

  const handleFormUpdated = () => {
    loadForms() // Reload forms when one is updated
  }

  const handleSelectForm = (form: Form | null) => {
    setSelectedForm(form)
  }

  const handleCreateForm = () => {
    setIsCreateModalOpen(true)
  }

  const handleDeleteForm = (form: Form) => {
    setFormToDelete(form)
    setIsDeleteModalOpen(true)
  }

  if (formsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4 animate-spin">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Top Navigation */}
      <Sidebar
        forms={forms}
        selectedForm={selectedForm}
        onSelectForm={handleSelectForm}
        onCreateForm={handleCreateForm}
        onDeleteForm={handleDeleteForm}
        onLogout={handleLogout}
        user={user}
        loading={loading}
      />

      {/* Main Layout with Sidebar and Content */}
      <div className="flex flex-1">
        {/* Left Sidebar with Forms */}
        <FormsSidebar
          forms={forms}
          selectedForm={selectedForm}
          onSelectForm={handleSelectForm}
          onCreateForm={handleCreateForm}
          onDeleteForm={handleDeleteForm}
        />

        {/* Main Content */}
        <main className="flex-1">
          {selectedForm ? (
            <FormDetails
              form={selectedForm}
              onFormUpdated={handleFormUpdated}
              onDeleteForm={handleDeleteForm}
            />
          ) : (
            <DashboardOverview
              forms={forms}
              onCreateForm={handleCreateForm}
              onDeleteForm={handleDeleteForm}
              user={user}
            />
          )}
        </main>
      </div>

      {/* Create Form Modal */}
      <FormCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onFormCreated={handleFormCreated}
      />

      {/* Delete Form Modal */}
      <FormDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onFormDeleted={handleFormDeleted}
        form={formToDelete}
      />
    </div>
  )
} 