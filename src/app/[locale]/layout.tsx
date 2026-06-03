import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { Header } from "@/components/layouts/header"
import { Footer } from "@/components/layouts/footer"
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Metadata" })

  return {
    title: {
      default: t("title_default"),
      template: "%s | Drumblow",
    },
    description: t("description"),
    metadataBase: new URL("https://drumblow.com"),
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: t("og_title"),
      description: t("og_description"),
      images: [{ url: "/drumblow-logo.png" }],
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <AnalyticsProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </AnalyticsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
