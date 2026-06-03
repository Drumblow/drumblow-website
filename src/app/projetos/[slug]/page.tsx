import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getProject } from '@/lib/projetos/loader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Mermaid from '@/components/projetos/Mermaid'
import ScreenshotGallery from '@/components/projetos/ScreenshotGallery'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    return { title: 'Projeto não encontrado' }
  }

  return {
    title: `${project.meta.title} | Drumblow`,
    description: project.meta.description,
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    notFound()
  }

  const { meta, mdxSource } = project

  return (
    <div className="container py-16">
      <div className="mb-8">
        <Link href="/projetos" className="text-sm text-muted-foreground hover:underline">
          ← Voltar para Projetos
        </Link>
      </div>

      <div className="max-w-4xl">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold">{meta.title}</h1>
          <span className={`text-xs px-3 py-1 rounded-full border ${meta.status === 'Ativo' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
            {meta.status}
          </span>
        </div>

        <p className="text-xl text-muted-foreground mb-8">{meta.description}</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {meta.stacks.map((s) => (
            <span key={s} className="text-sm bg-muted px-3 py-1 rounded">{s}</span>
          ))}
          <span className="text-sm px-3 py-1 rounded border">{meta.country}</span>
        </div>

        {meta.liveUrl && (
          <div className="mb-12">
            <a href={meta.liveUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg">Acessar site em produção →</Button>
            </a>
          </div>
        )}

        <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary">
          <MDXRemote 
            source={mdxSource} 
            components={{
              // Handle mermaid code blocks
              pre: ({ children, ...props }: any) => {
                const child = Array.isArray(children) ? children[0] : children
                if (child?.props?.className === 'language-mermaid') {
                  return <Mermaid chart={child.props.children as string} />
                }
                return <pre {...props}>{children}</pre>
              },
              // Optional: nice code blocks for other languages
              code: ({ className, children, ...props }: any) => {
                if (className === 'language-mermaid') {
                  return null // handled by pre
                }
                return <code className={className} {...props}>{children}</code>
              }
            }}
          />
        </article>

        {meta.metrics && (
          <div className="mt-12 pt-8 border-t">
            <h3 className="font-semibold mb-4">Métricas do projeto</h3>
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
              title="Screenshots e prints reais do projeto"
              screenshots={
                meta.slug === 'beenorth-3d' 
                  ? [
                      { src: '/assets/logos/LogobeeNorthTransparente.png', alt: 'Logo BeeNorth', caption: 'Logo oficial' },
                      { src: '/assets/logos/logoBeeNorthComfundo.jpeg', alt: 'Logo com fundo', caption: 'Versão com fundo' },
                    ]
                  : meta.slug === 'invoice'
                  ? [
                      { src: '/assets/cases/invoice/drumblow_feature_graphic_1024x500.png', alt: 'Feature graphic', caption: 'Play Store feature graphic' },
                      { src: '/assets/cases/invoice/hero-composite.png', alt: 'Web hero', caption: 'Interface web' },
                      { src: '/assets/cases/invoice/mobile-invoices.jpeg', alt: 'Mobile invoices', caption: 'Lista de invoices no mobile' },
                    ]
                  : [
                      { src: '/assets/cases/jumb/Registration & Login.jpg', alt: 'Login', caption: 'Tela de registro e login' },
                      { src: '/assets/cases/jumb/Explore Activities Map.jpg', alt: 'Mapa', caption: 'Exploração de atividades no mapa' },
                      { src: '/assets/cases/jumb/Activity Details.jpg', alt: 'Detalhes', caption: 'Detalhes da atividade' },
                      { src: '/assets/cases/jumb/User Profile.jpg', alt: 'Perfil', caption: 'Perfil do usuário' },
                    ]
              } 
            />
          </div>
        )}
      </div>
    </div>
  )
}
