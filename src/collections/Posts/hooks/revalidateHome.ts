import { Post } from '@/payload-types'
import { revalidatePath } from 'next/cache'
import { CollectionAfterChangeHook } from 'payload'

// this makes sure the Archive component has updated posts on Home
export const revalidateHome: CollectionAfterChangeHook<Post> = ({ doc }) => {
  if (doc._status === 'published') {
    console.log('Revalidating homepage')
    revalidatePath('/')
  }
}
