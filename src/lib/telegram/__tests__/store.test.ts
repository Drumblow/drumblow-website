import { ChatStore } from '../store'

describe('ChatStore', () => {
  beforeEach(() => {
    ChatStore.reset()
  })

  test('createSession creates a session with welcome message', () => {
    const session = ChatStore.createSession('session_1', 'João', 'joao@test.com')
    expect(session.sessionId).toBe('session_1')
    expect(session.userName).toBe('João')
    expect(session.messages).toHaveLength(1)
    expect(session.messages[0].text).toBe('Olá! Como posso ajudar?')
    expect(session.messages[0].from).toBe('admin')
  })

  test('getMessages returns only messages for the given session', () => {
    ChatStore.createSession('session_1', 'João', 'joao@test.com')
    ChatStore.createSession('session_2', 'Maria', 'maria@test.com')
    
    ChatStore.addMessage('session_1', { id: '1', text: 'Oi', timestamp: new Date().toISOString(), from: 'user' })
    ChatStore.addMessage('session_2', { id: '2', text: 'Tchau', timestamp: new Date().toISOString(), from: 'user' })
    
    const msgs1 = ChatStore.getMessages('session_1')
    const msgs2 = ChatStore.getMessages('session_2')
    
    expect(msgs1).toHaveLength(2) // welcome + Oi
    expect(msgs2).toHaveLength(2) // welcome + Tchau
    expect(msgs1.some(m => m.text === 'Oi')).toBe(true)
    expect(msgs1.some(m => m.text === 'Tchau')).toBe(false)
    expect(msgs2.some(m => m.text === 'Tchau')).toBe(true)
    expect(msgs2.some(m => m.text === 'Oi')).toBe(false)
  })

  test('hasAdminMessage prevents duplicates', () => {
    ChatStore.createSession('session_1', 'João', '')
    
    expect(ChatStore.hasAdminMessage('session_1', 'Olá! Como posso ajudar?', 'welcome-1')).toBe(true)
    expect(ChatStore.hasAdminMessage('session_1', 'Nova mensagem', 'new-1')).toBe(false)
  })

  test('updateId tracking works', () => {
    expect(ChatStore.getLastUpdateId()).toBe(0)
    ChatStore.setLastUpdateId(5)
    expect(ChatStore.getLastUpdateId()).toBe(5)
    ChatStore.setLastUpdateId(3) // should not decrease
    expect(ChatStore.getLastUpdateId()).toBe(5)
    ChatStore.setLastUpdateId(10)
    expect(ChatStore.getLastUpdateId()).toBe(10)
  })

  test('cleanOldSessions removes old sessions', () => {
    ChatStore.createSession('old', 'User', '')
    // Manually set createdAt to past
    const session = ChatStore.getSession('old')!
    session.createdAt = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    session.updatedAt = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    
    ChatStore.createSession('new', 'User2', '')
    
    const removed = ChatStore.cleanOldSessions(24 * 60 * 60 * 1000)
    expect(removed).toBe(1)
    expect(ChatStore.getSession('old')).toBeUndefined()
    expect(ChatStore.getSession('new')).toBeDefined()
  })
})
