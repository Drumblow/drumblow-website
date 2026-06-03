import { NextResponse } from 'next/server'
import { TELEGRAM_CONFIG } from '@/lib/telegram/config'
import { ChatStore } from '@/lib/telegram/store'
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
    }),
    reply_to_message: z.object({
      text: z.string().optional(),
      message_id: z.number()
    }).optional()
  }).optional()
})

function extractSessionId(text: string): string | null {
  const match = text.match(/ID:\s*(session_[^\s]+)/)
  return match ? match[1] : null
}

export async function POST(request: Request) {
  try {
    const update = await request.json()
    const validatedUpdate = updateSchema.parse(update)
    
    if (validatedUpdate.message?.text) {
      const chatId = validatedUpdate.message.chat.id.toString()
      const fromId = validatedUpdate.message.from.id.toString()
      const text = validatedUpdate.message.text
      const replyToText = validatedUpdate.message.reply_to_message?.text

      if (chatId !== TELEGRAM_CONFIG.adminChatId) {
        return NextResponse.json({ ok: true, ignored: 'not admin chat' })
      }
      if (fromId !== TELEGRAM_CONFIG.adminChatId) {
        return NextResponse.json({ ok: true, ignored: 'not from admin' })
      }

      let targetSessionId: string | null = null
      
      if (replyToText) {
        targetSessionId = extractSessionId(replyToText)
        console.log('[WEBHOOK] Reply detected, sessionId:', targetSessionId)
      }
      
      if (!targetSessionId) {
        const latest = ChatStore.findLatestActiveSession()
        if (latest) {
          targetSessionId = latest.sessionId
          console.log('[WEBHOOK] No reply, using latest active session:', targetSessionId)
        }
      }
      
      if (targetSessionId) {
        const session = ChatStore.getSession(targetSessionId)
        if (!session?.isActive) {
          console.log('[WEBHOOK] Session is not active, ignoring')
          return NextResponse.json({ ok: true, ignored: 'session ended' })
        }
        
        const messageId = `admin-webhook-${Date.now()}`
        
        if (!ChatStore.hasAdminMessage(targetSessionId, text, messageId)) {
          ChatStore.addMessage(targetSessionId, {
            id: messageId,
            text,
            timestamp: new Date().toISOString(),
            from: 'admin',
          })
          console.log('[WEBHOOK] Message stored for session:', targetSessionId)
        }
      } else {
        console.log('[WEBHOOK] No active session found for admin message')
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
