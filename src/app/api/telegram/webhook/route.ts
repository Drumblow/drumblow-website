import { NextResponse } from 'next/server'
import { TelegramClient } from '@/lib/telegram/client'
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
    console.log('Webhook received')
    const update = await request.json()
    console.log('Update:', JSON.stringify(update, null, 2))
    
    const validatedUpdate = updateSchema.parse(update)
    
    if (validatedUpdate.message?.text) {
      await TelegramClient.getInstance().handleIncomingMessage(validatedUpdate)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export const runtime = 'edge'