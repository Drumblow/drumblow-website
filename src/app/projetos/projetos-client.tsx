'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { FilterBar } from '@/components/projetos/FilterBar'
import { ProjectCard } from '@/components/projetos/ProjectCard'
import { Analytics } from '@/lib/analytics/customEvents'

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
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [projects] = useState(initialProjects)

  // Initialize from URL
  const initialStacks = searchParams?.get('stacks') ? searchParams!.get('stacks')!.split(',') : []
  const initialStatus = (searchParams?.get('status') as 'all' | 'Ativo' | 'Arquivado') || 'all'

  const [selectedStacks, setSelectedStacks] = useState<string[]>(initialStacks)
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'Ativo' | 'Arquivado'>(initialStatus)

  const allStacks = Array.from(new Set(projects.flatMap(p => p.stacks))).sort()

  const filtered = projects.filter(p => {
    const stackMatch = selectedStacks.length === 0 || selectedStacks.some(s => p.stacks.includes(s))
    const statusMatch = selectedStatus === 'all' || p.status === selectedStatus
    return stackMatch && statusMatch
  })

  // Sync state to URL
  const updateURL = (stacks: string[], status: string) => {
    const params = new URLSearchParams()
    if (stacks.length > 0) params.set('stacks', stacks.join(','))
    if (status !== 'all') params.set('status', status)
    const query = params.toString()
    const basePath = pathname || '/projetos'
    router.replace(query ? `${basePath}?${query}` : basePath, { scroll: false })
  }

  const toggleStack = (stack: string) => {
    const newStacks = selectedStacks.includes(stack)
      ? selectedStacks.filter(s => s !== stack)
      : [...selectedStacks, stack]
    setSelectedStacks(newStacks)
    updateURL(newStacks, selectedStatus)
    Analytics.trackEvent('filter_changed', { type: 'stack', value: stack, selected: newStacks })
  }

  const handleStatusChange = (status: 'all' | 'Ativo' | 'Arquivado') => {
    setSelectedStatus(status)
    updateURL(selectedStacks, status)
    Analytics.trackEvent('filter_changed', { type: 'status', value: status })
  }

  // Sync from URL on mount / param change (for direct links)
  useEffect(() => {
    const urlStacks = searchParams?.get('stacks') ? searchParams!.get('stacks')!.split(',') : []
    const urlStatus = (searchParams?.get('status') as 'all' | 'Ativo' | 'Arquivado') || 'all'
    if (JSON.stringify(urlStacks) !== JSON.stringify(selectedStacks)) {
      setSelectedStacks(urlStacks)
    }
    if (urlStatus !== selectedStatus) {
      setSelectedStatus(urlStatus)
    }
  }, [searchParams])

  return (
    <>
      <FilterBar
        allStacks={allStacks}
        selectedStacks={selectedStacks}
        onToggleStack={toggleStack}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
      />

      <div className="grid gap-8 md:grid-cols-2">
        {filtered.length === 0 && (
          <p className="text-muted-foreground">Nenhum projeto encontrado com os filtros atuais.</p>
        )}

        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </>
  )
}
