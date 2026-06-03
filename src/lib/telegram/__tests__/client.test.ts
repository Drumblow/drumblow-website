import { TelegramClient } from '../client'
import { TELEGRAM_CONFIG } from '../config'
import { TelegramWebhookUpdate } from '../types'

// Mock fetch
global.fetch = jest.fn() as jest.Mock

describe('TelegramClient', () => {
  let client: TelegramClient

  beforeEach(() => {
    jest.clearAllMocks()
    client = TelegramClient.getInstance()
  })

  it('should be a singleton', () => {
    const instance1 = TelegramClient.getInstance()
    const instance2 = TelegramClient.getInstance()
    expect(instance1).toBe(instance2)
  })

  describe('sendTelegramMessage', () => {
    it('should send message successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ok: true })
      })

      const result = await client.sendTelegramMessage('123', 'test message')
      expect(result).toBe(true)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should handle errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const result = await client.sendTelegramMessage('123', 'test message')
      expect(result).toBe(false)
    })
  })

  describe('startSession', () => {
    beforeEach(() => {
      // Reset mocks before each test
      (global.fetch as jest.Mock).mockReset()
    })

    it('should start session successfully', async () => {
      // setupWebhook: deleteWebhook, setWebhook, getWebhookInfo
      // startSession: sendTelegramMessage
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) }) // deleteWebhook
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) }) // setWebhook
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true, result: { url: 'http://test' } }) }) // getWebhookInfo
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) }) // sendTelegramMessage

      const session = await client.startSession('123', 'Test User')
      
      expect(session.userId).toBe('123')
      expect(session.userName).toBe('Test User')
      expect(session.chatId).toBe(TELEGRAM_CONFIG.adminChatId)
    })
  })

  describe('endSession', () => {
    it('should end session successfully', async () => {
      // Setup mocks
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) }) // deleteWebhook
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) }) // setWebhook
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true, result: { url: 'http://test' } }) }) // getWebhookInfo
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) }) // sendTelegramMessage (startSession)
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) }) // sendTelegramMessage (endSession)

      // Start a session first
      const session = await client.startSession('123', 'Test User')
      
      // End the session
      await client.endSession(session.chatId)
      
      // Verify calls
      expect(global.fetch).toHaveBeenCalledTimes(5)
    })
  })

  describe('handleIncomingMessage', () => {
    it('should handle incoming message correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ok: true })
      })

      const update: TelegramWebhookUpdate = {
        message: {
          chat: { id: 123 },
          text: 'test message',
          from: { 
            id: 456,
            username: 'testuser'
          }
        }
      }

      await client.handleIncomingMessage(update)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
  })
})
