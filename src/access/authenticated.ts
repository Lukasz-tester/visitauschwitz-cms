import type { AccessArgs } from 'payload'
import type { User } from '@/payload-types'

type isAuthenticated = (args: AccessArgs<User>) => boolean

// tylko zalogowany użytkownik
export const authenticated: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user)
}

// zalogowany i admin (or no role set — treat as admin for backwards compat)
export const authenticatedAdmin: isAuthenticated = ({ req: { user } }) => {
  if (!user || !('role' in user)) return false
  return user.role === 'admin' || !user.role
}
