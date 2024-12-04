import { TELEGRAM_CONFIG } from './config'

export async function setupWebhook() {
  try {
    // Remover webhook existente
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/deleteWebhook`
    )

    // Configurar novo webhook
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/setWebhook`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: TELEGRAM_CONFIG.webhookUrl,
          allowed_updates: ['message'],
          secret_token: TELEGRAM_CONFIG.secretToken,
          max_connections: 100,
          drop_pending_updates: true
        })
      }
    )

    const data = await response.json()
    
    if (!data.ok) {
      throw new Error(data.description || 'Failed to set webhook')
    }

    return true
  } catch (error) {
    console.error('Error setting webhook:', error)
    return false
  }
}