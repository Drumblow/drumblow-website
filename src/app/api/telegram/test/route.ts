import { NextResponse } from 'next/server'
import { TELEGRAM_CONFIG } from '@/lib/telegram/config'

async function makeRequest(url: string, method = 'GET', body?: any) {
  return fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': '1'
    },
    body: body ? JSON.stringify(body) : undefined
  })
}

export async function GET() {
  const results = {
    currentWebhook: null,
    deleteResult: null,
    setWebhook: null,
    finalStatus: null
  }

  try {
    // Verificar webhook atual
    const getWebhook = await makeRequest(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/getWebhookInfo`
    )
    results.currentWebhook = await getWebhook.json()

    // Remover webhook existente
    const deleteWebhook = await makeRequest(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/deleteWebhook`
    )
    results.deleteResult = await deleteWebhook.json()

    // Configurar novo webhook
    const webhookUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/telegram/webhook`
    const setWebhook = await makeRequest(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/setWebhook`,
      'POST',
      {
        url: webhookUrl,
        allowed_updates: ['message'],
        drop_pending_updates: true
      }
    )
    results.setWebhook = await setWebhook.json()

    // Verificar configuração final
    const finalCheck = await makeRequest(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/getWebhookInfo`
    )
    results.finalStatus = await finalCheck.json()

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      results 
    }, { status: 500 })
  }
}
