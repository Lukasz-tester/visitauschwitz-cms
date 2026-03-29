/**
 * Creates the "Best Time to Visit Auschwitz: Month-by-Month Guide" post
 * via Payload Local API.
 *
 * Usage:
 *   npx tsx scripts/create-post-best-time.ts
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

function ol(items: object[]) {
  return { type: 'list', version: 1, tag: 'ol', listType: 'number', start: 1, direction: 'ltr', format: '', indent: 0, children: items }
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

// ─── Layout ─────────────────────────────────────────────────────────

const PLACEHOLDER = '67be70ae35ec329c954f5410'

const layout = [
  // ── Block 1: Intro (emphasis) ──
  textBlock('intro', 'emphasis', [
    p([
      t('April\u2013May and September\u2013October offer the best balance of weather, manageable crowds, and sufficient daylight. Summer has the longest visiting hours but draws the biggest crowds and intense heat. Winter is the quietest and most reflective season \u2014 but bitterly cold, with the Memorial open for as few as 6.5 hours per day. This month-by-month guide, written by a licensed Auschwitz educator since 2006, helps you choose the right time for your visit.'),
    ]),
  ]),

  // ── Block 2: Table of Contents ──
  textBlock('table-of-contents', 'text', [
    p([t('In This Guide:', 1)]),
    ul([
      li([link('Auschwitz Opening Hours by Month', '#opening-hours')], 1),
      li([link('Auschwitz in Spring \u2014 April and May', '#spring')], 2),
      li([link('Auschwitz in Summer \u2014 June to August', '#summer')], 3),
      li([link('Auschwitz in Autumn \u2014 September to November', '#autumn')], 4),
      li([link('Visiting Auschwitz in Winter \u2014 December to March', '#winter')], 5),
      li([link('Best Time of Day to Visit Auschwitz', '#best-time-of-day')], 6),
      li([link('How to Avoid Crowds at Auschwitz', '#how-to-avoid-crowds')], 7),
      li([link('Auschwitz Dress Code: What to Wear Each Season', '#what-to-wear')], 8),
    ]),
  ]),

  // ── Block 3: Opening Hours ──
  textBlock('opening-hours', 'text', [
    h2('Auschwitz Opening Hours by Month'),
    ep(),
    p([
      t('The Auschwitz-Birkenau Memorial is open every day of the year except January 1, December 25, and Easter Sunday. The Memorial opens at 7:30 year-round, but closing times vary dramatically by season \u2014 from 14:00 in December to 19:00 in summer.'),
    ]),
    ep(),
    h3('Closing Times by Month'),
    ep(),
    ul([
      li([t('January and November: ', 1), t('15:00 (last entry at 13:30)')], 1),
      li([t('February: ', 1), t('16:00 (last entry at 14:30)')], 2),
      li([t('March and October: ', 1), t('17:00 (last entry at 15:30)')], 3),
      li([t('April and September: ', 1), t('18:00 (last entry at 16:30)')], 4),
      li([t('May through August: ', 1), t('19:00 (last entry at 17:30)')], 5),
      li([t('December: ', 1), t('14:00 (last entry at 12:30)')], 6),
    ]),
    p([
      t('Last entry is always 90 minutes before closing. After entering, you may remain on the grounds for up to 90 minutes past closing time. A guided tour lasts 3.5 hours, so plan your arrival accordingly \u2014 in winter months, only the earliest morning slots allow a full guided tour.'),
    ]),
    ep(),
    h3('What This Means for Your Visit'),
    ep(),
    p([
      t('The difference between a December visit (6.5 hours of access) and a July visit (11.5 hours) is enormous. In winter, you may need to choose between a guided tour and self-exploration. In summer, you can comfortably do both. Factor the closing time into your '),
      link('transport planning from Krak\u00f3w', '/en/arrival/'),
      t(' \u2014 arriving late in winter may leave too little time for a meaningful visit.'),
    ]),
  ]),

  // ── Block 4: Image (entry tunnel) ──
  imageBlock('image-entry-tunnel', '680ceacc1aff9dbf42d4a305', [
    p([t('The tunnel leading to the main gate and exhibition at Auschwitz I Main Camp')]),
  ]),

  // ── Block 5: Spring ──
  textBlock('spring', 'text', [
    h2('Auschwitz in Spring \u2014 April and May'),
    ep(),
    p([
      t('Spring is one of the best times to visit Auschwitz. The weather is mild, the days are long enough for a thorough visit, and the summer crowds have not yet arrived. The Memorial closes at 18:00 in April and 19:00 in May, giving you ample daylight.'),
    ]),
    ep(),
    h3('Auschwitz Weather in Spring'),
    ep(),
    p([
      t('Expect temperatures between 5\u201318\u00b0C, with April still cool and occasionally rainy. May is warmer and more pleasant. Rain is possible in both months, so bring a waterproof jacket or umbrella. The grounds are mostly outdoors, and paths at Birkenau can be muddy after rain.'),
    ]),
    ep(),
    h3('Fewer Crowds and Good Availability'),
    ep(),
    p([
      t('April sees noticeably fewer visitors than the summer peak. By May, school groups begin to appear, but overall numbers remain manageable. Tickets are easier to reserve, and you are less likely to encounter the long queues that form in July and August. If you are flexible with your dates, mid-April to mid-May is the sweet spot.'),
    ]),
  ]),

  // ── Block 6: Summer ──
  textBlock('summer', 'text', [
    h2('Auschwitz in Summer \u2014 June to August'),
    ep(),
    p([
      t('Summer offers the longest visiting hours \u2014 the Memorial stays open until 19:00 from May through August. You have enough daylight for a full guided tour in the morning and a self-guided return to Birkenau in the afternoon. However, this is also peak season, with the highest visitor numbers of the year.'),
    ]),
    ep(),
    h3('Longest Visiting Hours but Biggest Crowds'),
    ep(),
    p([
      t('Nearly 2 million people visited the Auschwitz Memorial in 2025, and the vast majority came between June and August. Large tour groups, school excursions, and international visitors all converge during these months. Mornings and early afternoons are typically crowded with large groups. Guided tours sell out weeks in advance.'),
    ]),
    ep(),
    h3('Heat and Sun at Birkenau'),
    ep(),
    p([
      t('Birkenau is a vast, open site with almost no shade. On hot summer days, walking the grounds for 1\u20132 hours in direct sun can be physically exhausting. Bring a water bottle, wear sun protection, and pace yourself. The emotional weight of the visit combined with heat and fatigue can be overwhelming \u2014 take breaks when needed.'),
    ]),
    ep(),
    h3('Reserve 2\u20133 Weeks Ahead in Summer'),
    ep(),
    p([
      t('Since March 2026, all entry passes must be reserved online at '),
      link('visit.auschwitz.org', 'https://visit.auschwitz.org', { newTab: true }),
      t('. During summer, guided tour slots sell out quickly. Reserve at least 2\u20133 weeks ahead, especially for weekend dates. Free afternoon entry passes are easier to get but still require advance booking. Check availability regularly \u2014 cancellations appear daily.'),
    ]),
  ]),

  // ── Block 7: Image (visitors at gate) ──
  imageBlock('image-visitors-gate', '67d725fa7d7f6cbd8c6d2639', [
    p([t('A guide with visitors in front of the main Auschwitz I gate \u201cArbeit Macht Frei\u201d')]),
  ]),

  // ── Block 8: Autumn ──
  textBlock('autumn', 'text', [
    h2('Auschwitz in Autumn \u2014 September to November'),
    ep(),
    p([
      t('Autumn is widely considered the best overall season for visiting Auschwitz. The summer crowds thin out, the weather remains comfortable through September, and the atmosphere becomes noticeably more reflective as the days shorten.'),
    ]),
    ep(),
    h3('September \u2014 Best Month to Visit Auschwitz?'),
    ep(),
    p([
      t('September combines the advantages of both summer and autumn. The Memorial closes at 18:00, giving you a full day. Temperatures are pleasant, typically 10\u201320\u00b0C. School groups have returned to class, and the summer rush has subsided. Many experienced visitors and educators recommend September as the single best month to plan your visit.'),
    ]),
    ep(),
    h3('October and November \u2014 Quieter Grounds, Shorter Days'),
    ep(),
    p([
      t('October sees closing time drop to 17:00, and November to 15:00. The weather cools significantly \u2014 expect rain, overcast skies, and temperatures between 0\u201310\u00b0C by late November. The grounds become noticeably quieter. For some visitors, the grey skies and bare trees add to the solemn atmosphere. Dress warmly and bring rain protection.'),
    ]),
  ]),

  // ── Block 9: Quote (Cheryle A.) ──
  textBlock('quote-cheryle', 'quote', [
    p([
      t('\u201cLast year it was warm and sunny, it was very busy and we concentrated hard on taking in all the information from our guide, moving at speed. This year it was cold and overcast, starting to get darker. There were no crowds and sometimes we were completely alone in the silence. The impact was much more intense, completely overwhelming.\u201d', 2),
    ]),
    p([
      t('\u2014 Cheryle A.,', 1),
      t(' Plymouth, Devon, UK \u2014 visited twice in different conditions'),
    ]),
  ]),

  // ── Block 10: Winter ──
  textBlock('winter', 'text', [
    h2('Visiting Auschwitz in Winter \u2014 December to March'),
    ep(),
    p([
      t('Winter transforms the Auschwitz Memorial. The crowds disappear, snow covers the grounds, and the silence is almost total. For many visitors, winter provides the most powerful and emotionally intense experience \u2014 but it demands serious physical preparation.'),
    ]),
    ep(),
    h3('When Is Auschwitz Least Crowded?'),
    ep(),
    p([
      t('The site is at its quietest from November through March. December and January see the fewest visitors of the entire year. You may find yourself walking through barracks or standing at the execution wall in Block 11 completely alone. This solitude allows for a depth of reflection that is simply not possible during peak season.'),
    ]),
    ep(),
    h3('Auschwitz Winter Weather and Conditions'),
    ep(),
    p([
      t('Winter in southern Poland can be harsh. Temperatures regularly drop below zero, and snowfall is common. The paths at Birkenau become icy and slippery. Wind across the flat, open terrain of Birkenau makes the cold feel even more severe. Remember that the prisoners endured these same conditions \u2014 in thin uniforms, without adequate food or shelter. Standing in that cold, even briefly, brings a visceral understanding that no summer visit can replicate.'),
    ]),
    ep(),
    h3('Shorter Hours Limit Your Visit'),
    ep(),
    p([
      t('December closes at 14:00, January and November at 15:00, February at 16:00, and March at 17:00. With last entry 90 minutes before closing, a December visit allows entry only until 12:30. A standard 3.5-hour guided tour starting at the earliest slot may be your only realistic option. Plan accordingly and '),
      link('reserve your entry pass', '/en/tickets/'),
      t(' well in advance.'),
    ]),
  ]),

  // ── Block 11: Image (snow) ──
  imageBlock('image-snow-auschwitz', '67f29635e9da5782807bb4d9', [
    p([t('Snow falling on a stony road between trees and blocks at Auschwitz I Main Camp \u2014 winter visits offer solitude and reflection')]),
  ]),

  // ── Block 12: Best Time of Day ──
  textBlock('best-time-of-day', 'text', [
    h2('Best Time of Day to Visit Auschwitz'),
    ep(),
    p([
      t('Regardless of the season, the time of day you arrive significantly affects your experience. The difference between an 8:00 visit and a noon arrival can mean the difference between contemplative silence and navigating through tour groups.'),
    ]),
    ep(),
    h3('Early Morning \u2014 Fewest Visitors'),
    ep(),
    p([
      t('The Memorial opens at 7:30 every day. The first hour or two are consistently the quietest, before the large guided groups from Krak\u00f3w begin arriving mid-morning. If you want to experience the camp in near-solitude, an early morning slot is your best option \u2014 especially at Auschwitz I, where indoor exhibitions can feel cramped when crowded.'),
    ]),
    ep(),
    h3('Late Afternoon \u2014 After Tour Groups Leave'),
    ep(),
    p([
      t('A second quiet window opens in the late afternoon when most organised tour groups have departed. Free individual entry passes are available for afternoon slots, making this a practical option for self-guided visits. The fading daylight in autumn and winter adds a particularly solemn quality to Birkenau in the late afternoon hours.'),
    ]),
  ]),

  // ── Block 13: How to Avoid Crowds ──
  textBlock('how-to-avoid-crowds', 'text', [
    h2('How to Avoid Crowds at Auschwitz'),
    ep(),
    p([
      t('Auschwitz received nearly 2 million visitors in 2025. At peak times, the exhibitions can feel congested and the emotional gravity of the site harder to absorb. Here are practical strategies to find quieter moments.'),
    ]),
    ep(),
    h3('Visit in the Off-Season'),
    ep(),
    p([
      t('November through March sees a fraction of the summer visitor numbers. If your travel dates are flexible, scheduling your trip outside peak season is the single most effective way to avoid crowds. The trade-off is shorter hours and colder weather, but many visitors consider it worthwhile.'),
    ]),
    ep(),
    h3('Weekdays Over Weekends'),
    ep(),
    p([
      t('Weekends draw higher numbers year-round, particularly Saturday mornings. Tuesday through Thursday tend to be the quietest weekdays. Avoid public holidays and long weekends in Poland, which also bring increased visitor numbers.'),
    ]),
    ep(),
    h3('Skip the Queue as an Individual Visitor'),
    ep(),
    p([
      t('Individual visitors and groups of up to 15 people can bypass the longest entrance queues \u2014 ask the staff on site for assistance. A private tour lets you start 30 minutes before group tours begin. Combined with an off-season or early-morning visit, this means you can often enter with virtually no waiting.'),
    ]),
  ]),

  // ── Block 14: Quote (Olli-Pekka K.) ──
  textBlock('quote-olli-pekka', 'quote', [
    p([
      t('\u201cWith my wife, I visited Auschwitz-Birkenau in June. All the massive tragical things which happened 80 years ago on-site stopped our minds. At the same time, \u0141ukasz challenged our thinking. It is not difficult to draw a link to the horrible things still happening around us \u2014 every day, and not far away.\u201d', 2),
    ]),
    p([
      t('\u2014 Olli-Pekka K.,', 1),
      t(' Jyv\u00e4skyl\u00e4, Finland \u2014 visited in June'),
    ]),
  ]),

  // ── Block 15: What to Wear ──
  textBlock('what-to-wear', 'text', [
    h2('Auschwitz Dress Code: What to Wear Each Season'),
    ep(),
    p([
      t('The Auschwitz Memorial requires modest, respectful attire. Beyond the dress code, practical clothing choices are essential \u2014 much of the visit is outdoors on uneven terrain, in whatever weather the season brings. Comfortable walking shoes are non-negotiable in every season.'),
    ]),
    ep(),
    h3('Spring and Autumn'),
    ep(),
    p([
      t('Layer clothing for changeable conditions. A waterproof jacket and sturdy walking shoes are essential \u2014 the paths at Birkenau can be muddy after rain. Temperatures swing widely: a sunny April morning can start at 5\u00b0C and reach 15\u00b0C by midday. Bring an umbrella.'),
    ]),
    ep(),
    h3('Summer'),
    ep(),
    p([
      t('Wear light, breathable clothing but keep shoulders covered out of respect. Birkenau has almost no shade, so bring sun protection: hat, sunscreen, and a water bottle. The Memorial allows water and non-alcoholic drinks inside the grounds. Avoid open shoes \u2014 the terrain at Birkenau is rough.'),
    ]),
    ep(),
    h3('Winter \u2014 Dress for Below Zero'),
    ep(),
    p([
      t('A warm winter coat, thermal layers, waterproof boots, gloves, a scarf, and a hat are all necessary. You will be outdoors for most of the 3.5-hour tour, and temperatures can drop well below zero. Wind at Birkenau makes the cold feel even harsher. Dress as if you will be standing outside for four hours \u2014 because you will be.'),
    ]),
  ]),

  // ── Block 16: Image (muddy path) ──
  imageBlock('image-muddy-path', '67f29634e9da5782807bb4c4', [
    p([t('Muddy path between sectors at Auschwitz II-Birkenau \u2014 sturdy waterproof shoes are essential in autumn and spring')]),
  ]),

  // ── Block 17: Closing Callout (emphasis, no links) ──
  textBlock('closing-callout', 'emphasis', [
    p([
      t('Every season offers a different experience at the Auschwitz Memorial. Spring and autumn balance comfort with quiet reflection. Summer gives you the most daylight. Winter strips everything to its essence. There is no wrong time to visit \u2014 only the time that is right for you.'),
    ]),
  ]),

  // ── Block 18: Closing Links (text) ──
  textBlock('closing-links', 'text', [
    p([
      t('Ready to plan your visit? Check the '),
      link('ticket and booking options', '/en/tickets/'),
      t(', read the '),
      link('visitor preparation guide', '/en/supplement/'),
      t(', and reserve your entry pass at '),
      link('visit.auschwitz.org', 'https://visit.auschwitz.org', { newTab: true }),
      t('.'),
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
      title: 'Best Time to Visit Auschwitz: Month-by-Month Guide',
      slug: 'best-time-to-visit-auschwitz',
      slugLock: false,
      _status: 'draft',
      authors: ['675f51ab4d074485ad8b59af'],
      categories: ['69c4dc0bc486e36c7c9fe818'],
      meta: {
        title: 'Best Time to Visit Auschwitz: Month-by-Month Guide',
        description:
          'When to visit Auschwitz by month \u2014 opening hours, crowds, weather, and what to wear each season. Practical seasonal advice from a licensed guide. ALT: Auschwitz Memorial grounds in changing seasons showing visitor conditions',
        image: PLACEHOLDER,
      },
      // layout,
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
