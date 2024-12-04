import { Header } from "./header"
import { Footer } from "./footer"
import { AnalyticsProvider } from '../analytics/AnalyticsProvider'

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnalyticsProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </AnalyticsProvider>
    </div>
  )
}