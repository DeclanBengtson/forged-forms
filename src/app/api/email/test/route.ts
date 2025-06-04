import { NextRequest, NextResponse } from 'next/server'
import { sendTestEmail } from '@/lib/email/sendgrid'
import { ApiResponse } from '@/lib/types/database'

// POST /api/email/test - Test SendGrid configuration
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email address is required' },
        { status: 400 }
      )
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address format' },
        { status: 400 }
      )
    }
    
    const success = await sendTestEmail(email)
    
    if (success) {
      const response: ApiResponse = {
        success: true,
        message: 'Test email sent successfully'
      }
      return NextResponse.json(response)
    } else {
      const response: ApiResponse = {
        success: false,
        error: 'Failed to send test email. Check your SendGrid configuration.'
      }
      return NextResponse.json(response, { status: 500 })
    }
    
  } catch (error) {
    console.error('Error sending test email:', error)
    
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send test email'
    }
    
    return NextResponse.json(response, { status: 500 })
  }
} 