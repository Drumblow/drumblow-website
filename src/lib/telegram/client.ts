// src/lib/telegram/client.ts
import { TELEGRAM_CONFIG } from './config'
import type { TelegramMessage, TelegramSession, TelegramWebhookUpdate } from './types'

export class TelegramClient {
  private static instance: TelegramClient
  private sessions: Map<string, TelegramSession> = new Map()
  private readonly botToken: string
  private readonly adminChatId: string

  private constructor() {
    this.botToken = TELEGRAM_CONFIG.botToken
    this.adminChatId = TELEGRAM_CONFIG.adminChatId
  }

  static getInstance(): TelegramClient {
    if (!TelegramClient.instance) {
      TelegramClient.instance = new TelegramClient()
    }
    return TelegramClient.instance
  }

  async handleIncomingMessage(update: TelegramWebhookUpdate): Promise<void> {
    try {
      const message = update.message
      if (!message) return

      const chatId = message.chat.id.toString()
      const text = message.text || ''
      const username = message.from?.username || 'Unknown'

      if (chatId === this.adminChatId) {
        return
      }

      const session = this.sessions.get(chatId)
      if (session) {
        session.lastActivity = new Date()
        this.sessions.set(chatId, session)
      }

      await this.sendMessage(
        this.adminChatId,
        `📩 <b>Nova mensagem</b>\nDe: @${username}\n\n${text}`
      )
    } catch (error) {
      console.error('Error handling incoming message:', error)
    }
  }

  async sendMessage(chatId: string, text: string): Promise<boolean> {
    try {
      const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML'
          })
        }
      )
  
      const data = await response.json()
      if (!data.ok) {
        throw new Error(data.description || 'Failed to send message')
      }
      return true
    } catch (error) {
      console.error('Error sending message:', error)
      return false
    }
  }

  async startSession(userId: string, userName: string): Promise<TelegramSession> {
    try {
      const session: TelegramSession = {
        chatId: this.adminChatId,
        userId,
        userName,
        startTime: new Date(),
        lastActivity: new Date()
      }

      this.sessions.set(session.chatId, session)
      
      await this.sendMessage(
        this.adminChatId,
        `🟢 <b>Nova sessão de chat iniciada</b>\n\nUsuário: ${userName}\nID: ${userId}\nHorário: ${session.startTime.toLocaleString()}`
      )

      return session
    } catch (error) {
      console.error('Error starting session:', error)
      throw error
    }
  }

  async endSession(chatId: string): Promise<void> {
    try {
      const session = this.sessions.get(chatId)
      if (session) {
        await this.sendMessage(
          this.adminChatId,
          `🔴 <b>Sessão de chat encerrada</b>\n\nUsuário: ${session.userName}\nDuração: ${Math.round((Date.now() - session.startTime.getTime()) / 1000 / 60)} minutos`
        )
        this.sessions.delete(chatId)
      }
    } catch (error) {
      console.error('Error ending session:', error)
    }
  }
}