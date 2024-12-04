import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { securityHeaders } from '@/lib/security/headers'
import { isRateLimited } from '@/lib/security/rateLimit'

export function middleware(request: NextRequest) {
  // Check rate limit
  if (isRateLimited(request)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60',
      },
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

  const response = NextResponse.next()

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // CORS headers for regular requests
  response.headers.set('Access-Control-Allow-Origin', 
    request.headers.get('origin') || '*')
  response.headers.set('Access-Control-Allow-Credentials', 'true')

  return response
}

// Atualizar o config para incluir todas as rotas
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}