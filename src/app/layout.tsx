import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider'
import { Inter, Source_Sans_3, JetBrains_Mono } from "next/font/google"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const sourceSans = Source_Sans_3({ subsets: ["latin"], variable: "--font-source" })
const jetBrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" })

export const metadata = {
  title: "Drumblow FabricApps",
  description: "Modern and interactive website for Drumblow FabricApps",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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