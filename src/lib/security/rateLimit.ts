import { NextRequest } from 'next/server'
import { securityConfig } from './config'

const ipRequests = new Map<string, number[]>()

export function isRateLimited(req: NextRequest): boolean {
  const now = Date.now()
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  
  const requests = ipRequests.get(ip) || []
  const windowStart = now - securityConfig.rateLimit.window
  
  // Remove old requests
  const recentRequests = requests.filter(time => time > windowStart)
  
  if (recentRequests.length >= securityConfig.rateLimit.max) {
    return true
  }
  
  recentRequests.push(now)
  ipRequests.set(ip, recentRequests)
  
  return false
}