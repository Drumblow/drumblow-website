'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Post } from '@/lib/blog/types'

function searchPosts(posts: Post[], query: string): Post[] {
  const searchTerm = query.toLowerCase().trim()
  
  if (!searchTerm) return posts

  return posts.filter(post => {
    const titleMatch = post.title.toLowerCase().includes(searchTerm)
    const descriptionMatch = post.description.toLowerCase().includes(searchTerm)
    const contentMatch = post.content.toLowerCase().includes(searchTerm)
    const tagMatch = post.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm)
    )

    return titleMatch || descriptionMatch || contentMatch || tagMatch
  })
}

export default function BlogPage() {
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    setFilteredPosts(searchPosts(allPosts, query))
  }, [query, allPosts])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts')
      const data = await response.json()
      setAllPosts(data)
      setFilteredPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container py-16 text-center">Carregando...</div>
  }

  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        
        <div className="relative mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar posts..."
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:border-primary"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="space-y-12">
          {filteredPosts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block space-y-3">
                <div className="flex items-center gap-2">
                  <div className="text-sm">
                    <span className="font-medium">{post.author.name}</span>
                    <p className="text-muted-foreground">{post.author.role}</p>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold group-hover:text-primary">
                  {post.title}
                </h2>
                
                <p className="text-muted-foreground">
                  {post.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm">
                  <time className="text-muted-foreground">
                    {new Date(post.date).toLocaleDateString('pt-BR')}
                  </time>
                  
                  <div className="flex gap-2">
                    {post.tags.map(tag => (
                      <span 
                        key={tag}
                        className="bg-secondary/10 text-secondary-foreground px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum post encontrado para esta busca.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}