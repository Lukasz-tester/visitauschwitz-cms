import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { ImageMedia } from '@/components/Media/ImageMedia'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  return (
    <div className="relative -mt-[10.4rem] flex items-end text-white">
      <div className="container mb-8 z-10 relative">
        <div className="max-w-[37rem]">
          {richText && (
            <RichText
              className="mb-4 px-3 pt-4 pb-5 md:p-5 rounded-xl md:prose-p:text-2xl bg-gradient-to-tr 
              from-slate-500 from-5% via-slate-800 via-40% to-75%"
              content={richText}
              enableGutter={false}
              styleH1={true}
            />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex pl-2 md:pl-4 gap-4 mb-3">
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
              className="absolute pointer-events-none left-0 bottom-0 w-full h-full
               bg-gradient-to-b
            from-5% from-background via-30% via-transparent 
            dark:via-transparent dark:to-background"
            />
          </React.Fragment>
        )}
      </div>
    </div>
  )
}
