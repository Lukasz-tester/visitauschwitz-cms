'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { getCookie } from '@/utilities/helpersSsr'

function setCookie(name, value, days = 365) {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/`
}

export const CookiePopup = () => {
  const [show, setShow] = useState(false)
  const t = useTranslations()

  useEffect(() => {
    const hasConsent = getCookie('cookie-consent')
    if (!hasConsent) setShow(true)
  }, [])

  const acceptCookies = () => {
    setCookie('cookie-popup-hide', 'true')
    setCookie('cookie-consent', 'true')
    setShow(false)
    location.reload() // ważne, jeśli chcesz np. od razu załadować analytics
  }

  const declineCookies = () => {
    setCookie('cookie-popup-hide', 'true')
    setCookie('cookie-consent', 'false')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 w-full z-[100001] flex justify-center bg-black/90 text-white/90 text-xl">
      <div className="flex flex-col sm:flex-row w-fit h-fit p-6 pb-8 gap-5 items-start sm:items-center justify-between">
        <span>
          {t('cookie-message')}
          <Link href="/privacy-policy" className="underline">
            {t('privacy-policy')}
          </Link>
        </span>

        <div className="flex gap-6">
          <Button className="w-fit" variant="outline" onClick={acceptCookies}>
            {t('accept')}
          </Button>
          <Button className="w-fit" onClick={declineCookies}>
            {t('decline')}
          </Button>
        </div>
      </div>
    </div>
  )
}
