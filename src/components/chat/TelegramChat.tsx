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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const startSession = async () => {
        try {
          const session = await TelegramClient.getInstance().startSession(
            'website_user',
            'Website Visitor'
          )
          setSessionId(session.chatId)
          
          setMessages([{
            id: Date.now().toString(),
            text: 'Olá! Como podemos ajudar você hoje?',
            timestamp: new Date(),
            isUser: false
          }])
        } catch (err: unknown) {
          const error = err as Error
          console.error('Error starting session:', error.message)
        }
      }

      startSession()
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    return () => {
      if (sessionId) {
        try {
          TelegramClient.getInstance().endSession(sessionId)
        } catch (err: unknown) {
          const error = err as Error
          console.error('Error ending session:', error.message)
        }
      }
    }
  }, [sessionId])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !sessionId) return

    setIsLoading(true)
    try {
      const messageId = Date.now().toString()
      const newUserMessage: Message = {
        id: messageId,
        text: newMessage,
        timestamp: new Date(),
        isUser: true
      }

      setMessages(prev => [...prev, newUserMessage])

      await TelegramClient.getInstance().sendMessage(sessionId, newMessage)

      setNewMessage('')
    } catch (err: unknown) {
      const error = err as Error
      console.error('Error sending message:', error.message)
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

      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 rounded-md border border-input px-3 py-2 text-sm"
            disabled={isLoading}
          />
          <Button type="submit" variant="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}