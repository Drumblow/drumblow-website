import { securityConfig } from './config'

export function generateCSP(): string {
  return Object.entries(securityConfig.csp.directives)
    .map(([key, values]) => {
      if (!values || values.length === 0) return ''
      return `${key} ${values.join(' ')}`
    })
    .filter(Boolean)
    .join('; ')
}

export const securityHeaders = {
  'Content-Security-Policy': generateCSP(),
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
}