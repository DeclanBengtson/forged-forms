import { NextRequest, NextResponse } from 'next/server'
import { RateLimitInfo } from '@/lib/types/database'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile } from '@/lib/database/users'
import { redisRateLimit, getRedisClient } from '@/lib/redis'
import { rateLimitLogger } from '@/lib/logger'

// Fallback in-memory store for development (when Vercel KV is not available)
// Note: This will reset on each cold start in serverless environments
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limit configurations optimized for serverless
const RATE_LIMITS = {
  // Form submissions (per IP) - optimized for high volume
  submission: {
    free: { limit: 10, window: 60 * 1000 }, // 10 per minute
    starter: { limit: 25, window: 60 * 1000 }, // 25 per minute
    pro: { limit: 50, window: 60 * 1000 }, // 50 per minute
    enterprise: { limit: 200, window: 60 * 1000 }, // 200 per minute
  },
  // API calls (per user)
  api: {
    free: { limit: 100, window: 60 * 60 * 1000 }, // 100 per hour
    starter: { limit: 500, window: 60 * 60 * 1000 }, // 500 per hour
    pro: { limit: 1000, window: 60 * 60 * 1000 }, // 1000 per hour
    enterprise: { limit: 10000, window: 60 * 60 * 1000 }, // 10000 per hour
  },
  // Form creation (per user)
  formCreation: {
    free: { limit: 5, window: 24 * 60 * 60 * 1000 }, // 5 per day
    starter: { limit: 25, window: 24 * 60 * 60 * 1000 }, // 25 per day
    pro: { limit: 50, window: 24 * 60 * 60 * 1000 }, // 50 per day
    enterprise: { limit: 500, window: 24 * 60 * 60 * 1000 }, // 500 per day
  }
}

// In-memory rate limiter (fallback for when Vercel KV is unavailable)
// Note: Limited effectiveness in serverless due to cold starts
function inMemoryRateLimit(
  type: keyof typeof RATE_LIMITS,
  tier: 'free' | 'starter' | 'pro' | 'enterprise',
  identifier: string
): RateLimitInfo {
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
  
  const result: RateLimitInfo = {
    limit: config.limit,
    remaining,
    resetTime: entry.resetTime,
    retryAfter: isLimited ? Math.ceil((entry.resetTime - now) / 1000) : undefined
  }
  
  return result
}

// Vercel KV-based rate limiter (recommended for production on Vercel)
async function vercelKVRateLimit(
  type: keyof typeof RATE_LIMITS,
  tier: 'free' | 'starter' | 'pro' | 'enterprise',
  identifier: string
): Promise<RateLimitInfo> {
  const config = RATE_LIMITS[type][tier]
  const key = `${type}:${tier}:${identifier}`
  
  try {
    const result = await redisRateLimit(key, config.limit, config.window)
    const rateLimitInfo: RateLimitInfo = {
      limit: result.limit,
      remaining: result.remaining,
      resetTime: result.resetTime,
      retryAfter: result.retryAfter
    }
    
    return rateLimitInfo
  } catch (error) {
    rateLimitLogger.error('Vercel KV rate limiting failed, falling back to in-memory', identifier, error)
    // Fallback to in-memory rate limiting
    return inMemoryRateLimit(type, tier, identifier)
  }
}

export function createRateLimiter(
  type: keyof typeof RATE_LIMITS,
  tier: 'free' | 'starter' | 'pro' | 'enterprise' = 'free'
) {
  return async (identifier: string): Promise<RateLimitInfo> => {
    const kvClient = getRedisClient()
    
    if (kvClient) {
      // Prefer Vercel KV for persistent rate limiting across serverless invocations
      return await vercelKVRateLimit(type, tier, identifier)
    } else {
      // Fallback to in-memory (limited effectiveness on serverless)
      rateLimitLogger.warn('Using in-memory rate limiting - consider enabling Vercel KV for production', identifier)
      return inMemoryRateLimit(type, tier, identifier)
    }
  }
}

// Middleware function for rate limiting
export function withRateLimit(
  type: keyof typeof RATE_LIMITS,
  getIdentifier: (request: NextRequest) => string | Promise<string>,
  getTier: (request: NextRequest) => Promise<'free' | 'starter' | 'pro' | 'enterprise'> = async () => 'free'
) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    try {
      const identifier = await getIdentifier(request)
      const tier = await getTier(request)
      const rateLimiter = createRateLimiter(type, tier)
      const rateLimitInfo = await rateLimiter(identifier)
      
      // Add rate limit headers for debugging and client awareness
      const headers = new Headers()
      headers.set('X-RateLimit-Limit', rateLimitInfo.limit.toString())
      headers.set('X-RateLimit-Remaining', rateLimitInfo.remaining.toString())
      headers.set('X-RateLimit-Reset', rateLimitInfo.resetTime.toString())
      
      if (rateLimitInfo.retryAfter) {
        headers.set('Retry-After', rateLimitInfo.retryAfter.toString())
        
        rateLimitLogger.warn('Rate limit exceeded', identifier, {
          type,
          tier,
          limit: rateLimitInfo.limit,
          retryAfter: rateLimitInfo.retryAfter
        })
        
        return NextResponse.json(
          {
            success: false,
            error: 'Rate limit exceeded',
            message: `Too many requests. Please try again in ${rateLimitInfo.retryAfter} seconds.`,
            rateLimitInfo
          },
          { 
            status: 429,
            headers
          }
        )
      }
      
      return null // Continue to next middleware/handler
    } catch (error) {
      rateLimitLogger.error('Rate limiting error', undefined, error)
      return null // Continue on error (fail open)
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
  
  // Fallback for development/testing
  return 'unknown'
}

export const getUserIdFromRequest = async (_request: NextRequest): Promise<string> => {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return 'anonymous'
    }
    
    return user.id
  } catch (error) {
    rateLimitLogger.error('Error getting user from request', undefined, error)
    return 'anonymous'
  }
}

export const getUserTierFromRequest = async (_request: NextRequest): Promise<'free' | 'starter' | 'pro' | 'enterprise'> => {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return 'free'
    }
    
    const userProfile = await getUserProfile(user.id)
    if (!userProfile) {
      return 'free'
    }
    
    // Map subscription status to tier
    switch (userProfile.subscription_status) {
      case 'starter':
        return 'starter'
      case 'pro':
        return 'pro'
      case 'enterprise':
        return 'enterprise'
      default:
        return 'free'
    }
  } catch (error) {
    rateLimitLogger.error('Error getting user tier from request', undefined, error)
    return 'free'
  }
}

// Cleanup function for in-memory store (useful for development)
export function cleanupRateLimitStore(): void {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// Clean up rate limits for a specific user (useful for testing)
export function cleanupUserRateLimits(userId: string): void {
  for (const [key] of rateLimitStore.entries()) {
    if (key.includes(userId)) {
      rateLimitStore.delete(key)
    }
  }
} 