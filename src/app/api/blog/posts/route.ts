import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkHtml from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'content/posts')
const authorsDirectory = path.join(process.cwd(), 'content/authors')

async function markdownToHtml(content: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(content)
  
  return result.toString()
}

export async function GET() {
  try {
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true })
    }
    if (!fs.existsSync(authorsDirectory)) {
      fs.mkdirSync(authorsDirectory, { recursive: true })
    }

    const files = fs.readdirSync(postsDirectory)
    const posts = await Promise.all(
      files
        .filter(file => file.endsWith('.mdx'))
        .map(async file => {
          const filePath = path.join(postsDirectory, file)
          const fileContents = fs.readFileSync(filePath, 'utf8')
          const { data, content } = matter(fileContents)
          const htmlContent = await markdownToHtml(content)
          const slug = file.replace(/\.mdx$/, '')

          let author = {
            name: "Admin",
            role: "Editor",
            avatar: "/images/avatar.jpg"
          }

          try {
            author = JSON.parse(
              fs.readFileSync(
                path.join(authorsDirectory, `${data.author}.json`),
                'utf8'
              )
            )
          } catch (e) {
            // Usa o autor padrão se não encontrar o arquivo
          }

          return {
            slug,
            title: data.title,
            description: data.description,
            content: htmlContent,
            date: data.date,
            author,
            tags: data.tags || [],
            published: data.published ?? false
          }
        })
    )

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}
