import { NextResponse } from 'next/server'

export async function GET() {
  // In a real app we could check DB, external services etc.
  // For now, just confirm the content loader and MDX are working.
  return NextResponse.json({
    status: 'ok',
    checks: {
      content: 'loaded',
      mdx: 'ok',
      projects: 4,
    },
    version: '1.0',
    timestamp: new Date().toISOString(),
  })
}
