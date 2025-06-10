import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateForm, deleteForm, getFormById } from '@/lib/database/forms'
import { ApiResponse, FormUpdate } from '@/lib/types/database'

// GET /api/forms/[id] - Get a specific form
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params

    // Get the form by ID
    const form = await getFormById(id, user.id)
    
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

// PUT /api/forms/[id] - Update a specific form
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params

    // First, verify the form exists and belongs to the user
    const existingForm = await getFormById(id, user.id)
    
    if (!existingForm) {
      return NextResponse.json(
        { success: false, error: 'Form not found' },
        { status: 404 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { name, description, email_notifications, notification_email, is_active, project_id } = body

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
    
    if (email_notifications !== undefined) {
      updateData.email_notifications = Boolean(email_notifications)
    }
    
    if (notification_email !== undefined) {
      updateData.notification_email = notification_email?.trim() || null
    }
    
    if (is_active !== undefined) {
      updateData.is_active = Boolean(is_active)
    }

    if (project_id !== undefined) {
      updateData.project_id = project_id || null
    }

    // Update the form
    const updatedForm = await updateForm(id, user.id, updateData)
    
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
      if (error.message.includes('Validation failed')) {
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

// DELETE /api/forms/[id] - Delete a specific form
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params

    // First, verify the form exists and belongs to the user
    const existingForm = await getFormById(id, user.id)
    
    if (!existingForm) {
      return NextResponse.json(
        { success: false, error: 'Form not found' },
        { status: 404 }
      )
    }

    // Delete the form (this will also delete all associated submissions due to CASCADE)
    await deleteForm(id, user.id)
    
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