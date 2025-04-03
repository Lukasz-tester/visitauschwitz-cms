'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React, { useState } from 'react'

import type { Theme } from './types'

import { useTheme } from '..'
import { themeLocalStorageKey } from './types'
import { Moon, Sun, SunMoon } from 'lucide-react'

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme()
  const [value, setValue] = useState('')

  const onThemeChange = (themeToSet: Theme & 'auto') => {
    if (themeToSet === 'auto') {
      setTheme(null)
      setValue('auto')
    } else {
      setTheme(themeToSet)
      setValue(themeToSet)
    }
  }

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    setValue(preference ?? 'auto')
  }, [])

  return (
    <Select onValueChange={onThemeChange} value={value}>
      <SelectTrigger className="bg-transparent max-w-fit border-none px-2">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="dark">
          <div className="flex gap-2">
            <Moon />
            Dark
          </div>
        </SelectItem>
        <SelectItem value="light">
          <div className="flex gap-2">
            <Sun />
            Light
          </div>
        </SelectItem>
        <SelectItem value="auto">
          <div className="flex gap-2">
            <SunMoon />
            Auto
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
