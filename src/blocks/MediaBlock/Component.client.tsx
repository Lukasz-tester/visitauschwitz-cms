'use client'

import React from 'react'
import type { Page } from '@/payload-types'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = Extract<Page['layout'][0], { blockType: 'mediaBlock' }> & {
  // className?: string
  id?: string
}

export const MediaBlock: React.FC<Props> = (props) => {
  const { images } = props

  const [currentSlide, setCurrentSlide] = React.useState(0)

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)

  React.useEffect(() => {
    const timer = setInterval(nextSlide, 7000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="overflow-hidden items-center self-center ">
      <div className="h-[50vh] md:h-[80vh] flex items-end justify-center">
        {images.map((image, i) => {
          const { id, title, link, media } = image
          return (
            <a
              key={id}
              href={link || undefined}
              className={`absolute ease-in-out transition-opacity duration-1000 ${currentSlide !== i ? 'opacity-0' : 'opacity-100 z-10'}`}
            >
              <div className="max-w-[50vh] md:max-w-[80vh] items-center">
                <ImageMedia resource={media} imgClassName="rounded-3xl p-3" />
                <div className="absolute m-6 md:m-7 inset-0 bg-transparent flex items-end place-content-center ">
                  {title && (
                    <div className="px-4 pb-2 pt-1.5 text-white/90 bg-gradient-to-tr from-5% from-amber-800/60 via-40% via-slate-800/70  to-transparent to-70% rounded-2xl border border-amber-800/50">
                      <p className="text-xl md:text-3xl text-center font-semibold ">{title}</p>
                    </div>
                  )}
                </div>
              </div>
            </a>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-5 px-2">
        <button
          onClick={prevSlide}
          className="rounded-full p-2 border border-card-accent hover:bg-card"
        >
          <ChevronLeft className="w-6 h-6 text-amber-700" />
        </button>

        <div className="place-self-center">
          <div className="flex gap-4">
            {images.map((_, i) => (
              <button
                key={i}
                className={`
                w-5 h-5 rounded-full border border-card-accent
                ${currentSlide === i ? 'scale-125 bg-card ' : ' hover:scale-125'}
              `}
                onClick={() => setCurrentSlide(i)}
              />
            ))}
          </div>
        </div>

        <button
          onClick={nextSlide}
          className="rounded-full p-2 border border-card-accent hover:bg-card"
        >
          <ChevronRight className="w-6 h-6 text-amber-700" />
        </button>
      </div>
    </div>
  )
}
