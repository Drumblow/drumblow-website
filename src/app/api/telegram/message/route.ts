import { NextResponse } from 'next/server'
import { TELEGRAM_CONFIG } from '@/lib/telegram/config'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lastMessageId = searchParams.get('lastMessageId') || '0'

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/getUpdates?offset=${parseInt(lastMessageId) + 1}&timeout=1`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch messages')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error getting messages:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// Removed edge runtime to allow better static generation and avoid Vercel warnings.
// These routes work fine on the default Node.js runtime.