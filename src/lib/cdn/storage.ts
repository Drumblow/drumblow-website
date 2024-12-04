import { v2 as cloudinary } from 'cloudinary'
import { cloudinaryConfig } from './config'
import { CloudinaryUploadResult } from './types'

export class CloudinaryService {
  private static sanitizeFileName(fileName: string): string {
    return fileName
      .toLowerCase()
      .replace(/\s+/g, '-') // substitui espaços por hífens
      .replace(/[^a-z0-9-]/g, '') // remove caracteres especiais
      .replace(/-+/g, '-') // substitui múltiplos hífens por um único
      .replace(/^-+|-+$/g, '') // remove hífens do início e fim
  }

  static async uploadFile(
    file: Buffer, 
    options = {}
  ): Promise<CloudinaryUploadResult> {
    const fileName = (options as any).public_id || 'unnamed'
    const sanitizedName = this.sanitizeFileName(fileName)

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: cloudinaryConfig.folder,
            resource_type: 'auto',
            ...options,
            public_id: sanitizedName
          },
          (error, result) => {
            if (error) return reject(error)
            if (!result) return reject(new Error('No result from Cloudinary'))
            resolve(result)
          }
        )
        .end(file)
    })
  }
}