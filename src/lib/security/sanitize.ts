import createDOMPurify from 'dompurify'
import { marked } from 'marked'
import { JSDOM } from 'jsdom'

// Criar um ambiente DOM para o DOMPurify
const window = new JSDOM('').window
const purify = createDOMPurify(window)

export function sanitizeHTML(html: string): string {
  return purify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  })
}

export async function sanitizeMarkdown(markdown: string): Promise<string> {
  const html = await marked.parse(markdown)
  return sanitizeHTML(html)
}

export function sanitizeUserInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}