'use client'

import { useEffect, useRef } from 'react'

interface MermaidProps {
  chart: string
}

export default function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderMermaid = async () => {
      if (!containerRef.current) return

      try {
        // Dynamic import to avoid SSR issues
        const mermaid = (await import('mermaid')).default

        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            primaryColor: '#0F172A',
            primaryTextColor: '#fff',
            primaryBorderColor: '#3B82F6',
            lineColor: '#64748b',
            secondaryColor: '#F59E0B',
            tertiaryColor: '#f1f5f9',
          },
          securityLevel: 'loose',
        })

        // Clear previous content
        containerRef.current.innerHTML = ''

        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        
        const { svg } = await mermaid.render(id, chart)
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch (error) {
        console.error('Mermaid render error:', error)
        if (containerRef.current) {
          containerRef.current.innerHTML = `<pre class="text-red-500 text-xs overflow-auto">${chart}</pre>`
        }
      }
    }

    renderMermaid()
  }, [chart])

  return (
    <div 
      ref={containerRef} 
      className="my-6 flex justify-center bg-white dark:bg-slate-950 p-4 rounded-lg border overflow-x-auto"
    />
  )
}
