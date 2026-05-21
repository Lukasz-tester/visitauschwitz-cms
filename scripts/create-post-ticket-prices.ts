/**
 * Creates the "Auschwitz Ticket Prices 2026" post (EN locale, draft) via Payload Local API.
 *
 * Usage:
 *   npx tsx scripts/create-post-ticket-prices.ts
 */

import { readFileSync } from 'fs'

const envContent = readFileSync('.env', 'utf-8')
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
}

// ─── Lexical helpers ────────────────────────────────────────────────

function t(text: string, format = 0) {
  return { detail: 0, format, mode: 'normal', style: '', text, type: 'text', version: 1 }
}

function link(text: string, url: string, opts: { newTab?: boolean; format?: number } = {}) {
  return {
    children: [t(text, opts.format)],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'link',
    version: 3,
    fields: { url, newTab: opts.newTab ?? false, linkType: 'custom' },
  }
}

function p(children: object[]) {
  return {
    children,
    direction: children.length ? 'ltr' : null,
    format: '',
    indent: 0,
    type: 'paragraph',
    version: 1,
    textFormat: 0,
    textStyle: '',
  }
}

const ep = () => p([])

function h2(text: string) {
  return { children: [t(text)], direction: 'ltr', format: '', indent: 0, type: 'heading', version: 1, tag: 'h2' }
}

function h3(text: string) {
  return { children: [t(text)], direction: 'ltr', format: '', indent: 0, type: 'heading', version: 1, tag: 'h3' }
}

function li(children: object[], value: number) {
  return { type: 'listitem', version: 1, value, checked: null, direction: 'ltr', format: '', indent: 0, children }
}

function ul(items: object[]) {
  return { type: 'list', version: 1, tag: 'ul', listType: 'bullet', start: 0, direction: 'ltr', format: '', indent: 0, children: items }
}

function rt(children: object[]) {
  return { root: { children, direction: children.length ? 'ltr' : null, format: '', indent: 0, type: 'root', version: 1 } }
}

function textBlock(blockName: string, style: 'text' | 'emphasis' | 'quote', nodes: object[]) {
  return { blockType: 'Text', blockName, style, content: rt(nodes) }
}

function imageBlock(blockName: string, mediaId: string, captionNodes: object[]) {
  return { blockType: 'Image', blockName, media: mediaId, caption: rt(captionNodes) }
}

const PLACEHOLDER = '67be70ae35ec329c954f5410'
const LUKASZ = '675f51ab4d074485ad8b59af'

// ─── Layout ─────────────────────────────────────────────────────────

const layout = [
  textBlock('intro', 'emphasis', [
    p([
      t('Auschwitz Memorial entry cards are issued by the Museum, not sold by tourism companies — and individual entry without a guide is free. What you pay for is a guided tour (in your language) or, optionally, an organized day-tour with transport from Kraków. The numbers below come straight from the Museum’s official price list, valid from 1 February 2026; switch the currency at the top of the table to see equivalents in EUR, USD or GBP.'),
    ]),
  ]),

  textBlock('table-of-contents', 'text', [
    p([t('In this post:', 1)]),
    ul([
      li([link('How Auschwitz pricing works', '#how-pricing-works')], 1),
      li([link('Full price table — Individual, Group and Organized tours', '#prices')], 2),
      li([link('Individual vs group: which is cheaper?', '#individual-vs-group')], 3),
      li([link('Where to book — the only official channel', '#where-to-book')], 4),
      li([link('Discounts: student, 75+, disability', '#discounts')], 5),
      li([link('Payment and currency at the Museum', '#payment-and-currency')], 6),
    ]),
  ]),

  textBlock('how-pricing-works', 'text', [
    h2('How Auschwitz Pricing Works'),
    ep(),
    p([
      t('Auschwitz-Birkenau is a state-run memorial, not a commercial attraction. The entry card itself — for a self-guided visit during designated afternoon hours — costs nothing. What you actually pay for is the guided tour: an educator who walks you through both parts of the camp in a specific language. Since 1 March 2026, every entry card and tour ticket must be reserved online at '),
      link('visit.auschwitz.org', 'https://visit.auschwitz.org', { newTab: true }),
      t('; on-site sales have been permanently discontinued.'),
    ]),
    ep(),
    h3('Three Things You Are Actually Paying For'),
    ep(),
    ul([
      li([t('the '), t('guide’s time', 1), t(' (most tours are 3.5 hours, study tours 6 or 8 hours),')], 1),
      li([t('the '), t('language', 1), t(' of the tour (English, French, German, Italian, Polish, Russian, Spanish for individuals; around 20 languages for private groups),')], 2),
      li([t('a '), t('headset', 1), t(' so you can hear the guide clearly inside the exhibitions.')], 3),
    ]),
  ]),

  imageBlock('image-prices-hero', PLACEHOLDER, [
    p([t('Visitor service center at Auschwitz I — the ticket-scanning gate where every entry pass is verified.')]),
  ]),

  // ── TicketPrices block ──
  {
    blockType: 'ticketPrices',
    blockName: 'prices',
    heading: rt([h2('Full Price List — Auschwitz 2026')]),
    sections: [
      {
        title: 'Individual Visit',
        intro: rt([
          p([
            t('For a single visitor or a couple without a reservation in advance. You join an existing language-specific tour led by a Museum educator. Prices are per person.'),
          ]),
        ]),
        rows: [
          { label: '3.5-h regular tour', pricePLN: 150, pricePLNDiscount: 140, unit: 'per person' },
          { label: '6-h study tour', pricePLN: 190, pricePLNDiscount: 170, unit: 'per person' },
          { label: '2.5-h online tour', pricePLN: 60, unit: 'per person' },
        ],
        footnote: rt([
          p([
            t('* Discount available to students under 26, people over 75, or visitors with a disability card. Polish-language tours are 10–20 PLN cheaper than other languages (except online tours, which are the same price).'),
          ]),
        ]),
      },
      {
        title: 'Group Visit (Private Tour)',
        intro: rt([
          p([
            t('For groups of 6+ with your own guide and a custom route — one price covers the whole group, not per person. The online group tour is a flat rate regardless of size.'),
          ]),
        ]),
        rowLabelHeader: 'Number of people in group',
        columnHeaders: [
          { header: '0–10' },
          { header: '11–20' },
          { header: '21–30' },
        ],
        rows: [
          {
            label: '3.5-h general tour',
            pricesPLN: [{ value: 970 }, { value: 1070 }, { value: 1120 }],
          },
          {
            label: '6-h study tour',
            pricesPLN: [{ value: 1240 }, { value: 1340 }, { value: 1390 }],
          },
          {
            label: '8-h study tour',
            pricesPLN: [{ value: 1750 }, { value: 1850 }, { value: 1900 }],
          },
          {
            label: '2.5-h online group tour',
            sublabel: 'flat rate (any size)',
            pricesPLN: [{ value: 690 }, { value: 690 }, { value: 690 }],
          },
        ],
        footnote: rt([
          p([
            t('Polish schools are entitled to additional discounts; contact the Museum’s reservation office for details.'),
          ]),
        ]),
      },
      {
        title: 'Organized Tours from Kraków',
        intro: rt([
          p([
            t('Third-party operators that bundle transport from Kraków, the entry pass and a guide into one package. The Museum does not run these tours and does not set their prices — figures below come from typical advertised rates. Prices are per person.'),
          ]),
        ]),
        rows: [
          {
            label: 'Typical advertised price',
            pricePLN: 160,
            priceMaxPLN: 300,
            unit: 'per person',
          },
          {
            label: 'Last-minute / special offers',
            pricePLN: 40,
            unit: 'per person',
          },
        ],
      },
    ],
    warning: rt([
      h3('Cheap Organized Tours Can Be Cancelled Last-Minute'),
      ep(),
      p([
        t('Operators sometimes advertise prices as low as 40 PLN (around 10 EUR), but those slots are frequently dropped when a higher-paying booking appears for the same departure — sometimes the day before. If your dates are fixed, book directly at '),
        link('visit.auschwitz.org', 'https://visit.auschwitz.org', { newTab: true }),
        t(' instead.'),
      ]),
    ]),
    changeBackground: false,
    addMarginTop: true,
    addMarginBottom: true,
  },

  textBlock('individual-vs-group', 'text', [
    h2('Individual vs Group Tours: Which Is Cheaper?'),
    ep(),
    p([
      t('The numbers cross over surprisingly fast. A single English-language 3.5-h tour costs 150 PLN per person. Once your party reaches '),
      t('seven people', 1),
      t(', the private group rate (970 PLN for up to 10 people) becomes the cheaper option — 7 × 150 = 1050 PLN, already more than the group rate, and the gap widens with every extra person. For families and friend groups travelling together, a private tour usually wins on both price and flexibility.'),
    ]),
    ep(),
    h3('When to Choose Individual'),
    ep(),
    ul([
      li([t('you are travelling alone or as a couple,')], 1),
      li([t('your dates are flexible enough to find an available language slot,')], 2),
      li([t('you prefer a fixed itinerary over a custom route.')], 3),
    ]),
    ep(),
    h3('When to Choose Group / Private'),
    ep(),
    ul([
      li([t('you have 6 or more people,')], 1),
      li([t('you need a less-common language (Hebrew, Japanese, Korean, Dutch, etc.),')], 2),
      li([t('you want a custom route, ceremony stop, or a specific guide.')], 3),
    ]),
  ]),

  imageBlock('image-booking', PLACEHOLDER, [
    p([t('The official online booking system at visit.auschwitz.org — the only place to reserve Auschwitz entry passes.')]),
  ]),

  textBlock('where-to-book', 'text', [
    h2('Where to Book — Only One Official Channel'),
    ep(),
    p([
      t('There is exactly one legitimate place to reserve Auschwitz tickets: '),
      link('visit.auschwitz.org', 'https://visit.auschwitz.org', { newTab: true }),
      t('. Since 1 March 2026, on-site sales have been permanently discontinued and the Museum does not cooperate with any third-party booking sites. Anyone selling “Auschwitz tickets” outside this system is either reselling at inflated prices or selling something else entirely (usually just transport from Kraków).'),
    ]),
    ep(),
    h3('Booking Windows'),
    ep(),
    ul([
      li([t('Free individual entry cards: ', 1), t('up to 7 days before your visit,')], 1),
      li([t('Paid guided tours (individual): ', 1), t('up to 90 days before,')], 2),
      li([t('Private group tours: ', 1), t('up to 5 days before; last-minute requests up to 2 days for an additional fee.')], 3),
    ]),
  ]),

  textBlock('where-to-book-quote', 'quote', [
    p([
      t('Entry cards to the Auschwitz Memorial are available only online from 1 March 2026. The Museum does not cooperate with external booking entities — visit.auschwitz.org is the only official reservation system.'),
    ]),
    p([
      t('— Auschwitz-Birkenau State Museum,', 1),
      t(' official news announcement, March 2026'),
    ]),
  ]),

  textBlock('discounts', 'text', [
    h2('Discounts: Student, 75+, Disability'),
    ep(),
    p([
      t('The Museum applies a single reduced rate (marked with an asterisk in the price table above) to three groups: '),
      t('students under 26', 1),
      t(', '),
      t('visitors aged 75 or older', 1),
      t(', and '),
      t('holders of a disability card', 1),
      t('. The discount is 10 PLN off the standard guided-tour price — small in absolute terms, but applied per person, so it adds up for families travelling with grandparents or older teenagers.'),
    ]),
    ep(),
    h3('Bring Proof at the Entrance'),
    ep(),
    p([
      t('The discount is applied at booking and verified on site. Bring your student ID (ISIC or national equivalent), passport showing your date of birth, or your disability card. Without proof, you may be charged the standard rate at the entry gate.'),
    ]),
    ep(),
    h3('Polish-Language Discount'),
    ep(),
    p([
      t('A separate, unofficial “discount” exists for visitors who speak Polish: tours conducted in Polish are 10–20 PLN cheaper per person than the same tours in English, German or other foreign languages. The 2.5-h online tour is the only exception — its price is the same in every language.'),
    ]),
  ]),

  imageBlock('image-payment', PLACEHOLDER, [
    p([t('Online payment screen during the visit.auschwitz.org checkout — Museum charges in PLN regardless of your card’s home currency.')]),
  ]),

  textBlock('payment-and-currency', 'text', [
    h2('Payment and Currency at the Museum'),
    ep(),
    p([
      t('The Museum charges every booking in '),
      t('Polish złoty (PLN)', 1),
      t(' — that is the only currency the reservation system accepts. If your card is in another currency, your bank converts at its own rate at the moment of purchase, which is usually within a percent or two of the European Central Bank rate.'),
    ]),
    ep(),
    h3('Why the Switcher Above Shows EUR, USD and GBP'),
    ep(),
    p([
      t('Most visitors travel from outside Poland and want to know roughly what the tour will cost in their own currency. The currency selector at the top of the price table converts every PLN amount using the daily ECB rate (refreshed every morning from frankfurter.app), so you can plan your budget — but the actual charge on your statement will be in PLN.'),
    ]),
    ep(),
    h3('Payment Methods Accepted'),
    ep(),
    ul([
      li([t('Visa, Mastercard and other major credit/debit cards (most common),')], 1),
      li([t('BLIK (Polish payment system, useful if you have a Polish account),')], 2),
      li([t('bank transfer for institutional bookings (schools, universities).')], 3),
    ]),
  ]),

  {
    blockType: 'donationTrigger',
    blockName: 'donate',
    heading: rt([h3('Support a Local Guide')]),
    columns: [
      {
        size: 'oneHalf',
        enableMedia: false,
        richText: rt([
          p([
            t('If this practical guide saved you time or money, consider a small contribution. Every donation supports independent, ad-free information for visitors preparing for Auschwitz-Birkenau.'),
          ]),
        ]),
        enableButtons: true,
      },
    ],
    changeBackground: true,
    addMarginTop: true,
    addMarginBottom: true,
  },

  textBlock('closing', 'emphasis', [
    p([
      t('Auschwitz is one of the few major historical sites in Europe where individual entry is completely free — what you pay for is the educator’s time and the language they teach in. Whether you book a 3.5-hour standard tour, a 6-hour study tour, or a private group visit, every złoty goes directly to the Museum, not to a tour reseller. Reserve early, bring photo ID, and budget for a journey that asks more of you than money.'),
    ]),
  ]),
]

// ─── Create Post ────────────────────────────────────────────────────

async function main() {
  console.log(`Layout: ${layout.length} blocks`)

  const { getPayload } = await import('payload')
  const configPromise = (await import('@payload-config')).default
  const payload = await getPayload({ config: configPromise })

  const post = await payload.create({
    collection: 'posts',
    locale: 'en',
    draft: true,
    data: {
      title: 'Auschwitz Ticket Prices 2026: Individual, Group & Tours',
      slug: 'auschwitz-ticket-prices',
      slugLock: false,
      _status: 'draft',
      authors: [LUKASZ],
      meta: {
        title: 'Auschwitz Ticket Prices 2026: Individual, Group & Tours',
        description:
          'Auschwitz 2026 ticket prices in PLN, EUR, USD & GBP. Individual passes, group rates, organized tour costs — by a licensed guide since 2006. ALT: Auschwitz I main gate ticket scanner at the visitor service center',
        image: PLACEHOLDER,
      },
      layout: layout as any,
    },
  })

  console.log(`\nPost created: ${post.id}`)
  console.log(`Title: ${post.title}`)
  console.log(`Slug: ${post.slug}`)
  console.log(`Status: ${post._status}`)

  process.exit(0)
}

main().catch((err) => {
  console.error('Failed to create post:', err)
  process.exit(1)
})
