import { z } from 'zod'

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
  content: string
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

export const ProjectFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  stacks: z.array(z.string()),
  domains: z.array(z.string()),
  country: z.enum(['Brasil', 'Canadá', 'Internacional']),
  status: z.enum(['Ativo', 'Arquivado']),
  liveUrl: z.string().optional(),
  metrics: z.record(z.union([z.number(), z.string()])).optional(),
  date: z.string().optional(),
})
