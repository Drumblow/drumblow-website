'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AnimatedHero() {
  return (
    <motion.section 
      className="relative py-32"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container flex flex-col items-center text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold max-w-3xl">
          Software de produção com excelência técnica
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl">
          Rust para sistemas críticos, Flutter para apps cross-platform e Next.js para experiências web modernas. Cases reais em produção.
        </p>
        
        <div className="flex gap-4">
          <Link href="/projetos">
            <Button size="lg">Ver Projetos Realizados</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg">Fale Conosco</Button>
          </Link>
        </div>
      </div>
    </motion.section>
  )
}
