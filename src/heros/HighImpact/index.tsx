'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { ImageMedia } from '@/components/Media/ImageMedia'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  return (
    <div className="relative -mt-[10.4rem] flex items-end text-white">
      <div className="container mb-8 z-10 relative">
        <div className="max-w-[34rem]">
          {richText && (
            <RichText
              className="mb-4 px-3 py-2  text-white rounded 
              md:prose-h1:text-6xl lg:prose-p:text-xl lg:prose-h1:text-7xl
              from-slate-500 via-slate-700 via-25% bg-gradient-to-tr to-85%"
              content={richText}
              enableGutter={false}
            />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex gap-4 mb-3">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="min-h-screen select-none">
        {media && typeof media === 'object' && (
          <React.Fragment>
            <ImageMedia fill imgClassName="-z-1000 object-cover" priority resource={media} />
            <div
              className="absolute pointer-events-none left-0 bottom-0 w-full h-full bg-gradient-to-b
            from-white via-35% via-transparent 
            dark:from-black dark:from-0% dark:via-transparent dark:to-black"
            />
          </React.Fragment>
        )}
      </div>
    </div>
  )
}
