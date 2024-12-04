import { NextResponse } from 'next/server'
import { TelegramClient } from '@/lib/telegram/client'
import { TELEGRAM_CONFIG } from '@/lib/telegram/config'
import { headers } from 'next/headers'
import { z } from 'zod'

const updateSchema = z.object({
  message: z.object({
    chat: z.object({
      id: z.number()
    }),
    text: z.string().optional(),
    from: z.object({
      id: z.number(),
      username: z.string().optional()
    })
  }).optional()
})

export async function POST(request: Request) {
  try {
    // Validação mais flexível do token
    if (process.env.NODE_ENV === 'production') {
      const headersList = await headers()
      const secretToken = headersList.get('x-telegram-bot-api-secret-token')
      
      if (!secretToken || secretToken !== TELEGRAM_CONFIG.secretToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const update = await request.json()
    const validatedUpdate = updateSchema.parse(update)

    if (validatedUpdate.message) {
      await TelegramClient.getInstance().handleIncomingMessage(validatedUpdate)
    }
    
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export const runtime = 'edge'