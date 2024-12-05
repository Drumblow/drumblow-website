import { NextResponse } from 'next/server'
import { POST } from '../route'

jest.mock('next/server', () => ({
 NextResponse: {
   json: jest.fn().mockImplementation((body, init) => {
     return {
       ...new Response(JSON.stringify(body), init),
       json: async () => body
     }
   })
 }
}))

describe('Telegram Webhook Route', () => {
 it('handles incoming message correctly', async () => {
   const update = {
     message: {
       chat: { id: 123 },
       text: 'test message',
       from: {
         id: 456,
         username: 'testuser'
       }
     }
   }

   const request = new Request('http://localhost/api/telegram/webhook', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify(update)
   })

   const response = await POST(request)
   const data = await response.json()
   expect(data).toEqual({ ok: true })
 })
})