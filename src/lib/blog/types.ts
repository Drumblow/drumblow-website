export interface Author {
  name: string
  role: string
  avatar: string
}

export interface Post {
  slug: string
  title: string
  description: string
  date: string
  author: Author
  content: string 
  tags: string[]
  published: boolean
}
