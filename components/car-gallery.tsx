"use client"

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

interface GalleryProps {
  images: { id: string; image_url: string }[]
  mainImageUrl: string
  carName: string
}

export function CarGallery({ images, mainImageUrl, carName }: GalleryProps) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  // Tüm resimleri birleştir (Ana resim + galeridekiler)
  const allImages = [
    { src: mainImageUrl },
    ...images.filter(img => img.image_url !== mainImageUrl).map(img => ({ src: img.image_url }))
  ]

  const openLightbox = (idx: number) => {
    setIndex(idx)
    setOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* ANA GÖRSEL */}
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200 cursor-pointer group"
        onClick={() => openLightbox(0)}
      >
        {mainImageUrl ? (
          <Image
            src={mainImageUrl}
            alt={carName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">Görsel Yok</div>
        )}
      </div>

      {/* KÜÇÜK GÖRSELLER */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {allImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx)}
              className="relative aspect-square overflow-hidden rounded-xl border bg-white shadow-sm cursor-pointer group"
            >
              <Image
                src={img.src}
                alt={`${carName} - ${idx}`}
                fill
                className="object-cover transition-opacity group-hover:opacity-80"
              />
            </div>
          ))}
        </div>
      )}

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={allImages}
      />
    </div>
  )
}