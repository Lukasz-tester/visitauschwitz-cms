import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'images',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'link',
          type: 'text',
        },
      ],
    },
    // {
    //   name: 'position',
    //   type: 'select',
    //   defaultValue: 'default',
    //   options: [
    //     {
    //       label: 'Default',
    //       value: 'default',
    //     },
    //     {
    //       label: 'Fullscreen',
    //       value: 'fullscreen',
    //     },
    //   ],
    // },
    // {
    //   name: 'images',
    //   type: 'upload',
    //   fields: tileFields,
    // },
  ],
}
