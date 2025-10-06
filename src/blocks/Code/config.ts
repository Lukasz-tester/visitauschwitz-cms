import type { Block } from 'payload'

export const Code: Block = {
  slug: 'Image',
  interfaceName: 'CodeBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      localized: true,
      label: 'Caption',
      required: false,
    },
  ],
}
