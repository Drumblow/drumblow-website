import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkHtml from 'remark-html'
import { Post } from './types'

const postsDirectory = path.join(process.cwd(), 'content/posts')
const authorsDirectory = path.join(process.cwd(), 'content/authors')

async function markdownToHtml(content: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkHtml)
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
      published: data.published ?? false
    }
  } catch (error) {
    console.error(`Error getting post ${slug}:`, error)
    return null
  }
}

export async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const files = fs.readdirSync(postsDirectory)
  const posts = []

  for (const file of files) {
    if (!file.endsWith('.mdx')) continue
    
    const slug = file.replace(/\.mdx$/, '')
    const post = await getPost(slug)
    if (post && post.published) {
      posts.push(post)
    }
  }

  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}