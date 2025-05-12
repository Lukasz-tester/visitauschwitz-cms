import './globals.css'
import type { Metadata } from 'next'

// export const revalidate = 600

import { cn } from 'src/utilities/cn'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/globals/Footer/Component'
import { Header } from '@/globals/Header/Component'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { TypedLocale } from 'payload'

import { getMessages, setRequestLocale } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { CookiePopup } from '@/components/Cookies/cookiePopup'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

type Args = {
  children: React.ReactNode
  params: {
    locale: TypedLocale
  }
}

export default async function RootLayout({ children, params }: Args) {
  const { locale } = params

  if (!routing.locales.includes(locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const { isEnabled } = await draftMode()
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/icon.ico" rel="icon" sizes="32x32" />
      </head>
      <body>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />
            <LivePreviewListener />
            <Header locale={locale} />
            {children}
            <Footer locale={locale} />

            <CookiePopup />
            {/* <Analytics />
            <SpeedInsights /> */}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://payloadcms.com'),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
