// Database types for the form service

export interface Database {
  public: {
    Tables: {
      forms: {
        Row: Form
        Insert: FormInsert
        Update: FormUpdate
      }
      submissions: {
        Row: Submission
        Insert: SubmissionInsert
        Update: SubmissionUpdate
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_form_by_slug: {
        Args: {
          form_slug: string
        }
        Returns: {
          id: string
          name: string
          is_active: boolean
          email_notifications: boolean
          notification_email: string | null
          user_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Form types
export interface Form {
  id: string
  user_id: string
  name: string
  slug: string
  description: string | null
  email_notifications: boolean
  notification_email: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FormInsert {
  user_id: string
  name: string
  slug: string
  description?: string | null
  email_notifications?: boolean
  notification_email?: string | null
  is_active?: boolean
}

export interface FormUpdate {
  name?: string
  slug?: string
  description?: string | null
  email_notifications?: boolean
  notification_email?: string | null
  is_active?: boolean
}

// Submission types
export interface Submission {
  id: string
  form_id: string
  data: Record<string, any>
  submitted_at: string
  ip_address: string | null
  user_agent: string | null
  referrer: string | null
}

export interface SubmissionInsert {
  form_id: string
  data: Record<string, any>
  ip_address?: string | null
  user_agent?: string | null
  referrer?: string | null
}

export interface SubmissionUpdate {
  data?: Record<string, any>
}

// Form with submission count (for dashboard)
export interface FormWithStats extends Form {
  submission_count: number
  latest_submission: string | null
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form validation types
export interface FormValidation {
  name: {
    isValid: boolean
    message?: string
  }
  slug: {
    isValid: boolean
    message?: string
  }
  notification_email?: {
    isValid: boolean
    message?: string
  }
}

// Public form submission types (for external use)
export interface PublicFormSubmission {
  [fieldName: string]: string | number | boolean | string[]
} 