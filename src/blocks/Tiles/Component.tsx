import { cn } from 'src/utilities/cn'
import React from 'react'
import RichText from '@/components/RichText'

import type { Page } from '@/payload-types'

import { CMSLink } from '../../components/Link'
import { ImageMedia } from '@/components/Media/ImageMedia'

type Props = Extract<Page['layout'][0], { blockType: 'tiles' }>

export const TilesBlock: React.FC<
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
      // id={props.blockName || undefined}
      className={cn(
        'pt-14 ',
        {
          'bg-card': changeBackground,
        },
        {
          'mt-14': addMarginTop,
        },
        {
          'mb-14': addMarginBottom,
        },
      )}
    >
      <div className="container">
        {heading && (
          <RichText
            // className={cn(
            //   'md:px-[17.3%] pt-9 ',
            //   {
            //     'hidden ': heading.root.direction === null,
            //   },
            //   {
            //     'pb-7 md:pb-14 ': heading.root.direction !== null && columns && columns.length > 0,
            //   },
            // )}
            content={heading}
            enableGutter={false}
          />
        )}
        <div
        // className={`grid grid-cols-4 lg:grid-cols-12 gap-7 ${columns && columns.length > 0 ? 'md:gap-14 pb-14 ' : ''}`}
        >
          {/* {columns &&
            columns.length > 0 &&
            columns.map((col, index) => {
              const {
                enableLink,
                enableMedia,
                link,
                richText,
                richTextEnd,
                noPaddingRichTextEnd,
                size,
                media,
              } = col

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
                      className={`${richText.root.direction !== null ? '' : 'hidden'}`}
                      content={richText}
                      enableGutter={false}
                      styleLink={true}
                    />
                  )}
                  {enableLink && <CMSLink {...link} />}
                  {enableMedia && <ImageMedia resource={media} />}
                  {richTextEnd && (
                    <RichText
                      className={cn(
                        {
                          'hidden ': richTextEnd.root.direction === null,
                        },
                        {
                          'md:py-0 ': noPaddingRichTextEnd,
                        },
                        {
                          'mt-7': enableMedia,
                        },
                        {
                          'mt-3 ': noPaddingRichTextEnd && enableMedia,
                        },
                      )}
                      content={richTextEnd}
                      enableGutter={false}
                    />
                  )}
                </div>
              )
            })} */}
        </div>
      </div>
    </div>
  )
}
