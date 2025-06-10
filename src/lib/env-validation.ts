import { z } from 'zod';
import { log } from './logger';

// Define the schema for environment variables
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // App configuration
  NEXT_PUBLIC_APP_URL: z.string().url('Invalid app URL'),
  
  // Supabase configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required'),
  
  // Stripe configuration
  STRIPE_SECRET_KEY: z.string().min(1, 'Stripe secret key is required'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'Stripe webhook secret is required'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'Stripe publishable key is required'),
  STRIPE_STARTER_PRICE_ID: z.string().min(1, 'Stripe starter price ID is required'),
  STRIPE_PRO_PRICE_ID: z.string().min(1, 'Stripe pro price ID is required'),
  STRIPE_ENTERPRISE_PRICE_ID: z.string().min(1, 'Stripe enterprise price ID is required'),
  
  // Email configuration
  SENDGRID_API_KEY: z.string().min(1, 'SendGrid API key is required'),
  SENDGRID_FROM_EMAIL: z.string().email('Invalid SendGrid from email'),
  
  // Optional Redis configuration
  REDIS_URL: z.string().url('Invalid Redis URL').optional(),
  
  // Optional logging configuration
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
  
  // Optional security configuration
  ALLOWED_ORIGINS: z.string().optional(),
  
  // Google Analytics configuration (optional)
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().regex(/^G-[A-Z0-9]+$/, 'Invalid Google Analytics Measurement ID format').optional(),
});

// Type for validated environment variables
export type ValidatedEnv = z.infer<typeof envSchema>;

// Cache for validated environment
let validatedEnv: ValidatedEnv | null = null;

// Validate environment variables
export function validateEnv(): ValidatedEnv {
  // Return cached result if available
  if (validatedEnv) {
    return validatedEnv;
  }

  try {
    // Parse and validate environment variables
    validatedEnv = envSchema.parse(process.env);
    
    log.info('Environment validation successful', {
      nodeEnv: validatedEnv.NODE_ENV,
      hasRedis: !!validatedEnv.REDIS_URL,
      logLevel: validatedEnv.LOG_LEVEL,
    });
    
    return validatedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));
      
      log.error('Environment validation failed', {
        missingVariables: missingVars,
        totalErrors: error.errors.length,
      });
      
      // In production, this should cause the app to fail to start
      if (process.env.NODE_ENV === 'production') {
        console.error('❌ Environment validation failed in production:');
        missingVars.forEach(({ field, message }) => {
          console.error(`  - ${field}: ${message}`);
        });
        process.exit(1);
      } else {
        // In development, log warnings but continue
        console.warn('⚠️  Environment validation failed in development:');
        missingVars.forEach(({ field, message }) => {
          console.warn(`  - ${field}: ${message}`);
        });
        
        // Return a partial environment for development
        return process.env as any;
      }
    }
    
    throw error;
  }
}

// Get a specific environment variable with validation
export function getEnvVar<K extends keyof ValidatedEnv>(
  key: K,
  fallback?: ValidatedEnv[K]
): ValidatedEnv[K] {
  const env = validateEnv();
  const value = env[key];
  
  if (value === undefined && fallback !== undefined) {
    return fallback;
  }
  
  if (value === undefined) {
    throw new Error(`Environment variable ${String(key)} is not defined`);
  }
  
  return value;
}

// Check if we're in production
export function isProduction(): boolean {
  return getEnvVar('NODE_ENV') === 'production';
}

// Check if we're in development
export function isDevelopment(): boolean {
  return getEnvVar('NODE_ENV') === 'development';
}

// Check if Redis is available
export function hasRedis(): boolean {
  const env = validateEnv();
  return !!env.REDIS_URL;
}

// Get allowed origins for CORS
export function getAllowedOrigins(): string[] {
  const env = validateEnv();
  if (!env.ALLOWED_ORIGINS) {
    return [env.NEXT_PUBLIC_APP_URL];
  }
  
  return env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
}

// Validate environment on module load in production
if (process.env.NODE_ENV === 'production') {
  validateEnv();
}

// Health check function for environment
export function checkEnvHealth(): {
  status: 'healthy' | 'warning' | 'error';
  issues: string[];
  details: Record<string, any>;
} {
  const issues: string[] = [];
  const details: Record<string, any> = {};
  
  try {
    const env = validateEnv();
    
    // Check critical services
    details.nodeEnv = env.NODE_ENV;
    details.hasRedis = !!env.REDIS_URL;
    details.logLevel = env.LOG_LEVEL;
    
    // Check if we're missing Redis in production
    if (env.NODE_ENV === 'production' && !env.REDIS_URL) {
      issues.push('Redis URL not configured in production - using in-memory storage');
    }
    
    // Check if we're using development keys in production
    if (env.NODE_ENV === 'production') {
      if (env.STRIPE_SECRET_KEY.includes('test')) {
        issues.push('Using test Stripe keys in production');
      }
      if (env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes('test')) {
        issues.push('Using test Stripe publishable key in production');
      }
    }
    
    const status = issues.length === 0 ? 'healthy' : 'warning';
    
    return { status, issues, details };
  } catch (error) {
    return {
      status: 'error',
      issues: ['Environment validation failed'],
      details: { error: error instanceof Error ? error.message : 'Unknown error' },
    };
  }
} 