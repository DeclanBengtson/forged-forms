import { getCache, setCache, deleteCache } from '@/lib/redis'
import { getPublicFormById } from '@/lib/database/forms'
import { Form } from '@/lib/types/database'
import { log } from '@/lib/logger'

// Cache configuration
const FORM_CACHE_TTL = 300 // 5 minutes
const FORM_CACHE_PREFIX = 'form:'

// Cache form data to reduce database hits
export async function getCachedForm(id: string): Promise<Form | null> {
  const cacheKey = `${FORM_CACHE_PREFIX}${id}`
  
  try {
    // Try to get from cache first
    const cached = await getCache<Form>(cacheKey)
    
    if (cached) {
      log.info('Form cache hit', { formId: id })
      return cached
    }
    
    // Cache miss - fetch from database
    log.info('Form cache miss, fetching from database', { formId: id })
    const form = await getPublicFormById(id)
    
    if (form) {
      // Cache the form for future requests
      await setCache(cacheKey, form, FORM_CACHE_TTL)
      log.info('Form cached successfully', { formId: id, ttl: FORM_CACHE_TTL })
    }
    
    return form
  } catch (error) {
    log.error('Form cache error, falling back to database', { formId: id, error })
    // Always fallback to database on cache errors
    return await getPublicFormById(id)
  }
}

// Invalidate form cache when form is updated
export async function invalidateFormCache(id: string): Promise<void> {
  const cacheKey = `${FORM_CACHE_PREFIX}${id}`
  
  try {
    await deleteCache(cacheKey)
    log.info('Form cache invalidated', { formId: id })
  } catch (error) {
    log.warn('Failed to invalidate form cache', { formId: id, error })
  }
}

// Preload popular forms into cache
export async function preloadFormCache(formIds: string[]): Promise<void> {
  if (formIds.length === 0) return
  
  log.info('Preloading form cache', { count: formIds.length })
  
  const promises = formIds.map(async (id) => {
    try {
      const form = await getPublicFormById(id)
      if (form) {
        const cacheKey = `${FORM_CACHE_PREFIX}${id}`
        await setCache(cacheKey, form, FORM_CACHE_TTL)
      }
    } catch (error) {
      log.error('Failed to preload form', { formId: id, error })
    }
  })
  
  await Promise.allSettled(promises)
  log.info('Form cache preload completed', { count: formIds.length })
}

// Get cache statistics for monitoring
export async function getFormCacheStats(): Promise<{
  totalForms: number
  cacheSize: string
}> {
  // This is a simplified version - in production you might want more detailed stats
  return {
    totalForms: 0, // Would need to scan Redis keys to get accurate count
    cacheSize: 'Unknown' // Upstash doesn't provide direct memory usage info
  }
}

// Warm cache for frequently accessed forms (call this periodically)
export async function warmFormCache(popularFormIds: string[]): Promise<void> {
  log.info('Warming form cache', { count: popularFormIds.length })
  await preloadFormCache(popularFormIds)
} 