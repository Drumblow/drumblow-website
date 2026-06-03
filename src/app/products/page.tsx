import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ProductsPage() {
  return (
    <div className="container py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Nossos Produtos</h1>
      <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
        Nossa vitrine de soluções agora está em <strong>Projetos Realizados</strong>, com cases detalhados e links para sistemas em produção.
      </p>
      
      <Link href="/projetos">
        <Button size="lg">Ver Projetos Realizados →</Button>
      </Link>

      <div className="mt-12 text-sm text-muted-foreground">
        Ou entre em contato para soluções customizadas.
      </div>
    </div>
  )
}