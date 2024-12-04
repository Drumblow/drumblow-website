import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProductsPage() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold mb-8">Nossos Produtos</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-lg border p-8">
          <h2 className="text-2xl font-bold mb-4">ConnectCorp Hub</h2>
          <p className="text-muted-foreground mb-4">
            Plataforma integrada para gestão corporativa, oferecendo soluções completas para empresas modernas.
          </p>
          <Link href="/products/connectcorp-hub">
            <Button>Saiba Mais</Button>
          </Link>
        </div>

        <div className="rounded-lg border p-8">
          <h2 className="text-2xl font-bold mb-4">Soluções Customizadas</h2>
          <p className="text-muted-foreground mb-4">
            Desenvolvimento de soluções personalizadas para atender às necessidades específicas do seu negócio.
          </p>
          <Link href="/contact">
            <Button>Entre em Contato</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}