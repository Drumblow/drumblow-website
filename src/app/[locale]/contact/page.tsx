'use client'

import { useState } from 'react'
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { TelegramChat } from '@/components/chat/TelegramChat'

export default function ContactPage() {
  const t = useTranslations("Contact")
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    try {
      const sessionId = `contact_${Date.now()}`

      const response = await fetch('/api/telegram/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          text: `📨 <b>New message via contact form</b>\n\nName: ${name}\nEmail: ${email}\n\n${message}`,
          userName: name,
          userEmail: email,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setSent(true)
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">{t("title")}</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          {sent ? (
            <div className="rounded-2xl border border-green-100 bg-green-50 p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">{t("success_title")}</h3>
              <p className="text-green-700 text-sm mb-4">
                {t("success_desc")}
              </p>
              <Button onClick={() => setSent(false)} variant="outline">
                {t("success_button")}
              </Button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700">
                  {t("form_name")}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300 transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
                  {t("form_email")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300 transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700">
                  {t("form_message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300 transition-colors resize-none"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("form_sending") : t("form_submit")}
              </Button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">{t("get_in_touch")}</h2>
            <p className="text-gray-500">
              {t("get_in_touch_desc")}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-gray-900">{t("chat_title")}</h3>
            <p className="text-gray-500">
              {t("chat_desc")}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="font-semibold mb-3 text-gray-900">{t("direct_contact")}</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>{t("phone")}: <a href="tel:+14378296820" className="text-orange-500 hover:text-orange-600 transition-colors">+1 437-829-6820</a></li>
              <li>{t("location")}: Sarnia, ON. Canada</li>
            </ul>
          </div>
        </div>
      </div>

      <TelegramChat />
    </div>
  )
}
