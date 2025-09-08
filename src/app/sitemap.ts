import type { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic' //This tells Next.js: “Don’t try to pre-render this during build — always generate it at runtime.”

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://visitauschwitz.info'
const locales = ['en', 'pl']
// TODO - add locales when translated!
// const locales = ['en', 'pl', 'de', 'fr', 'es', 'it', 'nl', 'ru', 'uk']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { docs: pages } = await fetch(`${serverUrl}/api/pages?limit=0`).then((res) => res.json())
  const { docs: posts } = await fetch(`${serverUrl}/api/posts?limit=0`).then((res) => res.json())

  const sitemap: MetadataRoute.Sitemap = []

  const createLocalizedUrls = (slug: string, updatedAt: string) => {
    const safeSlug = slug === 'home' ? '' : slug
    return locales.map((locale) => ({
      url: `${serverUrl}/${locale}/${safeSlug}`,
      lastModified: updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 1,
      alternates: locales.reduce(
        (acc, lang) => {
          acc[lang] = `${serverUrl}/${lang}/${safeSlug}`
          return acc
        },
        {} as Record<string, string>,
      ),
    }))
  }

  for (const page of pages) {
    sitemap.push(...createLocalizedUrls(page.slug, page.updatedAt))
  }

  for (const post of posts) {
    sitemap.push(...createLocalizedUrls(`posts/${post.slug}`, post.updatedAt))
  }

  return sitemap
}
