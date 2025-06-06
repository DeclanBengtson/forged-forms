# Rate Limiting and Subscription Management Implementation Guide

This document outlines the comprehensive implementation of rate limiting and subscription-based form submission limits in the form service application.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Subscription Tiers and Limits](#subscription-tiers-and-limits)
3. [Rate Limiting Implementation](#rate-limiting-implementation)
4. [Submission Limit Enforcement](#submission-limit-enforcement)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Frontend Components](#frontend-components)
8. [Usage Tracking](#usage-tracking)
9. [Implementation Details](#implementation-details)
10. [Production Considerations](#production-considerations)
11. [Testing Strategies](#testing-strategies)

## Architecture Overview

The system implements a multi-layered approach to rate limiting and subscription management:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client/Form   │    │   Middleware    │    │   Database      │
│   Submission    │───▶│   Rate Limiter  │───▶│   Validation    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               │
                               ▼
                       ┌─────────────────┐
                       │  Subscription   │
                       │  Tier Check     │
                       └─────────────────┘
```

### Key Components:

1. **Subscription Management**: Controls user access levels and limits
2. **Rate Limiting Middleware**: Prevents abuse and controls request frequency
3. **Usage Tracking**: Monitors submission counts per user/form
4. **Limit Enforcement**: Validates submissions against subscription limits

## Subscription Tiers and Limits

The system supports four subscription tiers with different limits:

```typescript
// From src/lib/database/users.ts
export function getSubscriptionLimits(subscriptionStatus: 'free' | 'starter' | 'pro' | 'enterprise'): SubscriptionLimits {
  switch (subscriptionStatus) {
    case 'free':
      return {
        maxForms: 3,
        maxSubmissionsPerMonth: 250,
        emailNotifications: true,
        customDomains: false,
        apiAccess: false,
        exportData: false,
        priority_support: false
      }
    case 'starter':
      return {
        maxForms: -1, // Unlimited
        maxSubmissionsPerMonth: 2000,
        emailNotifications: true,
        customDomains: false,
        apiAccess: false,
        exportData: true,
        priority_support: false
      }
    case 'pro':
      return {
        maxForms: -1, // Unlimited
        maxSubmissionsPerMonth: 10000,
        emailNotifications: true,
        customDomains: true,
        apiAccess: true,
        exportData: true,
        priority_support: true
      }
    case 'enterprise':
      return {
        maxForms: -1, // Unlimited
        maxSubmissionsPerMonth: -1, // Unlimited
        emailNotifications: true,
        customDomains: true,
        apiAccess: true,
        exportData: true,
        priority_support: true
      }
  }
}
```

### Subscription Features Comparison:

| Feature | Free | Starter | Pro | Enterprise |
|---------|------|---------|-----|------------|
| Forms | 3 | Unlimited | Unlimited | Unlimited |
| Monthly Submissions | 250 | 2,000 | 10,000 | Unlimited |
| Email Notifications | ✅ | ✅ | ✅ | ✅ |
| Custom Domains | ❌ | ❌ | ✅ | ✅ |
| API Access | ❌ | ❌ | ✅ | ✅ |
| Data Export | ❌ | ✅ | ✅ | ✅ |
| Priority Support | ❌ | ❌ | ✅ | ✅ |

## Rate Limiting Implementation

The rate limiting system uses an in-memory store (Redis recommended for production) and implements different limits based on subscription tiers.

### Rate Limit Configuration

```typescript
// From src/lib/middleware/rate-limit.ts
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
```

### Rate Limiter Factory

```typescript
export function createRateLimiter(
  type: keyof typeof RATE_LIMITS,
  tier: 'free' | 'pro' | 'enterprise' = 'free'
) {
  return (identifier: string): RateLimitInfo => {
    const config = RATE_LIMITS[type][tier]
    const now = Date.now()
    const key = `${type}:${tier}:${identifier}`
    
    // Implementation details...
    
    return {
      limit: config.limit,
      remaining,
      resetTime: entry.resetTime,
      retryAfter: isLimited ? Math.ceil((entry.resetTime - now) / 1000) : undefined
    }
  }
}
```

## Submission Limit Enforcement

The system enforces submission limits at the monthly level across all user forms:

### Monthly Submission Limits

```typescript
// From src/lib/database/users.ts
export async function canUserReceiveSubmission(userId: string): Promise<{ canReceive: boolean; reason?: string }> {
  const profile = await getUserProfile(userId)
  if (!profile) {
    return { canReceive: false, reason: 'User profile not found' }
  }

  const limits = getSubscriptionLimits(profile.subscription_status)
  
  // Check monthly limit across all user forms
  if (limits.maxSubmissionsPerMonth !== -1) {
    const { data: userForms } = await supabase
      .from('forms')
      .select('id')
      .eq('user_id', userId)

    const formIds = userForms?.map(f => f.id) || []
    
    if (formIds.length > 0) {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const { count: monthlyCount } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .in('form_id', formIds)
        .gte('submitted_at', startOfMonth.toISOString())

      if ((monthlyCount || 0) >= limits.maxSubmissionsPerMonth) {
        return { 
          canReceive: false, 
          reason: `Monthly submission limit (${limits.maxSubmissionsPerMonth}) reached for your ${profile.subscription_status} plan.` 
        }
      }
    }
  }

  return { canReceive: true }
}
```

### Form Creation Limits

```typescript
export async function canUserCreateForm(userId: string): Promise<{ canCreate: boolean; reason?: string }> {
  const profile = await getUserProfile(userId)
  const limits = getSubscriptionLimits(profile.subscription_status)
  
  if (limits.maxForms === -1) {
    return { canCreate: true }
  }

  const { count } = await supabase
    .from('forms')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  const currentFormCount = count || 0
  
  if (currentFormCount >= limits.maxForms) {
    return { 
      canCreate: false, 
      reason: `You've reached the maximum number of forms (${limits.maxForms}) for your ${profile.subscription_status} plan.` 
    }
  }

  return { canCreate: true }
}
```

## Database Schema

### User Profiles Table

```sql
-- From supabase/consolidated_reset.sql
CREATE TABLE public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  subscription_status public.subscription_status DEFAULT 'free'::public.subscription_status,
  subscription_id VARCHAR(255),
  customer_id VARCHAR(255),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Submissions Table with Indexes

```sql
CREATE TABLE public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES public.forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT
);

-- Performance indexes for rate limiting queries
CREATE INDEX idx_submissions_form_id ON public.submissions(form_id);
CREATE INDEX idx_submissions_submitted_at ON public.submissions(submitted_at DESC);
```

## API Endpoints

### 1. Usage Tracking Endpoint

```typescript
// From src/app/api/user/usage/route.ts
export async function GET(_request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Calculate usage metrics
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Get monthly submissions across all user forms
  const { data: userForms } = await supabase
    .from('forms')
    .select('id')
    .eq('user_id', user.id);

  const formIds = userForms?.map(f => f.id) || [];
  
  let monthlySubmissions = 0;
  if (formIds.length > 0) {
    const { count } = await supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true })
      .in('form_id', formIds)
      .gte('submitted_at', startOfMonth.toISOString());
    
    monthlySubmissions = count || 0;
  }
  
  return NextResponse.json({
    usage: {
      formsCount: formsCount || 0,
      monthlySubmissions,
      submissionsThisWeek: submissionsThisWeek || 0,
      totalSubmissions: totalSubmissions || 0
    }
  });
}
```

### 2. Subscription Information Endpoint

```typescript
// Endpoint: /api/user/subscription
export async function GET() {
  const { user } = await getCurrentUser();
  const profile = await getUserProfile(user.id);
  const limits = getSubscriptionLimits(profile.subscription_status);
  
  return NextResponse.json({
    subscription: {
      status: profile.subscription_status,
      subscription_id: profile.subscription_id,
      current_period_end: profile.current_period_end,
      cancel_at_period_end: profile.cancel_at_period_end,
      trial_end: profile.trial_end
    },
    limits
  });
}
```

## Frontend Components

### 1. Subscription Status Component

```typescript
// From src/components/dashboard/SubscriptionStatus.tsx
export default function SubscriptionStatus({ subscription, limits, usage }: SubscriptionStatusProps) {
  const shouldShowUpgrade = () => {
    return subscription.status === 'free' || 
           (subscription.status === 'starter' && (usage.monthlySubmissions / limits.maxSubmissionsPerMonth) > 0.8) ||
           (usage.formsCount >= limits.maxForms && limits.maxForms !== -1);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Subscription tier display */}
      <div className="mb-6">
        <span className="text-lg font-medium text-gray-900">
          {getSubscriptionDisplayName(subscription.status)}
        </span>
      </div>
      
      {/* Usage bars */}
      <div className="space-y-4 mb-6">
        <UsageBar
          label="Forms"
          current={usage.formsCount}
          limit={limits.maxForms}
        />
        <UsageBar
          label="Monthly Submissions"
          current={usage.monthlySubmissions}
          limit={limits.maxSubmissionsPerMonth}
        />
      </div>
      
      {/* Upgrade prompts */}
      {shouldShowUpgrade() && (
        <button onClick={handleUpgrade} className="btn-primary">
          Upgrade Plan
        </button>
      )}
    </div>
  );
}
```

### 2. Usage Bar Component

```typescript
interface UsageBarProps {
  label: string;
  current: number;
  limit: number;
}

function UsageBar({ label, current, limit }: UsageBarProps) {
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 0 : Math.min((current / limit) * 100, 100);
  const isNearLimit = percentage > 80;
  const isAtLimit = percentage >= 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className={`font-medium ${isAtLimit ? 'text-red-600' : isNearLimit ? 'text-orange-600' : 'text-gray-900'}`}>
          {isUnlimited ? `${current.toLocaleString()} / Unlimited` : `${current.toLocaleString()} / ${limit.toLocaleString()}`}
        </span>
      </div>
      {!isUnlimited && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-orange-500' : 'bg-blue-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
```

## Usage Tracking

### 1. Real-time Usage Monitoring

The system tracks usage across multiple dimensions:

- **Forms per user**: Counted against subscription limits
- **Submissions per month**: Aggregated across all user forms
- **API calls**: Rate limited by subscription tier

### 2. Usage Calculation Functions

```typescript
// From src/app/api/user/usage/route.ts
async function calculateUsage(userId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  
  // Get all user forms
  const { data: userForms } = await supabase
    .from('forms')
    .select('id')
    .eq('user_id', userId);
  
  const formIds = userForms?.map(f => f.id) || [];
  
  // Calculate metrics in parallel
  const [monthlyCount, weeklyCount, totalCount] = await Promise.all([
    supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true })
      .in('form_id', formIds)
      .gte('submitted_at', startOfMonth.toISOString()),
    supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true })
      .in('form_id', formIds)
      .gte('submitted_at', startOfWeek.toISOString()),
    supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true })
      .in('form_id', formIds)
  ]);
  
  return {
    monthlySubmissions: monthlyCount.count || 0,
    submissionsThisWeek: weeklyCount.count || 0,
    totalSubmissions: totalCount.count || 0
  };
}
```

## Implementation Details

### 1. Middleware Integration

```typescript
// In Next.js middleware or API routes
import { withRateLimit, getIPAddress } from '@/lib/middleware/rate-limit';

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await withRateLimit(
    'submission',
    getIPAddress,
    async (req) => {
      // Get user's subscription tier
      const user = await getCurrentUser(req);
      const profile = await getUserProfile(user.id);
      return profile.subscription_status === 'enterprise' ? 'enterprise' : 
             profile.subscription_status === 'pro' ? 'pro' : 'free';
    }
  )(request);
  
  if (rateLimitResponse) {
    return rateLimitResponse; // Rate limit exceeded
  }
  
  // Check subscription limits
  const { canReceive, reason } = await canUserReceiveSubmission(userId);
  if (!canReceive) {
    return NextResponse.json(
      { error: reason },
      { status: 403 }
    );
  }
  
  // Process submission...
}
```

### 2. Subscription Upgrade Flow

```typescript
// Handle subscription upgrades
export async function handleSubscriptionUpgrade(userId: string, newTier: SubscriptionStatus) {
  const supabase = await createClient();
  
  // Update user profile
  const { error } = await supabase
    .from('user_profiles')
    .update({
      subscription_status: newTier,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);
  
  if (error) {
    throw new Error(`Failed to update subscription: ${error.message}`);
  }
  
  // Clear any cached rate limits for the user
  // This allows immediate access to new limits
  cleanupUserRateLimits(userId);
}
```

## Production Considerations

### 1. Redis Implementation

For production environments, replace the in-memory rate limiter with Redis:

```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function createRedisRateLimiter(
  type: string,
  tier: string,
  identifier: string,
  limit: number,
  window: number
): Promise<RateLimitInfo> {
  const key = `rate_limit:${type}:${tier}:${identifier}`;
  const now = Date.now();
  
  // Use Redis MULTI for atomic operations
  const multi = redis.multi();
  multi.zremrangebyscore(key, 0, now - window);
  multi.zadd(key, now, now);
  multi.zcard(key);
  multi.expire(key, Math.ceil(window / 1000));
  
  const results = await multi.exec();
  const count = results[2][1] as number;
  
  return {
    limit,
    remaining: Math.max(0, limit - count),
    resetTime: now + window,
    retryAfter: count > limit ? Math.ceil(window / 1000) : undefined
  };
}
```

### 2. Database Optimization

```sql
-- Add compound indexes for efficient queries
CREATE INDEX idx_submissions_user_month ON public.submissions(form_id, submitted_at) 
WHERE submitted_at >= date_trunc('month', CURRENT_DATE);

-- Partition submissions table by month for better performance
CREATE TABLE submissions_y2024m01 PARTITION OF submissions
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### 3. Caching Strategy

```typescript
// Cache subscription limits to reduce database queries
const subscriptionCache = new Map<string, { limits: SubscriptionLimits, expiry: number }>();

export async function getCachedSubscriptionLimits(userId: string): Promise<SubscriptionLimits> {
  const cached = subscriptionCache.get(userId);
  if (cached && cached.expiry > Date.now()) {
    return cached.limits;
  }
  
  const profile = await getUserProfile(userId);
  const limits = getSubscriptionLimits(profile.subscription_status);
  
  // Cache for 5 minutes
  subscriptionCache.set(userId, {
    limits,
    expiry: Date.now() + 5 * 60 * 1000
  });
  
  return limits;
}
```

### 4. Monitoring and Alerting

```typescript
// Usage monitoring
export async function trackUsageMetrics(userId: string, action: string, metadata?: any) {
  // Send to analytics service (e.g., PostHog, Mixpanel)
  analytics.track(userId, action, {
    ...metadata,
    timestamp: new Date().toISOString(),
    subscription_tier: await getUserSubscriptionTier(userId)
  });
}

// Alert when users approach limits
export async function checkUsageAlerts(userId: string) {
  const usage = await getUserUsage(userId);
  const limits = await getCachedSubscriptionLimits(userId);
  
  if (usage.monthlySubmissions / limits.maxSubmissionsPerMonth > 0.9) {
    await sendUsageAlert(userId, 'approaching_monthly_limit', {
      current: usage.monthlySubmissions,
      limit: limits.maxSubmissionsPerMonth
    });
  }
}
```

## Testing Strategies

### 1. Unit Tests

```typescript
// Test subscription limit calculations
describe('Subscription Limits', () => {
  test('should return correct limits for free tier', () => {
    const limits = getSubscriptionLimits('free');
    expect(limits.maxForms).toBe(3);
    expect(limits.maxSubmissionsPerMonth).toBe(250);
  });
  
  test('should allow unlimited forms for pro tier', () => {
    const limits = getSubscriptionLimits('pro');
    expect(limits.maxForms).toBe(-1);
  });
});

// Test rate limiting
describe('Rate Limiting', () => {
  test('should block requests after limit exceeded', () => {
    const rateLimiter = createRateLimiter('submission', 'free');
    
    // Make requests up to limit
    for (let i = 0; i < 10; i++) {
      const result = rateLimiter('test-ip');
      expect(result.remaining).toBe(10 - i - 1);
    }
    
    // Next request should be blocked
    const blocked = rateLimiter('test-ip');
    expect(blocked.retryAfter).toBeDefined();
  });
});
```

### 2. Integration Tests

```typescript
// Test submission limits
describe('Submission Enforcement', () => {
  test('should reject submissions when monthly limit exceeded', async () => {
    const userId = 'test-user';
    
    // Mock user with free tier (250 submissions/month)
    mockUserProfile(userId, 'free');
    
    // Mock 250 existing submissions this month
    mockSubmissionCount(userId, 250);
    
    const result = await canUserReceiveSubmission(userId);
    expect(result.canReceive).toBe(false);
    expect(result.reason).toContain('Monthly submission limit');
  });
});
```

### 3. Load Testing

```typescript
// Load test rate limiting
import { performance } from 'perf_hooks';

describe('Rate Limiting Performance', () => {
  test('should handle high request volume', async () => {
    const rateLimiter = createRateLimiter('api', 'enterprise');
    const requests = 1000;
    
    const start = performance.now();
    
    const results = await Promise.all(
      Array(requests).fill(0).map((_, i) => rateLimiter(`user-${i % 100}`))
    );
    
    const end = performance.now();
    
    expect(end - start).toBeLessThan(1000); // Should complete in under 1s
    expect(results.every(r => r.limit > 0)).toBe(true);
  });
});
```

## Conclusion

This implementation provides a robust, scalable system for managing rate limiting and subscription-based form submission limits. The architecture separates concerns effectively, allowing for easy maintenance and feature expansion.

Key benefits:
- **Flexible subscription tiers** with different limits
- **Multi-level rate limiting** (IP, user, form)
- **Real-time usage tracking** and monitoring
- **Graceful limit enforcement** with clear error messages
- **Scalable architecture** ready for production deployment

The system can be extended to support additional features like:
- Custom rate limits per customer
- Usage-based billing
- Advanced analytics and reporting
- API quotas and throttling
- Geographic rate limiting

For production deployment, ensure you implement Redis for rate limiting, set up proper monitoring and alerting, and consider database partitioning for large-scale usage data. 