import { createClient } from '@/lib/supabase/server'
import { Form, FormInsert, FormUpdate, FormWithStats } from '@/lib/types/database'

// Utility function to generate URL-safe slug from form name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

// Validate form data
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

  if (!data.slug || data.slug.trim().length === 0) {
    errors.slug = 'Form slug is required'
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.slug = 'Form slug can only contain lowercase letters, numbers, and hyphens'
  } else if (data.slug.length > 255) {
    errors.slug = 'Form slug must be less than 255 characters'
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

// Get a form by slug (public access)
export async function getFormBySlug(slug: string): Promise<Form | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .rpc('get_form_by_slug', { form_slug: slug })

  if (error) {
    throw new Error(`Failed to fetch form by slug: ${error.message}`)
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
    slug: slug,
    description: null,
    email_notifications: formData.email_notifications,
    notification_email: formData.notification_email,
    is_active: formData.is_active,
    created_at: '',
    updated_at: ''
  }
}

// Create a new form
export async function createForm(formData: FormInsert): Promise<Form> {
  const supabase = await createClient()
  
  // Validate the form data
  const validation = validateForm(formData)
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`)
  }

  // Check if slug already exists
  const { data: existingForm } = await supabase
    .from('forms')
    .select('id')
    .eq('slug', formData.slug)
    .single()

  if (existingForm) {
    throw new Error('A form with this slug already exists')
  }

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

// Update a form
export async function updateForm(id: string, userId: string, updates: FormUpdate): Promise<Form> {
  const supabase = await createClient()
  
  // If updating slug, validate it and check for conflicts
  if (updates.slug) {
    const validation = validateForm(updates as Partial<FormInsert>)
    if (!validation.isValid && validation.errors.slug) {
      throw new Error(validation.errors.slug)
    }

    // Check if new slug conflicts with existing forms (excluding current form)
    const { data: existingForm } = await supabase
      .from('forms')
      .select('id')
      .eq('slug', updates.slug)
      .neq('id', id)
      .single()

    if (existingForm) {
      throw new Error('A form with this slug already exists')
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
}

// Check if slug is available
export async function isSlugAvailable(slug: string, excludeFormId?: string): Promise<boolean> {
  const supabase = await createClient()
  
  let query = supabase
    .from('forms')
    .select('id')
    .eq('slug', slug)

  if (excludeFormId) {
    query = query.neq('id', excludeFormId)
  }

  const { data, error } = await query.single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to check slug availability: ${error.message}`)
  }

  return !data // Available if no data found
} 