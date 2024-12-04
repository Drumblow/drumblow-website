// src/app/admin/blog/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Post } from '@/lib/blog/types'

export default function BlogAdmin() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (slug: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return

    try {
      const response = await fetch(`/api/blog/posts?slug=${slug}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchPosts()
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  if (loading) return <div className="p-8">Carregando...</div>

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Blog</h1>
        <Link href="/admin/blog/new">
          <Button>Novo Post</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <div 
            key={post.slug}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-sm text-muted-foreground">
                {new Date(post.date).toLocaleDateString('pt-BR')}
                {' • '}
                {post.author.name}
              </p>
              <div className="flex gap-2 mt-2">
                {post.tags.map(tag => (
                  <span 
                    key={tag}
                    className="bg-secondary/10 text-secondary-foreground px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Link href={`/blog/${post.slug}`}>
                <Button variant="outline" size="sm">
                  Visualizar
                </Button>
              </Link>
              <Link href={`/admin/blog/edit/${post.slug}`}>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </Link>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => deletePost(post.slug)}
                className="text-red-500 hover:text-red-700"
              >
                Excluir
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}