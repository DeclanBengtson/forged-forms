'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { Form } from '@/lib/types/database'
import { listForms } from '@/lib/api/client'
import FormCreateModal from '@/components/dashboard/FormCreateModal'
import FormDeleteModal from '@/components/dashboard/FormDeleteModal'
import DashboardNavigation from '@/components/dashboard/DashboardNavigation'
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

  const handleFormDeleted = (id: string) => {
    setForms(prev => prev.filter(form => form.id !== id))
    // If the deleted form was selected, go back to overview
    if (selectedForm?.id === id) {
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dot-grid dark:dot-grid-dark flex items-center justify-center">
        <div className="text-center py-16">
          <div className="w-8 h-8 mx-auto mb-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">Loading workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dot-grid dark:dot-grid-dark">
      {/* Fixed Top Navigation */}
      <DashboardNavigation
        forms={forms}
        selectedForm={selectedForm}
        onSelectForm={handleSelectForm}
        onCreateForm={handleCreateForm}
        onDeleteForm={handleDeleteForm}
        onLogout={handleLogout}
        user={user}
        loading={loading}
      />

      {/* Fixed Left Sidebar with Forms */}
      <FormsSidebar
        forms={forms}
        selectedForm={selectedForm}
        onSelectForm={handleSelectForm}
        onCreateForm={handleCreateForm}
        onDeleteForm={handleDeleteForm}
      />

      {/* Main Content */}
      <main className="pt-[65px] pl-64">
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