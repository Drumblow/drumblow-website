// src/lib/telegram/client.ts
import { TELEGRAM_CONFIG } from './config'
import type { TelegramMessage, TelegramSession } from './types'

export class TelegramClient {
  private static instance: TelegramClient
  private sessions: Map<string, TelegramSession> = new Map()
  private botToken: string
  private adminChatId: string

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

  private async makeRequest(method: string, data: any) {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${this.botToken}/${method}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        }
      )

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error in ${method}:`, error)
      throw error
    }
  }

  async sendMessage(chatId: string, text: string): Promise<boolean> {
    try {
      await this.makeRequest('sendMessage', {
        chat_id: this.adminChatId,
        text: text,
        parse_mode: 'HTML'
      })
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