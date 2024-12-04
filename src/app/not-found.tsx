'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

function NotFoundContent() {
  return (
    <div className="container py-32 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-4 mb-8">Página não encontrada</p>
      <Link href="/">
        <Button>Voltar para Home</Button>
      </Link>
    </div>
  )
}

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  )
}