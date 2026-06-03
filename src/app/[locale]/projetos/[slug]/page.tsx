import { notFound } from 'next/navigation'
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { getProject } from '@/lib/projetos/loader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ScreenshotGallery from '@/components/projetos/ScreenshotGallery'
import ProjectViewTracker from '@/components/projetos/ProjectViewTracker'
import CaseContent from '@/components/projetos/CaseContent'

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params
  const project = await getProject(slug)
  const t = await getTranslations({ locale, namespace: "Projects" })

  if (!project) {
    return { title: t("meta_title") }
  }

  const metaData: Metadata = {
    title: `${project.meta.title} | Drumblow`,
    description: project.meta.description,
  }
  if (project.meta.liveUrl) {
    metaData.openGraph = {
      title: project.meta.title,
      description: project.meta.description,
      url: project.meta.liveUrl,
    } as Metadata['openGraph']
  }
  return metaData
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = await getProject(slug)
  const t = await getTranslations("Projects")

  if (!project) {
    notFound()
  }

  const { meta, content } = project

  const statusLabel = meta.status === 'Ativo' ? 'Active' : 'Archived'

  return (
    <div className="container py-16">
      <div className="mb-8">
        <Link href="/projetos" className="text-sm text-muted-foreground hover:underline">
          ← {t("back_to_projects")}
        </Link>
      </div>

      <div className="max-w-4xl">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold">{meta.title}</h1>
          <span className={`text-xs px-3 py-1 rounded-full border ${meta.status === 'Ativo' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
            {statusLabel}
          </span>
        </div>

        <p className="text-xl text-muted-foreground mb-8">{meta.description}</p>

        <ProjectViewTracker slug={meta.slug} title={meta.title} />

        <div className="flex flex-wrap gap-2 mb-8">
          {meta.stacks.map((s) => (
            <span key={s} className="text-sm bg-muted px-3 py-1 rounded">{s}</span>
          ))}
          <span className="text-sm px-3 py-1 rounded border">{meta.country}</span>
        </div>

        {/* JSON-LD for rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: meta.title,
              description: meta.description,
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web, Android, iOS",
              offers: {
                "@type": "Offer",
                availability: "https://schema.org/InStock",
              },
              url: meta.liveUrl,
            }),
          }}
        />

        {meta.liveUrl && (
          <div className="mb-12">
            <a href={meta.liveUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg">{t("live_project")} →</Button>
            </a>
          </div>
        )}

        <CaseContent content={content} />

        {meta.metrics && (
          <div className="mt-12 pt-8 border-t">
            <h3 className="font-semibold mb-4">{t("metrics")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(meta.metrics).map(([key, value]) => (
                <div key={key} className="p-4 border rounded">
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-sm text-muted-foreground capitalize">{key}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Screenshot Gallery - populated for projects where we have real assets */}
        {(['beenorth-3d', 'invoice', 'jumb'].includes(meta.slug)) && (
          <div className="mt-12 pt-8 border-t">
            <ScreenshotGallery
              title="Screenshots and real project prints"
              screenshots={
                meta.slug === 'beenorth-3d'
                  ? [
                      { src: '/assets/logos/LogobeeNorthTransparente.png', alt: 'Logo BeeNorth', caption: 'Official transparent logo' },
                      { src: '/assets/logos/logoBeeNorthComfundo.jpeg', alt: 'Logo with background', caption: 'Version with background' },
                      { src: '/assets/logos/logoVersaoHorizontalTransparente.png', alt: 'Horizontal logo', caption: 'Horizontal version' },
                    ]
                  : meta.slug === 'invoice'
                  ? [
                      { src: '/assets/cases/invoice/drumblow_feature_graphic_1024x500.png', alt: 'Feature graphic', caption: 'Play Store feature graphic' },
                      { src: '/assets/cases/invoice/hero-composite.png', alt: 'Web hero', caption: 'Main web interface' },
                      { src: '/assets/cases/invoice/mobile-invoices.jpeg', alt: 'Mobile invoices', caption: 'Invoice list on mobile' },
                      { src: '/assets/cases/invoice/mobile-invoice-detail.jpeg', alt: 'Mobile invoice detail', caption: 'Invoice detail' },
                      { src: '/assets/cases/invoice/mobile-settings.jpeg', alt: 'Mobile settings', caption: 'Settings screen' },
                    ]
                  : meta.slug === 'jumb'
                  ? [
                      { src: '/assets/cases/jumb/Registration & Login.jpg', alt: 'Login', caption: 'Registration and login screen' },
                      { src: '/assets/cases/jumb/Explore Activities Map.jpg', alt: 'Map', caption: 'Explore activities on map' },
                      { src: '/assets/cases/jumb/Activity Details.jpg', alt: 'Details', caption: 'Activity details' },
                      { src: '/assets/cases/jumb/User Profile.jpg', alt: 'Profile', caption: 'User profile' },
                      { src: '/assets/cases/jumb/Chat.jpg', alt: 'Chat', caption: 'Chat interface' },
                    ]
                  : []
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}
