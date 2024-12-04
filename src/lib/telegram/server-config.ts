if (!process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN is required')
  }
  
  if (!process.env.NEXT_PUBLIC_TELEGRAM_ADMIN_CHAT_ID) {
    throw new Error('TELEGRAM_ADMIN_CHAT_ID is required')
  }
  
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is required')
  }
  
  export const TELEGRAM_SERVER_CONFIG = {
    botToken: process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN,
    adminChatId: process.env.NEXT_PUBLIC_TELEGRAM_ADMIN_CHAT_ID,
    webhookUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/telegram/webhook`
  } as const