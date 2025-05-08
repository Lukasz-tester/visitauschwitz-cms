import React from 'react'
import dynamic from 'next/dynamic'
import type { Page } from '@/payload-types'
import { cn } from '@/utilities/cn'

import RichText from '@/components/RichText'
const ImageMedia = dynamic(() =>
  import('@/components/Media/ImageMedia').then((mod) => mod.ImageMedia),
)

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
  MassageQuestion,
  PlaceholderHouse,
  PlaceholderOnMap,
  Plane,
  Route,
  Shoe,
  StopSign,
  Store,
  Ticket,
  TicketID,
  Tickets,
  Toilet,
  Train,
  Trees,
  Umbrella,
  UmbrellaDrops,
} from '@/components/ui/Icons'
import Link from 'next/link'

const icons = {
  food: <Food />,
  luggage: <Luggage />,
  toilet: <Toilet />,
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
  plane: <Plane />,
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

type Props = Extract<Page['layout'][0], { blockType: 'cta' }>

export const CallToActionBlock: React.FC<Props & { id?: string }> = ({
  blockName,
  tiles,
  changeBackground,
  size,
}) => {
  const tilesSpanClasses = {
    half: '6',
    oneThird: '4',
    oneForth: '3',
  }
  const gridSize = tilesSpanClasses[size!]

  return (
    <section
      id={blockName || undefined}
      className={cn('mt-7', {
        'bg-gradient-to-b from-card-foreground to-transparent pb-7 my-0': changeBackground,
        'md:px-[17.3%]': tiles?.length === 1,
      })}
    >
      <div className="container justify-center">
        <div
          className={cn(
            'gap-7 lg:gap-14',
            tiles && (gridSize === '3' || tiles?.length === 1)
              ? 'flex flex-wrap justify-center'
              : 'grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 grid',
          )}
        >
          {tiles?.map((tile, index) => {
            const { icon, enableMedia, media, title, richText, linkTo } = tile

            const content = (
              <>
                {enableMedia && (
                  <ImageMedia
                    imgClassName={`${linkTo ? 'rounded-t-xl' : 'rounded'}`}
                    resource={media}
                  />
                )}
                <div
                  className={cn(
                    linkTo && 'px-6',
                    icon && title && gridSize === '3' && 'place-self-center',
                  )}
                >
                  {icon && !enableMedia && (
                    <div
                      className={cn(
                        'sm:w-fit',
                        title && 'place-self-center py-2',
                        tiles.length === 5 && 'px-5',
                      )}
                    >
                      {icons[icon as keyof typeof icons]}
                    </div>
                  )}
                  {title && (
                    <h3
                      className={cn(
                        'text-2xl opacity-85 font-semibold',
                        gridSize === '3' && tiles.length !== 5 && 'text-center py-3',
                        tiles.length === 1 && 'text-3xl md:text-4xl mt-5',
                        tiles.length === 5 && 'text-3xl p-3 px-5',
                      )}
                    >
                      {title}
                    </h3>
                  )}
                  {richText && tiles.length !== 5 && (
                    <RichText
                      className={cn(
                        richText.root.direction === null ? 'hidden' : 'prose-h3:text-3xl my-5',
                      )}
                      content={richText}
                      enableGutter={false}
                      styleH3={false}
                    />
                  )}
                </div>
              </>
            )

            return (
              <article
                key={tile.id || index}
                className={cn(
                  `col-span-3 lg:col-span-${gridSize} rounded-xl`,
                  linkTo
                    ? 'bg-gradient-to-tl from-card-foreground to-40% to-transparent border border-background hover:border-amber-700/70'
                    : 'from-transparent',
                  !enableMedia &&
                    linkTo &&
                    'bg-gradient-to-bl from-amber-700/50 via-slate-800/15 dark:from-amber-700/35 dark:via-slate-900 to-70%',
                  tiles.length === 5 || gridSize === '3' ? 'max-w-[378px] items-start' : '',
                  tiles.length === 1 && gridSize !== '6' && 'place-self-center pt-16',
                )}
              >
                {linkTo ? (
                  <Link
                    className="place-self-center"
                    href={linkTo}
                    aria-label={`Call to action: ${title}`}
                    target={linkTo.startsWith('http') ? '_blank' : undefined}
                    rel={linkTo.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="place-self-center">{content}</div>
                )}

                <div className={cn(tiles.length === 5 ? 'p-4 rounded-3xl bg-card/50' : 'hidden')}>
                  {richText && (
                    <RichText
                      content={richText}
                      enableGutter={false}
                      styleLink={true}
                      styleH3={false}
                    />
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
