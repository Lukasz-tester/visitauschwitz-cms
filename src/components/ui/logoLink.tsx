import { useTranslations } from 'next-intl'
import { Logo } from '@/components/ui/Icons'
import Link from 'next/link'

export const LogoLink = ({ className }: { className?: string }) => {
  const t = useTranslations()
  const label = t('go-home')

  return (
    <Link href="/" aria-label={label} className={className}>
      <Logo title={label} />
    </Link>
  )
}
