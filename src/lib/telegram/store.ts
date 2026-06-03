export interface ChatMessage {
  id: string
  text: string
  timestamp: string
  from: 'user' | 'admin' | 'system'
}

export interface ChatSession {
  sessionId: string
  userName: string
  userEmail: string
  messages: ChatMessage[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  endedAt?: string
}

// Simple in-memory store for chat sessions
const sessions = new Map<string, ChatSession>()
let lastProcessedUpdateId = 0

export const ChatStore = {
  reset(): void {
    sessions.clear()
    lastProcessedUpdateId = 0
  },

  createSession(sessionId: string, userName: string, userEmail: string): ChatSession {
    const session: ChatSession = {
      sessionId,
      userName,
      userEmail,
      messages: [{
        id: `welcome-${Date.now()}`,
        text: 'Olá! Como posso ajudar?',
        timestamp: new Date().toISOString(),
        from: 'admin'
      }],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    sessions.set(sessionId, session)
    return session
  },

  getSession(sessionId: string): ChatSession | undefined {
    return sessions.get(sessionId)
  },

  addMessage(sessionId: string, message: ChatMessage): void {
    const session = sessions.get(sessionId)
    if (session && session.isActive) {
      session.messages.push(message)
      session.updatedAt = new Date().toISOString()
    }
  },

  endSession(sessionId: string): ChatSession | undefined {
    const session = sessions.get(sessionId)
    if (session) {
      session.isActive = false
      session.endedAt = new Date().toISOString()
      session.messages.push({
        id: `system-end-${Date.now()}`,
        text: 'Conversa encerrada. Se precisar de mais ajuda, inicie um novo chat.',
        timestamp: new Date().toISOString(),
        from: 'system'
      })
    }
    return session
  },

  getMessages(sessionId: string): ChatMessage[] {
    return sessions.get(sessionId)?.messages || []
  },

  getSessions(): ChatSession[] {
    return Array.from(sessions.values())
  },

  getActiveSessions(): ChatSession[] {
    return Array.from(sessions.values()).filter(s => s.isActive)
  },

  findSessionByUserEmail(email: string): ChatSession | undefined {
    return Array.from(sessions.values()).find(s => s.userEmail === email)
  },

  findLatestSession(): ChatSession | undefined {
    const all = Array.from(sessions.values())
    if (all.length === 0) return undefined
    return all.reduce((latest, current) => 
      new Date(current.updatedAt) > new Date(latest.updatedAt) ? current : latest
    )
  },

  findLatestActiveSession(): ChatSession | undefined {
    const active = this.getActiveSessions()
    if (active.length === 0) return undefined
    return active.reduce((latest, current) => 
      new Date(current.updatedAt) > new Date(latest.updatedAt) ? current : latest
    )
  },

  getLastUpdateId(): number {
    return lastProcessedUpdateId
  },

  setLastUpdateId(id: number): void {
    if (id > lastProcessedUpdateId) {
      lastProcessedUpdateId = id
    }
  },

  hasAdminMessage(sessionId: string, text: string, messageId?: string): boolean {
    const session = sessions.get(sessionId)
    if (!session) return false
    return session.messages.some(m => 
      m.from === 'admin' && (m.id === messageId || m.text === text)
    )
  },

  cleanOldSessions(maxAgeMs: number = 24 * 60 * 60 * 1000): number {
    const now = Date.now()
    let removed = 0
    for (const [id, session] of sessions) {
      if (now - new Date(session.updatedAt).getTime() > maxAgeMs) {
        sessions.delete(id)
        removed++
      }
    }
    return removed
  }
}
