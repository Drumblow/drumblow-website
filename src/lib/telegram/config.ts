import { z } from 'zod'

const configSchema = z.object({
  botToken: z.string().default(''),
  adminChatId: z.string().default(''),
  webhookUrl: z.string().default(''),
  secretToken: z.string().default('defaultsecrettoken'.repeat(2))
}).transform(data => ({
  ...data,
  webhookUrl: process.env.VERCEL_URL ? 
    `https://${process.env.VERCEL_URL}/api/telegram/webhook` : 
    `${process.env.NEXT_PUBLIC_API_URL || ''}/api/telegram/webhook`
}))

export const TELEGRAM_CONFIG = configSchema.parse({
  botToken: process.env.TELEGRAM_BOT_TOKEN,
  adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID,
  secretToken: process.env.TELEGRAM_SECRET_TOKEN
})

// Validação apenas quando em runtime na Vercel
export function validateProductionConfig() {
  if (process.env.VERCEL && !process.env.TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN is required in production')
  }
  if (process.env.VERCEL && !process.env.TELEGRAM_ADMIN_CHAT_ID) {
    throw new Error('TELEGRAM_ADMIN_CHAT_ID is required in production')
  }
  if (process.env.VERCEL && !process.env.TELEGRAM_SECRET_TOKEN) {
    throw new Error('TELEGRAM_SECRET_TOKEN is required in production')
  }
}

// Valida apenas em runtime na Vercel
if (process.env.VERCEL) {
  validateProductionConfig()
}