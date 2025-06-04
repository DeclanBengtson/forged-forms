import { createClient } from './src/lib/supabase/middleware'
import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request)

  // This will refresh session if expired - required for Server Components
  await supabase.auth.getUser()

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