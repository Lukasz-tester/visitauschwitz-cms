import type { AccessArgs } from 'payload'
import type { User } from '@/payload-types'

type isAuthenticated = (args: AccessArgs<User>) => boolean

// tylko zalogowany użytkownik
export const authenticated: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user)
}

// zalogowany i admin
export const authenticatedAdmin: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user) && user?.role === 'admin'
}
