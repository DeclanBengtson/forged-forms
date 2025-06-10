import { createClient } from '@/lib/supabase/server'
import { Form, FormInsert, FormUpdate, FormWithStats } from '@/lib/types/database'
import { invalidateFormCache } from '@/lib/cache/forms'

// Validate form data (simplified - no slug validation needed)
export function validateForm(data: Partial<FormInsert>): {
  isValid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Form name is required'
  } else if (data.name.length > 255) {
    errors.name = 'Form name must be less than 255 characters'
  }

  if (data.notification_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.notification_email)) {
    errors.notification_email = 'Please enter a valid email address'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Get all forms for a user
export async function getUserForms(userId: string): Promise<Form[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch forms: ${error.message}`)
  }

  return data || []
}

// Get forms with stats (submission count, etc.)
export async function getUserFormsWithStats(userId: string): Promise<FormWithStats[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('forms')
    .select(`
      *,
      submissions:submissions(count)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch forms with stats: ${error.message}`)
  }

  // Transform the data to include submission count
  const formsWithStats: FormWithStats[] = (data || []).map((form: any) => ({
    ...form,
    submission_count: form.submissions?.[0]?.count || 0,
    latest_submission: null // We'll add this later if needed
  }))

  return formsWithStats
}

// Get a single form by ID
export async function getFormById(id: string, userId: string): Promise<Form | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Form not found
    }
    throw new Error(`Failed to fetch form: ${error.message}`)
  }

  return data
}

// Get a form by ID (public access for submissions)
export async function getPublicFormById(id: string): Promise<Form | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .rpc('get_form_by_id', { form_id: id })

  if (error) {
    throw new Error(`Failed to fetch form by id: ${error.message}`)
  }

  if (!data || data.length === 0) {
    return null
  }

  // Convert the RPC result to a Form object
  const formData = data[0]
  return {
    id: formData.id,
    user_id: formData.user_id,
    name: formData.name,
    description: null,
    email_notifications: formData.email_notifications,
    notification_email: formData.notification_email,
    is_active: formData.is_active,
    project_id: null,
    created_at: '',
    updated_at: ''
  }
}

// Create a new form (simplified - no slug generation needed)
export async function createForm(formData: FormInsert): Promise<Form> {
  const supabase = await createClient()
  
  // Validate the form data
  const validation = validateForm(formData)
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`)
  }

  // Create form with auto-generated UUID id
  const { data, error } = await supabase
    .from('forms')
    .insert(formData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create form: ${error.message}`)
  }

  return data
}

// Update a form (simplified - no slug logic)
export async function updateForm(id: string, userId: string, updates: FormUpdate): Promise<Form> {
  const supabase = await createClient()
  
  // Validate if we have data to validate
  if (updates.name || updates.notification_email) {
    const validation = validateForm(updates as Partial<FormInsert>)
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`)
    }
  }

  const { data, error } = await supabase
    .from('forms')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update form: ${error.message}`)
  }

  // Invalidate cache when form is updated
  await invalidateFormCache(id)

  return data
}

// Delete a form
export async function deleteForm(id: string, userId: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('forms')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to delete form: ${error.message}`)
  }

  // Invalidate cache when form is deleted
  await invalidateFormCache(id)
} 