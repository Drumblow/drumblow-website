export default function AboutPage() {
    return (
      <div className="container py-16">
        <h1 className="text-4xl font-bold mb-8">Sobre a Drumblow</h1>
        
        <div className="grid gap-16">
          <section>
            <h2 className="text-2xl font-bold mb-4">Quem somos</h2>
            <p className="text-lg text-muted-foreground">
              Desenvolvemos software de alto nível para domínios complexos. Backends em Rust para performance e segurança, apps cross-platform em Flutter e web moderna com Next.js. Nossos projetos estão em produção atendendo igrejas, negócios canadenses e plataformas de e-commerce/logística.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-bold mb-4">Nossa abordagem</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <h3 className="text-xl font-semibold mb-2">Qualidade em produção</h3>
                <p className="text-muted-foreground">Testes extensivos, CI/CD, auditorias de segurança, migrations bem documentadas e deploys confiáveis (Oracle, Vercel, Docker).</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Tecnologia certa</h3>
                <p className="text-muted-foreground">Rust para sistemas críticos, Flutter para UIs consistentes em múltiplas plataformas, Next.js para experiências web de alto desempenho.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Transparência</h3>
                <p className="text-muted-foreground">Documentação detalhada, código limpo e cases reais com métricas e links para os sistemas em produção.</p>
              </div>
            </div>
          </section>
  
          <section>
            <h2 className="text-2xl font-bold mb-4">Tecnologias principais</h2>
            <div className="grid gap-4 md:grid-cols-4">
              {["Rust (Axum / Actix)", "Flutter (mobile + web)", "Next.js 16 + TypeScript", "PostgreSQL + Stripe + integrações"].map((tech) => (
                <div key={tech} className="p-4 rounded-lg border text-center text-sm">
                  {tech}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    )
  }