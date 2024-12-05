import { POST } from '../upload/route'
import { CloudinaryService } from '@/lib/cdn/storage'

jest.mock('@/lib/cdn/storage', () => ({
  CloudinaryService: {
    uploadFile: jest.fn().mockResolvedValue({
      secure_url: 'https://res.cloudinary.com/djc3smoxw/image/upload/test.jpg'
    })
  }
}))

describe('Image Upload API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('validates file upload correctly', async () => {
    const file = new File(
      [Buffer.from('test image content')],
      'test.jpg',
      { type: 'image/jpeg' }
    )

    const formData = new FormData()
    formData.append('file', file)

    const request = new Request('http://localhost/api/upload', {
      method: 'POST',
      body: formData
    })

    const response = await POST(request)
    expect(response.status).toBe(400) // Esperamos status 400 quando houver erro

    const data = await response.json()
    expect(data.success).toBe(false)
    expect(data.error).toBeDefined()
  })
})