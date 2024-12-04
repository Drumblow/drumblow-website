export const analyticsConfig = {
    googleAnalytics: {
      measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    },
    hotjar: {
      hjid: process.env.NEXT_PUBLIC_HOTJAR_ID,
      hjsv: process.env.NEXT_PUBLIC_HOTJAR_SNIPPET_VERSION,
    },
    customEvents: {
      enabled: true,
      debugMode: process.env.NODE_ENV === 'development',
    }
  }