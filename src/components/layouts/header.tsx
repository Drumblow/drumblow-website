import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
          <img src="/drumblow-logo.png" alt="Drumblow" className="h-8 w-auto" />
          Drumblow
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/projetos" className="text-sm font-medium hover:text-primary/80">
            Projetos
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary/80">
            Sobre Nós
          </Link>
          <Link href="/blog" className="text-sm font-medium hover:text-primary/80">
            Blog
          </Link>
          <Link href="/contact">
            <Button>Contato</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}