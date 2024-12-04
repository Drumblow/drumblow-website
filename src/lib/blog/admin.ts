import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export async function createPost(
  slug: string,
  title: string,
  content: string,
  metadata: any
) {
  const frontmatter = {
    title,
    date: new Date().toISOString(),
    ...metadata
  }

  const fileContent = matter.stringify(content, frontmatter)
  const filePath = path.join(postsDirectory, `${slug}.mdx`)

  fs.writeFileSync(filePath, fileContent)
}

export async function updatePost(
  slug: string,
  content: string,
  metadata: any
) {
  const filePath = path.join(postsDirectory, `${slug}.mdx`)
  const currentContent = fs.readFileSync(filePath, 'utf8')
  const { data: currentFrontmatter } = matter(currentContent)

  const updatedFrontmatter = {
    ...currentFrontmatter,
    ...metadata,
    updatedAt: new Date().toISOString()
  }

  const fileContent = matter.stringify(content, updatedFrontmatter)
  fs.writeFileSync(filePath, fileContent)
}

export async function deletePost(slug: string) {
  const filePath = path.join(postsDirectory, `${slug}.mdx`)
  fs.unlinkSync(filePath)
}
