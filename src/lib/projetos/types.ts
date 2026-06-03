import { MDXRemoteSerializeResult } from 'next-mdx-remote'

export interface ProjectMeta {
  title: string
  description: string
  slug: string
  stacks: string[]
  domains: string[]
  country: 'Brasil' | 'Canadá' | 'Internacional'
  status: 'Ativo' | 'Arquivado'
  liveUrl?: string
  metrics?: {
    migrations?: number
    linesOfCode?: number
    tests?: number
    [key: string]: number | string | undefined
  }
  date?: string
}

export interface ProjectContent {
  meta: ProjectMeta
  mdxSource: MDXRemoteSerializeResult
}

export interface ProjectFrontmatter {
  title: string
  description: string
  stacks: string[]
  domains: string[]
  country: 'Brasil' | 'Canadá' | 'Internacional'
  status: 'Ativo' | 'Arquivado'
  liveUrl?: string
  metrics?: Record<string, number | string>
  date?: string
}
