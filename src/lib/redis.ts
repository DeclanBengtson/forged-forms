import Redis from 'ioredis';
import { log } from './logger';

// Redis client instance
let redis: Redis | null = null;

// Initialize Redis connection
export function getRedisClient(): Redis | null {
  // If Redis URL is not provided, return null (fallback to in-memory)
  if (!process.env.REDIS_URL) {
    if (process.env.NODE_ENV === 'production') {
      log.warn('Redis URL not provided in production environment. Using in-memory storage.');
    }
    return null;
  }

  // Return existing connection if available
  if (redis) {
    return redis;
  }

  try {
    redis = new Redis(process.env.REDIS_URL, {
      // Connection options
      connectTimeout: 10000,
      lazyConnect: true,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      
      // Reconnection options
      reconnectOnError: (err) => {
        const targetError = 'READONLY';
        return err.message.includes(targetError);
      },
    });

    // Event handlers
    redis.on('connect', () => {
      log.info('Redis client connected');
    });

    redis.on('ready', () => {
      log.info('Redis client ready');
    });

    redis.on('error', (err) => {
      log.error('Redis client error', { error: err.message });
    });

    redis.on('close', () => {
      log.warn('Redis client connection closed');
    });

    redis.on('reconnecting', () => {
      log.info('Redis client reconnecting');
    });

    return redis;
  } catch (error) {
    log.error('Failed to initialize Redis client', { error });
    return null;
  }
}

// Rate limiting with Redis
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
    throw new Error('Redis client not available');
  }

  const now = Date.now();
  const window = Math.floor(now / windowMs);
  const redisKey = `rate_limit:${key}:${window}`;

  try {
    // Use pipeline for atomic operations
    const pipeline = client.pipeline();
    pipeline.incr(redisKey);
    pipeline.expire(redisKey, Math.ceil(windowMs / 1000));
    
    const results = await pipeline.exec();
    
    if (!results || results.length < 2) {
      throw new Error('Redis pipeline execution failed');
    }

    const [incrResult, expireResult] = results;
    
    if (incrResult[0] || expireResult[0]) {
      throw new Error('Redis operation failed');
    }

    const count = incrResult[1] as number;
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
    log.error('Redis rate limit operation failed', { key, error });
    throw error;
  }
}

// Webhook idempotency with Redis
export async function isWebhookProcessed(eventId: string): Promise<boolean> {
  const client = getRedisClient();
  
  if (!client) {
    throw new Error('Redis client not available');
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
    throw new Error('Redis client not available');
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
    throw new Error('Redis client not available');
  }

  try {
    await client.setex(`webhook:${eventId}`, ttlSeconds, 'processing');
  } catch (error) {
    log.error('Failed to mark webhook as processing', { eventId, error });
    throw error;
  }
}

// Cleanup function for graceful shutdown
export async function closeRedisConnection(): Promise<void> {
  if (redis) {
    try {
      await redis.quit();
      redis = null;
      log.info('Redis connection closed gracefully');
    } catch (error) {
      log.error('Error closing Redis connection', { error });
    }
  }
}

// Health check function
export async function checkRedisHealth(): Promise<boolean> {
  const client = getRedisClient();
  
  if (!client) {
    return false;
  }

  try {
    const result = await client.ping();
    return result === 'PONG';
  } catch (error) {
    log.error('Redis health check failed', { error });
    return false;
  }
} 