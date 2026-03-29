/**
 * Creates the "Auschwitz Emotional Preparation" post via Payload Local API.
 *
 * Usage:
 *   npx tsx scripts/create-post-emotional-preparation.ts
 */

import { readFileSync } from 'fs'

// Load .env before importing Payload
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

const ep = () => p([]) // empty paragraph

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

// ─── Layout ─────────────────────────────────────────────────────────

const PLACEHOLDER = '67be70ae35ec329c954f5410'

const layout = [
  // ── Block 1: Intro (emphasis) ──
  textBlock('intro', 'emphasis', [
    p([
      t('Visiting Auschwitz is one of the most emotionally intense experiences many people will ever have. Some visitors cry, others feel numb or angry \u2014 there is no \u201cright\u201d way to react, and every response is valid. This guide, written by a licensed Auschwitz educator since 2006, helps you prepare emotionally before your visit, understand what you will see on site, and process the experience after you leave.'),
    ]),
  ]),

  // ── Block 2: Table of Contents ──
  textBlock('table-of-contents', 'text', [
    p([t('In This Guide:', 1)]),
    ul([
      li([link('Why Visiting Auschwitz Is Emotionally Different', '#why-emotionally-different')], 1),
      li([link('How to Emotionally Prepare Before Your Visit', '#emotional-preparation-before')], 2),
      li([link('What to Expect at Auschwitz \u2014 The Visiting Conditions', '#what-to-expect')], 3),
      li([link('Preparing for Difficult Content \u2014 What You Will See', '#difficult-content')], 4),
      li([link('Guided Tour or Self-Guided \u2014 Which Is Better Emotionally?', '#guided-vs-self-guided')], 5),
      li([link('Is Auschwitz Appropriate for Children?', '#children-visiting')], 6),
      li([link('How to Process the Experience After Your Visit', '#processing-after-visit')], 7),
      li([link('There Is No \u201cRight\u201d Way to Feel', '#no-right-way-to-feel')], 8),
    ]),
  ]),

  // ── Block 3: Why Emotionally Different ──
  textBlock('why-emotionally-different', 'text', [
    h2('Why Visiting Auschwitz Is Emotionally Different'),
    ep(),
    p([
      t('Auschwitz-Birkenau is not a typical museum. It is the preserved site where approximately 1.1 million people \u2014 the vast majority of them Jews \u2014 were murdered in a systematic, industrial operation. You will walk through the original camp grounds, authentic barracks, and preserved evidence of mass murder. The exhibitions contain real photographs of victims, their personal belongings, and physical evidence of the crimes committed here.'),
    ]),
    ep(),
    h3('Numbers Become Faces'),
    ep(),
    p([
      t('What makes Auschwitz different from reading about the Holocaust in a textbook is the sheer confrontation with reality. The scale of human suffering becomes tangible when you stand in the rooms where it happened. History stops being abstract \u2014 it becomes something you can see, touch, and feel in the silence around you.'),
    ]),
    ep(),
    h3('Every Visitor Reacts Differently'),
    ep(),
    p([
      t('Some visitors describe feeling heavy-hearted and tearful. Others feel a deep silence settle over them. Some feel anger, disbelief, or even numbness. One visitor who came twice described her first visit as informative but manageable, while her second visit left her in tears: \u201cThe gas chamber was overwhelming this time and I had to get out.\u201d None of these reactions is wrong \u2014 they are all natural human responses to confronting the reality of what happened here.'),
    ]),
  ]),

  // ── Block 4: Image (gate) ──
  imageBlock('image-camp-grounds', '67d725fa7d7f6cbd8c6d2639', [
    p([t('Visitors in front of the main Auschwitz I gate \u201cArbeit Macht Frei\u201d \u2014 the starting point of the tour through the original camp grounds')]),
  ]),

  // ── Block 5: Emotional Preparation Before ──
  textBlock('emotional-preparation-before', 'text', [
    h2('How to Emotionally Prepare Before Your Visit'),
    ep(),
    p([
      t('The single most important thing you can do is learn the history before you arrive. Understanding the context of what you will see transforms your visit from confusion into comprehension \u2014 and helps you absorb the experience without being completely overwhelmed.'),
    ]),
    ep(),
    h3('Read Trusted Sources and Survivor Testimonies'),
    ep(),
    p([
      t('Start with survivor memoirs that provide first-hand accounts of life in the camp. Primo Levi\u2019s \u201cIf This Is a Man\u201d is one of the most important Auschwitz testimonies ever written. \u201cNight\u201d by Elie Wiesel and \u201cThe Choice\u201d by Edith Eger are also highly recommended. Consider watching a documentary for visual context \u2014 but avoid fictionalized accounts. Even bestselling titles like \u201cThe Boy in the Striped Pajamas\u201d or \u201cThe Tattooist of Auschwitz\u201d contain false depictions that distort the reality of the camp.'),
    ]),
    ep(),
    h3('Use the Tour Walkthrough'),
    ep(),
    p([
      t('The '),
      link('tour page', '/en/tour/'),
      t(' on this site provides a location-by-location walkthrough with historical context. Going through it before your visit helps you understand what you are seeing at each point and allows you to focus on reflection rather than trying to absorb everything for the first time. Make a list of specific blocks or exhibits you want to see \u2014 on a guided tour, ask questions and take notes.'),
    ]),
    ep(),
    h3('Consider a Study Tour for Deeper Insights'),
    ep(),
    p([
      t('If you want the deepest possible understanding, consider a 6-hour guided study tour with an expert Museum educator. These tours include access to less-visited areas and provide detailed context that the standard 3.5-hour tour cannot cover. The '),
      link('official Auschwitz Memorial website', 'https://www.auschwitz.org', { newTab: true }),
      t(' is the most reliable source for educational preparation.'),
    ]),
  ]),

  // ── Block 6: What to Expect ──
  textBlock('what-to-expect', 'text', [
    h2('What to Expect at Auschwitz \u2014 The Visiting Conditions'),
    ep(),
    p([
      t('Understanding the physical conditions of your visit helps you prepare both logistically and emotionally. When you know what to expect, you can focus your energy on the experience itself rather than being caught off guard.'),
    ]),
    ep(),
    h3('Physical Demands'),
    ep(),
    p([
      t('Expect extensive walking on uneven paths, climbing numerous and sometimes slippery stairs, and exposure to weather conditions \u2014 summers can be very hot, winters well below zero. Most of the visit takes place outdoors. A guided tour lasts 3.5 hours; a thorough self-guided visit takes at least 4\u20135 hours. Comfortable walking shoes are essential, and you should dress for the season.'),
    ]),
    ep(),
    h3('Security and Entry'),
    ep(),
    p([
      t('There is airport-style security at the entrance. Bags must not exceed 30\u00d720\u00d710 cm \u2014 larger bags and backpacks must be left in lockers at the visitor centre. Bring your entry pass (printed or digital with barcode) and a valid photo ID. Since March 2026, all entry passes must be reserved online in advance at '),
      link('visit.auschwitz.org', 'https://visit.auschwitz.org', { newTab: true }),
      t(' \u2014 there are no on-site ticket sales.'),
    ]),
    ep(),
    h3('Food, Water, and Facilities'),
    ep(),
    p([
      t('Eating is prohibited inside the Museum grounds, but staying hydrated is encouraged \u2014 water and non-alcoholic drinks are allowed. Restrooms are available at the entrances and at a few points inside the Memorial. Restaurants operate at the Auschwitz I visitor centre and at the Birkenau parking area. Pack a water bottle and a light snack for before or after.'),
    ]),
  ]),

  // ── Block 7: Difficult Content ──
  textBlock('difficult-content', 'text', [
    h2('Preparing for Difficult Content \u2014 What You Will See'),
    ep(),
    p([
      t('Knowing what awaits you inside the camp reduces the shock and allows you to be more present during your visit. This section describes the most emotionally challenging parts of the tour so you can prepare yourself.'),
    ]),
    ep(),
    h3('Auschwitz I \u2014 The Main Camp'),
    ep(),
    p([
      t('You will pass through the infamous \u201cArbeit macht frei\u201d gate. Blocks 4 and 5 contain exhibitions on mass extermination and confiscated personal belongings \u2014 suitcases, shoes, glasses, and other items taken from victims upon arrival. Block 4 also houses the victims\u2019 hair exhibit, which many visitors describe as the most difficult moment of the entire visit. Photography is not allowed in this room or in the Block 11 basements.'),
    ]),
    p([
      t('Block 11 was the camp\u2019s prison \u2014 here you will see underground punishment cells, the SS court, and the execution wall in the courtyard. The tour of Auschwitz I concludes at Crematorium I, the only remaining crematorium and gas chamber at this site.'),
    ]),
    ep(),
    h3('Auschwitz II-Birkenau \u2014 The Extermination Camp'),
    ep(),
    p([
      t('Birkenau is where the scale of the crime becomes fully visible. You enter through the iconic railway gate and walk along the tracks to the selection ramp \u2014 the place where arriving Jews were divided into those sent directly to the gas chambers and those selected for forced labour. At the far end of the tracks stand the ruins of the gas chambers and crematoria, deliberately destroyed by the SS before liberation. The international memorial stands nearby. You will also see the barracks where prisoners lived in unimaginable conditions.'),
    ]),
    ep(),
    h3('Allow Yourself to Pause'),
    ep(),
    p([
      t('You do not need to see everything. If a particular room or exhibit becomes too much, step outside, take a breath, and return when you are ready \u2014 or move on. There is no obligation to absorb every detail in a single visit.'),
    ]),
  ]),

  // ── Block 8: Quote (Marian Turski) ──
  textBlock('survivor-testimony', 'quote', [
    p([
      t('\u201cThey used to ask: \u2018What was the worst in Auschwitz?\u2019 They expect: hunger... cold... living conditions... lice. But the worst was: humiliation. If you were Jewish, we were treated not like a human being. We were treated like a louse, like a cockroach. And what do people do with cockroaches? They step on, they crush, they annihilate... If I would have to choose among all the lessons \u2014 one or two \u2014 I would choose: Empathy. Compassion. These are the most important in life.\u201d', 2),
    ]),
    p([
      t('\u2014 Marian Turski,', 1),
      t(' Auschwitz survivor (prisoner B-940), Holocaust Memorial Ceremony, United Nations, 28 January 2019. '),
      link('Full statement (PDF)', 'https://www.un.org/sites/un2.un.org/files/2020/08/statement_by_marian_turski.pdf', { newTab: true }),
    ]),
  ]),

  // ── Block 9: Image (Birkenau) ──
  imageBlock('image-birkenau', '68061bc42aa9f47f838b3052', [
    p([t('Auschwitz II-Birkenau main watchtower \u2014 the vast scale of the extermination camp becomes apparent only when walking its grounds')]),
  ]),

  // ── Block 10: Guided vs Self-Guided ──
  textBlock('guided-vs-self-guided', 'text', [
    h2('Guided Tour or Self-Guided \u2014 Which Is Better Emotionally?'),
    ep(),
    p([
      t('Both options offer a meaningful experience, but they affect you in different ways. Your choice depends on whether you need structured context or space for personal reflection.'),
    ]),
    ep(),
    h3('Guided Tours Provide Context and Structure'),
    ep(),
    p([
      t('A guided tour provides historical information and context that is not immediately apparent from the signs or exhibits alone. Having an educator narrate the history helps you understand the significance of each location. This is especially valuable for first-time visitors. The structure also creates a certain emotional buffer \u2014 you are part of a group, moving at a set pace, focused on listening and learning.'),
    ]),
    ep(),
    h3('Self-Guided Visits Allow Deeper Reflection'),
    ep(),
    p([
      t('An independent visit allows more time for reflection and exploration beyond the standard route. However, it requires thorough preparation to grasp the historical significance. The emotional impact can be more intense \u2014 without the guide\u2019s narration, you are alone with the silence and the site itself. One visitor described returning for a self-guided visit: \u201cWhen we arrived there were only a handful of people. In the prison block we were completely alone.\u201d'),
    ]),
    ep(),
    h3('A Practical Recommendation'),
    ep(),
    p([
      t('If this is your first visit, a '),
      link('guided tour', '/en/tickets/'),
      t(' is recommended \u2014 the educator\u2019s knowledge adds layers of understanding you would otherwise miss. If you have visited before or have studied the history extensively, a self-guided afternoon visit offers a profoundly different, more personal experience. Free individual entry passes are available for '),
      link('afternoon time slots', '/en/tickets/'),
      t('.'),
    ]),
  ]),

  // ── Block 11: Quote (Cheryle A.) ──
  textBlock('visitor-reflection', 'quote', [
    p([
      t('\u201cThis visit really hit me in a completely different way. I remembered everything I\u2019d seen the previous year and felt extremely sad but this time I couldn\u2019t stop the tears. The gas chamber was overwhelming this time and I had to get out. I just wanted to leave.\u201d', 2),
    ]),
    p([
      t('\u2014 Cheryle A.,', 1),
      t(' Plymouth, Devon, UK \u2014 returned for a second visit to pay her respects'),
    ]),
  ]),

  // ── Block 12: Children Visiting ──
  textBlock('children-visiting', 'text', [
    h2('Is Auschwitz Appropriate for Children?'),
    ep(),
    p([
      t('This is one of the most common questions parents ask, and the answer depends on your child\u2019s individual maturity rather than a fixed age rule.'),
    ]),
    ep(),
    h3('The Museum\u2019s Recommendation'),
    ep(),
    p([
      t('The Auschwitz-Birkenau Memorial recommends that visitors be at least 14 years old due to the sensitive content of the exhibitions. Children under 14 are allowed but must be accompanied by an adult at all times. Visitors with infants should use a baby carrier \u2014 strollers cannot be used inside buildings. A changing room with amenities is available in the reception area.'),
    ]),
    ep(),
    h3('Preparing Children for the Visit'),
    ep(),
    p([
      t('If you decide to bring a teenager, preparation is essential. Discuss the basic history beforehand in age-appropriate terms \u2014 who was persecuted and why, what a concentration camp was, and what they will see. Explain that some images and exhibits are very difficult. Let them know it is okay to feel upset, confused, or even not to feel anything at all. Agree in advance that they can step outside any exhibit if they need to.'),
    ]),
    ep(),
    h3('After the Visit with Children'),
    ep(),
    p([
      t('Plan for quiet discussion time afterwards \u2014 do not schedule another activity immediately. Ask open questions: \u201cWhat stood out to you?\u201d or \u201cIs there anything you want to talk about?\u201d Younger visitors may process the experience over days or weeks. Be available for questions that may come later and watch for signs of distress in the following period.'),
    ]),
  ]),

  // ── Block 13: Processing After Visit ──
  textBlock('processing-after-visit', 'text', [
    h2('How to Process the Experience After Your Visit'),
    ep(),
    p([
      t('The emotional impact of Auschwitz does not end when you leave the grounds. Many visitors report that the experience stays with them for days, weeks, or longer. Planning for this is just as important as preparing for the visit itself.'),
    ]),
    ep(),
    h3('Keep Your Schedule Light Afterwards'),
    ep(),
    p([
      t('Do not plan other activities for the rest of the day. Give yourself quiet time to sit with what you have seen. Many visitors describe feeling drained, heavy, or deeply reflective after leaving. Travelling from Krak\u00f3w can add fatigue \u2014 if possible, consider staying overnight in O\u015bwi\u0119cim to rest before and after.'),
    ]),
    ep(),
    h3('Talk About What You Experienced'),
    ep(),
    p([
      t('Share the experience with whoever accompanied you \u2014 or reach out to others who have visited. Talking helps process complex emotions. The '),
      link('Auschwitz Visiting Advice Facebook group', 'https://www.facebook.com/groups/auschwitzvisitingadvice', { newTab: true }),
      t(' is a community of thousands of people who have visited the camp and share their reflections and experiences.'),
    ]),
    ep(),
    h3('Give Yourself Time'),
    ep(),
    p([
      t('One visitor from Finland described how \u201cthe sad place and the tour left a strong mark in our minds.\u201d Another wrote about her mind returning to the experience repeatedly after coming home. This is normal. Allow yourself to reflect, journal if it helps, and understand that the visit may change how you see certain things. Seeking support is always an option if the emotions feel too heavy to carry alone.'),
    ]),
  ]),

  // ── Block 14: Image (memorial) ──
  imageBlock('image-memorial', PLACEHOLDER, [
    p([t('The international memorial at Auschwitz II-Birkenau \u2014 a place for quiet reflection after walking through the former extermination camp')]),
  ]),

  // ── Block 15: No Right Way to Feel ──
  textBlock('no-right-way-to-feel', 'text', [
    h2('There Is No \u201cRight\u201d Way to Feel'),
    ep(),
    p([
      t('If there is one thing to take away from this guide, it is this: whatever you feel at Auschwitz \u2014 or after \u2014 is valid. There is no expected emotional response. Some visitors weep. Some stand in stunned silence. Some feel nothing in the moment and are surprised when the emotions surface days later. Some visit twice and have completely different experiences each time.'),
    ]),
    ep(),
    h3('Why Visiting Matters'),
    ep(),
    p([
      t('Visiting Auschwitz is not about sadness for its own sake. It is an act of remembrance \u2014 a way to honour the 1.1 million people who were murdered here and to confront the reality of what human beings are capable of doing to one another. As one visitor reflected: \u201cIt is not difficult to draw a link to the horrible things still happening around us \u2014 every day, and not far away.\u201d'),
    ]),
    ep(),
    h3('You Become a Witness'),
    ep(),
    p([
      t('By walking through these grounds, you carry the memory forward. Over 2.3 million people visited in 2025 alone \u2014 each one choosing to see, to understand, and to remember. That choice, and the emotions that come with it, is what keeps this memorial alive for future generations.'),
    ]),
  ]),

  // ── Block 16: Closing Callout (emphasis) ──
  textBlock('closing-callout', 'emphasis', [
    p([
      t('Preparation \u2014 both practical and emotional \u2014 makes the difference between a rushed trip and a meaningful act of remembrance. Learn the history, give yourself time, and allow whatever feelings come. Start with the '),
      link('preparation checklist', '/en/supplement/'),
      t(' and reserve your entry pass at '),
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
      title: 'Auschwitz Emotional Preparation: What to Expect and How to Cope',
      slug: 'auschwitz-emotional-preparation',
      slugLock: false,
      _status: 'draft',
      authors: ['675f51ab4d074485ad8b59af'],
      categories: ['69c4dc0bc486e36c7c9fe818'],
      meta: {
        title: 'Auschwitz Emotional Preparation: What to Expect and How to Cope',
        description:
          'How to emotionally prepare for visiting Auschwitz. What to expect, how to process the experience, and advice for families \u2014 from a licensed guide. ALT: Visitors walking solemnly through the gate of Auschwitz I main camp',
        image: '67be70ae35ec329c954f5410',
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
