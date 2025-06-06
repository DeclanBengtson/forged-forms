import { Redis } from '@upstash/redis';
import { log } from './logger';

// Vercel KV Redis client instance (powered by Upstash)
let redis: Redis | null = null;

// Initialize Vercel KV Redis connection
export function getRedisClient(): Redis | null {
  // Check for Vercel KV environment variables
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    if (process.env.NODE_ENV === 'production') {
      log.warn('Vercel KV credentials not provided in production environment. Using in-memory storage.');
    }
    return null;
  }

  // Return existing connection if available
  if (redis) {
    return redis;
  }

  try {
    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });

    log.info('Vercel KV Redis client initialized successfully');
    return redis;
  } catch (error) {
    log.error('Failed to initialize Vercel KV Redis client', { error });
    return null;
  }
}

// Rate limiting with Vercel KV Redis (optimized for serverless)
export interface RedisRateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

export async function redisRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RedisRateLimitInfo> {
  const client = getRedisClient();
  
  if (!client) {
    throw new Error('Vercel KV Redis client not available');
  }

  const now = Date.now();
  const window = Math.floor(now / windowMs);
  const redisKey = `rate_limit:${key}:${window}`;

  try {
    // Use Vercel KV pipeline for atomic operations
    const pipeline = client.pipeline();
    pipeline.incr(redisKey);
    pipeline.expire(redisKey, Math.ceil(windowMs / 1000));
    
    const results = await pipeline.exec();
    
    if (!results || results.length < 2) {
      throw new Error('Vercel KV pipeline execution failed');
    }

    const count = results[0] as number;
    const remaining = Math.max(0, limit - count);
    const resetTime = (window + 1) * windowMs;
    const retryAfter = count > limit ? Math.ceil((resetTime - now) / 1000) : undefined;

    return {
      limit,
      remaining,
      resetTime,
      retryAfter,
    };
  } catch (error) {
    log.error('Vercel KV rate limit operation failed', { key, error });
    throw error;
  }
}

// Cache operations with Vercel KV Redis
export async function setCache(key: string, value: any, ttlSeconds: number): Promise<void> {
  const client = getRedisClient();
  
  if (!client) {
    log.warn('Cache set operation skipped - Vercel KV not available', { key });
    return;
  }

  try {
    await client.setex(key, ttlSeconds, JSON.stringify(value));
    log.info('Cache set successfully', { key, ttl: ttlSeconds });
  } catch (error) {
    log.error('Cache set operation failed', { key, error });
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  
  if (!client) {
    return null;
  }

  try {
    const cached = await client.get(key);
    
    if (cached) {
      const parsed = JSON.parse(cached as string);
      log.info('Cache hit', { key });
      return parsed as T;
    }
    
    log.info('Cache miss', { key });
    return null;
  } catch (error) {
    log.error('Cache get operation failed', { key, error });
    return null;
  }
}

export async function deleteCache(key: string): Promise<void> {
  const client = getRedisClient();
  
  if (!client) {
    return;
  }

  try {
    await client.del(key);
    log.info('Cache deleted successfully', { key });
  } catch (error) {
    log.error('Cache delete operation failed', { key, error });
  }
}

// Batch cache operations for efficiency
export async function setBatchCache(items: { key: string; value: any; ttl: number }[]): Promise<void> {
  const client = getRedisClient();
  
  if (!client || items.length === 0) {
    return;
  }

  try {
    const pipeline = client.pipeline();
    
    for (const item of items) {
      pipeline.setex(item.key, item.ttl, JSON.stringify(item.value));
    }
    
    await pipeline.exec();
    log.info('Batch cache set successfully', { count: items.length });
  } catch (error) {
    log.error('Batch cache set operation failed', { count: items.length, error });
  }
}

// Webhook idempotency with Redis
export async function isWebhookProcessed(eventId: string): Promise<boolean> {
  const client = getRedisClient();
  
  if (!client) {
    throw new Error('Vercel KV client not available');
  }

  try {
    const result = await client.get(`webhook:${eventId}`);
    return result === 'processed';
  } catch (error) {
    log.error('Failed to check webhook idempotency', { eventId, error });
    throw error;
  }
}

export async function markWebhookProcessed(eventId: string, ttlSeconds: number = 86400): Promise<void> {
  const client = getRedisClient();
  
  if (!client) {
    throw new Error('Vercel KV client not available');
  }

  try {
    await client.setex(`webhook:${eventId}`, ttlSeconds, 'processed');
  } catch (error) {
    log.error('Failed to mark webhook as processed', { eventId, error });
    throw error;
  }
}

export async function markWebhookProcessing(eventId: string, ttlSeconds: number = 300): Promise<void> {
  const client = getRedisClient();
  
  if (!client) {
    throw new Error('Vercel KV client not available');
  }

  try {
    await client.setex(`webhook:${eventId}`, ttlSeconds, 'processing');
  } catch (error) {
    log.error('Failed to mark webhook as processing', { eventId, error });
    throw error;
  }
}

// Health check function for Vercel KV Redis
export async function checkRedisHealth(): Promise<boolean> {
  const client = getRedisClient();
  
  if (!client) {
    return false;
  }

  try {
    const result = await client.ping();
    return result === 'PONG';
  } catch (error) {
    log.error('Vercel KV Redis health check failed', { error });
    return false;
  }
} 