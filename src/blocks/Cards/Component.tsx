import { cn } from 'src/utilities/cn'
import React from 'react'
import RichText from '@/components/RichText'

import type { Page } from '@/payload-types'

import { CMSLink } from '../../components/Link'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { Icon } from 'lucide-react'

type Props = Extract<Page['layout'][0], { blockType: 'cards' }>

export const CardsBlock: React.FC<
  {
    id?: string
  } & Props
> = (props) => {
  const { cards, changeBackground } = props

  const cardsSpanClasses = {
    half: '6',
    oneThird: '4',
    oneForth: '3',
    oneSixth: '2',
  }

  return (
    <div // each cards block receives unique id = blockName
      id={props.blockName || undefined}
      className={cn('pt-14 ', {
        'bg-card': changeBackground,
      })}
    >
      <div className="container">
        <div
          className={`grid grid-cols-4 lg:grid-cols-12 gap-7 ${cards && cards.length > 0 ? 'md:gap-14 pb-14 ' : ''}`}
        >
          {cards &&
            cards.length > 0 &&
            cards.map((col, index) => {
              const { size, enableMedia, media, richText, linkTo } = col

              return (
                <div
                  className={cn(
                    `col-span-4 lg:col-span-${cardsSpanClasses[size!]}`,
                    // {
                    //   'md:col-span-2': size !== 'full' && size !== 'twoThirds',
                    // },
                    {
                      'hidden lg:block': size === 'oneSixth',
                    },
                  )}
                  key={index}
                >
                  <a href={linkTo || undefined}>
                    {enableMedia && <ImageMedia resource={media} />}
                    {richText && (
                      <RichText
                        className={`${richText.root.direction !== null ? '' : 'hidden'}`}
                        content={richText}
                        enableGutter={false}
                        styleLink={true}
                      />
                    )}
                  </a>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
