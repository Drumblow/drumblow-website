import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getAllProjects } from "@/lib/projetos/loader"

export default async function Home() {
  const projects = await getAllProjects()
  const featured = projects.slice(0, 3)

  return (
    <>
      <section className="relative py-32">
        <div className="container flex flex-col items-center text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold max-w-3xl">
            Software de produção com excelência técnica
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl">
            Rust para sistemas críticos, Flutter para apps cross-platform e Next.js para experiências web modernas. Cases reais em produção.
          </p>
          
          <div className="flex gap-4">
            <Link href="/projetos">
              <Button size="lg">Ver Projetos Realizados</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">Fale Conosco</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold">Trabalhos em produção</h2>
              <p className="text-muted-foreground mt-2">Projetos entregues com código de alto nível e integrações reais.</p>
            </div>
            <Link href="/projetos">
              <Button variant="outline">Ver todos</Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featured.map((project) => (
              <Link key={project.slug} href={`/projetos/${project.slug}`} className="block bg-white p-8 rounded-lg border hover:shadow-sm transition">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full border ${project.status === 'Ativo' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-muted-foreground line-clamp-3">{project.description}</p>
                <div className="mt-6 text-sm text-primary">Ver case →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para construir algo excepcional?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Vamos conversar sobre seu próximo projeto de software.
          </p>
          <Link href="/contact">
            <Button size="lg">Iniciar conversa</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
