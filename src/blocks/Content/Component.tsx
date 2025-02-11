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
  const { columns, heading, changeBackground, addMarginTop, addMarginBottom } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
    oneSixth: '2',
  }

  return (
    <div // each content block receives unique id = blockName
      id={props.blockName || undefined}
      className={cn(
        {
          'bg-card': changeBackground,
        },
        {
          'mt-20': addMarginTop,
        },
        {
          'mb-20': addMarginBottom,
        },
      )}
    >
      <div className="container py-12">
        {heading && (
          <RichText
            className={`md:px-[17.3%] ${heading?.root?.direction !== null ? 'pb-11' : ''}`}
            content={heading}
            enableGutter={false}
          />
        )}
        <div
          className={`grid grid-cols-4 lg:grid-cols-12 md:gap-12 gap-y-6 ${columns && columns.length > 0 ? 'mb-11' : ''}`}
        >
          {columns &&
            columns.length > 0 &&
            columns.map((col, index) => {
              const { enableLink, enableMedia, link, richText, richTextEnd, size, media } = col

              return (
                <div
                  className={cn(
                    `col-span-4 lg:col-span-${colsSpanClasses[size!]}`,
                    {
                      'md:col-span-2': size !== 'full' && size !== 'twoThirds',
                    },
                    {
                      'hidden lg:block': size === 'oneSixth',
                    },
                  )}
                  key={index}
                >
                  {richText && (
                    <RichText
                      className={`${richText.root.direction !== null ? 'pb-4' : ''}`}
                      content={richText}
                      enableGutter={false}
                    />
                  )}
                  {enableLink && <CMSLink className="mb-4" {...link} />}
                  {enableMedia && <ImageMedia resource={media} />}
                  {richTextEnd && (
                    <RichText
                      className={`${richTextEnd.root.direction !== null ? 'pt-6 pb-2' : ''}`}
                      content={richTextEnd}
                      enableGutter={false}
                    />
                  )}
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
