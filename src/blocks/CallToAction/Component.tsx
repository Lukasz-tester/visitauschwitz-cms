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
    // some not used above?
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
      className={cn(
        'my-7 mb-12',
        {
          'bg-gradient-to-b from-card-foreground to-transparent py-7 my-0': changeBackground,
        },

        {
          'md:px-[17.3%]': tiles?.length === 1,
        },
      )}
    >
      <div className="container justify-center">
        <div
          className={cn(
            ` gap-4 md:gap-7 lg:gap-14
            ${
              tiles && (gridSize === '3' || tiles?.length === 1)
                ? 'flex flex-wrap justify-center'
                : 'grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 grid '
            }`,
            {
              'pt-1 px-2 border border-card-foreground rounded-2xl shadow-xl shadow-card-foreground':
                tiles?.length === 1,
            },
          )}
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
                    {
                      'place-self-center': tiles.length === 1,
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
                        className={cn(
                          'pt-4 mb-5 text-2xl',
                          {
                            'text-center': gridSize === '3',
                          },
                          {
                            'text-3xl md:text-4xl pt-5': tiles.length === 1,
                          },
                        )}
                      >
                        {title}
                      </div>
                    )}

                    {richText && (
                      <RichText
                        className={`${richText.root.direction !== null ? 'prose-h3:text-3xl pb-2 mt-6' : 'hidden'}`}
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
