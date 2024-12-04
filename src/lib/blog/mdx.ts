import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkHtml from 'remark-html'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { Post } from './types'
import { calculateReadingTime } from './utils'

const postsDirectory = path.join(process.cwd(), 'content/posts')
const authorsDirectory = path.join(process.cwd(), 'content/authors')

async function markdownToHtml(content: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkHtml)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .process(content)
  
  return result.toString()
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    
    const { data, content } = matter(fileContents)
    const author = JSON.parse(
      fs.readFileSync(
        path.join(authorsDirectory, `${data.author}.json`),
        'utf8'
      )
    )

    const htmlContent = await markdownToHtml(content)

    return {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      author,
      content: htmlContent,
      tags: data.tags || [],
      published: data.published ?? false,
      featured: data.featured ?? false,
      readingTime: calculateReadingTime(content),
      seo: {
        title: data.seo?.title || data.title,
        description: data.seo?.description || data.description,
        keywords: data.seo?.keywords || data.tags,
        ogImage: data.seo?.ogImage
      }
    }
  } catch (error) {
    console.error(`Error getting post ${slug}:`, error)
    return null
  }
}