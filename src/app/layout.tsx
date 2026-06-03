import { Inter, Source_Sans_3, JetBrains_Mono } from "next/font/google"
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} ${sourceSans.variable} ${jetBrains.variable} font-sans min-h-screen flex flex-col antialiased`}>
        {children}
      </body>
    </html>
  )
}
