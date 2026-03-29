import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateNewsletterEmail: GlobalAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating newsletter-email`)

  revalidateTag('global_newsletter-email')

  return doc
}
