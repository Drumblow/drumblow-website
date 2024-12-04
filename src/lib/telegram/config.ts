import { z } from 'zod'

const configSchema = z.object({
  botToken: z.string().min(1),
  adminChatId: z.string().min(1),
  webhookUrl: z.string().url(),
  secretToken: z.string().min(32)
})

export const TELEGRAM_CONFIG = configSchema.parse({
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID || '',
  webhookUrl: `${process.env.VERCEL_URL || process.env.NEXT_PUBLIC_API_URL}/api/telegram/webhook`,
  secretToken: process.env.TELEGRAM_SECRET_TOKEN || ''
})