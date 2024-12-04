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

  async sendMessage(chatId: string, text: string): Promise<boolean> {
    console.log('Enviando mensagem:', { chatId, text, botToken: this.botToken })
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.adminChatId, // Forçar envio para o admin
          text: text
        })
      })

      const data = await response.json()
      console.log('Resposta do Telegram:', data)

      if (!response.ok) {
        throw new Error(data.description || 'Erro ao enviar mensagem')
      }

      return true
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      return false
    }
  }

  async handleIncomingMessage(update: any): Promise<void> {
    console.log('Recebendo mensagem:', update)
    
    const message = update.message
    if (!message) return

    const chatId = message.chat.id.toString()
    const text = message.text || ''

    // Se for mensagem do admin
    if (chatId === this.adminChatId) {
      return
    }

    // Atualizar última atividade da sessão
    const session = this.sessions.get(chatId)
    if (session) {
      session.lastActivity = new Date()
      this.sessions.set(chatId, session)
    }

    // Enviar para o admin
    await this.sendMessage(
      this.adminChatId,
      `Nova mensagem:\n${text}`
    )
  }

  async startSession(userId: string, userName: string): Promise<TelegramSession> {
    const session: TelegramSession = {
      chatId: this.adminChatId, // Usar o chat do admin
      userId,
      userName,
      startTime: new Date(),
      lastActivity: new Date()
    }

    this.sessions.set(session.chatId, session)
    
    await this.sendMessage(
      this.adminChatId,
      `Nova sessão iniciada:\nUsuário: ${userName}\nID: ${userId}`
    )

    return session
  }

  async endSession(chatId: string): Promise<void> {
    const session = this.sessions.get(chatId)
    if (session) {
      await this.sendMessage(
        this.adminChatId,
        `Sessão encerrada:\nUsuário: ${session.userName}`
      )
      this.sessions.delete(chatId)
    }
  }
}