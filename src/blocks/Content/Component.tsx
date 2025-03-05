import { cn } from 'src/utilities/cn'
import React from 'react'
import RichText from '@/components/RichText'

import type { Page } from '@/payload-types'

import { ImageMedia } from '@/components/Media/ImageMedia'

type Props = Extract<Page['layout'][0], { blockType: 'content' }>

export const ContentBlock: React.FC<
  {
    id?: string
  } & Props
> = (props) => {
  const { columns, heading, changeBackground, addMarginTop, addMarginBottom, addPaddingBottom } =
    props

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
        'pt-14 ',
        {
          'bg-card-foreground': changeBackground,
        },
        {
          'mt-14': addMarginTop,
        },
        {
          'mb-14': addMarginBottom,
        },
        {
          'pb-14': addPaddingBottom,
        },
        {
          // no heading and 4 or more columns
          'pt-24': heading?.root.direction === null && columns && columns.length > 3,
        },
      )}
    >
      <div className="container">
        {heading && (
          <RichText
            className={cn(
              'md:px-[17.3%] pt-10 ',
              {
                'hidden ': heading.root.direction === null,
              },
              {
                'pb-7 md:pb-14 ': heading.root.direction !== null && columns && columns.length > 0,
              },
            )}
            content={heading}
            enableGutter={false}
          />
        )}
        <div
          className={`grid grid-cols-4 lg:grid-cols-12 gap-8 md:gap-14 ${changeBackground ? 'pb-14' : 'mb-14'}`}
        >
          {columns &&
            columns.length > 0 &&
            columns.map((col, index) => {
              const { enableMedia, richText, richTextEnd, size, media } = col

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
                      className={cn(
                        '',
                        {
                          'mb-4 md:mb-7': richText.root.direction !== null && enableMedia,
                        },
                        {
                          hidden: richText.root.direction === null,
                        },
                        {
                          'prose-a:bg-card': changeBackground,
                        },
                      )}
                      content={richText}
                      enableGutter={false}
                      styleLink={true}
                    />
                  )}
                  {enableMedia && <ImageMedia imgClassName="rounded" resource={media} />}
                  {richTextEnd && (
                    <RichText
                      className={cn(
                        {
                          hidden: richTextEnd.root.direction === null,
                        },
                        {
                          'mt-2 ': enableMedia,
                        },
                      )}
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
