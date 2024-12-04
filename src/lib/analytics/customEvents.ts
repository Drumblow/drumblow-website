type EventData = Record<string, any>

class CustomAnalytics {
  private static instance: CustomAnalytics
  private events: Array<{ name: string; data: EventData; timestamp: Date }> = []
  private debugMode: boolean

  private constructor() {
    this.debugMode = process.env.NODE_ENV === 'development'
  }

  static getInstance(): CustomAnalytics {
    if (!CustomAnalytics.instance) {
      CustomAnalytics.instance = new CustomAnalytics()
    }
    return CustomAnalytics.instance
  }

  trackEvent(name: string, data: EventData = {}) {
    const event = {
      name,
      data,
      timestamp: new Date()
    }

    this.events.push(event)

    if (this.debugMode) {
      console.log('Analytics Event:', event)
    }

    // Enviar para o backend
    this.sendToBackend(event)
  }

  private async sendToBackend(event: any) {
    try {
      const response = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      })

      if (!response.ok) {
        throw new Error('Failed to send analytics event')
      }
    } catch (error) {
      if (this.debugMode) {
        console.error('Analytics Error:', error)
      }
    }
  }

  getEvents() {
    return this.events
  }
}

export const Analytics = CustomAnalytics.getInstance()