import sharp from 'sharp'
import { v2 as cloudinary } from 'cloudinary'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validar tamanho
    if (file.size > 5 * 1024 * 1024) { // 5MB
      return new Response(
        JSON.stringify({ error: 'File too large' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Processar imagem
    const buffer = await file.arrayBuffer()
    const optimizedBuffer = await sharp(Buffer.from(buffer))
      .resize(2048, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({ quality: 80 })
      .toBuffer()

    // Upload para Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'drumblow-website',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) {
            reject(error)
            return
          }
          resolve(result)
        }
      )

      uploadStream.end(optimizedBuffer)
    })

    const result = await uploadPromise as any

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: result.secure_url 
      }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Upload error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process image',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}