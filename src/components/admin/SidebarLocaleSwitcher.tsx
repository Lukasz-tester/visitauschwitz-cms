'use client'

import React from 'react'
import { useLocale, useConfig, useTranslation } from '@payloadcms/ui'
import { getTranslation } from '@payloadcms/translations'
import { useRouter } from 'next/navigation.js'

export const SidebarLocaleSwitcher: React.FC = () => {
  const { config } = useConfig()
  const { localization } = config
  const locale = useLocale()
  const router = useRouter()
  const { i18n } = useTranslation()

  if (!localization) return null

  const { locales } = localization

  return (
    <div style={{ marginBottom: '1rem' }}>
      <select
        value={locale.code}
        onChange={(e) => {
          const searchParams = new URLSearchParams(window.location.search)
          searchParams.set('locale', e.target.value)
          router.push(`?${searchParams.toString()}`, { scroll: false })
        }}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--style-radius-s)',
          border: 'none',
          boxShadow: 'inset 0 0 0 1px var(--theme-elevation-800)',
          background: 'transparent',
          color: 'var(--theme-text)',
          fontSize: 'var(--base-body-size)',
          lineHeight: 'calc(var(--base) * 1.2)',
          cursor: 'pointer',
          appearance: 'none',
          WebkitAppearance: 'none',
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          paddingRight: '2.5rem',
        }}
      >
        {locales.map((localeOption) => {
          const label = getTranslation(localeOption.label, i18n)
          return (
            <option key={localeOption.code} value={localeOption.code}>
              {label !== localeOption.code ? `${label} (${localeOption.code})` : label}
            </option>
          )
        })}
      </select>
    </div>
  )
}
