'use client'

import React from 'react'
import { useDocumentInfo, useConfig, useTranslation } from '@payloadcms/ui'

export const DocumentMeta: React.FC = () => {
  const { data, isEditing } = useDocumentInfo()
  const { config } = useConfig()
  const { i18n } = useTranslation()

  if (!isEditing || !data) return null

  const status = data._status as string | undefined
  const updatedAt = data.updatedAt as string | undefined
  const createdAt = data.createdAt as string | undefined

  const formatDate = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat(i18n.language, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(dateStr))
    } catch {
      return dateStr
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0.75rem 0',
        marginBottom: '0.5rem',
        borderBottom: '1px solid var(--theme-elevation-100)',
        fontSize: '0.8125rem',
        color: 'var(--theme-elevation-500)',
      }}
    >
      {status && (
        <span>
          <strong style={{ color: 'var(--theme-text)' }}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </strong>
        </span>
      )}
      {updatedAt && (
        <span>
          {i18n.t('general:lastModified')}:{' '}
          <strong style={{ color: 'var(--theme-text)' }}>{formatDate(updatedAt)}</strong>
        </span>
      )}
      {createdAt && (
        <span>
          {i18n.t('general:created')}:{' '}
          <strong style={{ color: 'var(--theme-text)' }}>{formatDate(createdAt)}</strong>
        </span>
      )}
    </div>
  )
}
