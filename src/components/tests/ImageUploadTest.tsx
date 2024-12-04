// src/components/tests/ImageUploadTest.tsx
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"

export function ImageUploadTest() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; url?: string; error?: string; details?: string } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setResult(data)
    } catch (error) {
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed',
        details: 'Check console for more details'
      })
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto border rounded-lg space-y-4">
      <h2 className="text-xl font-bold">Teste de Upload de Imagem</h2>
      
      <div className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm"
        />
        
        {file && (
          <div className="text-sm">
            Arquivo selecionado: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            <br />
            Tipo: {file.type}
          </div>
        )}

        <Button 
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? 'Enviando...' : 'Enviar Imagem'}
        </Button>

        {result && (
          <div className={`p-4 rounded ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
            {result.success ? (
              <div className="space-y-2">
                <div className="text-green-600">Upload realizado com sucesso!</div>
                <img 
                  src={result.url} 
                  alt="Uploaded" 
                  className="max-w-full rounded"
                />
                <div className="text-xs break-all">
                  URL: {result.url}
                </div>
              </div>
            ) : (
              <div className="text-red-600">
                <div>Erro: {result.error}</div>
                {result.details && (
                  <div className="text-sm mt-2 text-red-500">
                    {result.details}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}