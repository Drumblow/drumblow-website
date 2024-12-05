import { NextResponse } from 'next/server'
import { z } from 'zod'
import { TELEGRAM_CONFIG } from '@/lib/telegram/config'

const messageSchema = z.object({
  text: z.string(),
  chatId: z.string()
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text, chatId } = messageSchema.parse(body)

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML'
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to send message')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}