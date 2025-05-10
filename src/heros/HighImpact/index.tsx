import React from 'react'

import type { Page } from '@/payload-types'
import RichText from '@/components/RichText'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const HighImpactHero: React.FC<Page['hero']> = React.memo(({ links, media, richText }) => {
  return (
    //Before:
    //  export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
    //   return (
    <div className="relative -mt-[10.4rem] flex items-end text-white min-h-screen pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="container mb-8 z-10 relative">
        <div className="max-w-[32rem]">
          {richText && (
            <RichText
              className="mb-4 mt-28 p-5 rounded-xl md:prose-p:text-2xl prose-p:pt-1 bg-gradient-to-tr 
              from-slate-500 from-5% via-slate-800 via-40% to-75%"
              content={richText}
              enableGutter={false}
              styleH1={true}
            />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex flex-wrap pl-2 md:pl-4 gap-4 mb-3">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <Button variant={link.appearance}>
                      {link.url && <Link href={link.url}>{link.label}</Link>}
                    </Button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      {media && typeof media === 'object' && (
        <React.Fragment>
          <ImageMedia
            fill
            imgClassName="-z-1000 object-cover select-none overflow-hidden"
            priority
            resource={media}
            size="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1440px"
          />
          <div
            className="absolute pointer-events-none left-0 bottom-0 w-full h-full
               bg-gradient-to-b from-5% from-background via-30% via-transparent dark:via-transparent dark:to-background select-none"
          />
        </React.Fragment>
      )}
    </div>
  )
})
