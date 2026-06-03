'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from "next-intl"
import { Search } from 'lucide-react'
import { Post } from '@/lib/blog/types'

function filterPosts(posts: Post[], query: string, activeTag: string | null): Post[] {
  let result = posts

  if (activeTag) {
    result = result.filter(post =>
      post.tags.some(tag => tag.toLowerCase() === activeTag.toLowerCase())
    )
  }

  const searchTerm = query.toLowerCase().trim()
  if (searchTerm) {
    result = result.filter(post => {
      const titleMatch = post.title.toLowerCase().includes(searchTerm)
      const descriptionMatch = post.description.toLowerCase().includes(searchTerm)
      const contentMatch = post.content.toLowerCase().includes(searchTerm)
      const tagMatch = post.tags.some(tag =>
        tag.toLowerCase().includes(searchTerm)
      )
      return titleMatch || descriptionMatch || contentMatch || tagMatch
    })
  }

  return result
}

export default function BlogPage() {
  const t = useTranslations("Blog")
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    setFilteredPosts(filterPosts(allPosts, query, activeTag))
  }, [query, allPosts, activeTag])

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

  const allTags = Array.from(new Set(allPosts.flatMap(p => p.tags))).sort()

  const clearTag = () => {
    setActiveTag(null)
    window.history.replaceState({}, '', '/blog')
  }

  if (loading) {
    return <div className="container py-16 text-center text-gray-400">{t("loading")}</div>
  }

  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">{t("title")}</h1>

        {allTags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="text-sm self-center text-gray-400">{t("tags")}</span>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={`text-xs px-3 py-1 rounded-full border transition ${activeTag === tag ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
              >
                #{tag}
              </button>
            ))}
            {activeTag && (
              <button onClick={clearTag} className="text-xs px-2 py-1 text-gray-400 hover:text-gray-900 transition-colors">{t("clear")}</button>
            )}
          </div>
        )}

        <div className="relative mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search_placeholder")}
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300 transition-colors"
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
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

                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {post.title}
                </h2>

                <p className="text-gray-500">
                  {post.description}
                </p>

                <div className="flex items-center gap-4 text-sm">
                  <time className="text-gray-400">
                    {new Date(post.date).toLocaleDateString('en-US')}
                  </time>

                  <div className="flex gap-2">
                    {post.tags.map(tag => (
                      <button
                        key={tag}
                        onClick={(e) => {
                          e.preventDefault()
                          setActiveTag(tag)
                        }}
                        className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full text-xs hover:bg-orange-100 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              {t("no_results")}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
