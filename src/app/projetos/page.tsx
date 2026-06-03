import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getAllProjects } from '@/lib/projetos/loader'
import ProjetosClient from './projetos-client'

export const metadata = {
  title: 'Projetos | Drumblow',
  description: 'Trabalhos realizados pela Drumblow: sistemas enterprise em Rust + Flutter e e-commerces modernos com Next.js.',
}

export default async function ProjetosPage() {
  const projects = await getAllProjects()

  return (
    <div className="container py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Projetos Realizados</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Soluções de software de produção, construídas com Rust para backends críticos, Flutter para experiências cross-platform e Next.js para web de alto desempenho.
        </p>
      </div>

      <ProjetosClient projects={projects} />
    </div>
  )
}

