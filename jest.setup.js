import '@testing-library/jest-dom'
import 'whatwg-fetch'

// Mock do window.gtag
window.gtag = jest.fn()

// Mock do Hotjar
window.hj = jest.fn()

// Mock do sharp para testes
jest.mock('sharp', () => ({
  __esModule: true,
  default: () => ({
    resize: () => ({ webp: () => ({ toBuffer: () => Buffer.from([]) }) }),
  }),
}))

// Mock do IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe() { return null }
  unobserve() { return null }
  disconnect() { return null }
}

// Supress console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
}