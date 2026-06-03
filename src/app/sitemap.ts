import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://drumblow.com' // update if different domain

  const staticRoutes = [
    '',
    '/projetos',
    '/about',
    '/contact',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic project routes (we can hardcode the known slugs or fetch)
  const projectSlugs = [
    'igreja-manager',
    'beenorth-3d',
    'invoice',
    'jumb',
  ]

  const projectRoutes = projectSlugs.map((slug) => ({
    url: `${baseUrl}/projetos/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.9,
  }))

  return [...staticRoutes, ...projectRoutes]
}
