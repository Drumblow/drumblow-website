import '@testing-library/jest-dom'
import 'whatwg-fetch'

// Mock FormData de maneira mais simples
class MockFormData {
  private data = new Map<string, any>()

  append(name: string, value: any) {
    this.data.set(name, value)
  }

  get(name: string) {
    return this.data.get(name)
  }
}

// Override global FormData
Object.defineProperty(global, 'FormData', {
  value: MockFormData,
  writable: true,
  configurable: true
})

// Mock fetch global
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ secure_url: 'https://test.com/image.jpg' })
  })
) as jest.Mock

// Mock Cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn((options, callback) => {
        callback(null, {
          secure_url: 'https://test.com/image.jpg',
          public_id: 'test',
          format: 'jpg',
          width: 800,
          height: 600,
          bytes: 1024,
          resource_type: 'image',
          created_at: new Date().toISOString()
        })
        return { end: jest.fn() }
      })
    }
  }
}))

// Mock sharp
jest.mock('sharp', () => {
  return jest.fn().mockImplementation(() => ({
    resize: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from([]))
  }))
})

// Suppress console errors during tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn()
}