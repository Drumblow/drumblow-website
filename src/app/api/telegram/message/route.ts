import { NextResponse } from 'next/server'
import { TELEGRAM_CONFIG } from '@/lib/telegram/config'
import { ChatStore } from '@/lib/telegram/store'

function extractSessionId(text: string): string | null {
  const match = text.match(/ID:\s*(session_[^\s]+)/)
  return match ? match[1] : null
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionId, text, userName, userEmail, action } = body

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    // Handle session end action
    if (action === 'end') {
      const session = ChatStore.endSession(sessionId)
      if (session) {
        // Notify admin that session ended
        await fetch(
          `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CONFIG.adminChatId,
              text: `🔴 <b>Chat encerrado</b>\n\nDe: ${session.userName}\nID: ${sessionId}`,
              parse_mode: 'HTML',
            }),
          }
        )
      }
      return NextResponse.json({ success: true, ended: true })
    }

    if (!text) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 })
    }

    // Ensure session exists
    let session = ChatStore.getSession(sessionId)
    if (!session) {
      session = ChatStore.createSession(sessionId, userName || 'Website Visitor', userEmail || '')
    }

    // Don't allow messages on ended sessions
    if (!session.isActive) {
      return NextResponse.json({ error: 'Session ended' }, { status: 410 })
    }

    // Store user message
    ChatStore.addMessage(sessionId, {
      id: `user-${Date.now()}`,
      text,
      timestamp: new Date().toISOString(),
      from: 'user',
    })

    // Send to Telegram admin with session ID embedded for reply tracking
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CONFIG.adminChatId,
          text: `📩 <b>Nova mensagem via Chat</b>\n\nDe: ${userName || 'Visitante'}\nEmail: ${userEmail || 'Não informado'}\n\n${text}\n\n—\nID: ${sessionId}`,
          parse_mode: 'HTML',
        }),
      }
    )

    const telegramData = await telegramResponse.json()
    if (!telegramData.ok) {
      console.error('[TELEGRAM API ERROR]', {
        ok: telegramData.ok,
        error_code: telegramData.error_code,
        description: telegramData.description,
        tokenPrefix: TELEGRAM_CONFIG.botToken ? TELEGRAM_CONFIG.botToken.slice(0, 10) + '...' : 'EMPTY',
        adminChatId: TELEGRAM_CONFIG.adminChatId || 'EMPTY',
      })
      return NextResponse.json(
        { success: false, error: telegramData.description || 'Telegram API error' },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true, telegramOk: true })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET: return messages for a session + poll Telegram for admin replies (dev fallback)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (sessionId) {
      const messages = ChatStore.getMessages(sessionId)
      const session = ChatStore.getSession(sessionId)
      return NextResponse.json({ messages, isActive: session?.isActive ?? false })
    }

    // Fallback: poll Telegram API for admin messages
    const offset = ChatStore.getLastUpdateId() + 1
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/getUpdates?offset=${offset}&limit=10`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch updates from Telegram')
    }

    const data = await response.json()
    
    if (data.ok && Array.isArray(data.result)) {
      for (const update of data.result) {
        if (update.update_id) {
          ChatStore.setLastUpdateId(update.update_id)
        }

        const msg = update.message
        if (!msg || !msg.text) continue
        
        const chatId = msg.chat?.id?.toString()
        const fromId = msg.from?.id?.toString()
        const text = msg.text
        
        if (chatId !== TELEGRAM_CONFIG.adminChatId) continue
        if (fromId !== TELEGRAM_CONFIG.adminChatId) continue
        
        let targetSessionId: string | null = null
        
        if (msg.reply_to_message?.text) {
          targetSessionId = extractSessionId(msg.reply_to_message.text)
        }
        
        if (!targetSessionId) {
          const latest = ChatStore.findLatestActiveSession()
          if (latest) targetSessionId = latest.sessionId
        }
        
        if (targetSessionId) {
          const session = ChatStore.getSession(targetSessionId)
          if (!session?.isActive) continue // Don't add to ended sessions
          
          const messageId = `admin-poll-${update.update_id || Date.now()}`
          if (!ChatStore.hasAdminMessage(targetSessionId, text, messageId)) {
            ChatStore.addMessage(targetSessionId, {
              id: messageId,
              text,
              timestamp: new Date((msg.date || Date.now()/1000) * 1000).toISOString(),
              from: 'admin',
            })
          }
        }
      }
    }

    return NextResponse.json({ ok: true, polled: data.result?.length || 0 })
  } catch (error) {
    console.error('Error polling Telegram:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
