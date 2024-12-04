'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { TelegramClient } from '@/lib/telegram/client'
import { TelegramChat } from '@/components/chat/TelegramChat'

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    try {
      const session = await TelegramClient.getInstance()
        .startSession(email, name)
      
      await TelegramClient.getInstance()
        .sendMessage(session.chatId, `Nova mensagem via formulário:\n\nNome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`)
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold mb-8">Contato</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full rounded-md border border-input px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full rounded-md border border-input px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Mensagem
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full rounded-md border border-input px-3 py-2"
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar Mensagem'}
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Fale Conosco</h2>
            <p className="text-muted-foreground">
              Entre em contato conosco para saber mais sobre nossas soluções ou tirar suas dúvidas.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Chat Online</h3>
            <p className="text-muted-foreground">
              Converse com nosso time em tempo real através do chat.
            </p>
          </div>
        </div>
      </div>

      <TelegramChat />
    </div>
  )
}