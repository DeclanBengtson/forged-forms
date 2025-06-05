import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile, updateUserProfile } from '@/lib/database/users'
import { ApiResponse } from '@/lib/types/database'

// GET /api/user/profile - Get current user's profile
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

    // Get user profile
    const profile = await getUserProfile(user.id)

    const response: ApiResponse = {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          email_confirmed_at: user.email_confirmed_at,
          created_at: user.created_at
        },
        profile
      },
      message: 'Profile retrieved successfully'
    }

    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error fetching user profile:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch profile'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}

// PUT /api/user/profile - Update current user's profile
export async function PUT(request: NextRequest) {
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
    const updates = await request.json()
    
    // Only allow certain fields to be updated by users
    const allowedFields = ['full_name', 'avatar_url']
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {} as any)

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Update user profile
    const updatedProfile = await updateUserProfile(user.id, filteredUpdates)

    const response: ApiResponse = {
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully'
    }

    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error updating user profile:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update profile'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
} 