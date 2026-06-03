import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TechBadge } from './TechBadge'
import { motion } from 'framer-motion'
import { Analytics } from '@/lib/analytics/customEvents'

interface Project {
  title: string
  description: string
  slug: string
  stacks: string[]
  status: 'Ativo' | 'Arquivado'
  liveUrl?: string
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div 
      className="rounded-lg border p-8 flex flex-col h-full"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold">{project.title}</h2>
        <span className={`text-xs px-2 py-1 rounded-full border shrink-0 ${project.status === 'Ativo' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
          {project.status}
        </span>
      </div>

      <p className="text-muted-foreground mb-6 flex-1">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {project.stacks.slice(0, 5).map((stack) => (
          <TechBadge key={stack} tech={stack} />
        ))}
      </div>

      <div className="flex gap-3 mt-auto">
        <Link 
          href={`/projetos/${project.slug}`}
          onClick={() => Analytics.trackEvent('project_viewed', { slug: project.slug, title: project.title, source: 'list' })}
        >
          <Button>Ver detalhes</Button>
        </Link>
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">Ver live</Button>
          </a>
        )}
      </div>
    </motion.div>
  )
}
