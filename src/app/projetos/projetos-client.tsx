'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Project = {
  title: string
  description: string
  slug: string
  stacks: string[]
  domains: string[]
  country: string
  status: 'Ativo' | 'Arquivado'
  liveUrl?: string
}

export default function ProjetosClient({ projects: initialProjects }: { projects: Project[] }) {
  const [projects] = useState(initialProjects)
  const [selectedStacks, setSelectedStacks] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'Ativo' | 'Arquivado'>('all')

  const allStacks = Array.from(new Set(projects.flatMap(p => p.stacks))).sort()

  const filtered = projects.filter(p => {
    const stackMatch = selectedStacks.length === 0 || selectedStacks.some(s => p.stacks.includes(s))
    const statusMatch = selectedStatus === 'all' || p.status === selectedStatus
    return stackMatch && statusMatch
  })

  const toggleStack = (stack: string) => {
    setSelectedStacks(prev =>
      prev.includes(stack) ? prev.filter(s => s !== stack) : [...prev, stack]
    )
  }

  return (
    <>
      {/* Filtros */}
      <div className="mb-8 flex flex-wrap gap-4 items-center">
        <div>
          <span className="text-sm font-medium mr-2">Stacks:</span>
          {allStacks.map(stack => (
            <button
              key={stack}
              onClick={() => toggleStack(stack)}
              className={`text-xs mr-2 mb-1 px-3 py-1 rounded-full border ${selectedStacks.includes(stack) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            >
              {stack}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={() => setSelectedStatus('all')} className={`text-sm px-3 py-1 rounded border ${selectedStatus === 'all' ? 'bg-primary text-white' : ''}`}>Todos</button>
          <button onClick={() => setSelectedStatus('Ativo')} className={`text-sm px-3 py-1 rounded border ${selectedStatus === 'Ativo' ? 'bg-green-600 text-white' : ''}`}>Ativos</button>
          <button onClick={() => setSelectedStatus('Arquivado')} className={`text-sm px-3 py-1 rounded border ${selectedStatus === 'Arquivado' ? 'bg-amber-600 text-white' : ''}`}>Arquivados</button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {filtered.length === 0 && (
          <p className="text-muted-foreground">Nenhum projeto encontrado com os filtros atuais.</p>
        )}

        {filtered.map((project) => (
          <div key={project.slug} className="rounded-lg border p-8 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold">{project.title}</h2>
              <span className={`text-xs px-2 py-1 rounded-full border ${project.status === 'Ativo' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                {project.status}
              </span>
            </div>

            <p className="text-muted-foreground mb-6 flex-1">{project.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.stacks.slice(0, 5).map((stack) => (
                <span key={stack} className="text-xs bg-muted px-2 py-1 rounded">{stack}</span>
              ))}
            </div>

            <div className="flex gap-3">
              <Link href={`/projetos/${project.slug}`}>
                <Button>Ver detalhes</Button>
              </Link>
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">Ver live</Button>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
