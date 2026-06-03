This is the professional website for **Drumblow** — a software engineering studio specializing in high-quality production systems using Rust, Flutter, and Next.js.

## Features
- Showcase of real projects: Igreja Manager, BeeNorth 3D, Drumblow Invoice, and Jumb (archived)
- Rich MDX case studies with architecture diagrams (Mermaid)
- Screenshot galleries using real assets from the projects
- Modern design system with Tailwind 4 + custom theme tokens
- SEO optimized (sitemap, JSON-LD, robots.txt)
- Contact form integrated with Telegram

## Project Structure Highlights
- `content/projetos/*.mdx` — Case studies (add new ones following the frontmatter template)
- `src/lib/projetos/loader.ts` — MDX loader for projects (uses next-mdx-remote)
- `src/components/projetos/` — FilterBar, ProjectCard, TechBadge, Mermaid, ScreenshotGallery
- `public/assets/` — Curated logos and screenshots (see Assets Playbook below)

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Assets Playbook
When adding a new case:
1. Copy relevant images to `public/assets/cases/<slug>/`
2. Update the gallery data in `src/app/projetos/[slug]/page.tsx`
3. Add Mermaid diagrams in the MDX file using ```mermaid blocks
4. Reference images with `/assets/...` paths (optimized with next/image in gallery)

Current assets come from the source repos (newbeenorth3d, Invoice, TRAE/jumb).

## Technologies
- Next.js 16 + TypeScript + Tailwind 4
- Framer Motion for micro-interactions
- next-mdx-remote for rich case studies
- Reuses existing libs: security, Telegram chat, analytics

## Deploy
Connected to Vercel. Uses `vercel.json` for security headers.

See the full planning document at `planejamento-novo-website.md` for the complete roadmap.

## Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- Internal planning: `planejamento-novo-website.md` (and resumo)
