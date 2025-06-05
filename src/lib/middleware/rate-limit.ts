import { NextRequest, NextResponse } from 'next/server'
import { RateLimitInfo } from '@/lib/types/database'

// In-memory rate limit store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limit configurations
const RATE_LIMITS = {
  // Form submissions (per IP)
  submission: {
    free: { limit: 10, window: 60 * 1000 }, // 10 per minute
    pro: { limit: 50, window: 60 * 1000 }, // 50 per minute
    enterprise: { limit: 200, window: 60 * 1000 }, // 200 per minute
  },
  // API calls (per user)
  api: {
    free: { limit: 100, window: 60 * 60 * 1000 }, // 100 per hour
    pro: { limit: 1000, window: 60 * 60 * 1000 }, // 1000 per hour
    enterprise: { limit: 10000, window: 60 * 60 * 1000 }, // 10000 per hour
  },
  // Form creation (per user)
  formCreation: {
    free: { limit: 5, window: 24 * 60 * 60 * 1000 }, // 5 per day
    pro: { limit: 50, window: 24 * 60 * 60 * 1000 }, // 50 per day
    enterprise: { limit: 500, window: 24 * 60 * 60 * 1000 }, // 500 per day
  }
}

export function createRateLimiter(
  type: keyof typeof RATE_LIMITS,
  tier: 'free' | 'pro' | 'enterprise' = 'free'
) {
  return (identifier: string): RateLimitInfo => {
    const config = RATE_LIMITS[type][tier]
    const now = Date.now()
    const key = `${type}:${tier}:${identifier}`
    
    // Clean up expired entries
    if (rateLimitStore.has(key)) {
      const entry = rateLimitStore.get(key)!
      if (now > entry.resetTime) {
        rateLimitStore.delete(key)
      }
    }
    
    // Get or create entry
    let entry = rateLimitStore.get(key)
    if (!entry) {
      entry = {
        count: 0,
        resetTime: now + config.window
      }
      rateLimitStore.set(key, entry)
    }
    
    // Increment count
    entry.count++
    
    const remaining = Math.max(0, config.limit - entry.count)
    const isLimited = entry.count > config.limit
    
    return {
      limit: config.limit,
      remaining,
      resetTime: entry.resetTime,
      retryAfter: isLimited ? Math.ceil((entry.resetTime - now) / 1000) : undefined
    }
  }
}

// Middleware function for rate limiting
export function withRateLimit(
  type: keyof typeof RATE_LIMITS,
  getIdentifier: (request: NextRequest) => string,
  getTier: (request: NextRequest) => Promise<'free' | 'pro' | 'enterprise'> = async () => 'free'
) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    try {
      const identifier = getIdentifier(request)
      const tier = await getTier(request)
      const rateLimiter = createRateLimiter(type, tier)
      const rateLimitInfo = rateLimiter(identifier)
      
      // Add rate limit headers
      const headers = new Headers()
      headers.set('X-RateLimit-Limit', rateLimitInfo.limit.toString())
      headers.set('X-RateLimit-Remaining', rateLimitInfo.remaining.toString())
      headers.set('X-RateLimit-Reset', rateLimitInfo.resetTime.toString())
      
      if (rateLimitInfo.retryAfter) {
        headers.set('Retry-After', rateLimitInfo.retryAfter.toString())
        
        return NextResponse.json(
          {
            success: false,
            error: 'Rate limit exceeded',
            rateLimitInfo
          },
          { 
            status: 429,
            headers
          }
        )
      }
      
      // Rate limit passed, add headers to response
      const response = NextResponse.next()
      headers.forEach((value, key) => {
        response.headers.set(key, value)
      })
      
      return null // Continue to next middleware/handler
    } catch (error) {
      console.error('Rate limiting error:', error)
      return null // Continue on error
    }
  }
}

// Helper functions for common rate limiting scenarios
export const getIPAddress = (request: NextRequest): string => {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

export const getUserId = (request: NextRequest): string => {
  // This would typically extract user ID from JWT token or session
  // For now, return a placeholder - implement based on your auth system
  const authHeader = request.headers.get('authorization')
  if (authHeader) {
    // Extract user ID from token
    // This is a placeholder - implement actual token parsing
    return 'user-from-token'
  }
  return 'anonymous'
}

// Clean up expired entries periodically (call this in a cron job or background task)
export function cleanupRateLimitStore(): void {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
} 