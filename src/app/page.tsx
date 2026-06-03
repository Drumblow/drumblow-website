import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getAllProjects } from "@/lib/projetos/loader"
import AnimatedHero from "@/components/home/AnimatedHero"
import AnimatedProjectCards from "@/components/home/AnimatedProjectCards"

export default async function Home() {
  const projects = await getAllProjects()
  const featured = projects.slice(0, 3)

  return (
    <>
      <AnimatedHero />

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
          
          <AnimatedProjectCards featured={featured} />
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
