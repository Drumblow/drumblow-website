export interface Author {
    name: string
    image: string
    role: string
  }
  
  export interface BlogPost {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string
    author: Author
    tags: string[]
    publishDate: Date
    status: 'draft' | 'published'
    seo: {
      title: string
      description: string
      keywords: string[]
    }
  }