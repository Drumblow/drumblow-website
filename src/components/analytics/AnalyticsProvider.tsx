'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { useEffect } from 'react'
import * as gtag from '@/lib/analytics/gtag'
import { initHotjar } from '@/lib/analytics/hotjar'

export function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname) {
      gtag.pageview(pathname)
    }
  }, [pathname])

  useEffect(() => {
    initHotjar()
  }, [])

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      {children}
    </>
  )
}