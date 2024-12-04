'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

export default function EditPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    tags: '',
    published: false
  })

  useEffect(() => {
    fetchPost()
  }, [])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/posts/${slug}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch post')
      }
      
      const data = await response.json()
      
      setFormData({
        title: data.title || '',
        description: data.description || '',
        content: data.content || '',
        tags: (data.tags || []).join(', '),
        published: data.published || false
      })
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/blog/posts/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: formData.content,
          metadata: {
            title: formData.title,
            description: formData.description,
            tags: formData.tags.split(',').map(tag => tag.trim()),
            published: formData.published
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update post')
      }

      router.push('/admin/blog')
    } catch (error) {
      console.error('Error updating post:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8">Carregando...</div>

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Editar Post</h1>

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
            Publicado
          </label>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Atualizar Post'}
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