import { NextResponse } from 'next/server';
import { checkEnvHealth } from '@/lib/env-validation';
import { checkRedisHealth } from '@/lib/redis';
import { createClient } from '@/lib/supabase/server';
import { log } from '@/lib/logger';

export async function GET() {
  const startTime = Date.now();
  const checks: Record<string, any> = {};
  let overallStatus: 'healthy' | 'warning' | 'error' = 'healthy';
  const issues: string[] = [];

  try {
    // Check environment variables
    const envHealth = checkEnvHealth();
    checks.environment = {
      status: envHealth.status,
      issues: envHealth.issues,
      details: envHealth.details,
    };
    
    if (envHealth.status === 'error') {
      overallStatus = 'error';
    } else if (envHealth.status === 'warning' && overallStatus === 'healthy') {
      overallStatus = 'warning';
    }
    issues.push(...envHealth.issues);

    // Check Redis connection
    try {
      const redisHealthy = await checkRedisHealth();
      checks.redis = {
        status: redisHealthy ? 'healthy' : 'error',
        available: redisHealthy,
      };
      
      if (!redisHealthy && process.env.NODE_ENV === 'production') {
        overallStatus = 'warning';
        issues.push('Redis connection failed - using in-memory fallback');
      }
    } catch (error) {
      checks.redis = {
        status: 'error',
        available: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      
      if (process.env.NODE_ENV === 'production') {
        overallStatus = 'warning';
        issues.push('Redis health check failed');
      }
    }

    // Check Supabase connection
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('user_profiles').select('count').limit(1);
      
      checks.supabase = {
        status: error ? 'error' : 'healthy',
        connected: !error,
        error: error?.message,
      };
      
      if (error) {
        overallStatus = 'error';
        issues.push(`Supabase connection failed: ${error.message}`);
      }
    } catch (error) {
      checks.supabase = {
        status: 'error',
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      overallStatus = 'error';
      issues.push('Supabase health check failed');
    }

    // Check system resources
    const memoryUsage = process.memoryUsage();
    checks.system = {
      status: 'healthy',
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
        external: Math.round(memoryUsage.external / 1024 / 1024), // MB
      },
      uptime: Math.round(process.uptime()),
      nodeVersion: process.version,
    };

    // Check if memory usage is too high (warning at 500MB, error at 1GB)
    const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;
    if (heapUsedMB > 1024) {
      checks.system.status = 'error';
      overallStatus = 'error';
      issues.push(`High memory usage: ${Math.round(heapUsedMB)}MB`);
    } else if (heapUsedMB > 512) {
      checks.system.status = 'warning';
      if (overallStatus === 'healthy') {
        overallStatus = 'warning';
      }
      issues.push(`Elevated memory usage: ${Math.round(heapUsedMB)}MB`);
    }

    const responseTime = Date.now() - startTime;

    const healthData = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      responseTime,
      version: process.env.npm_package_version || 'unknown',
      environment: process.env.NODE_ENV,
      issues: issues.length > 0 ? issues : undefined,
      checks,
    };

    // Log health check results
    if (overallStatus === 'error') {
      log.error('Health check failed', { healthData });
    } else if (overallStatus === 'warning') {
      log.warn('Health check has warnings', { healthData });
    } else {
      log.debug('Health check passed', { responseTime });
    }

    // Return appropriate status code
    const statusCode = overallStatus === 'error' ? 503 : 200;

    return NextResponse.json(healthData, { status: statusCode });

  } catch (error) {
    log.error('Health check endpoint error', { error });
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        checks,
      },
      { status: 503 }
    );
  }
}

// Also support HEAD requests for simple uptime checks
export async function HEAD() {
  try {
    // Quick health check - just verify basic functionality
    const supabase = await createClient();
    await supabase.from('user_profiles').select('count').limit(1);
    
    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
} 