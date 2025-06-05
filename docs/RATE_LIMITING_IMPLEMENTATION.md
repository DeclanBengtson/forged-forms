# Rate Limiting Implementation

This document describes the rate limiting system that has been implemented in the form service application.

## Overview

The rate limiting system provides multi-tiered protection against abuse while respecting subscription-based limits. It integrates seamlessly with the existing Supabase authentication and subscription management system.

## Features Implemented

### 1. Subscription-Based Rate Limits

Different rate limits are applied based on user subscription tiers:

- **Free Tier**: Basic limits for testing and small usage
- **Starter Tier**: Moderate limits for growing businesses
- **Pro Tier**: Higher limits for professional use
- **Enterprise Tier**: Very high limits for large organizations

### 2. Multi-Type Rate Limiting

Three types of rate limiting are implemented:

#### Form Submissions (IP-based)
- **Free**: 10 submissions per minute
- **Starter**: 25 submissions per minute
- **Pro**: 50 submissions per minute
- **Enterprise**: 200 submissions per minute

#### API Calls (User-based)
- **Free**: 100 calls per hour
- **Starter**: 500 calls per hour
- **Pro**: 1,000 calls per hour
- **Enterprise**: 10,000 calls per hour

#### Form Creation (User-based)
- **Free**: 5 forms per day
- **Starter**: 25 forms per day
- **Pro**: 50 forms per day
- **Enterprise**: 500 forms per day

### 3. Endpoints Protected

The following API endpoints now have rate limiting:

- `POST /api/forms/[id]/submit` - Form submissions (IP-based)
- `POST /api/forms` - Form creation (user-based)
- `GET /api/forms` - List forms (user-based)
- `GET /api/forms/[id]/submissions` - Get submissions (user-based)
- `GET /api/user/usage` - Usage statistics (user-based)
- `GET /api/user/subscription` - Subscription info (user-based)

## Implementation Details

### Rate Limiter Core

The rate limiter uses an in-memory store (Map) for development. For production, this should be replaced with Redis for better performance and persistence across server restarts.

```typescript
// Example usage
const rateLimiter = createRateLimiter('submission', 'pro')
const result = rateLimiter('user-ip-address')

if (result.retryAfter) {
  // Rate limit exceeded
  return error response
}
```

### Middleware Integration

Rate limiting is applied using a higher-order function pattern:

```typescript
const rateLimitResponse = await withRateLimit(
  'submission',
  getIPAddress,
  getUserTierFromRequest
)(request)

if (rateLimitResponse) {
  return rateLimitResponse // Rate limit exceeded
}
```

### Subscription Integration

The system automatically detects user subscription tiers and applies appropriate limits:

```typescript
export const getUserTierFromRequest = async (request: NextRequest) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return 'free'
  
  const profile = await getUserProfile(user.id)
  return profile?.subscription_status || 'free'
}
```

## Response Headers

Rate limit information is included in response headers:

- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Timestamp when the limit resets
- `Retry-After`: Seconds to wait before retrying (when limited)

## Error Responses

When rate limits are exceeded, a 429 status code is returned:

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again in 45 seconds.",
  "rateLimitInfo": {
    "limit": 10,
    "remaining": 0,
    "resetTime": 1640995200000,
    "retryAfter": 45
  }
}
```

## Subscription Limit Enforcement

In addition to rate limiting, the system enforces subscription-based limits:

### Form Creation Limits
- Free users can create up to 3 forms total
- Other tiers have unlimited forms

### Monthly Submission Limits
- **Free**: 250 submissions per month across all forms
- **Starter**: 2,000 submissions per month
- **Pro**: 10,000 submissions per month
- **Enterprise**: Unlimited submissions

### Per-Form Submission Limits
- **Free**: 50 submissions per form
- **Starter**: 500 submissions per form
- **Pro**: 2,000 submissions per form
- **Enterprise**: Unlimited submissions per form

## Cleanup and Maintenance

### Automatic Cleanup

The system includes automatic cleanup of expired rate limit entries:

1. **Periodic Cleanup**: 1% chance per request to clean expired entries
2. **User Upgrade Cleanup**: When users upgrade subscriptions, their rate limits are reset

### Manual Cleanup

```typescript
// Clean all expired entries
cleanupRateLimitStore()

// Clean specific user's rate limits (useful after subscription changes)
cleanupUserRateLimits('user-id')
```

## Production Considerations

### Redis Implementation

For production, replace the in-memory store with Redis:

```typescript
// Example Redis implementation
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function createRedisRateLimiter(
  type: string,
  tier: string,
  identifier: string,
  limit: number,
  window: number
) {
  const key = `rate_limit:${type}:${tier}:${identifier}`
  const now = Date.now()
  
  // Use Redis sliding window
  const multi = redis.multi()
  multi.zremrangebyscore(key, 0, now - window)
  multi.zadd(key, now, now)
  multi.zcard(key)
  multi.expire(key, Math.ceil(window / 1000))
  
  const results = await multi.exec()
  const count = results[2][1] as number
  
  return {
    limit,
    remaining: Math.max(0, limit - count),
    resetTime: now + window,
    retryAfter: count > limit ? Math.ceil(window / 1000) : undefined
  }
}
```

### Monitoring

Consider implementing monitoring for:

- Rate limit hit rates by tier
- Most rate-limited endpoints
- Users approaching their limits
- Potential abuse patterns

### Scaling Considerations

- Use Redis Cluster for high availability
- Consider implementing distributed rate limiting
- Monitor memory usage of rate limit store
- Implement rate limit bypass for internal services

## Testing

The rate limiting system can be tested by:

1. Making multiple requests to protected endpoints
2. Checking response headers for rate limit information
3. Verifying different limits apply to different subscription tiers
4. Testing subscription upgrade scenarios

## Configuration

Rate limits can be adjusted in `src/lib/middleware/rate-limit.ts`:

```typescript
const RATE_LIMITS = {
  submission: {
    free: { limit: 10, window: 60 * 1000 },
    // ... other tiers
  },
  // ... other types
}
```

## Security Benefits

1. **DDoS Protection**: Prevents overwhelming the server with requests
2. **Abuse Prevention**: Stops malicious users from excessive API usage
3. **Fair Usage**: Ensures resources are shared fairly among users
4. **Cost Control**: Prevents unexpected infrastructure costs from abuse
5. **Service Quality**: Maintains performance for legitimate users

## Future Enhancements

Potential improvements to consider:

1. **Geographic Rate Limiting**: Different limits by region
2. **Adaptive Rate Limiting**: Adjust limits based on server load
3. **User-Specific Overrides**: Custom limits for specific customers
4. **Rate Limit Analytics**: Detailed reporting on usage patterns
5. **Webhook Rate Limiting**: Protect webhook endpoints
6. **API Key Rate Limiting**: Separate limits for API key usage

This implementation provides a solid foundation for protecting the form service while maintaining a good user experience across all subscription tiers. 