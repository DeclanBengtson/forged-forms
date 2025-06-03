import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateForm, deleteForm, getUserForms } from '@/lib/database/forms'
import { ApiResponse, FormUpdate } from '@/lib/types/database'

// GET /api/forms/[slug] - Get a specific form
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { slug } = await params

    // First, get all user forms to find the one with matching slug
    const userForms = await getUserForms(user.id)
    const form = userForms.find(f => f.slug === slug)
    
    if (!form) {
      return NextResponse.json(
        { success: false, error: 'Form not found' },
        { status: 404 }
      )
    }

    const response: ApiResponse = {
      success: true,
      data: form,
      message: 'Form retrieved successfully'
    }

    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error fetching form:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch form'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}

// PUT /api/forms/[slug] - Update a specific form
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { slug } = await params

    // First, find the form by slug
    const userForms = await getUserForms(user.id)
    const existingForm = userForms.find(f => f.slug === slug)
    
    if (!existingForm) {
      return NextResponse.json(
        { success: false, error: 'Form not found' },
        { status: 404 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { name, description, slug: newSlug, email_notifications, notification_email, is_active } = body

    // Prepare update data (only include fields that are provided)
    const updateData: FormUpdate = {}
    
    if (name !== undefined) {
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: 'Form name cannot be empty' },
          { status: 400 }
        )
      }
      updateData.name = name.trim()
    }
    
    if (description !== undefined) {
      updateData.description = description?.trim() || null
    }
    
    if (newSlug !== undefined) {
      updateData.slug = newSlug?.trim() || null
    }
    
    if (email_notifications !== undefined) {
      updateData.email_notifications = Boolean(email_notifications)
    }
    
    if (notification_email !== undefined) {
      updateData.notification_email = notification_email?.trim() || null
    }
    
    if (is_active !== undefined) {
      updateData.is_active = Boolean(is_active)
    }

    // Update the form
    const updatedForm = await updateForm(existingForm.id, user.id, updateData)
    
    const response: ApiResponse = {
      success: true,
      data: updatedForm,
      message: 'Form updated successfully'
    }

    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error updating form:', error)
    
    // Handle specific validation errors
    if (error instanceof Error) {
      if (error.message.includes('slug already exists')) {
        return NextResponse.json(
          { success: false, error: 'A form with this URL already exists. Please choose a different slug.' },
          { status: 409 }
        )
      }
      
      if (error.message.includes('Validation failed') || error.message.includes('Form slug can only')) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 400 }
        )
      }
    }
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update form'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}

// DELETE /api/forms/[slug] - Delete a specific form
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { slug } = await params

    // First, find the form by slug
    const userForms = await getUserForms(user.id)
    const existingForm = userForms.find(f => f.slug === slug)
    
    if (!existingForm) {
      return NextResponse.json(
        { success: false, error: 'Form not found' },
        { status: 404 }
      )
    }

    // Delete the form (this will also delete all associated submissions due to CASCADE)
    await deleteForm(existingForm.id, user.id)
    
    const response: ApiResponse = {
      success: true,
      message: 'Form deleted successfully'
    }

    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error deleting form:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete form'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
} 