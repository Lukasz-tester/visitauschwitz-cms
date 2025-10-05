'use client'

import type { StaticImageData } from 'next/image'
import NextImage from 'next/image'
import React from 'react'
import { cn } from 'src/utilities/cn'
import type { Props as MediaProps } from '../types'

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
  } = props

  const [isLoading, setIsLoading] = React.useState(true)

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''

  if (!src && resource && typeof resource === 'object') {
    const { alt: altFromResource, filename, height: h, width: w } = resource

    width = w ?? undefined
    height = h ?? undefined
    alt = altFromResource

    // Serve WebP from Cloudflare R2
    const webpFilename = filename?.replace(/\.(jpg|jpeg)$/i, '.webp')
    src = `${process.env.NEXT_PUBLIC_CF_R2_URL}${webpFilename}`
  }

  if (!alt) console.warn('ImageMedia rendered without alt text:', src)

  const sizes =
    sizeFromProps ||
    `
    (max-width: 768px) 100vw,
    (max-width: 1024px) 100vw,
    (max-width: 1440px) 90vw,
    1440px
  `.trim()

  return (
    <NextImage
      alt={alt || ''}
      className={cn(imgClassName)}
      fill={fill}
      height={!fill ? height : undefined}
      width={!fill ? width : undefined}
      onClick={onClick}
      onLoad={() => {
        setIsLoading(false)
        if (typeof onLoadFromProps === 'function') onLoadFromProps()
      }}
      priority={priority}
      quality={50}
      sizes={sizes}
      src={src}
      loading={priority ? 'eager' : 'lazy'}
      unoptimized={true}
    />
  )
}
