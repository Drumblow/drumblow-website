import { NextResponse } from 'next/server'
import { TelegramClient } from '@/lib/telegram/client'

export async function POST(request: Request) {
  console.log('Webhook recebido')
  
  try {
    const update = await request.json()
    console.log('Update do Telegram:', update)

    if (update.message) {
      const message = update.message
      console.log('Mensagem recebida:', {
        from: message.from,
        text: message.text,
        chat: message.chat
      })

      // Processar a mensagem recebida
      await TelegramClient.getInstance().handleIncomingMessage(update)
    }
    
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Erro processando webhook:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// Para garantir que o Next.js aceite requisições POST nesta rota
export const runtime = 'edge'