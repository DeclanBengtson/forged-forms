import { createClient } from '@/lib/supabase/server'
import { Project, ProjectInsert, ProjectUpdate, ProjectWithForms } from '@/lib/types/database'

// Get all projects for a user
export async function getUserProjects(userId: string): Promise<Project[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`)
  }

  return data || []
}

// Get all projects with form counts for a user
export async function getUserProjectsWithCounts(userId: string): Promise<ProjectWithForms[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .rpc('get_projects_with_form_counts', { user_uuid: userId })

  if (error) {
    throw new Error(`Failed to fetch projects with counts: ${error.message}`)
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    user_id: userId,
    name: row.name,
    description: row.description,
    created_at: row.created_at,
    updated_at: row.updated_at,
    forms: [], // Will be populated separately if needed
    form_count: Number(row.form_count)
  }))
}

// Get a single project by ID
export async function getProjectById(id: string, userId: string): Promise<Project | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Project not found
    }
    throw new Error(`Failed to fetch project: ${error.message}`)
  }

  return data
}

// Create a new project
export async function createProject(projectData: ProjectInsert): Promise<Project> {
  const supabase = await createClient()
  
  // Validate the project data
  if (!projectData.name?.trim()) {
    throw new Error('Project name is required')
  }

  const { data, error } = await supabase
    .from('projects')
    .insert(projectData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create project: ${error.message}`)
  }

  return data
}

// Update a project
export async function updateProject(id: string, userId: string, updates: ProjectUpdate): Promise<Project> {
  const supabase = await createClient()
  
  // Validate the updates
  if (updates.name !== undefined && !updates.name?.trim()) {
    throw new Error('Project name cannot be empty')
  }

  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update project: ${error.message}`)
  }

  return data
}

// Delete a project
export async function deleteProject(id: string, userId: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to delete project: ${error.message}`)
  }
}

// Get project with all its forms
export async function getProjectWithForms(id: string, userId: string): Promise<ProjectWithForms | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      forms(*)
    `)
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Project not found
    }
    throw new Error(`Failed to fetch project with forms: ${error.message}`)
  }

  return {
    ...data,
    forms: data.forms || [],
    form_count: data.forms?.length || 0
  }
}

// Move forms to a project
export async function moveFormsToProject(formIds: string[], projectId: string | null, userId: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('forms')
    .update({ project_id: projectId })
    .in('id', formIds)
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to move forms: ${error.message}`)
  }
}

// Validation function for project data
export function validateProject(project: ProjectInsert | ProjectUpdate): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  if ('name' in project && project.name !== undefined) {
    if (!project.name?.trim()) {
      errors.name = 'Project name is required'
    } else if (project.name.length > 255) {
      errors.name = 'Project name must be less than 255 characters'
    }
  }

  if ('description' in project && project.description !== undefined) {
    if (project.description && project.description.length > 1000) {
      errors.description = 'Description must be less than 1000 characters'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Function to ensure user has a default project
export async function ensureDefaultProject(userId: string): Promise<string> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .rpc('ensure_default_project', { user_uuid: userId })

  if (error) {
    throw new Error(`Failed to ensure default project: ${error.message}`)
  }

  return data
} 