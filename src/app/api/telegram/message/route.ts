import { NextResponse } from 'next/server'
import { TELEGRAM_CONFIG } from '@/lib/telegram/config'
import { z } from 'zod'

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
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         chat_id: chatId,
         text: text,
         parse_mode: 'HTML'
       })
     }
   )

   const data = await response.json()
   return NextResponse.json(data)
   
 } catch (error) {
   console.error('Error sending telegram message:', error)
   return NextResponse.json(
     { error: error instanceof Error ? error.message : 'Failed to send message' },
     { status: 500 }
   )
 }
}

export const runtime = 'edge'