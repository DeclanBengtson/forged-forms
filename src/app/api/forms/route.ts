import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserFormsWithStats, createForm, generateSlug } from '@/lib/database/forms'
import { ApiResponse } from '@/lib/types/database'

// GET /api/forms - List all forms for the authenticated user
export async function GET() {
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

    // Get user's forms with stats
    const forms = await getUserFormsWithStats(user.id)
    
    const response: ApiResponse = {
      success: true,
      data: forms,
      message: `Found ${forms.length} forms`
    }

    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error fetching forms:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch forms'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}

// POST /api/forms - Create a new form
export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json()
    const { name, description, slug, email_notifications, notification_email } = body

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Form name is required' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const finalSlug = slug && slug.trim() ? slug.trim() : generateSlug(name)

    // Prepare form data
    const formData = {
      user_id: user.id,
      name: name.trim(),
      description: description?.trim() || null,
      slug: finalSlug,
      email_notifications: email_notifications !== false, // Default to true
      notification_email: notification_email?.trim() || user.email || null
    }

    // Create the form
    const newForm = await createForm(formData)
    
    const response: ApiResponse = {
      success: true,
      data: newForm,
      message: 'Form created successfully'
    }

    return NextResponse.json(response, { status: 201 })
    
  } catch (error) {
    console.error('Error creating form:', error)
    
    // Handle specific validation errors
    if (error instanceof Error) {
      if (error.message.includes('slug already exists')) {
        return NextResponse.json(
          { success: false, error: 'A form with this URL already exists. Please choose a different name.' },
          { status: 409 }
        )
      }
      
      if (error.message.includes('Validation failed')) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 400 }
        )
      }
    }
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create form'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
} 