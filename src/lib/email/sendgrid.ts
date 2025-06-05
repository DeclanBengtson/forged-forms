import sgMail from '@sendgrid/mail'
import { Form, Submission } from '@/lib/types/database'

// Initialize SendGrid
const apiKey = process.env.SENDGRID_API_KEY
const fromEmail = process.env.SENDGRID_FROM_EMAIL

if (!apiKey) {
  console.warn('SENDGRID_API_KEY is not set. Email notifications will be disabled.')
} else {
  sgMail.setApiKey(apiKey)
}

export interface EmailNotificationData {
  form: Form
  submission: Submission
  submissionData: Record<string, any>
}

/**
 * Generate a readable email body from form submission data
 */
function generateEmailBody(data: EmailNotificationData): string {
  const { form, submission, submissionData } = data
  
  let body = `You have received a new form submission for "${form.name}".\n\n`
  body += `Submission Details:\n`
  body += `==================\n\n`
  
  // Format each field in the submission
  Object.entries(submissionData).forEach(([key, value]) => {
    const fieldName = key.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    let fieldValue = value
    
    // Handle arrays (e.g., from checkboxes or multi-select)
    if (Array.isArray(value)) {
      fieldValue = value.join(', ')
    }
    
    body += `${fieldName}: ${fieldValue}\n`
  })
  
  body += `\n`
  body += `Submission Info:\n`
  body += `===============\n`
  body += `Submitted at: ${new Date(submission.submitted_at).toLocaleString()}\n`
  body += `Form: ${form.name} (${form.id})\n`
  
  if (submission.ip_address) {
    body += `IP Address: ${submission.ip_address}\n`
  }
  
  if (submission.user_agent) {
    body += `User Agent: ${submission.user_agent}\n`
  }
  
  if (submission.referrer) {
    body += `Referrer: ${submission.referrer}\n`
  }
  
  body += `\n---\nThis email was sent by ForgedForms because you have email notifications enabled for this form.`
  
  return body
}

/**
 * Generate HTML email body from form submission data
 */
function generateEmailHtml(data: EmailNotificationData): string {
  const { form, submission, submissionData } = data
  
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
  
  let html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1f2937; margin: 0; font-size: 24px;">New Form Submission</h1>
          <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">Form: <strong>${form.name}</strong></p>
        </div>
        
        <div style="background-color: #f3f4f6; border-radius: 6px; padding: 20px; margin-bottom: 25px;">
          <h2 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">Submission Details</h2>
  `
  
  // Add each form field
  Object.entries(submissionData).forEach(([key, value]) => {
    const fieldName = key.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    let fieldValue = value
    
    // Handle arrays (e.g., from checkboxes or multi-select)
    if (Array.isArray(value)) {
      fieldValue = value.join(', ')
    }
    
    html += `
      <div style="margin-bottom: 12px;">
        <strong style="color: #374151; display: inline-block; min-width: 120px;">${fieldName}:</strong>
        <span style="color: #1f2937;">${fieldValue}</span>
      </div>
    `
  })
  
  html += `
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 16px;">Additional Information</h3>
          <div style="color: #6b7280; font-size: 14px; line-height: 1.5;">
            <p style="margin: 5px 0;"><strong>Submitted:</strong> ${formatDate(submission.submitted_at)}</p>
            <p style="margin: 5px 0;"><strong>Form ID:</strong> ${form.id}</p>
  `
  
  if (submission.ip_address) {
    html += `<p style="margin: 5px 0;"><strong>IP Address:</strong> ${submission.ip_address}</p>`
  }
  
  if (submission.referrer) {
    html += `<p style="margin: 5px 0;"><strong>Referrer:</strong> ${submission.referrer}</p>`
  }
  
  html += `
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            This email was sent by <strong>ForgedForms</strong> because you have email notifications enabled for this form.
          </p>
        </div>
      </div>
    </div>
  `
  
  return html
}

/**
 * Send email notification for a form submission
 */
export async function sendFormSubmissionNotification(data: EmailNotificationData): Promise<void> {
  if (!apiKey || !fromEmail) {
    console.warn('SendGrid not configured. Skipping email notification.')
    return
  }
  
  const { form } = data
  
  if (!form.email_notifications || !form.notification_email) {
    console.log('Email notifications disabled or no notification email set for form:', form.id)
    return
  }
  
  try {
    const msg = {
      to: form.notification_email,
      from: {
        email: fromEmail,
        name: 'ForgedForms'
      },
      subject: `New submission for "${form.name}"`,
      text: generateEmailBody(data),
      html: generateEmailHtml(data),
    }
    
    await sgMail.send(msg)
    console.log('Email notification sent successfully for form:', form.id)
    
  } catch (error) {
    console.error('Failed to send email notification:', error)
    // Don't throw the error to avoid breaking the form submission process
  }
}

/**
 * Send a test email to verify SendGrid configuration
 */
export async function sendTestEmail(toEmail: string): Promise<boolean> {
  if (!apiKey || !fromEmail) {
    throw new Error('SendGrid not configured')
  }
  
  try {
    const msg = {
      to: toEmail,
      from: {
        email: fromEmail,
        name: 'ForgedForms'
      },
      subject: 'ForgedForms - Test Email',
      text: 'This is a test email to verify your SendGrid configuration is working correctly.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1f2937;">Test Email Successful!</h1>
          <p style="color: #6b7280;">This is a test email to verify your SendGrid configuration is working correctly.</p>
          <p style="color: #6b7280;">Your ForgedForms email notifications are now ready to use.</p>
        </div>
      `,
    }
    
    await sgMail.send(msg)
    return true
    
  } catch (error) {
    console.error('Failed to send test email:', error)
    return false
  }
} 