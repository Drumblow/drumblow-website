import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
})

export const blogPostSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(500),
  content: z.string().min(50),
  tags: z.array(z.string()).min(1).max(10),
  published: z.boolean(),
})

export const fileUploadSchema = z.object({
  filename: z.string().regex(/^[a-zA-Z0-9-_]+\.[a-zA-Z0-9]+$/),
  mimetype: z.enum(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  size: z.number().max(5 * 1024 * 1024), // 5MB max
})

// Helper functions for validation
export function validateContactForm(data: unknown) {
  return contactFormSchema.safeParse(data)
}

export function validateBlogPost(data: unknown) {
  return blogPostSchema.safeParse(data)
}

export function validateFileUpload(data: unknown) {
  return fileUploadSchema.safeParse(data)
}
