'use client'

import React from 'react'
import type { Page } from '@/payload-types'
import type { StaticImageData } from 'next/image'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

type Props = Extract<Page['layout'][0], { blockType: 'mediaBlock' }> & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  id?: string
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const { images } = props

  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [startX, setStartX] = React.useState<number | null>(null)

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)

  // Auto slide
  React.useEffect(() => {
    const timer = setInterval(nextSlide, 7000)
    return () => clearInterval(timer)
  }, [])

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => setStartX(e.touches[0].clientX)
  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX === null) return
    const deltaX = e.touches[0].clientX - startX
    if (deltaX > 50) prevSlide()
    if (deltaX < -50) nextSlide()
    setStartX(null)
  }

  // Mouse drag support
  const handleMouseDown = (e: React.MouseEvent) => setStartX(e.clientX)
  const handleMouseUp = (e: React.MouseEvent) => {
    if (startX === null) return
    const deltaX = e.clientX - startX
    if (deltaX > 50) prevSlide()
    if (deltaX < -50) nextSlide()
    setStartX(null)
  }

  // Keyboard support
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide()
      if (e.key === 'ArrowLeft') prevSlide()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div
      className="overflow-hidden items-center self-center select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="h-[50vh] md:h-[90vh] flex items-end justify-center">
        {images.map((image, i) => {
          const { id, title, link, media } = image
          return (
            <Link
              key={id}
              href={link!}
              className={`absolute ease-in-out transition-opacity duration-1000 ${
                currentSlide !== i ? 'opacity-0' : 'opacity-100 z-10'
              }`}
            >
              <div className="max-w-[50vh] md:max-w-[90vh] items-center">
                <ImageMedia resource={media} imgClassName="rounded-3xl p-3" />
                <div className="absolute m-6 md:m-7 inset-0 bg-transparent flex items-end place-content-center ">
                  {title && (
                    <div className="px-4 pb-2 pt-1.5 text-white/90 bg-gradient-to-tr from-5% from-amber-800/60 via-40% via-slate-800/70 to-transparent to-70% rounded-2xl border border-amber-800/50">
                      <p className="text-xl md:text-3xl text-center font-semibold ">{title}</p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-5 px-2">
        <button
          onClick={prevSlide}
          className="rounded-full p-2 border border-card-accent hover:bg-card"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-amber-700" />
        </button>

        <div className="place-self-center">
          <div className="flex gap-4">
            {images.map((_, i) => (
              <button
                key={i}
                className={`w-5 h-5 rounded-full border border-card-accent ${
                  currentSlide === i ? 'scale-125 bg-card' : 'hover:scale-125'
                }`}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={nextSlide}
          className="rounded-full p-2 border border-card-accent hover:bg-card"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-amber-700" />
        </button>
      </div>
    </div>
  )
}

// BELOW VERIONS WITH-OUT SWIPING ON DESKTOP
//  'use client'

// import React from 'react'
// import type { Page } from '@/payload-types'
// import type { StaticImageData } from 'next/image'
// import { ImageMedia } from '@/components/Media/ImageMedia'
// import { ChevronLeft, ChevronRight } from 'lucide-react'

// type Props = Extract<Page['layout'][0], { blockType: 'mediaBlock' }> & {
//   breakout?: boolean
//   captionClassName?: string
//   className?: string
//   enableGutter?: boolean
//   id?: string
//   imgClassName?: string
//   staticImage?: StaticImageData
//   disableInnerContainer?: boolean
// }

// export const MediaBlock: React.FC<Props> = (props) => {
//   const { images } = props

//   const [currentSlide, setCurrentSlide] = React.useState(0)

//   const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length)
//   const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)

//   // Auto slide every 7s
//   React.useEffect(() => {
//     const timer = setInterval(nextSlide, 7000)
//     return () => clearInterval(timer)
//   }, [])

//   // Swipe gesture handlers
//   const [touchStart, setTouchStart] = React.useState(0)
//   const [touchEnd, setTouchEnd] = React.useState(0)

//   const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX)
//   const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.touches[0].clientX)
//   const onTouchEnd = () => {
//     if (touchStart - touchEnd > 50) nextSlide()
//     if (touchEnd - touchStart > 50) prevSlide()
//   }

//   // Keyboard arrow key support
//   React.useEffect(() => {
//     const handleKey = (e: KeyboardEvent) => {
//       if (e.key === 'ArrowRight') nextSlide()
//       if (e.key === 'ArrowLeft') prevSlide()
//     }

//     window.addEventListener('keydown', handleKey)
//     return () => window.removeEventListener('keydown', handleKey)
//   }, [])

//   return (
//     <div
//       className="overflow-hidden items-center self-center"
//       onTouchStart={onTouchStart}
//       onTouchMove={onTouchMove}
//       onTouchEnd={onTouchEnd}
//     >
//       <div className="h-[50vh] md:h-[90vh] flex items-end justify-center">
//         {images.map((image, i) => {
//           const { id, title, link, media } = image
//           return (
//             <a
//               key={id}
//               href={link || undefined}
//               className={`absolute ease-in-out transition-opacity duration-1000 ${
//                 currentSlide !== i ? 'opacity-0' : 'opacity-100 z-10'
//               }`}
//             >
//               <div className="max-w-[50vh] md:max-w-[90vh] items-center">
//                 <ImageMedia resource={media} imgClassName="rounded-3xl p-3" />
//                 <div className="absolute m-6 md:m-7 inset-0 bg-transparent flex items-end place-content-center ">
//                   {title && (
//                     <div className="px-4 pb-2 pt-1.5 text-white/90 bg-gradient-to-tr from-5% from-amber-800/60 via-40% via-slate-800/70 to-transparent to-70% rounded-2xl border border-amber-800/50">
//                       <p className="text-xl md:text-3xl text-center font-semibold ">{title}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </a>
//           )
//         })}
//       </div>

//       {/* Navigation */}
//       <div className="flex justify-center gap-5 px-2">
//         <button
//           onClick={prevSlide}
//           className="rounded-full p-2 border border-card-accent hover:bg-card"
//           aria-label="Previous slide"
//         >
//           <ChevronLeft className="w-6 h-6 text-amber-700" />
//         </button>

//         <div className="place-self-center">
//           <div className="flex gap-4">
//             {images.map((_, i) => (
//               <button
//                 key={i}
//                 className={`w-5 h-5 rounded-full border border-card-accent ${
//                   currentSlide === i ? 'scale-125 bg-card' : 'hover:scale-125'
//                 }`}
//                 onClick={() => setCurrentSlide(i)}
//                 aria-label={`Go to slide ${i + 1}`}
//               />
//             ))}
//           </div>
//         </div>

//         <button
//           onClick={nextSlide}
//           className="rounded-full p-2 border border-card-accent hover:bg-card"
//           aria-label="Next slide"
//         >
//           <ChevronRight className="w-6 h-6 text-amber-700" />
//         </button>
//       </div>
//     </div>
//   )
// }
