import { ApiResponse, PaginatedResponse, Form, FormInsert, FormUpdate, Submission } from '@/lib/types/database'

// Base API configuration
const API_BASE = '/api'

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error occurred' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }
  
  return response.json()
}

// Forms API
export const formsApi = {
  // List all forms
  async list(): Promise<ApiResponse<Form[]>> {
    const response = await fetch(`${API_BASE}/forms`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return handleResponse<ApiResponse<Form[]>>(response)
  },

  // Create a new form
  async create(formData: Omit<FormInsert, 'user_id'>): Promise<ApiResponse<Form>> {
    const response = await fetch(`${API_BASE}/forms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    return handleResponse<ApiResponse<Form>>(response)
  },

  // Get a specific form
  async get(slug: string): Promise<ApiResponse<Form>> {
    const response = await fetch(`${API_BASE}/forms/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return handleResponse<ApiResponse<Form>>(response)
  },

  // Update a form
  async update(slug: string, updates: FormUpdate): Promise<ApiResponse<Form>> {
    const response = await fetch(`${API_BASE}/forms/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })
    return handleResponse<ApiResponse<Form>>(response)
  },

  // Delete a form
  async delete(slug: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE}/forms/${slug}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return handleResponse<ApiResponse<void>>(response)
  },

  // Get form statistics
  async getStats(slug: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE}/forms/${slug}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return handleResponse<ApiResponse<any>>(response)
  }
}

// Submissions API
export const submissionsApi = {
  // List submissions for a form
  async list(
    slug: string, 
    options: {
      page?: number
      limit?: number
      sortBy?: 'submitted_at' | 'id'
      sortOrder?: 'asc' | 'desc'
    } = {}
  ): Promise<PaginatedResponse<Submission>> {
    const params = new URLSearchParams()
    if (options.page) params.set('page', options.page.toString())
    if (options.limit) params.set('limit', options.limit.toString())
    if (options.sortBy) params.set('sortBy', options.sortBy)
    if (options.sortOrder) params.set('sortOrder', options.sortOrder)

    const queryString = params.toString()
    const url = `${API_BASE}/forms/${slug}/submissions${queryString ? `?${queryString}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return handleResponse<PaginatedResponse<Submission>>(response)
  },

  // Export submissions as CSV
  async export(slug: string): Promise<Blob> {
    const response = await fetch(`${API_BASE}/forms/${slug}/submissions/export`, {
      method: 'GET',
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to export' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }
    
    return response.blob()
  },

  // Submit to a form (public endpoint)
  async submit(slug: string, data: Record<string, any>): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE}/forms/${slug}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return handleResponse<ApiResponse<any>>(response)
  }
}

// Helper functions for common operations
export const apiHelpers = {
  // Generate a preview URL for a form
  getFormSubmissionUrl(slug: string, baseUrl?: string): string {
    const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')
    return `${base}/api/forms/${slug}/submit`
  },

  // Generate a form management URL
  getFormManagementUrl(slug: string): string {
    return `/dashboard/forms/${slug}`
  },

  // Download CSV export
  async downloadCsvExport(slug: string, filename?: string): Promise<void> {
    try {
      const blob = await submissionsApi.export(slug)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename || `${slug}-submissions.csv`
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download CSV:', error)
      throw error
    }
  }
} 