import { useLocale } from 'next-intl'
import localization from '@/i18n/localization'
import { TypedLocale } from 'payload'
import { usePathname, useRouter } from '@/i18n/routing'
import { useParams } from 'next/navigation'
import { useTransition } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  // SelectValue,
} from '@/components/ui/select'
import { Globe } from 'lucide-react'

function LocaleSwitcher() {
  // inspired by https://github.com/amannn/next-intl/blob/main/examples/example-app-router/src/components/LocaleSwitcherSelect.tsx
  const locale = useLocale()
  const router = useRouter()
  const [, startTransition] = useTransition()
  const pathname = usePathname()
  const params = useParams()

  function onSelectChange(value: TypedLocale) {
    startTransition(() => {
      router.push(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: value, scroll: false },
      )
    })
  }

  //BEFORE:
  // function onSelectChange(value: TypedLocale) {
  //   startTransition(() => {
  //     router.replace(
  //       // @ts-expect-error -- TypeScript will validate that only known `params`
  //       // are used in combination with a given `pathname`. Since the two will
  //       // always match for the current route, we can skip runtime checks.
  //       { pathname, params },
  //       { locale: value },
  //     )
  //   })
  // }

  return (
    <Select onValueChange={onSelectChange} value={locale}>
      <SelectTrigger
        className="bg-transparent border-none uppercase w-auto opacity-85"
        title={localization.locales.find((l) => l.code === locale)?.label}
      >
        <Globe size={24} /> {/* Globe Icon */}
        <span className="pl-2">{locale.toUpperCase()}</span> {/* Current Language Code */}
      </SelectTrigger>
      <SelectContent>
        {localization.locales
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((locale) => (
            <SelectItem value={locale.code} key={locale.code}>
              <div className="flex gap-2">
                <div className="uppercase">{locale.code}</div>
                <div>{locale.label}</div>
              </div>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  )
}

export default LocaleSwitcher
