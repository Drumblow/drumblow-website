'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface Screenshot {
  src: string
  alt: string
  caption?: string
}

interface ScreenshotGalleryProps {
  screenshots: Screenshot[]
  title?: string
}

export default function ScreenshotGallery({ screenshots, title = "Screenshots" }: ScreenshotGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (!screenshots || screenshots.length === 0) return null

  const openLightbox = (index: number) => setSelectedIndex(index)
  const closeLightbox = () => setSelectedIndex(null)
  const goPrev = () => setSelectedIndex(i => (i! - 1 + screenshots.length) % screenshots.length)
  const goNext = () => setSelectedIndex(i => (i! + 1) % screenshots.length)

  const selected = selectedIndex !== null ? screenshots[selectedIndex] : null

  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {screenshots.map((shot, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            aria-label={`Ver imagem ampliada: ${shot.alt}`}
            className="group relative aspect-video overflow-hidden rounded-lg border bg-muted hover:border-primary transition"
          >
            <Image 
              src={shot.src} 
              alt={shot.alt} 
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {shot.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 text-left z-10">
                {shot.caption}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Simple lightbox */}
      {selected && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <button 
              onClick={closeLightbox}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300 z-10"
            >
              ✕
            </button>

            <div className="relative w-full h-[70vh]">
              <Image 
                src={selected.src} 
                alt={selected.alt} 
                fill
                className="object-contain rounded-lg shadow-2xl"
                sizes="100vw"
              />
            </div>

            {selected.caption && (
              <p className="text-center text-white/80 mt-3 text-sm">{selected.caption}</p>
            )}

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={goPrev} className="text-white border-white/30 hover:bg-white/10">
                ← Anterior
              </Button>
              <span className="text-white/60 self-center text-sm">
                {selectedIndex! + 1} / {screenshots.length}
              </span>
              <Button variant="outline" onClick={goNext} className="text-white border-white/30 hover:bg-white/10">
                Próximo →
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
