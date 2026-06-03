'use client'

import { useEffect } from 'react'
import { Analytics } from '@/lib/analytics/customEvents'

interface ProjectViewTrackerProps {
  slug: string
  title: string
}

export default function ProjectViewTracker({ slug, title }: ProjectViewTrackerProps) {
  useEffect(() => {
    Analytics.trackEvent('project_viewed', {
      slug,
      title,
      timestamp: new Date().toISOString(),
    })
  }, [slug, title])

  return null
}
