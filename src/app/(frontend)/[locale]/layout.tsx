import './globals.css'
import type { Metadata } from 'next'

// export const revalidate = 600
export const revalidate = false
export const dynamic = 'force-static'

// import { cn } from 'src/utilities/cn'
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
import { ConditionalCookies } from '@/components/Cookies/conditionalCookies'

type Args = {
  children: React.ReactNode
  params: Promise<{
    locale: TypedLocale
  }>
}

export default async function RootLayout({ children, params }: Args) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
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
            <ConditionalCookies />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  icons: {
    // icon: [
    //   { url: '/favicon.ico' }, // default fallback
    //   { url: '/favicon.png' },
    //   { url: '/icon.ico', sizes: '32x32', type: 'image/png' },
    // ],
    apple: '/apple-touch-icon.png',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'visitauschwitz.info'),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@visitauschwitz',
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
