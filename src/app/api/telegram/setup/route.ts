import { NextResponse } from 'next/server'
import { TELEGRAM_CONFIG } from '@/lib/telegram/config'

export async function GET() {
  try {
    // Primeiro, vamos verificar o webhook atual
    const getWebhookResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/getWebhookInfo`
    )
    
    const currentWebhook = await getWebhookResponse.json()
    console.log('Webhook atual:', currentWebhook)

    // Remover webhook existente
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/deleteWebhook`
    )

    // Configurar novo webhook
    const webhookUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/telegram/webhook`
    console.log('Configurando novo webhook:', webhookUrl)

    const setWebhookResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/setWebhook`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message'],
          drop_pending_updates: true
        })
      }
    )

    const webhookData = await setWebhookResponse.json()
    console.log('Resposta da configuração do webhook:', webhookData)

    if (!setWebhookResponse.ok) {
      return NextResponse.json({ 
        error: 'Failed to set webhook',
        details: webhookData
      }, { status: setWebhookResponse.status })
    }

    // Verificar nova configuração
    const finalCheckResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/getWebhookInfo`
    )
    
    const finalWebhook = await finalCheckResponse.json()

    return NextResponse.json({ 
      success: true, 
      webhookUrl,
      initialStatus: currentWebhook,
      setupResult: webhookData,
      finalStatus: finalWebhook
    })
  } catch (error) {
    console.error('Error setting webhook:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}