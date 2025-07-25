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
      user_profiles: {
        Row: UserProfile
        Insert: UserProfileInsert
        Update: UserProfileUpdate
      }
      projects: {
        Row: Project
        Insert: ProjectInsert
        Update: ProjectUpdate
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_form_by_id: {
        Args: {
          form_id: string
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
      subscription_status: 'free' | 'starter' | 'pro' | 'enterprise'
    }
  }
}

// Plan limits types for submission viewing restrictions
export interface SubmissionPlanLimits {
  isLimited: boolean
  maxAllowed: number
  totalStored: number
  upgradeRequired: boolean
}

export interface SubmissionStatsPlanLimits {
  isLimited: boolean
  maxAllowed: number
  totalStored: number
  hiddenCount: number
}

// User Profile types
export interface UserProfile {
  id: string
  user_id: string
  full_name: string | null
  avatar_url: string | null
  subscription_status: 'free' | 'starter' | 'pro' | 'enterprise'
  subscription_id: string | null
  customer_id: string | null
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  trial_end: string | null
  created_at: string
  updated_at: string
}

export interface UserProfileInsert {
  user_id: string
  full_name?: string | null
  avatar_url?: string | null
  subscription_status?: 'free' | 'starter' | 'pro' | 'enterprise'
  subscription_id?: string | null
  customer_id?: string | null
  current_period_start?: string | null
  current_period_end?: string | null
  cancel_at_period_end?: boolean
  trial_end?: string | null
}

export interface UserProfileUpdate {
  full_name?: string | null
  avatar_url?: string | null
  subscription_status?: 'free' | 'starter' | 'pro' | 'enterprise'
  subscription_id?: string | null
  customer_id?: string | null
  current_period_start?: string | null
  current_period_end?: string | null
  cancel_at_period_end?: boolean
  trial_end?: string | null
}

// Project types
export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface ProjectInsert {
  user_id: string
  name: string
  description?: string | null
}

export interface ProjectUpdate {
  name?: string
  description?: string | null
}

// Form types
export interface Form {
  id: string
  user_id: string
  name: string
  description: string | null
  email_notifications: boolean
  notification_email: string | null
  is_active: boolean
  project_id: string | null
  created_at: string
  updated_at: string
}

export interface FormInsert {
  user_id: string
  name: string
  description?: string | null
  email_notifications?: boolean
  notification_email?: string | null
  is_active?: boolean
  project_id?: string | null
}

export interface FormUpdate {
  name?: string
  description?: string | null
  email_notifications?: boolean
  notification_email?: string | null
  is_active?: boolean
  project_id?: string | null
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

// Extended types for UI
export interface FormWithStats extends Form {
  submission_count: number
  latest_submission: string | null
}

export interface FormWithProject extends Form {
  project: Project | null
}

export interface ProjectWithForms extends Project {
  forms: Form[]
  form_count: number
}

export interface ProjectWithStats extends Project {
  form_count: number
  total_submissions: number
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  planLimits?: SubmissionPlanLimits
}

// Form validation types
export interface FormValidation {
  name: {
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

// Subscription and rate limiting types
export interface SubscriptionLimits {
  maxForms: number
  maxSubmissionsPerMonth: number
  maxSubmissionsPerForm: number
  emailNotifications: boolean
  customDomains: boolean
  apiAccess: boolean
  exportData: boolean
  priority_support: boolean
}

export interface RateLimitInfo {
  limit: number
  remaining: number
  resetTime: number
  retryAfter?: number
} 