'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

function ErrorContent({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container py-32 text-center">
      <h1 className="text-4xl font-bold mb-4">Algo deu errado!</h1>
      <p className="text-xl mb-8">
        {error.message || 'Ocorreu um erro inesperado'}
      </p>
      <div className="space-x-4">
        <Button onClick={() => reset()}>Tentar Novamente</Button>
        <Link href="/">
          <Button variant="outline">Voltar para Home</Button>
        </Link>
      </div>
    </div>
  )
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorContent error={error} reset={reset} />
        </Suspense>
      </body>
    </html>
  )
}