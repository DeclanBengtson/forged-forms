import { z } from 'zod';

// Common validation patterns
const emailSchema = z.string().email('Invalid email address').max(254);
const urlSchema = z.string().url('Invalid URL').max(2048);
const _phoneSchema = z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number');
const nameSchema = z.string().min(1, 'Name is required').max(100).trim();

// Sanitization helpers
export function sanitizeString(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

export function sanitizeHtml(input: string): string {
  // Basic HTML sanitization - in production, consider using a library like DOMPurify
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*>/gi, '')
    .replace(/<link\b[^<]*>/gi, '')
    .replace(/<meta\b[^<]*>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

// Form submission validation schema
export const formSubmissionSchema = z.object({
  // Standard form fields with validation and sanitization
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .transform(sanitizeString)
    .optional(),
  
  email: z.string()
    .email('Invalid email address')
    .max(254, 'Email too long')
    .transform(sanitizeString)
    .optional(),
  
  phone: z.string()
    .regex(/^[\+]?[1-9][\d\s\-\(\)]{0,20}$/, 'Invalid phone number')
    .transform(sanitizeString)
    .optional(),
  
  message: z.string()
    .max(5000, 'Message too long')
    .transform(sanitizeHtml)
    .optional(),
  
  subject: z.string()
    .max(200, 'Subject too long')
    .transform(sanitizeString)
    .optional(),
  
  company: z.string()
    .max(100, 'Company name too long')
    .transform(sanitizeString)
    .optional(),
  
  website: z.string()
    .url('Invalid website URL')
    .max(2048, 'URL too long')
    .transform(sanitizeString)
    .optional()
    .or(z.literal('')),
  
  // Allow additional custom fields
}).catchall(
  z.string()
    .max(1000, 'Field value too long')
    .transform(sanitizeString)
);

// Form creation validation schema
export const formCreationSchema = z.object({
  name: z.string()
    .min(1, 'Form name is required')
    .max(100, 'Form name too long')
    .transform(sanitizeString),
  
  description: z.string()
    .max(500, 'Description too long')
    .transform(sanitizeHtml)
    .optional(),
  
  notification_email: emailSchema.optional(),
  
  email_notifications: z.boolean().default(true),
  

  
  custom_message: z.string()
    .max(1000, 'Custom message too long')
    .transform(sanitizeHtml)
    .optional(),
});

// User profile validation schema
export const userProfileSchema = z.object({
  full_name: nameSchema.optional(),
  company: z.string().max(100).transform(sanitizeString).optional(),
  website: urlSchema.optional().or(z.literal('')),
  bio: z.string().max(500).transform(sanitizeHtml).optional(),
});

// API key validation schema
export const apiKeySchema = z.object({
  name: z.string()
    .min(1, 'API key name is required')
    .max(50, 'API key name too long')
    .transform(sanitizeString),
  
  permissions: z.array(z.enum(['read', 'write', 'admin'])).default(['read']),
});

// Webhook validation schema
export const webhookSchema = z.object({
  url: urlSchema,
  events: z.array(z.string()).min(1, 'At least one event must be selected'),
  secret: z.string().min(8, 'Webhook secret must be at least 8 characters').optional(),
});

// Rate limiting validation
export const rateLimitSchema = z.object({
  identifier: z.string().min(1).max(100),
  type: z.enum(['submission', 'api', 'formCreation']),
  tier: z.enum(['free', 'starter', 'pro', 'enterprise']).default('free'),
});

// File upload validation
export const fileUploadSchema = z.object({
  filename: z.string()
    .min(1, 'Filename is required')
    .max(255, 'Filename too long')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Invalid filename characters'),
  
  contentType: z.string()
    .regex(/^[a-zA-Z0-9\/\-\+]+$/, 'Invalid content type'),
  
  size: z.number()
    .min(1, 'File cannot be empty')
    .max(10 * 1024 * 1024, 'File too large (max 10MB)'), // 10MB limit
});

// Search and pagination validation
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().max(100).transform(sanitizeString).optional(),
});

// Environment-specific validation
export const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  REDIS_URL: z.string().url().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

// Fast validation for high-volume submissions (bypasses Zod overhead)
export function validateFormSubmissionFast(data: unknown): {
  success: boolean
  data?: Record<string, any>
  error?: { message: string; field?: string }
} {
  if (!data || typeof data !== 'object') {
    return { success: false, error: { message: 'Invalid data format' } }
  }

  const input = data as Record<string, any>
  const validated: Record<string, any> = {}

  // Basic validation rules without Zod overhead
  const validationRules = {
    email: (value: string) => {
      if (value.length > 254) return 'Email too long'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format'
      return null
    },
    phone: (value: string) => {
      if (value.length > 20) return 'Phone number too long'
      if (!/^[\+]?[1-9][\d\s\-\(\)]{0,20}$/.test(value)) return 'Invalid phone format'
      return null
    },
    name: (value: string) => {
      if (value.length > 100) return 'Name too long'
      return null
    },
    message: (value: string) => {
      if (value.length > 5000) return 'Message too long'
      return null
    },
    subject: (value: string) => {
      if (value.length > 200) return 'Subject too long'
      return null
    },
    website: (value: string) => {
      if (value.length > 2048) return 'URL too long'
      if (value && !/^https?:\/\/.+/.test(value)) return 'Invalid URL format'
      return null
    }
  }

  // Validate each field
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed.length === 0) continue

      // Apply specific validation if rule exists
      if (key in validationRules) {
        const rule = validationRules[key as keyof typeof validationRules]
        const error = rule(trimmed)
        if (error) {
          return { success: false, error: { message: error, field: key } }
        }
      }

      validated[key] = trimmed
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      validated[key] = value
    } else if (Array.isArray(value)) {
      const cleanArray = value
        .filter(item => typeof item === 'string' && item.trim().length > 0)
        .map(item => item.trim())
      
      if (cleanArray.length > 0) {
        validated[key] = cleanArray
      }
    }
  }

  return { success: true, data: validated }
}

// Validation helper functions
export function validateFormSubmission(data: unknown) {
  return formSubmissionSchema.safeParse(data);
}

// Use fast validation for high-volume scenarios
export function validateFormSubmissionOptimized(data: unknown, useFastValidation = false) {
  if (useFastValidation) {
    return validateFormSubmissionFast(data);
  }
  return validateFormSubmission(data);
}

export function validateFormCreation(data: unknown) {
  return formCreationSchema.safeParse(data);
}

export function validateUserProfile(data: unknown) {
  return userProfileSchema.safeParse(data);
}

export function validatePagination(data: unknown) {
  return paginationSchema.safeParse(data);
}

// Middleware validation helper
export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return { success: true, data: result.data };
    }
    
    const errors = result.error.errors.map(err => {
      const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
      return `${path}${err.message}`;
    });
    
    return { success: false, errors };
  };
}

// XSS protection helper
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// SQL injection protection (for raw queries)
export function escapeSql(input: string): string {
  return input.replace(/'/g, "''");
}

// Rate limiting validation
export function validateRateLimit(data: unknown) {
  return rateLimitSchema.safeParse(data);
}

// Content Security Policy nonce generator
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// CSRF token validation
export function validateCSRFToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken) {
    return false;
  }
  
  // Use constant-time comparison to prevent timing attacks
  if (token.length !== expectedToken.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i);
  }
  
  return result === 0;
} 