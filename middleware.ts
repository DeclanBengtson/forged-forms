import { createClient } from './src/lib/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { cleanupRateLimitStore } from './src/lib/middleware/rate-limit'

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request)

  // This will refresh session if expired - required for Server Components
  await supabase.auth.getUser()

  // Periodically cleanup expired rate limit entries (1% chance per request)
  if (Math.random() < 0.01) {
    cleanupRateLimitStore()
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 