import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from './src/i18n/routing'
import { securityHeaders } from './src/lib/security/headers'
import { isRateLimited } from './src/lib/security/rateLimit'

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  // Skip rate limiting and security headers for static assets and API
  const pathname = request.nextUrl.pathname
  if (
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(?:png|jpg|jpeg|gif|svg|ico|webp|css|js|woff|woff2|ttf|otf)$/)
  ) {
    return intlMiddleware(request)
  }

  // Rate limiting
  if (isRateLimited(request)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: { 'Retry-After': '60' },
    })
  }

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
      },
    })
  }

  // next-intl middleware
  const response = intlMiddleware(request)

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // CORS headers for regular requests
  response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*')
  response.headers.set('Access-Control-Allow-Credentials', 'true')

  return response
}

export const config = {
  matcher: ['/((?!api|_next|assets|favicon|.*\\..*).*)'],
}
