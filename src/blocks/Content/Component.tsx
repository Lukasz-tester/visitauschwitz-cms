import { cn } from 'src/utilities/cn'
import React from 'react'
import RichText from '@/components/RichText'

import type { Page } from '@/payload-types'

import { CMSLink } from '../../components/Link'
import { ImageMedia } from '@/components/Media/ImageMedia'

type Props = Extract<Page['layout'][0], { blockType: 'content' }>

export const ContentBlock: React.FC<
  {
    id?: string
  } & Props
> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }
  // each content block receives unique id = blockName
  return (
    <div className="container my-16" id={props.blockName || undefined}>
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, enableMedia, link, richText, richTextEnd, size, media } = col

            return (
              <div
                className={cn(` mt-10 col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                  'md:col-span-2': size !== 'full',
                })}
                key={index}
              >
                <div className="">
                  {richText && (
                    <RichText
                      className="md:prose-h2:text-4xl prose-h2:mt-1"
                      content={richText}
                      enableGutter={false}
                    />
                  )}

                  {enableLink && <CMSLink className="mb-4" {...link} />}
                  {enableMedia && <ImageMedia resource={media} />}
                  {richTextEnd && (
                    <RichText className="mt-3" content={richTextEnd} enableGutter={false} />
                  )}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
