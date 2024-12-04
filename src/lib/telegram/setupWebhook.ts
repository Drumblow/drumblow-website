import { TELEGRAM_CONFIG } from './config'

export async function setupWebhook() {
  const webhookUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/telegram/webhook`
  
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/setWebhook`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message']
        })
      }
    )

    const data = await response.json()
    return data.ok
  } catch (error) {
    console.error('Error setting webhook:', error)
    return false
  }
}