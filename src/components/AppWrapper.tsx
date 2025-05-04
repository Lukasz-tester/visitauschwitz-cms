'use client'

import { useRestoreKey } from '@/components/RestoreHandler'

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const key = useRestoreKey()
  return <div key={key}>{children}</div>
}
