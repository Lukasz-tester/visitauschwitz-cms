import React from 'react'
import type { Post, Media } from '@/payload-types'

type PopulatedAuthor = NonNullable<Post['populatedAuthors']>[number]

type Props = {
  authors: PopulatedAuthor[]
}

export const AuthorBio: React.FC<Props> = ({ authors }) => {
  const authorsWithBio = authors.filter((a) => a.bio || a.photo)
  if (authorsWithBio.length === 0) return null

  return (
    <div className="container max-w-[50rem] mt-16 mb-8">
      {/* Divider */}
      <div className="border-t border-border mb-10" />

      <div className="flex flex-col gap-10">
        {authorsWithBio.map((author) => {
          const photo =
            author.photo && typeof author.photo === 'object' ? (author.photo as Media) : null
          const photoUrl =
            photo?.url ?? 'https://images.visitauschwitz.info/home-guide-birkenau-gate.webp'
          const photoAlt = photo?.alt ?? author.name ?? 'Author photo'

          return (
            <div
              key={author.id}
              className="flex flex-col sm:flex-row gap-8 items-start
                         rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm
                         shadow-sm"
            >
              {/* Author portrait */}
              <div className="shrink-0 place-self-center">
                <img
                  src={photoUrl}
                  alt={photoAlt}
                  className=" sm:w-64 h-44 rounded-xl object-cover ring-1 ring-border shadow-md"
                />
              </div>

              {/* Author text */}
              <div className="flex flex-col gap-2 ">
                <p className="text-xs uppercase tracking-widest text-foreground/50 font-medium">
                  About the author
                </p>
                {author.name && (
                  <h2 className="text-lg font-semibold leading-tight">{author.name}</h2>
                )}
                {author.bio && (
                  <p className="text-sm leading-relaxed text-foreground/70">{author.bio}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
