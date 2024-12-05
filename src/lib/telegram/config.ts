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
 botToken: process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || '',
 adminChatId: process.env.NEXT_PUBLIC_TELEGRAM_ADMIN_CHAT_ID || '',
 secretToken: process.env.TELEGRAM_SECRET_TOKEN || ''
})