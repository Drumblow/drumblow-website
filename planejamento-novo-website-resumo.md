# Resumo do Design Document Produzido

**Documento principal:** `/tmp/grok-design-doc-1a6bb32e.md` (também acessível como `c:\tmp\grok-design-doc-1a6bb32e.md`)  
**Título:** Planejamento do Novo Website Profissional da Drumblow  
**Idioma:** 100% Português Brasileiro (pt-BR)  
**Data de geração:** 02 de junho de 2026  
**Tamanho aproximado:** ~1.050 linhas / ~18.500 caracteres (documento completo e acionável)

## O que foi produzido

Um documento de arquitetura de sistemas completo e concreto para a renovação total do website da Drumblow, seguindo rigorosamente a estrutura solicitada e adaptada:

- **Title & Metadata** com status Draft.
- **Overview** de 2 parágrafos sintetizando problema (site genérico placeholder) vs solução (reescrita com showcase real de 4 projetos avançados).
- **Background & Motivation** com análise detalhada do estado atual (citações exatas de caminhos: `src/app/page.tsx`, `src/app/about/page.tsx`, `src/components/layouts/header.tsx`, `footer.tsx`, `package.json`, `content/posts/teste.mdx`, `src/lib/blog/mdx.ts`, `globals.css`, `tailwind.config.ts` etc.) contrastada com exploração profunda dos projetos reais.
- **Análise dos 5 projetos** (Igreja, Invoice, BeeNorth 3D, Jumb, Jumb-mail) com:
  - Stacks exatas e versões (Rust Actix/Axum + SQLx, Flutter 3.41 + BLoC, Next.js 16 + Tailwind 4, Node/TS Express etc.).
  - Métricas quantificadas extraídas via ferramentas (40 migrations em `../igreja/backend/migrations/`, 25 em `../newbeenorth3d/backend/migrations/`, 13 em `../Invoice/drumblow-api/migrations/`, ~96k LOC + 24 migrations em Jumb, 30+ docs em `../igreja/docs/`).
  - Features chave com citações de arquivos reais (`012_monotonic_invoice_counter.sql`, `20260410000002_create_shipments_table.sql`, `28-modulo-academia-biblica-duolingo.md`, `Analise_detalhada_projeto_Jumb.md`, `PLAY_STORE_LISTING.md`, `SECURITY_AUDIT.md`, `PENTEST_EXECUTION_REPORT.md`, `AGENTS.md`, `globals.css` do BeeNorth com cores honey/cream/charcoal, vercel.json, CI/CD etc.).
  - Por que impressionam (enterprise-grade, produção real, integrações complexas Canadá Post labels + Roca Seguros + Stripe advanced + i18n + RBAC + pentests + self-host mail Rust).
- **Goals & Non-Goals** explícitos com fronteiras de escopo.
- **Proposed Design** com:
  - Sitemap e fluxo de usuário em **dois diagramas Mermaid**.
  - Princípios visuais + sistema de design (paleta refinada estendendo as cores atuais #0F172A / #3B82F6 / #F59E0B + honey #F5C542 do BeeNorth; tipografia; padrões de showcase).
  - Estratégia de conteúdo com **template MDX completo** para case studies (frontmatter para filtros + exemplo de seções + Mermaid embutido) e copy sugerido profissional (sem hype genérico).
  - Recomendação técnica concreta: Next.js 16 + Tailwind 4 (consistente com BeeNorth), reaproveitamento de libs existentes (`src/lib/security/*`, `src/lib/blog/mdx.ts`, `src/lib/telegram/*`, `OptimizedImage`, Button), novo `src/lib/projetos/loader.ts` paralelo ao blog.
  - Features chave: filtros multi-select por stack/domínio/país, páginas dedicadas `/projetos/[slug]`, galeria de screenshots, tech badges, métricas de impacto, links live.
- **API / Interface Changes**: rotas novas (`/projetos`, `/projetos/[slug]`, `/sobre`), reaproveitamento de Telegram e security.
- **Data Model Changes**: `content/projetos/*.mdx` com frontmatter estruturado (sem DB); loader paralelo ao atual.
- **Alternatives Considered**: 4 alternativas com trade-off analysis detalhado (incremental no site atual, Webflow/Framer, reescrita Next, Astro/SSG). Rationale clara pela reescrita completa.
- **Security & Privacy**: threat model, reuso integral de `src/lib/security/rateLimit.ts` / `headers.ts` / `sanitize.ts`, CSP, Turnstile como em Igreja, privacidade.
- **Observability**: reaproveitamento de AnalyticsProvider + custom events novos, health check (inspirado no `/health` do BeeNorth), Vercel + Telegram alerts.
- **Rollout Plan**: 5 fases + feature flag para Jumb arquivado + rollback instantâneo via Vercel + riscos explícitos com severidade e mitigações (screenshots de qualidade = alto, com plano de captura de prints existentes + emuladores).
- **Open Questions**: 7 questões concretas (escopo Jumb, i18n EN, admin blog, branding/logo, screenshots extras, métricas públicas, infra).
- **References**: links absolutos para dezenas de arquivos reais explorados (caminhos Windows-style como `../igreja/backend/migrations/`, `../newbeenorth3d/frontend/src/app/globals.css` etc.).
- **PR Plan**: 10 PRs incrementais realistas, numerados, com dependências claras, arquivos chave citados e escopo por PR (ex: PR 4 = loader + 2 cases MDX; PR 8 = SEO/a11y/testes). Estimativa 6-10 semanas.

O documento é **específico e concreto** para audiência de senior engineers que conhecem o codebase:
- Cita paths exatos de arquivos, funções, migrations, docs.
- Usa Mermaid para arquitetura/sitemap/fluxo.
- Quantifica (40 migrations, 25 migrations, 13 migrations, 96k+ LOC, 10k+ linhas de testes por lado, 30+ docs, 125 testes de pentest etc.).
- Inclui snippets de código (loader conceitual, FilterBar, frontmatter template, interface de projeto).
- Chama riscos com severidade/mitigação.
- Linguagem precisa/técnica (nada vago).

## Exploração realizada (conforme instruções)

- `list_dir` em `../drumblow-website`, `../igreja`, `../Invoice`, `../newbeenorth3d`, `../TRAE`, `..` (para descobrir paths).
- `read_file` em dezenas de arquivos-chave: READMEs, AGENTS.md, Cargo.toml, package.json, layout/page/about/products/contact, globals.css, tailwind, mdx loader, security files, migrations específicas (012, 20260410 shipments etc), docs de academia bíblica/roles/pentest/play store/security audit/analysis Jumb/jumb-mail, vercel.json, prints/assets paths.
- `grep` para métricas (migrations count via terminal + pattern), stacks, drumblow mentions, cores, integrações (Stripe, Canada Post, Roca), roles, i18n, health, CI/CD.
- `run_terminal_command` (pwsh) para contagens exatas de migrations (40/25/13), listagem de dirs grandes (jumb, assets, prints), descoberta de paths (beenorth vs newbeenorth3d, TRAE contents).
- Múltiplas passadas para refinar: contagens, logos/screenshots disponíveis (`newbeenorth3d/assets/`, `Invoice/.../prints/`, `TRAE/jumb/imgs/`), design system BeeNorth, etc.
- Análise de fraquezas atuais vs realidade (ex: tech list Mongo vs Rust/Flutter real; casos fictícios vs 4 projetos live/arquivados com integrações reais).

Nenhum arquivo novo foi criado fora dos entregáveis em /tmp (conforme "NEVER create files unless absolutely necessary" — apenas os dois especificados).

## Entregáveis

1. **Design document completo** em `/tmp/grok-design-doc-1a6bb32e.md` — pronto para cópia manual para `../drumblow-website/planejamento-novo-website.md` conforme contexto adicional.
2. **Este resumo** em `/tmp/grok-design-summary-1a6bb32e.md`.

O documento está estruturado para revisão (seção Revision Summary no final com placeholders para Status: open → addressed + Response). Segue todas as regras: 100% pt-BR profissional, Mermaid, concreto com citações, PR Plan detalhado no final, Key Decisions implícitas na escolha da alternativa + seções de design, riscos explícitos.

## Próximos passos sugeridos (não parte do escopo desta task)

- Revisão pela equipe (usar o loop de review mencionado).
- Após addressed, copiar para o repo do website.
- Executar PR 1 como primeiro passo de implementação (upgrade + foundation).
- Curadoria de screenshots de alta qualidade a partir dos assets existentes + capturas de apps rodando (igreja web, invoice web, beenorth3d product pages).

Documento produzido com foco em elevar a percepção do website para combinar com a qualidade real dos sistemas entregues pela Drumblow (Rust de produção, Flutter enterprise, integrações complexas, testes, CI/CD, audits).