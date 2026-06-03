import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { z } from 'zod'
import { ProjectContent, ProjectMeta, ProjectFrontmatter, ProjectFrontmatterSchema } from './types'

const projectsDirectory = path.join(process.cwd(), 'content/projetos')

export async function getProject(slug: string): Promise<ProjectContent | null> {
  try {
    if (!fs.existsSync(projectsDirectory)) {
      return null
    }
    const fullPath = path.join(projectsDirectory, `${slug}.mdx`)
    if (!fs.existsSync(fullPath)) {
      return null
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const parsedMeta = ProjectFrontmatterSchema.parse(data) as ProjectFrontmatter

    const projectMeta: ProjectMeta = {
      title: parsedMeta.title,
      description: parsedMeta.description,
      slug,
      stacks: parsedMeta.stacks || [],
      domains: parsedMeta.domains || [],
      country: parsedMeta.country,
      status: parsedMeta.status,
      liveUrl: parsedMeta.liveUrl,
      metrics: parsedMeta.metrics,
      date: parsedMeta.date,
    }

    return {
      meta: projectMeta,
      content,
    }
  } catch (error) {
    console.error(`Error getting project ${slug}:`, error)
    return null
  }
}

export async function getAllProjects(): Promise<ProjectMeta[]> {
  if (!fs.existsSync(projectsDirectory)) {
    return []
  }

  const files = fs.readdirSync(projectsDirectory)
  const projects: ProjectMeta[] = []

  for (const file of files) {
    if (!file.endsWith('.mdx')) continue

    const slug = file.replace(/\.mdx$/, '')
    const project = await getProject(slug)
    if (project) {
      projects.push(project.meta)
    }
  }

  return projects.sort((a, b) => {
    // Prioritize Ativo, then by date desc if available
    if (a.status !== b.status) {
      return a.status === 'Ativo' ? -1 : 1
    }
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    return a.title.localeCompare(b.title)
  })
}
