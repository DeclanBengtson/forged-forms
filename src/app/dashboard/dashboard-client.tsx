'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { Form, Project } from '@/lib/types/database'
import { listForms, listProjects } from '@/lib/api/client'
import FormCreateModal from '@/components/dashboard/FormCreateModal'
import FormDeleteModal from '@/components/dashboard/FormDeleteModal'
import ProjectCreateModal from '@/components/dashboard/ProjectCreateModal'
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
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedForm, setSelectedForm] = useState<Form | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isProjectCreateModalOpen, setIsProjectCreateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [formToDelete, setFormToDelete] = useState<Form | null>(null)
  const [formsLoading, setFormsLoading] = useState(true)
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())
  const supabase = createClient()
  const router = useRouter()

  // Load forms and projects on component mount
  useEffect(() => {
    loadForms()
    loadProjects()
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

  const loadProjects = async () => {
    try {
      const result = await listProjects()
      if (result.success && result.data) {
        setProjects(result.data)
      }
    } catch (error) {
      console.error('Failed to load projects:', error)
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
    
    // If the form was assigned to a project, auto-expand that project
    if (newForm.project_id) {
      setExpandedProjects(prev => new Set([...Array.from(prev), newForm.project_id!]))
    }
  }

  const handleProjectCreated = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev])
    setSelectedProject(newProject) // Auto-select the newly created project
  }

  const handleFormDeleted = (id: string) => {
    setForms(prev => prev.filter(form => form.id !== id))
    // If the deleted form was selected, go back to overview
    if (selectedForm?.id === id) {
      setSelectedForm(null)
    }
  }

  const handleFormUpdated = async () => {
    // Reload forms when one is updated
    try {
      const result = await listForms()
      if (result.success && result.data) {
        setForms(result.data)
        // Update the selected form with the latest data
        if (selectedForm) {
          const updatedForm = result.data.find(form => form.id === selectedForm.id)
          if (updatedForm) {
            setSelectedForm(updatedForm)
          }
        }
      }
    } catch (error) {
      console.error('Failed to reload forms:', error)
    }
  }

  const handleSelectForm = (form: Form | null) => {
    setSelectedForm(form)
    
    // If selecting a form that belongs to a project, auto-expand that project
    if (form?.project_id) {
      setExpandedProjects(prev => new Set([...Array.from(prev), form.project_id!]))
    }
  }

  const handleCreateForm = () => {
    setIsCreateModalOpen(true)
  }

  const handleCreateProject = () => {
    setIsProjectCreateModalOpen(true)
  }

  const handleToggleProject = (projectId: string) => {
    setExpandedProjects(prev => {
      const newSet = new Set(Array.from(prev))
      if (newSet.has(projectId)) {
        newSet.delete(projectId)
      } else {
        newSet.add(projectId)
      }
      return newSet
    })
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
        projects={projects}
        selectedForm={selectedForm}
        selectedProject={selectedProject}
        expandedProjects={expandedProjects}
        onSelectForm={handleSelectForm}
        _onSelectProject={setSelectedProject}
        onToggleProject={handleToggleProject}
        onCreateForm={handleCreateForm}
        onCreateProject={handleCreateProject}
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
        projects={projects}
        selectedProjectId={selectedProject?.id || null}
      />

      {/* Delete Form Modal */}
      <FormDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onFormDeleted={handleFormDeleted}
        form={formToDelete}
      />

      {/* Create Project Modal */}
      <ProjectCreateModal
        isOpen={isProjectCreateModalOpen}
        onClose={() => setIsProjectCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  )
} 