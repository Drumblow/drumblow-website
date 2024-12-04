'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"

export default function WebhookTestPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testWebhook = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/telegram/test', {
        headers: {
          'ngrok-skip-browser-warning': '1'
        }
      })
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-16">
      <h1 className="text-3xl font-bold mb-8">Telegram Webhook Test</h1>

      <Button 
        onClick={testWebhook}
        disabled={loading}
        className="mb-8"
      >
        {loading ? 'Testando...' : 'Testar Webhook'}
      </Button>

      {results && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Resultados:</h2>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}