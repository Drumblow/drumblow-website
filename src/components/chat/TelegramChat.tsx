'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from "next-intl"
import { Send, Minus, RotateCcw } from "lucide-react"

interface Message {
  id: string
  text: string
  timestamp: string
  from: 'user' | 'admin' | 'system'
}

const STORAGE_KEY = 'drumblow_chat_profile'
const SESSION_KEY = 'drumblow_chat_session'

function getStoredProfile(): { name: string; email: string } | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (data.date === new Date().toDateString()) {
      return { name: data.name, email: data.email }
    }
  } catch { /* ignore */ }
  return null
}

function storeProfile(name: string, email: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    name,
    email,
    date: new Date().toDateString()
  }))
}

function getStoredSessionId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (Date.now() - data.createdAt < 2 * 60 * 60 * 1000) {
      return data.sessionId
    }
  } catch { /* ignore */ }
  return null
}

function storeSessionId(sessionId: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    sessionId,
    createdAt: Date.now()
  }))
}

function clearStoredSession() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_KEY)
}

export function TelegramChat() {
  const t = useTranslations("Chat")
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [hasStarted, setHasStarted] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const profile = getStoredProfile()
    if (profile) {
      setUserName(profile.name)
      setUserEmail(profile.email)
    }
  }, [])

  useEffect(() => {
    if (!sessionId) {
      const stored = getStoredSessionId()
      if (stored) {
        setSessionId(stored)
        fetch(`/api/telegram/message?sessionId=${stored}`)
          .then(r => r.json())
          .then(data => {
            if (data.messages && data.messages.length > 0) {
              setMessages(data.messages)
              setHasStarted(true)
              setIsActive(data.isActive !== false)
            }
          })
          .catch(() => {})
      } else {
        const sid = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
        setSessionId(sid)
        storeSessionId(sid)
      }
    }
  }, [sessionId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && sessionId && hasStarted && isActive) {
      const pollMessages = async () => {
        try {
          const response = await fetch(`/api/telegram/message?sessionId=${sessionId}`)
          if (response.ok) {
            const data = await response.json()
            if (data.messages && Array.isArray(data.messages)) {
              setMessages(data.messages)
              if (data.isActive === false) {
                setIsActive(false)
              }
            }
          }
        } catch (err) {
          console.error('Polling error:', err)
        }
      }

      pollMessages()
      pollIntervalRef.current = setInterval(pollMessages, 3000)

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current)
        }
      }
    }
  }, [isOpen, sessionId, hasStarted, isActive])

  useEffect(() => {
    if (isOpen && hasStarted && isActive) {
      const pollTelegram = async () => {
        try {
          await fetch('/api/telegram/message')
        } catch (err) {
          // silent fail
        }
      }

      const telegramPollInterval = setInterval(pollTelegram, 5000)
      return () => clearInterval(telegramPollInterval)
    }
  }, [isOpen, hasStarted, isActive])

  const handleStartChat = async () => {
    if (!sessionId || !userName.trim()) {
      setError(t("error_name_required"))
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      storeProfile(userName, userEmail)

      const response = await fetch('/api/telegram/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          text: `🟢 ${t("chat_started", { name: userName })}\nEmail: ${userEmail || t("email_not_provided")}`,
          userName,
          userEmail,
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to start session')
      }

      setMessages([{
        id: `welcome-${Date.now()}`,
        text: t("welcome_message", { name: userName }),
        timestamp: new Date().toISOString(),
        from: 'admin',
      }])
      setHasStarted(true)
      setIsActive(true)
    } catch (err: any) {
      console.error('Error starting session:', err)
      setError(err.message || t("error_start"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!newMessage.trim() || !sessionId || isLoading || !isActive) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/telegram/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          text: newMessage,
          userName: userName || 'Website Visitor',
          userEmail: userEmail || '',
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        if (errData.error === 'Session ended') {
          setIsActive(false)
          throw new Error(t("error_ended"))
        }
        throw new Error('Failed to send message')
      }

      setNewMessage('')

      const refreshResponse = await fetch(`/api/telegram/message?sessionId=${sessionId}`)
      if (refreshResponse.ok) {
        const data = await refreshResponse.json()
        if (data.messages && Array.isArray(data.messages)) {
          setMessages(data.messages)
        }
      }
    } catch (error: any) {
      console.error('Error sending message:', error)
      setError(error.message || t("error_send"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleEndChat = async () => {
    if (!sessionId) return

    setIsLoading(true)
    try {
      await fetch('/api/telegram/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          action: 'end',
          userName,
        }),
      })

      setIsActive(false)
      clearStoredSession()

      const newSid = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
      setSessionId(newSid)
      storeSessionId(newSid)
    } catch (err) {
      console.error('Error ending chat:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestartChat = () => {
    clearStoredSession()
    setMessages([])
    setHasStarted(false)
    setIsActive(true)
    setError(null)
    const newSid = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
    setSessionId(newSid)
    storeSessionId(newSid)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-opacity"
      >
        💬 Chat
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-gray-100">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-2xl shrink-0">
        <div>
          <h3 className="font-semibold text-sm">{t("chat_title")}</h3>
          <p className="text-[10px] text-orange-100">
            {isActive ? t("response_time") : t("conversation_ended")}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {hasStarted && isActive && (
            <button
              onClick={handleEndChat}
              disabled={isLoading}
              className="px-2.5 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white text-[11px] font-medium border border-white/20"
              title={t("end_button")}
            >
              {t("end_button")}
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white"
            title={t("minimize")}
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!hasStarted ? (
        <div className="flex-1 p-6 flex flex-col justify-center gap-4">
          <div className="text-center mb-2">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">👋</span>
            </div>
            <p className="text-sm font-medium text-gray-900">{t("welcome_title")}</p>
            <p className="text-xs text-gray-500 mt-1">{t("welcome_desc")}</p>
          </div>
          <input
            type="text"
            placeholder={t("name_placeholder")}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300"
          />
          <input
            type="email"
            placeholder={t("email_placeholder")}
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300"
          />
          <button
            onClick={handleStartChat}
            disabled={isLoading}
            className="w-full rounded-lg bg-orange-500 text-white py-2.5 text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? t("starting") : t("start_button")}
          </button>
          {error && <p className="text-xs text-red-500 text-center">{error}</p>}
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {!isActive && (
              <div className="bg-gray-50 text-gray-500 p-3 rounded-lg text-sm text-center">
                <p className="mb-2">{t("conversation_closed")}</p>
                <button
                  onClick={handleRestartChat}
                  className="inline-flex items-center gap-1.5 text-orange-500 hover:text-orange-600 font-medium text-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {t("restart")}
                </button>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                    message.from === 'user'
                      ? 'bg-orange-500 text-white'
                      : message.from === 'system'
                      ? 'bg-gray-50 text-gray-500 text-xs italic'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p>{message.text}</p>
                  <span className="text-[10px] opacity-70 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {isActive && (
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-gray-100 shrink-0"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t("message_placeholder")}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !newMessage.trim()}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors disabled:opacity-40 shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  )
}
