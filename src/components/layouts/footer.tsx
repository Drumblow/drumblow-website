import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold mb-4">Drumblow FabricApps</h3>
          <p className="text-sm text-muted-foreground">
            Soluções modernas para empresas modernas
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Produtos</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/products/connectcorp-hub" className="text-sm hover:text-primary">
                ConnectCorp Hub
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Empresa</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="text-sm hover:text-primary">
                Sobre Nós
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-sm hover:text-primary">
                Blog
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Contato</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/contact" className="text-sm hover:text-primary">
                Fale Conosco
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container py-6 border-t">
        <p className="text-sm text-center text-muted-foreground">
          © {new Date().getFullYear()} Drumblow FabricApps. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}