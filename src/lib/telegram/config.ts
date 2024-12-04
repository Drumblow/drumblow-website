export const TELEGRAM_CONFIG = {
    botToken: process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || '',
    adminChatId: process.env.NEXT_PUBLIC_TELEGRAM_ADMIN_CHAT_ID || '',
    webhookUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/telegram/webhook`
  }