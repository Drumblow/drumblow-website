import { Post } from './types'

export function searchPosts(posts: Post[], query: string): Post[] {
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
