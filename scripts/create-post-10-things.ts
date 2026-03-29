/**
 * Creates the "10 Things Most Visitors Miss at Auschwitz-Birkenau" post
 * via Payload Local API.
 *
 * Usage:
 *   npx tsx scripts/create-post-10-things.ts
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

// ─── Text block helper ──────────────────────────────────────────────

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
    p([t('The standard guided tour covers the essential parts of Auschwitz I and Birkenau — but the Memorial stretches across 191 hectares, and most visitors leave having seen only a fraction. Beyond the regular route lie national exhibitions, hidden basement cells, crematoria ruins, and places so significant they changed the course of Holocaust remembrance. As a licensed Auschwitz guide since 2006, these are the places I wish every visitor had time to see.')]),
  ]),

  // ── Block 2: Table of Contents ──
  textBlock('table-of-contents', 'text', [
    p([t('In This Post:', 1)]),
    ul([
      li([link('National Exhibitions at Auschwitz I', '#national-exhibitions')], 1),
      li([link('The Central Sauna at Birkenau', '#central-sauna')], 2),
      li([link('The Judenrampe — Original Arrival Ramp', '#judenrampe')], 3),
      li([link('All Four Crematoria Ruins at Birkenau', '#crematoria-ruins')], 4),
      li([link('The Pond of Ashes', '#pond-of-ashes')], 5),
      li([link('The Sonderkommando Revolt Site', '#sonderkommando-revolt')], 6),
      li([link("Block 11's Standing Cells and Dark Cells", '#block-11-cells')], 7),
      li([link("The International Monument's 23 Language Plaques", '#international-monument')], 8),
      li([link('Sector BIII "Mexico"', '#sector-mexico')], 9),
      li([link("The Commandant's Villa", '#commandants-villa')], 10),
    ]),
  ]),

  // ── Block 3: National Exhibitions ──
  textBlock('national-exhibitions', 'text', [
    h2('National Exhibitions at Auschwitz I'),
    ep(),
    p([t('The permanent exhibition in Blocks 4, 5, 6, 7, and 11 is what every guided tour covers. But scattered across other blocks at Auschwitz I are national exhibitions — created by individual countries to honour their citizens who were deported to the camp. Most visitors never enter a single one.')]),
    ep(),
    h3('Country Exhibitions Since 1960'),
    ep(),
    p([t('These exhibitions began in the late 1950s when each nation with victims at Auschwitz received the right to present its own display. Czechoslovakia and Hungary opened the first in 1960, with others following through the decades. Today, exhibitions from Poland, France, Belgium, the Netherlands, Hungary, the Czech Republic, Slovakia, Austria, Russia, and the Roma people occupy blocks throughout the camp. Many have been renewed over time to reflect evolving historical understanding.')]),
    ep(),
    h3('The Shoah Exhibition — Block 27'),
    ep(),
    p([t('One exhibition stands apart. Block 27 houses "Shoah," prepared by the Yad Vashem Institute in Jerusalem and opened in 2013. It is dedicated to the Jewish experience at Auschwitz — the largest group of victims, numbering over one million. The exhibition uses personal testimonies, photographs, and documents to tell the story of Jewish communities before, during, and after the Holocaust. It is widely considered one of the most powerful exhibitions in the entire Memorial.')]),
  ]),

  // ── Block 4: Image (national exhibitions) ──
  imageBlock('image-national-exhibitions', PLACEHOLDER, [
    p([t('Interior of one of the national exhibitions at Auschwitz I, showing historical photographs and personal testimonies')]),
  ]),

  // ── Block 5: Central Sauna ──
  textBlock('central-sauna', 'text', [
    h2('The Central Sauna at Birkenau'),
    ep(),
    p([t('The largest surviving building in Birkenau stands at the far end of the camp, well past the point where most visitors turn back. Known as the Central Sauna, this was the registration building where prisoners selected for labour were processed. They were stripped of their belongings, shaved, showered, and deloused before being assigned to barracks.')]),
    ep(),
    h3("Walking the Prisoner's Path"),
    ep(),
    p([t('Today, the building houses the only permanent exhibition at the Birkenau site. Visitors walk through rooms in the same sequence that prisoners experienced, following a glass walkway that protects the original floor. Steam delousing chambers line the corridor, and personal items belonging to victims fill the entrance hall.')]),
    ep(),
    h3('Pre-War Family Photographs'),
    ep(),
    p([t('The final room holds what many consider the most moving display at Auschwitz-Birkenau: hundreds of pre-war family photographs of Jewish deportees, discovered on the grounds after liberation. Images of weddings, holidays, children playing — full, ordinary lives that were destroyed. For visitors who make it this far, these photographs are often the moment that makes the scale of loss feel personal.')]),
  ]),

  // ── Block 6: Judenrampe ──
  textBlock('judenrampe', 'text', [
    h2('The Judenrampe — Where Most Victims Actually Arrived'),
    ep(),
    p([t('The railway tracks passing through the famous gate of Birkenau are one of the most recognised images of the Holocaust. But most victims never arrived there. Between 1942 and May 1944, approximately 800,000 people were unloaded at the Judenrampe — an older railway siding located between Auschwitz I and Birkenau, about 500 metres from Birkenau\u2019s main gate.')]),
    ep(),
    h3('The 2.5-Kilometre March to Death'),
    ep(),
    p([t('From this ramp, those selected for death faced a 2.5-kilometre forced march to the gas chambers. The ramp inside Birkenau was only built in May 1944, primarily for the Hungarian transports. The Judenrampe handled far more deportees over a much longer period, yet it sits outside both camp perimeters and is not included in standard guided tours.')]),
    ep(),
    h3('Two Original Cattle Cars'),
    ep(),
    p([t('Visitors can find the original tracks and platform between the two camps, opened to the public on 27 January 2005. Two original cattle cars stand on the rails — a French wagon and a German one, both dating from the early 20th century. Most people pass nearby on the shuttle bus between the two sites without realising what they are seeing.')]),
  ]),

  // ── Block 7: Image (Judenrampe) ──
  imageBlock('image-judenrampe', PLACEHOLDER, [
    p([t('Original cattle cars standing on the Judenrampe railway tracks between Auschwitz I and Birkenau')]),
  ]),

  // ── Block 8: Crematoria Ruins ──
  textBlock('crematoria-ruins', 'text', [
    h2('All Four Crematoria Ruins at Birkenau'),
    ep(),
    p([t('Birkenau had four large crematoria, built between March and June 1943. Each contained underground undressing rooms, gas chambers disguised as showers, and cremation ovens manufactured by the German company Topf und Söhne. The SS dynamited them in January 1945 to destroy evidence of their crimes.')]),
    ep(),
    h3('Beyond Crematorium II'),
    ep(),
    p([t('Most guided tours stop briefly at the ruins of Crematorium II, the nearest to the main path. But the remains of all four are accessible. Crematoria II and III lie as collapsed reinforced concrete — thick slabs cracked and buckled by the explosions, with underground chambers partially visible. Crematorium IV was destroyed during the Sonderkommando revolt of October 1944. Crematorium V was set ablaze during the camp evacuation.')]),
    ep(),
    h3('Open-Air Burning Pits'),
    ep(),
    p([t('Near the crematoria, fenced-off areas mark where open-air burning pits were dug when the ovens could not keep pace with the killing — particularly during the Hungarian transports of summer 1944, when up to 9,000 people were murdered daily. These pits, some 40–50 metres long, are easy to walk past without noticing.')]),
  ]),

  // ── Block 9: Pond of Ashes ──
  textBlock('pond-of-ashes', 'text', [
    h2('The Pond of Ashes'),
    ep(),
    p([t('A grey-green pond near the crematoria holds the ashes of tens of thousands of murdered people. Ashes from the crematoria and burning pits were disposed of in several ways — buried, scattered in nearby woods, used to surface camp roads, dumped into the Vistula and Soła rivers, and poured into this pond.')]),
    ep(),
    h3('A Mass Grave in Plain Sight'),
    ep(),
    p([t('A memorial stone reads: "To the memory of the men, women and children who fell victim to the Nazi genocide. Here lie their ashes. May their souls rest in peace." The pond is thick with algae and could be mistaken for an ordinary feature of the landscape. Many visitors who reach the crematoria ruins walk right past it without realising they are standing beside a mass grave — for many victims, the closest thing to a burial site that exists.')]),
  ]),

  // ── Block 10: Sonderkommando Revolt ──
  textBlock('sonderkommando-revolt', 'text', [
    h2('The Sonderkommando Revolt Site'),
    ep(),
    p([t('On 7 October 1944, Jewish members of the Sonderkommando — prisoners forced to work in the crematoria — staged the only armed uprising in the history of Auschwitz. At Crematorium IV, they used explosives smuggled over months by four young Jewish women working in the nearby munitions factory: Ester Wajcblum, Ella Gärtner, Regina Safirsztajn, and Róża Robota.')]),
    ep(),
    h3('Four Women Who Smuggled Gunpowder'),
    ep(),
    p([t('The prisoners set fire to Crematorium IV and fought the SS with whatever they had. The revolt was suppressed — 452 Sonderkommando members and three SS guards were killed. Crematorium IV never operated again. The four women who had smuggled the gunpowder were identified, tortured, and publicly hanged at Birkenau on 6 January 1945 — three weeks before liberation. Róża Robota\u2019s last words, passed to a fellow prisoner, were: "Be strong and have courage."')]),
    ep(),
    h3('An Unmarked Site of Courage'),
    ep(),
    p([t('The ruins of Crematorium IV are among the least visited of the four sites. There is no prominent marker specifically commemorating the revolt, and many visitors pass by unaware of what happened here.')]),
  ]),

  // ── Block 11: Sonderkommando Quote ──
  textBlock('sonderkommando-quote', 'quote', [
    p([t('The history of the Sonderkommando prisoners belongs without any doubt to the darkest chapters in the history of the Auschwitz camp. The perpetrators decided to abuse victims with premeditation to work at the extermination facilities. That\u2019s why the fact that they risked their lives in order to document the crimes, pass information for the next generations about what happened behind the fences of gas chambers and crematories, is an indication of foresight, understanding of their own situation and huge courage.', 2)]),
    p([
      t('— Dr. Piotr M.A. Cywiński,', 1),
      t(' Director of the Auschwitz-Birkenau State Museum, '),
      link('70th Anniversary of the Sonderkommando Revolt', 'https://www.auschwitz.org/en/museum/news/70th-anniversary-of-the-sonderkommando-revolt,1107.html', { newTab: true }),
    ]),
  ]),

  // ── Block 12: Image (crematoria ruins) ──
  imageBlock('image-crematoria', PLACEHOLDER, [
    p([t('Collapsed concrete ruins of one of the crematoria at Birkenau, destroyed by the SS in January 1945')]),
  ]),

  // ── Block 13: Block 11 Cells ──
  textBlock('block-11-cells', 'text', [
    h2("Block 11's Standing Cells and Dark Cells"),
    ep(),
    p([t('Block 11 at Auschwitz I — the Death Block — is part of the standard route, but its basement holds details that visitors often move through too quickly. The building served as the camp prison, and its basement contained three types of punishment cells.')]),
    ep(),
    h3('Punishment Cells in the Basement'),
    ep(),
    p([t('The standing cells were spaces of just 90 by 90 centimetres. Four prisoners were confined together, forced to stand the entire night — sometimes for 20 consecutive nights — and then sent to forced labour during the day. They could only enter through a small opening at floor level. The dark cells had their vents sealed with metal screens, trapping prisoners in total darkness for days or weeks.')]),
    ep(),
    h3('The First Mass Gassing with Zyklon B'),
    ep(),
    p([t('It was in this basement that the first mass gassing with Zyklon B took place around 3 September 1941, killing approximately 600 Soviet prisoners of war and 250 sick Polish prisoners. Some survived the initial gassing, requiring an additional dose. This experiment led directly to the construction of the gas chambers and the industrialised extermination that followed. Inscriptions scratched by prisoners into the walls and ceiling beams remain — for many, the only trace that they existed.')]),
  ]),

  // ── Block 14: Block 11 Quote ──
  textBlock('block-11-quote', 'quote', [
    p([t('Each standing cell had a floor area of 90 by 90 centimeters. Four prisoners were placed in one such cell, spending the entire night unable to sit down.', 2)]),
    p([
      t('— Dr. Adam Cyra,', 1),
      t(' Auschwitz Museum Research Centre, '),
      link('Block No. 11 in Auschwitz — Podcast', 'https://www.auschwitz.org/en/education/e-learning/podcast/block-no-11-in-auschwitz/', { newTab: true }),
    ]),
  ]),

  // ── Block 15: International Monument ──
  textBlock('international-monument', 'text', [
    h2("The International Monument's 23 Language Plaques"),
    ep(),
    p([t('The International Monument to the Victims of Fascism stands at the far end of the railway tracks in Birkenau. Designed by Italian architects Pietro and Andrea Cascella, it was selected from 465 design proposals from 36 countries — the jury was chaired by sculptor Henry Moore. Most guided tours stop here, but few visitors read every plaque.')]),
    ep(),
    h3('23 Languages of the Deported'),
    ep(),
    p([t('On the cobblestone platform lie 23 bronze tablets, each bearing the same inscription in a different language — the languages of the peoples deported to Auschwitz. They include not only major European languages but also Hebrew, Yiddish, Romani, and Ladino (Judeo-Spanish), specifically honouring Jewish and Roma victims.')]),
    ep(),
    h3('An Inscription Corrected by History'),
    ep(),
    p([t('The inscription itself carries a significant history. The original 1967 plaques stated that "four million people suffered and died here" without specifically mentioning Jewish victims. After decades of historical research, the old stone plaques were removed in 1990. The current bronze tablets, installed in 1995, read: "For ever let this place be a cry of despair and a warning to humanity, where the Nazis murdered about one and a half million men, women, and children, mainly Jews from various countries of Europe."')]),
  ]),

  // ── Block 16: Sector Mexico ──
  textBlock('sector-mexico', 'text', [
    h2('Sector BIII "Mexico" — The Unfinished Camp'),
    ep(),
    p([t('At the farthest reaches of Birkenau lies an area that looks like empty farmland. This was Sector BIII, nicknamed "Mexico" by prisoners — one of the most chilling aspects of the Nazi plans, because it means they were still building more.')]),
    ep(),
    h3('188 Planned Barracks, 32 Completed'),
    ep(),
    p([t('Construction began in mid-1943 with plans for 188 barracks housing 60,000 prisoners. Work was halted in early 1944 with only 32 barracks completed. From May 1944, Jewish women deported from Hungary were held in these unfinished structures with no kitchens, washrooms, latrines, or bunks. The conditions were among the worst in the entire camp.')]),
    ep(),
    h3('Empty Fields with a Hidden Story'),
    ep(),
    p([t("Today, only foundations and faint outlines remain. Without context, visitors see only grass and earth. But understanding what this empty space was meant to become — and what it briefly was — reveals the scale of the planned expansion of the killing operation, and the particular suffering of Hungarian Jewish women during the final year of the camp\u2019s existence.")]),
  ]),

  // ── Block 17: Image (Sector Mexico) ──
  imageBlock('image-sector-mexico', PLACEHOLDER, [
    p([t('Open field at the far end of Birkenau where Sector BIII "Mexico" once stood, with barely visible foundation outlines')]),
  ]),

  // ── Block 18: Commandant's Villa ──
  textBlock('commandants-villa', 'text', [
    h2("The Commandant's Villa"),
    ep(),
    p([t('At 88 Legionów Street in Oświęcim, about 200 metres from the gas chamber at Auschwitz I, stands a three-storey house with a garden. This was the home of Rudolf Höss, commandant of Auschwitz from 1940 to 1943, where he lived with his wife and five children while overseeing the murder of over one million people next door.')]),
    ep(),
    h3('From Private Home to Research Centre'),
    ep(),
    p([t('The villa gained worldwide attention through Jonathan Glazer\u2019s 2023 film "The Zone of Interest." On 27 January 2025 — the 80th anniversary of the camp\u2019s liberation — the house was opened to the public as the Auschwitz Research Center on Hate, Extremism and Radicalization, run by the Counter Extremism Project. Post-war modifications were removed to restore its wartime appearance.')]),
    ep(),
    h3('The Banality of Evil'),
    ep(),
    p([t('The house stands as a stark illustration of what Hannah Arendt described as the banality of evil — a garden where children played, metres from an extermination camp. It is the proximity and the ordinariness of domestic life maintained alongside industrialised murder that makes this place so deeply unsettling.')]),
  ]),

  // ── Block 19: Closing Callout (emphasis) ──
  textBlock('closing-callout', 'emphasis', [
    p([t('The standard guided tour provides essential context and understanding, but the Memorial holds far more for those with extra time. If you are planning a longer visit, consider a study tour or return for a self-guided visit to reach these overlooked places. The stories they hold are part of a fuller, more complete picture of what happened at Auschwitz-Birkenau.')]),
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
      title: '10 Things Most Visitors Miss at Auschwitz-Birkenau',
      slug: 'things-visitors-miss-auschwitz',
      slugLock: false,
      _status: 'draft',
      authors: ['675f51ab4d074485ad8b59af'],
      categories: ['69c4db86c486e36c7c9fe55d'],
      meta: {
        title: '10 Things Most Visitors Miss at Auschwitz-Birkenau',
        description:
          'Most visitors only see a fraction of Auschwitz-Birkenau. A licensed guide reveals 10 overlooked places that deepen your understanding of the Memorial. ALT: Birkenau railway tracks leading to the gate with ruins of crematoria visible in the distance',
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
