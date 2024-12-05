import '@testing-library/jest-dom'
import 'whatwg-fetch'

process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'djc3smoxw'
process.env.CLOUDINARY_API_KEY = '949423736749512'
process.env.CLOUDINARY_API_SECRET = '-LV1rzbcgAgmTFa-z1M4mKvUBgc'
process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN = '7719260931:AAHcQV_FRENAfkmRLVjAiywrcarHUm1YjH8'
process.env.NEXT_PUBLIC_TELEGRAM_ADMIN_CHAT_ID = '273567425'

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: (options, callback) => ({
        end: (buffer) => {
          callback(null, {
            secure_url: 'https://res.cloudinary.com/djc3smoxw/image/upload/test.jpg',
            public_id: 'test'
          })
        }
      })
    }
  }
}))

global.FormData = class {
  constructor() {
    this.data = new Map()
  }
  append(key, value) {
    this.data.set(key, value)
  }
  get(key) {
    return this.data.get(key)
  }
  has(key) {
    return this.data.has(key)
  }
}

global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn()
}

// Mock do IntersectionObserver
global.IntersectionObserver = class {
  observe() { return null }
  unobserve() { return null }
  disconnect() { return null }
}