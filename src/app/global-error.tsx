'use client'
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-semibold">Algo deu errado!</h2>
            <button
              className="rounded-md bg-primary px-4 py-2 text-sm text-white transition-colors hover:bg-primary/90"
              onClick={() => reset()}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}