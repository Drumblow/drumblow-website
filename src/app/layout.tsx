import type { Metadata } from "next"
import { Inter, Source_Sans_3, JetBrains_Mono } from "next/font/google"
import { Header } from "@/components/layouts/header"
import { Footer } from "@/components/layouts/footer"
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider'
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap'
})

const sourceSans = Source_Sans_3({ 
  subsets: ["latin"],
  variable: "--font-source",
  display: 'swap'
})

const jetBrains = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    default: "Drumblow",
    template: "%s | Drumblow",
  },
  description: "Desenvolvimento de software de alto nível. Rust para sistemas críticos, Flutter cross-platform e Next.js moderno. Cases reais: Igreja Manager, BeeNorth 3D, Invoice e Jumb.",
  metadataBase: new URL('https://drumblow.com'),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Drumblow - Software de produção com excelência técnica",
    description: "Projetos reais em produção com Rust, Flutter e Next.js. Transformando ideias complexas em soluções robustas.",
    images: [{ url: "/drumblow-logo.png" }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${sourceSans.variable} ${jetBrains.variable} font-sans min-h-screen flex flex-col`}>
        <AnalyticsProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AnalyticsProvider>
      </body>
    </html>
  )
}