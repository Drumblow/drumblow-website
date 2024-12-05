import { TELEGRAM_CONFIG } from './config'
import type { TelegramMessage, TelegramSession, TelegramWebhookUpdate } from './types'

export class TelegramClient {
  private static instance: TelegramClient
  private sessions: Map<string, TelegramSession> = new Map()
  private messageHandlers: ((message: string) => void)[] = []
  private messageHistory: Map<string, TelegramMessage[]> = new Map()
  private botToken: string
  private adminChatId: string
  private webhookUrl: string

  private constructor() {
    this.botToken = TELEGRAM_CONFIG.botToken
    this.adminChatId = TELEGRAM_CONFIG.adminChatId
    this.webhookUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/telegram/webhook`
  }

  static getInstance(): TelegramClient {
    if (!TelegramClient.instance) {
      TelegramClient.instance = new TelegramClient()
    }
    return TelegramClient.instance
  }

  public async setupWebhook(): Promise<void> {
    try {
      // Remover webhook existente
      const deleteResponse = await fetch(
        `https://api.telegram.org/bot${this.botToken}/deleteWebhook?drop_pending_updates=true`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      )

      if (!deleteResponse.ok) {
        throw new Error('Failed to delete existing webhook')
      }

      // Configurar novo webhook
      const setResponse = await fetch(
        `https://api.telegram.org/bot${this.botToken}/setWebhook`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: this.webhookUrl,
            allowed_updates: ['message']
          })
        }
      )

      if (!setResponse.ok) {
        const error = await setResponse.json()
        throw new Error(error.description || 'Failed to set webhook')
      }

      // Verificar configuração
      const infoResponse = await fetch(
        `https://api.telegram.org/bot${this.botToken}/getWebhookInfo`
      )
      
      if (!infoResponse.ok) {
        throw new Error('Failed to get webhook info')
      }

      const info = await infoResponse.json()
      console.log('Webhook configured:', info)
    } catch (error) {
      console.error('Webhook setup error:', error)
      throw error
    }
  }

  public addMessageHandler(handler: (message: string) => void) {
    this.messageHandlers.push(handler)
    // Mostrar mensagens do histórico
    const sessions = Array.from(this.sessions.values())
    const sessionId = sessions[0]?.chatId
    if (sessionId) {
      const history = this.messageHistory.get(sessionId) || []
      history.forEach(msg => handler(msg.text))
    }
  }

  public removeMessageHandler(handler: (message: string) => void) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler)
  }

  private notifyHandlers(message: string) {
    console.log('Notifying handlers:', message, this.messageHandlers.length)
    this.messageHandlers.forEach(handler => handler(message))
  }

  async handleIncomingMessage(update: TelegramWebhookUpdate): Promise<void> {
    try {
      console.log('Handling incoming message:', update)
      const message = update.message
      if (!message?.text) return

      const chatId = message.chat.id.toString()
      const text = message.text
      const timestamp = new Date()

      console.log('Message from:', chatId, 'Admin:', this.adminChatId)

      // Armazenar no histórico
      const sessionHistory = this.messageHistory.get(chatId) || []
      sessionHistory.push({
        id: `${timestamp.getTime()}`,
        text,
        timestamp,
        from: chatId === this.adminChatId ? 'admin' : 'user'
      })
      this.messageHistory.set(chatId, sessionHistory)

      if (chatId === this.adminChatId) {
        console.log('Admin message received')
        const sessions = Array.from(this.sessions.values())
        if (sessions.length > 0) {
          const latestSession = sessions.reduce((latest, current) => 
            latest.lastActivity > current.lastActivity ? latest : current
          )
          this.notifyHandlers(text)
          await this.sendTelegramMessage(latestSession.userId, text)
        }
      } else {
        console.log('User message received')
        let session = this.sessions.get(chatId)
        if (!session) {
          session = {
            chatId,
            userId: chatId,
            userName: message.from?.username || 'Unknown',
            startTime: timestamp,
            lastActivity: timestamp
          }
          this.sessions.set(chatId, session)
        } else {
          session.lastActivity = timestamp
        }
        
        await this.sendTelegramMessage(
          this.adminChatId,
          `📩 From: ${message.from?.username}\n${text}`
        )
      }
    } catch (error) {
      console.error('Error handling message:', error)
    }
  }

  public async sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${this.botToken}/sendMessage`,
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

      const timestamp = new Date()
      const sessionHistory = this.messageHistory.get(chatId) || []
      sessionHistory.push({
        id: `${timestamp.getTime()}`,
        text,
        timestamp,
        from: 'admin'
      })
      this.messageHistory.set(chatId, sessionHistory)

      return true
    } catch (error) {
      console.error('Error sending message:', error)
      return false
    }
  }

  async startSession(userId: string, userName: string): Promise<TelegramSession> {
    await this.setupWebhook()
    
    const session: TelegramSession = {
      chatId: this.adminChatId,
      userId,
      userName,
      startTime: new Date(),
      lastActivity: new Date()
    }

    this.sessions.set(userId, session)
    this.messageHistory.clear()
    
    await this.sendTelegramMessage(
      this.adminChatId,
      `🟢 <b>Nova sessão iniciada</b>\n\nUsuário: ${userName}\nID: ${userId}`
    )

    return session
  }

  async endSession(chatId: string): Promise<void> {
    const session = this.sessions.get(chatId)
    if (session) {
      await this.sendTelegramMessage(
        this.adminChatId,
        `🔴 <b>Sessão encerrada</b>\n\nUsuário: ${session.userName}`
      )
      this.sessions.delete(chatId)
      this.messageHistory.delete(chatId)
      this.messageHandlers = []
    }
  }

  getMessageHistory(chatId: string): TelegramMessage[] {
    return this.messageHistory.get(chatId) || []
  }
}