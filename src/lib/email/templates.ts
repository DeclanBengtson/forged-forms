import { Form, Submission } from '@/lib/types/database'

/**
 * Generate sample form submission data for testing and previews
 */
export function generateSampleSubmissionData(): {
  form: Partial<Form>
  submission: Partial<Submission>
  submissionData: Record<string, any>
} {
  return {
    form: {
      id: 'sample-form-id',
      name: 'Contact Form',
      slug: 'contact-form',
      email_notifications: true,
      notification_email: 'owner@example.com'
    },
    submission: {
      id: 'sample-submission-id',
      submitted_at: new Date().toISOString(),
      ip_address: '192.168.1.1',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      referrer: 'https://example.com/contact'
    },
    submissionData: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      company: 'Acme Corporation',
      message: 'Hello! I\'m interested in learning more about your services. Could you please send me more information about pricing and availability? Thanks!',
      newsletter: ['Yes', 'Weekly updates'],
      preferred_contact: 'Email',
      budget: '$1,000 - $5,000'
    }
  }
}

/**
 * Email template configurations
 */
export const EMAIL_TEMPLATES = {
  FORM_SUBMISSION: {
    subject: (formName: string) => `New submission for "${formName}"`,
    fromName: 'ForgedForms',
    
    // Plain text template
    textTemplate: (data: {
      formName: string
      submissionData: Record<string, any>
      submittedAt: string
      formSlug: string
      ipAddress?: string
      userAgent?: string
      referrer?: string
    }) => {
      let text = `You have received a new form submission for "${data.formName}".\n\n`
      text += `Submission Details:\n==================\n\n`
      
      Object.entries(data.submissionData).forEach(([key, value]) => {
        const fieldName = key.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        const fieldValue = Array.isArray(value) ? value.join(', ') : value
        text += `${fieldName}: ${fieldValue}\n`
      })
      
      text += `\nSubmission Info:\n===============\n`
      text += `Submitted at: ${new Date(data.submittedAt).toLocaleString()}\n`
      text += `Form: ${data.formName} (${data.formSlug})\n`
      
      if (data.ipAddress) text += `IP Address: ${data.ipAddress}\n`
      if (data.userAgent) text += `User Agent: ${data.userAgent}\n`
      if (data.referrer) text += `Referrer: ${data.referrer}\n`
      
      text += `\n---\nThis email was sent by ForgedForms because you have email notifications enabled for this form.`
      
      return text
    },
    
    // HTML template with improved styling
    htmlTemplate: (data: {
      formName: string
      submissionData: Record<string, any>
      submittedAt: string
      formSlug: string
      ipAddress?: string
      userAgent?: string
      referrer?: string
    }) => {
      const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        })
      }
      
      let fieldsHtml = ''
      Object.entries(data.submissionData).forEach(([key, value]) => {
        const fieldName = key.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        const fieldValue = Array.isArray(value) ? value.join(', ') : value
        
        fieldsHtml += `
          <div style="margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
            <strong style="color: #374151; display: inline-block; min-width: 120px; font-weight: 600;">
              ${fieldName}:
            </strong>
            <span style="color: #1f2937; word-break: break-word;">${fieldValue}</span>
          </div>
        `
      })
      
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Form Submission</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
              
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #e5e7eb;">
                <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 28px; font-weight: 700; margin-bottom: 8px;">
                  ForgedForms
                </div>
                <h1 style="color: #1f2937; margin: 0; font-size: 24px; font-weight: 600;">
                  New Form Submission
                </h1>
                <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 16px;">
                  Form: <strong style="color: #374151;">${data.formName}</strong>
                </p>
              </div>
              
              <!-- Submission Details -->
              <div style="background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 8px; padding: 24px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
                <h2 style="color: #374151; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
                  <span style="background: #3b82f6; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; margin-right: 8px;">
                    📋
                  </span>
                  Submission Details
                </h2>
                <div style="space-y: 12px;">
                  ${fieldsHtml}
                </div>
              </div>
              
              <!-- Additional Information -->
              <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-bottom: 24px;">
                <h3 style="color: #374151; margin: 0 0 16px 0; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
                  <span style="background: #10b981; color: white; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; margin-right: 8px;">
                    ℹ️
                  </span>
                  Additional Information
                </h3>
                <div style="background: #f9fafb; border-radius: 6px; padding: 16px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                  <div style="margin-bottom: 8px;">
                    <strong style="color: #374151;">Submitted:</strong> ${formatDate(data.submittedAt)}
                  </div>
                  <div style="margin-bottom: 8px;">
                    <strong style="color: #374151;">Form Slug:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${data.formSlug}</code>
                  </div>
                  ${data.ipAddress ? `<div style="margin-bottom: 8px;"><strong style="color: #374151;">IP Address:</strong> ${data.ipAddress}</div>` : ''}
                  ${data.referrer ? `<div style="margin-bottom: 8px;"><strong style="color: #374151;">Referrer:</strong> <a href="${data.referrer}" style="color: #3b82f6; text-decoration: none;">${data.referrer}</a></div>` : ''}
                </div>
              </div>
              
              <!-- Footer -->
              <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.5;">
                  This email was sent by <strong style="color: #6b7280;">ForgedForms</strong> because you have email notifications enabled for this form.<br>
                  <a href="#" style="color: #3b82f6; text-decoration: none;">Manage your notification settings</a>
                </p>
              </div>
              
            </div>
            
            <!-- Powered by -->
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #9ca3af; font-size: 11px; margin: 0;">
                Powered by <strong>ForgedForms</strong> - Simple form handling for developers
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    }
  }
}

/**
 * Validate email template configuration
 */
export function validateEmailSettings(settings: {
  notifications_enabled?: boolean
  notification_email?: string
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (settings.notifications_enabled && !settings.notification_email) {
    errors.push('Notification email is required when email notifications are enabled')
  }
  
  if (settings.notification_email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(settings.notification_email)) {
      errors.push('Please enter a valid email address')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
} 