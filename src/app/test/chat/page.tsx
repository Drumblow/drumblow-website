import { ChatStore } from '@/lib/telegram/store'
import { TELEGRAM_CONFIG } from '@/lib/telegram/config'

export const dynamic = 'force-dynamic'

export default function ChatTestPage() {
  const sessions = ChatStore.getSessions()
  const activeSessions = ChatStore.getActiveSessions()
  
  const configStatus = {
    botToken: TELEGRAM_CONFIG.botToken ? `✅ Configurado (${TELEGRAM_CONFIG.botToken.slice(0, 10)}...)` : '❌ Não configurado',
    adminChatId: TELEGRAM_CONFIG.adminChatId ? `✅ ${TELEGRAM_CONFIG.adminChatId}` : '❌ Não configurado',
    webhookUrl: TELEGRAM_CONFIG.webhookUrl || '❌ Não configurado',
    secretToken: TELEGRAM_CONFIG.secretToken ? '✅ Configurado' : '❌ Não configurado',
  }

  return (
    <div className="container py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Diagnóstico do Chat</h1>

      <div className="space-y-8">
        {/* Config Status */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuração do Telegram</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Bot Token</span>
              <span className="font-mono text-gray-900">{configStatus.botToken}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Admin Chat ID</span>
              <span className="font-mono text-gray-900">{configStatus.adminChatId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Webhook URL</span>
              <span className="font-mono text-gray-900">{configStatus.webhookUrl}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Secret Token</span>
              <span className="font-mono text-gray-900">{configStatus.secretToken}</span>
            </div>
          </div>
        </section>

        {/* Session Stats */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Sessões ({sessions.length} total, {activeSessions.length} ativas)
          </h2>
          {sessions.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhuma sessão no momento.</p>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.sessionId} className={`rounded-lg border p-4 ${session.isActive ? 'border-orange-200 bg-orange-50/30' : 'border-gray-100 bg-gray-50/30'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900 flex items-center gap-2">
                        {session.userName}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${session.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>
                          {session.isActive ? 'Ativa' : 'Encerrada'}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400">{session.userEmail || 'Sem email'}</p>
                    </div>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                      {session.messages.length} msgs
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono mb-2">ID: {session.sessionId}</p>
                  {session.endedAt && (
                    <p className="text-xs text-gray-400 mb-2">Encerrada em: {new Date(session.endedAt).toLocaleString('pt-BR')}</p>
                  )}
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {session.messages.slice(-5).map((msg) => (
                      <div key={msg.id} className={`text-xs p-2 rounded ${msg.from === 'user' ? 'bg-orange-50 text-orange-700' : msg.from === 'system' ? 'bg-gray-100 text-gray-500 italic' : 'bg-gray-50 text-gray-600'}`}>
                        <span className="font-semibold">{msg.from}:</span> {msg.text.length > 60 ? msg.text.slice(0, 60) + '...' : msg.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Test Instructions */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Como testar</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Abra o chat no canto inferior direito da tela</li>
              <li>Preencha nome e clique em <strong>Iniciar chat</strong></li>
              <li>Envie uma mensagem de teste</li>
              <li>Verifique seu Telegram — deve chegar a notificação</li>
              <li>Responda no Telegram (use <strong>Responder</strong> na mensagem do bot)</li>
              <li>Aguarde alguns segundos — a resposta aparece no site</li>
              <li>Clique no <strong>X</strong> no header do chat para <strong>Encerrar conversa</strong></li>
              <li>Verifique que o Telegram recebeu notificação de encerramento</li>
              <li>No site, clique em <strong>Iniciar nova conversa</strong> para testar de novo</li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  )
}
