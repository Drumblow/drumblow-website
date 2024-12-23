'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { TelegramClient } from '@/lib/telegram/client'

interface Message {
  id: string
  text: string
  timestamp: Date
  isUser: boolean
}

export function TelegramChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Registrar o handler na montagem do componente
  useEffect(() => {
    console.log('=== Component Mount ===')
    const handleNewMessage = (message: string) => {
      console.log('Handler triggered:', message)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: message,
        timestamp: new Date(),
        isUser: false
      }])
    }

    const client = TelegramClient.getInstance()
    client.addMessageHandler(handleNewMessage)
    console.log('Handler registered')

    // Manter o handler mesmo com isOpen false
    return () => {
      console.log('Component unmount - removing handler')
      client.removeMessageHandler(handleNewMessage)
    }
  }, [])

  // Efeito para iniciar sessão
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const startSession = async () => {
        setIsLoading(true)
        try {
          const visitorId = `visitor_${Math.random().toString(36).substring(7)}`
          const session = await TelegramClient.getInstance().startSession(
            visitorId,
            'Website Visitor'
          )
          
          setSessionId(session.chatId)
          setMessages([{
            id: Date.now().toString(),
            text: 'Olá! Como posso ajudar?',
            timestamp: new Date(),
            isUser: false
          }])
        } catch (err) {
          console.error('Error starting session:', err)
          setError('Não foi possível iniciar o chat. Tente novamente.')
        } finally {
          setIsLoading(false)
        }
      }

      startSession()
    }
  }, [isOpen, messages.length])
 
  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!newMessage.trim() || !sessionId || isLoading) return
 
    setIsLoading(true)
    try {
      const messageId = Date.now().toString()
      setMessages(prev => [...prev, {
        id: messageId,
        text: newMessage,
        timestamp: new Date(),
        isUser: true
      }])
      setNewMessage('')
 
      await TelegramClient.getInstance().sendTelegramMessage(
        sessionId,
        newMessage
      )
    } catch (error) {
      console.error('Error sending message:', error)
      setError('Não foi possível enviar a mensagem.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        Abrir Chat
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-xl z-50 flex flex-col">
      <div className="p-4 border-b flex justify-between items-center bg-primary text-white rounded-t-lg">
        <h3 className="font-semibold">Chat Drumblow</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-primary-foreground/10"
        >
          ✕
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.isUser
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 rounded-md border border-input px-3 py-2 text-sm"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            variant="icon" 
            disabled={isLoading || !newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}