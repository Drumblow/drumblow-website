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
        .sendTelegramMessage(session.chatId, `Nova mensagem via formulário:\n\nNome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`)
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

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-3">Projetos em produção</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="https://igreja.drumblow.com" target="_blank" className="hover:underline">igreja.drumblow.com</a> — Gestão eclesiástica completa</li>
              <li><a href="https://invoice.drumblow.com" target="_blank" className="hover:underline">invoice.drumblow.com</a> — Faturamento para negócios canadenses</li>
              <li><a href="https://beenorth3d.com" target="_blank" className="hover:underline">beenorth3d.com</a> — E-commerce 3D-print (Canadá)</li>
            </ul>
          </div>
        </div>
      </div>

      <TelegramChat />
    </div>
  )
}