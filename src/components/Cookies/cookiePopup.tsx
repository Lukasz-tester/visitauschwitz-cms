'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useLockBodyScroll } from '@/utilities/helpers'

function setCookie(name, value, days = 365) {
  var expires = ''
  if (days) {
    var date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}

function getCookie(name) {
  if (!document) return null

  var nameEQ = name + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export const CookiePopup = () => {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const hide = getCookie('hideCookiePopup') === 'true'
    if (hide === show) setShow(!hide)
  }, [])

  const t = useTranslations()
  useLockBodyScroll(show)

  if (!show) return null

  return (
    <div className="place-content-center bg-background/30 text-primary bottom-0 w-full h-full flex fixed z-[100001] text-xl">
      <div className="place-self-center items-center flex flex-col bg-background w-fit h-fit p-5 m-6 gap-5 rounded">
        <span>{t('cookie-message')}</span>
        <Button
          className="w-fit"
          variant="default"
          onClick={() => {
            setCookie('hideCookiePopup', true)
            setShow(false)
          }}
        >
          {t('hide-message')}
        </Button>
      </div>
    </div>
  )
}
