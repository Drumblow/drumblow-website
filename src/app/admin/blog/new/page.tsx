'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

export default function NewPost() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    tags: '',
    published: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Criar slug a partir do título
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          slug,
          title: formData.title,
          content: formData.content,
          metadata: {
            description: formData.description,
            tags: formData.tags.split(',').map(tag => tag.trim()),
            published: formData.published,
            author: 'default-author' // Temporário
          }
        })
      })

      if (response.ok) {
        router.push('/admin/blog')
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Novo Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-2">
            Título
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData(prev => ({ 
              ...prev, 
              title: e.target.value 
            }))}
            className="w-full rounded-md border border-input px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Descrição
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={e => setFormData(prev => ({ 
              ...prev, 
              description: e.target.value 
            }))}
            className="w-full rounded-md border border-input px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Tags (separadas por vírgula)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={e => setFormData(prev => ({ 
              ...prev, 
              tags: e.target.value 
            }))}
            className="w-full rounded-md border border-input px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Conteúdo (Markdown)
          </label>
          <textarea
            value={formData.content}
            onChange={e => setFormData(prev => ({ 
              ...prev, 
              content: e.target.value 
            }))}
            rows={10}
            className="w-full rounded-md border border-input px-3 py-2 font-mono"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={e => setFormData(prev => ({ 
              ...prev, 
              published: e.target.checked 
            }))}
          />
          <label htmlFor="published" className="text-sm font-medium">
            Publicar imediatamente
          </label>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Post'}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => router.push('/admin/blog')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}