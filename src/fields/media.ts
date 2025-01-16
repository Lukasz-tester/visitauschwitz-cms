import type { Field } from 'payload'

import deepMerge from '@/utilities/deepMerge'

type MediaType = (options?: { overrides?: Record<string, unknown> }) => Field

export const media: MediaType = ({ overrides = {} } = {}) => {
  const mediaResult: Field = {
    name: 'media',
    type: 'upload',
    relationTo: 'media',
    required: true,
  }

  return deepMerge(mediaResult, overrides)
}
