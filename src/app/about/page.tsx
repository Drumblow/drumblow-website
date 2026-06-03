export default function AboutPage() {
    return (
      <div className="container py-16">
        <h1 className="text-4xl font-bold mb-8">Sobre a Drumblow</h1>
        
        <div className="grid gap-16">
          <section>
            <h2 className="text-2xl font-bold mb-4">Quem somos</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Desenvolvemos software de alto nível para domínios complexos. Backends em Rust para performance e segurança, apps cross-platform em Flutter e web moderna com Next.js. Nossos projetos estão em produção atendendo igrejas, negócios canadenses e plataformas de e-commerce/logística.
            </p>
            <p className="text-muted-foreground">
              A Drumblow nasceu da necessidade de entregar sistemas robustos, bem documentados e com foco em qualidade real — não apenas protótipos. Trabalhamos com tecnologias que priorizam confiabilidade em produção.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-bold mb-4">Nossa abordagem de engenharia</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <h3 className="text-xl font-semibold mb-2">Qualidade em produção</h3>
                <p className="text-muted-foreground">
                  Testes extensivos (unit, integration, contract), CI/CD com GitHub Actions, auditorias de segurança (pentests com 125+ testes no Invoice), migrations bem documentadas (40+ em Igreja, 25 em BeeNorth3D, 13 em Invoice, 31 em Jumb) e deploys confiáveis (Oracle ARM Free Tier, Vercel, Docker).
                </p>
                <p className="text-xs mt-2 text-muted-foreground">Citando: <code>../igreja/backend/migrations/</code>, <code>../newbeenorth3d/backend/migrations/</code>, <code>../Invoice/drumblow-api/migrations/</code></p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Tecnologia certa para o problema</h3>
                <p className="text-muted-foreground">
                  Rust (Axum/Actix-Web + SQLx) para sistemas críticos de missão (performance, segurança, tipagem forte). Flutter para UIs consistentes e mantíveis em múltiplas plataformas (Android, iOS, Web, Desktop). Next.js 16 para experiências web modernas e e-commerces de alto desempenho.
                </p>
                <p className="text-xs mt-2 text-muted-foreground">Exemplos reais: <code>../igreja/backend/src/</code> (Actix), <code>../newbeenorth3d/backend/src/</code> (Axum + Canada Post), <code>../TRAE/jumb/lib/</code> (Flutter + Node/TS)</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Transparência e documentação</h3>
                <p className="text-muted-foreground">
                  Documentação detalhada (30+ arquivos em Igreja/docs/, AGENTS.md, SECURITY_ADVISORIES, planos de testes), código limpo e cases reais com métricas, links para sistemas em produção e prints reais.
                </p>
              </div>
            </div>
          </section>
  
          <section>
            <h2 className="text-2xl font-bold mb-6">Métricas agregadas dos projetos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-6 border rounded-lg bg-muted/30">
                <div className="text-4xl font-bold text-primary">78+</div>
                <div className="text-sm text-muted-foreground mt-1">Migrations SQL</div>
                <div className="text-xs mt-2">40 Igreja • 25 BeeNorth3D • 13 Invoice • 31 Jumb</div>
              </div>
              <div className="p-6 border rounded-lg bg-muted/30">
                <div className="text-4xl font-bold text-primary">20k+</div>
                <div className="text-sm text-muted-foreground mt-1">Linhas de testes</div>
                <div className="text-xs mt-2">Jest + Flutter widget/contract tests</div>
              </div>
              <div className="p-6 border rounded-lg bg-muted/30">
                <div className="text-4xl font-bold text-primary">96k</div>
                <div className="text-sm text-muted-foreground mt-1">LOC aproximado (Jumb)</div>
                <div className="text-xs mt-2">+ Flutter full cross-platform</div>
              </div>
              <div className="p-6 border rounded-lg bg-muted/30">
                <div className="text-4xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground mt-1">Idiomas suportados</div>
                <div className="text-xs mt-2">pt-BR, en, es (Igreja)</div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Pentests e auditorias: 125+ testes (Invoice) + 21 vulnerabilidades tratadas. Integrações reais: Stripe, Canada Post (labels), Roca Seguros, Cloudinary, Firebase, Google Maps, OAuth.
            </div>
          </section>
  
          <section>
            <h2 className="text-2xl font-bold mb-4">Tecnologias principais</h2>
            <div className="grid gap-4 md:grid-cols-4">
              {[
                "Rust (Axum / Actix-Web + SQLx)",
                "Flutter (mobile + web + desktop)",
                "Next.js 16 + TypeScript + Tailwind 4",
                "PostgreSQL • Stripe • Canada Post • integrações"
              ].map((tech) => (
                <div key={tech} className="p-4 rounded-lg border text-center text-sm hover:bg-muted transition">
                  {tech}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Infra: Docker, GitHub Actions CI/CD, Oracle Cloud (ARM Free Tier), Vercel. Self-hosting avançado (Stalwart Mail para Jumb).
            </p>
          </section>
        </div>
      </div>
    )
  }