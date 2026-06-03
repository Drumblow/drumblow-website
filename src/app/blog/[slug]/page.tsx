import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Post } from '@/lib/blog/types'

interface Props {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/blog/posts/${slug}`, {
      next: { revalidate: 3600 }
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    return { title: 'Post não encontrado' }
  }

  return {
    title: post.title,
    description: post.description,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container py-16 max-w-3xl mx-auto">
      <Link href="/blog" className="text-sm text-muted-foreground hover:underline mb-8 inline-block">
        ← Voltar para o Blog
      </Link>

      <article>
        <header className="mb-12">
          <div className="flex items-center gap-3 text-sm mb-4">
            <span className="font-medium">{post.author?.name || 'Drumblow'}</span>
            <span className="text-muted-foreground">•</span>
            <time className="text-muted-foreground">
              {new Date(post.date).toLocaleDateString('pt-BR')}
            </time>
          </div>

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <p className="text-xl text-muted-foreground mb-6">{post.description}</p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Link 
                  key={tag} 
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="bg-secondary/10 text-secondary-foreground px-3 py-1 rounded-full text-sm hover:bg-secondary/20"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        <div 
          className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: post.content || '' }} 
        />
      </article>

      <div className="mt-16 pt-8 border-t">
        <Link href="/blog" className="text-primary hover:underline">
          ← Ver todos os posts
        </Link>
      </div>
    </div>
  )
}