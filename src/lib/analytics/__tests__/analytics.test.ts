import { Analytics } from '../customEvents'

describe('Analytics', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should track events correctly', () => {
    const event = {
      name: 'test_event',
      data: { key: 'value' }
    }

    Analytics.trackEvent(event.name, event.data)
    const events = Analytics.getEvents()
    
    expect(events).toHaveLength(1)
    expect(events[0]).toMatchObject({
      name: event.name,
      data: event.data,
    })
  })

  it('should attempt to send event to backend', () => {
    Analytics.trackEvent('test_event', { key: 'value' })
    
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/analytics/events',
      expect.any(Object)
    )
  })
})
