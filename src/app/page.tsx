import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <>
      <section className="relative py-32">
        <div className="container flex flex-col items-center text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold max-w-3xl">
            Transformando ideias em soluções digitais
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl">
            Desenvolvemos soluções inovadoras para impulsionar a transformação digital da sua empresa
          </p>
          
          <div className="flex gap-4">
            <Link href="/products">
              <Button size="lg">Conheça Nossos Produtos</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">Fale Conosco</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Casos de Sucesso
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "ConnectCorp Hub",
                description: "Plataforma integrada de gestão empresarial que revolucionou a forma de trabalhar."
              },
              {
                title: "Automação de Processos",
                description: "Redução de 60% no tempo de processamento de dados com nossas soluções."
              },
              {
                title: "Transformação Digital",
                description: "Implementação completa de estratégia digital para empresas tradicionais."
              }
            ].map((case_) => (
              <div key={case_.title} className="bg-white p-8 rounded-lg border">
                <h3 className="text-xl font-bold mb-4">{case_.title}</h3>
                <p className="text-muted-foreground">{case_.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Vamos construir juntos a solução ideal para sua empresa
          </p>
          <Link href="/contact">
            <Button size="lg">Começar Agora</Button>
          </Link>
        </div>
      </section>
    </>
  )
}