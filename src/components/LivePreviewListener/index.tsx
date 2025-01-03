'use client'
import { useRouter } from 'next/navigation'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'

import React from 'react'

export const LivePreviewListener: React.FC = () => {
  const router = useRouter()
  return (
    <PayloadLivePreview refresh={router.refresh} serverURL={process.env.NEXT_PUBLIC_SERVER_URL!} />
  )
}
