export default function AboutPage() {
    return (
      <div className="container py-16">
        <h1 className="text-4xl font-bold mb-8">Sobre Nós</h1>
        
        <div className="grid gap-16">
          <section>
            <h2 className="text-2xl font-bold mb-4">Nossa História</h2>
            <p className="text-lg text-muted-foreground">
              A Drumblow FabricApps nasceu da visão de criar soluções inovadoras que transformam a maneira como as empresas operam no mundo digital.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-bold mb-4">Valores</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <h3 className="text-xl font-semibold mb-2">Inovação</h3>
                <p className="text-muted-foreground">Buscamos constantemente novas formas de resolver desafios complexos.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Excelência</h3>
                <p className="text-muted-foreground">Comprometimento com a qualidade em tudo que fazemos.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Colaboração</h3>
                <p className="text-muted-foreground">Trabalhamos juntos para alcançar resultados extraordinários.</p>
              </div>
            </div>
          </section>
  
          <section>
            <h2 className="text-2xl font-bold mb-4">Tecnologias</h2>
            <div className="grid gap-4 md:grid-cols-4">
              {["Next.js", "TypeScript", "Node.js", "MongoDB"].map((tech) => (
                <div key={tech} className="p-4 rounded-lg border text-center">
                  {tech}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    )
  }