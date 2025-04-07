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
                'pb-14': heading.root.direction !== null && columns && columns.length > 0,
              },
              {
                hidden: heading.root.direction === null,
              },
            )}
            content={heading}
            enableGutter={false}
          />
        )}
        <div
          className={`grid grid-cols-4 lg:grid-cols-12 gap-6 md:gap-14 ${changeBackground ? 'pb-14' : 'mb-14'}`}
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
                      'md:col-span-2':
                        size !== 'full' && size !== 'twoThirds' && size !== 'oneThird',
                    },
                    {
                      'col-span-4 md:col-span-2 lg:col-span-6 xl:col-span-4': size === 'oneThird',
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
                          'prose-a:bg-card': changeBackground,
                        },
                        {
                          'mb-6': richText.root.direction !== null && enableMedia,
                        },
                        {
                          'pb-1 md:pb-0': richText.root.direction !== null,
                        },
                        {
                          hidden: richText.root.direction === null,
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
                          'mt-4': enableMedia,
                        },
                        {
                          hidden: richTextEnd.root.direction === null,
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
