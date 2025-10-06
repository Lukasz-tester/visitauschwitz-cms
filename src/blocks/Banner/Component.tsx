import type { BannerBlock as BannerBlockProps } from 'src/payload-types'
import React from 'react'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  return (
    <>
      {style === 'text' && (
        <div>
          <RichText className="my-6" content={content} enableGutter={false} />
        </div>
      )}
      {style === 'quote' && (
        <div className="py-8 lg:py-2">
          <div className="py-4 flex rounded bg-card">
            <div className="text-6xl md:text-7xl font-serif ml-5 md:ml-7 mr-3">“</div>
            <div>
              <RichText content={content} className="px-3" />
            </div>
          </div>
        </div>
      )}
      {style === 'emphasis' && (
        <div className="rounded border p-4 pb-5 my-5 font-semibold">
          <div>
            <RichText
              className="text-xl opacity-90 place-self-center"
              enableProse={false}
              enableGutter={false}
              content={content}
            />
          </div>
        </div>
      )}
    </>
  )
}
