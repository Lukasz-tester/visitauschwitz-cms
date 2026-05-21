import type { GlobalConfig } from 'payload'

export const ExchangeRates: GlobalConfig = {
  slug: 'exchange-rates',
  label: 'Exchange Rates',
  access: {
    read: () => true,
  },
  admin: {
    description:
      'Foreign-exchange rates with PLN as base. Auto-refreshed daily from frankfurter.app (ECB data). Used by the TicketPrices block to convert museum prices on the fly.',
  },
  fields: [
    {
      name: 'baseCurrency',
      type: 'text',
      defaultValue: 'PLN',
      admin: { readOnly: true, description: 'Base currency for all rates (museum prices are in PLN).' },
    },
    {
      name: 'rates',
      type: 'group',
      label: 'Rates (1 PLN equals …)',
      fields: [
        { name: 'EUR', type: 'number', admin: { step: 0.0001 } },
        { name: 'USD', type: 'number', admin: { step: 0.0001 } },
        { name: 'GBP', type: 'number', admin: { step: 0.0001 } },
      ],
    },
    {
      name: 'updatedAt',
      type: 'date',
      admin: {
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Last successful refresh from frankfurter.app.',
      },
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'frankfurter.app',
      admin: { readOnly: true },
    },
  ],
}
