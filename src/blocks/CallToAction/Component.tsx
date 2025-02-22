import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { cn } from '@/utilities/cn'
import {
  Bus,
  Car,
  Diamond,
  Food,
  Luggage,
  MapLookingGlass,
  MapPlaceholder,
  Placeholder,
  Plane,
  Shoe,
  StopSign,
  Ticket,
  TicketID,
  TicketIDsmall,
  Toilet,
  Train,
  Umbrella,
  UmbrellaDrops,
} from '@/components/ui/Icons'

type Props = Extract<Page['layout'][0], { blockType: 'cta' }>

export const CallToActionBlock: React.FC<
  Props & {
    id?: string
  }
> = ({ blockName, tiles, changeBackground, size }) => {
  const tilesSpanClasses = {
    half: '6',
    oneThird: '4',
    oneForth: '3',
    oneSixth: '2',
  }

  const gridSize = tilesSpanClasses[size!]

  const icons = {
    bus: <Bus />,
    car: <Car />,
    food: <Food />,
    luggage: <Luggage />,
    plane: <Plane />,
    shoe: <Shoe />,
    ticketId: <TicketID />,
    ticketIdSmall: <TicketIDsmall />,
    toilet: <Toilet />,
    train: <Train />,
    umbrella: <Umbrella />,
    // not used below?
    diamond: <Diamond />,
    mapLookingGlass: <MapLookingGlass />,
    mapPlaceholder: <MapPlaceholder />,
    placeholder: <Placeholder />,
    stopSign: <StopSign />,
    ticket: <Ticket />,
    umbrellaDrops: <UmbrellaDrops />,
  }

  return (
    <div // each tiles block receives unique id = blockName
      id={blockName || undefined}
      className={cn('my-14 ', {
        'bg-gradient-to-r from-amber-900/20 to-transparent py-7 ': changeBackground,
      })}
    >
      <div className="container justify-center">
        <div
          className={` gap-4 md:gap-7 lg:gap-14 ${
            tiles && gridSize === '3'
              ? 'flex flex-wrap justify-center'
              : 'grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 grid '
          }`}
        >
          {tiles &&
            tiles.length > 0 &&
            tiles.map((col, index) => {
              const { icon, enableMedia, media, title, richText, linkTo } = col

              return (
                <a
                  className={cn(
                    `col-span-3 lg:col-span-${gridSize}
                    ${
                      linkTo
                        ? 'bg-gradient-to-tl from-amber-700/50 via-slate-800/15 dark:from-amber-700/35 dark:via-slate-900 to-70% to-transparent border border-card hover:border-amber-700/70'
                        : 'from-transparent '
                    }`,
                    {
                      'rounded-xl bg-gradient-to-bl': !enableMedia,
                    },
                    {
                      'max-w-[300px] place-self-center': gridSize === '3',
                    },
                  )}
                  key={index}
                  href={linkTo || undefined}
                >
                  {enableMedia && <ImageMedia resource={media} />}
                  <div
                    className={`px-4 ${icon && title && gridSize === '3' ? 'place-self-center' : ''}`}
                  >
                    {icon && !enableMedia && (
                      <div className={`sm:w-fit ${title ? 'place-self-center' : ''}`}>
                        {icons[icon]}
                      </div>
                    )}
                    {title && (
                      <div
                        className={`pt-4 pb-5 text-2xl ${gridSize === '3' ? 'text-center' : ''}`}
                      >
                        {title}
                      </div>
                    )}
                    {richText && (
                      <RichText
                        className={`${richText.root.direction !== null ? 'prose-h3:text-3xl pb-1' : 'hidden'}`}
                        content={richText}
                        enableGutter={false}
                        styleLink={true}
                        styleH3={false}
                      />
                    )}
                  </div>
                </a>
              )
            })}
        </div>
      </div>
    </div>
  )
}
