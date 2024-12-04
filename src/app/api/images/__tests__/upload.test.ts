import { POST } from '../upload/route'

describe('Image Upload API', () => {
  let mockFormData: FormData

  beforeEach(() => {
    mockFormData = new FormData()
  })

  const mockRequest = (file: File) => {
    const formDataMock = {
      get: jest.fn().mockReturnValue(file),
    }

    return {
      formData: jest.fn().mockResolvedValue(formDataMock),
    } as unknown as Request
  }

  it('validates file upload correctly', async () => {
    const file = new File(
      [Buffer.from('test image content')],
      'test.jpg',
      { type: 'image/jpeg' }
    )

    const request = mockRequest(file)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ success: true })
  })

  it('rejects invalid files', async () => {
    const file = new File(
      ['invalid content'],
      'test.exe',
      { type: 'application/exe' }
    )

    const request = mockRequest(file)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBeTruthy()
  })
})
