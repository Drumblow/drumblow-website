'use client'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold">Algo deu errado!</h2>
        <button onClick={() => reset()}>Tentar novamente</button>
      </div>
    </div>
  )
}