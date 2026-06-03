import Link from 'next/link'
import { useTranslations } from "next-intl"
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
  const t = useTranslations("Projects")
  const statusLabel = project.status === 'Ativo' ? t("status_active") : t("status_archived")

  return (
    <motion.div
      className="rounded-2xl border border-gray-100 bg-white p-8 flex flex-col h-full hover:border-orange-200 transition-colors shadow-sm"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
        <span className={`text-xs px-2.5 py-1 rounded-full border shrink-0 font-medium ${project.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
          {statusLabel}
        </span>
      </div>

      <p className="text-gray-500 mb-6 flex-1">{project.description}</p>

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
          <Button>{t("view_details")}</Button>
        </Link>
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">{t("view_live")}</Button>
          </a>
        )}
      </div>
    </motion.div>
  )
}
