import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { cn } from '@/utilities/cn'
import {
  Bus,
  Car,
  Diamond,
  Eating,
  Food,
  Handshake,
  Hotel,
  Luggage,
  Map,
  MapLookingGlass,
  MapPlaceholder,
  MassageQuestion,
  Placeholder,
  PlaceholderHouse,
  PlaceholderOnMap,
  Plane,
  Route,
  Shoe,
  StopSign,
  Store,
  Ticket,
  TicketID,
  TicketIDsmall,
  Tickets,
  Toilet,
  Train,
  Trees,
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
    placeholder: <Placeholder />, // NOT USED
    mapPlaceholder: <MapPlaceholder />, // NOT USED

    food: <Food />,
    luggage: <Luggage />,
    ticketIdSmall: <TicketIDsmall />,
    toilet: <Toilet />,
    // some not used above?
    bus: <Bus />,
    car: <Car />,
    diamond: <Diamond />,
    eating: <Eating />,
    handshake: <Handshake />,
    hotel: <Hotel />,
    map: <Map />,
    mapLookingGlass: <MapLookingGlass />,
    massageQuestion: <MassageQuestion />,
    placeholderHouse: <PlaceholderHouse />,
    placeholderOnMap: <PlaceholderOnMap />,
    plane: <Plane />, //
    route: <Route />,
    shoe: <Shoe />,
    stopSign: <StopSign />,
    store: <Store />,
    ticket: <Ticket />,
    ticketId: <TicketID />,
    tickets: <Tickets />,
    train: <Train />,
    trees: <Trees />,
    umbrella: <Umbrella />,
    umbrellaDrops: <UmbrellaDrops />,
  }

  return (
    <div // each tiles block receives unique id = blockName
      id={blockName || undefined}
      className={cn(
        'mt-7',
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
            `gap-7 lg:gap-14
            ${
              tiles && (gridSize === '3' || tiles?.length === 1)
                ? 'flex flex-wrap justify-center'
                : 'grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 grid '
            }`,
          )}
        >
          {tiles &&
            tiles.length > 0 &&
            tiles.map((col, index) => {
              const { icon, enableMedia, media, title, richText, linkTo } = col

              return (
                <div
                  key={index}
                  className={cn(
                    `col-span-3 lg:col-span-${gridSize} border border-card-foreground rounded
                ${
                  linkTo
                    ? 'bg-gradient-to-tl from-card-foreground to-40% to-transparent hover:border-amber-700/70'
                    : 'from-transparent '
                }`,
                    {
                      'rounded-2xl bg-gradient-to-bl from-amber-700/50 via-slate-800/15 dark:from-amber-700/35 dark:via-slate-900 to-70% ':
                        !enableMedia && linkTo,
                    },
                    {
                      'max-w-[360px] items-start border-none': tiles.length === 5,
                    },
                    {
                      'place-self-center border-none pt-16': tiles.length === 1 && gridSize !== '6',
                    },
                  )}
                >
                  <a
                    href={linkTo || undefined}
                    target={linkTo?.includes('http') ? '_blank' : undefined}
                  >
                    {enableMedia && <ImageMedia imgClassName="rounded-t" resource={media} />}
                    <div
                      className={`px-6 ${icon && title && gridSize === '3' ? 'place-self-center' : ''}`}
                    >
                      {icon && !enableMedia && (
                        <div className={`sm:w-fit ${title ? 'place-self-center py-2' : ''}`}>
                          {icons[icon]}
                        </div>
                      )}
                      {title && (
                        <div
                          className={cn(
                            'text-2xl opacity-85 font-semibold ',
                            {
                              'text-center pb-8 pt-4': gridSize === '3',
                            },
                            {
                              'text-3xl md:text-4xl mt-5': tiles.length === 1,
                            },
                            {
                              'text-3xl': tiles.length === 5,
                            },
                          )}
                        >
                          {title}
                        </div>
                      )}

                      {richText && tiles.length !== 5 && (
                        <RichText
                          className={`${richText.root.direction === null ? 'hidden' : 'prose-h3:text-3xl my-6'}`}
                          content={richText}
                          enableGutter={false}
                          // styleLink={true}
                          styleH3={false}
                        />
                      )}
                    </div>
                  </a>
                  {/* Custom style when 5 tiles */}
                  <div
                    className={`${
                      tiles.length === 5
                        ? 'p-6 rounded-2xl border border-slate-500/30 shadow-lg shadow-slate-500/50 hover:border-amber-700/60 hover:shadow-amber-700/60 hover:bg-card/30'
                        : 'hidden'
                    }`}
                  >
                    {richText && (
                      <RichText
                        // className="prose-p:pt-1"
                        content={richText}
                        enableGutter={false}
                        styleLink={true}
                        styleH3={false}
                      />
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
