'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Analytics } from '@/lib/analytics/customEvents'

type Project = {
  title: string
  description: string
  slug: string
  status: 'Ativo' | 'Arquivado'
}

export default function AnimatedProjectCards({ featured }: { featured: Project[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {featured.map((project, index) => (
        <motion.div
          key={project.slug}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link 
            href={`/projetos/${project.slug}`} 
            className="block bg-white p-8 rounded-lg border hover:shadow-lg transition-all"
            onClick={() => Analytics.trackEvent('project_viewed', { slug: project.slug, title: project.title, source: 'home' })}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{project.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full border ${project.status === 'Ativo' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                {project.status}
              </span>
            </div>
            <p className="text-muted-foreground line-clamp-3">{project.description}</p>
            <div className="mt-6 text-sm text-primary">Ver case →</div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
