# Donation Placement + SEO CTR — Audit & Plan

## Context

Site gets massive impressions (400k+/month) but donation CTA only exists on `/support` — a page almost no one visits (8 active users/month). Content pages are where the value is delivered; that's where donation nudges belong. Separately, EN CTR is critically low on top pages — `/en/tickets/` at 0.56% vs `/pl/tickets/` at 2.35% for the same content. This gap alone costs ~2,000 clicks/month.

**Scope: EN only. No Polish work until EN is proven.**

---

## Part 1 — Donation Component Placement

**Design:** compact Content block appended near the end of each page. No tiers. 2-line contextual hook + two payment buttons.

Payment links (reused from support page):

- Stripe: `https://donate.stripe.com/bJefZhe8d04jgclgDL0Fi01?locale=en`
- PayPal: `https://www.paypal.com/donate/?hosted_button_id=WE3LXWNR3JLFY`

**Pages + placement + copy:**

| Page              | Position                                                                    | Hook copy                                                                                                                                                                                                  |
| ----------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/en/tickets/`    | After block 22 (final scam/cheap-tour accordion)                            | "There are hundreds of sites selling fake Auschwitz tickets. This page exists so you don't land on one. If it helped you book correctly — or for free — consider a small thank-you to keep it up to date." |
| `/en/arrival/`    | After final block (~15, airport transfers)                                  | "Most visitors stress about getting to Auschwitz. This guide maps every option so you don't have to figure it out alone. If it helped you plan a stress-free journey, consider supporting the work."       |
| `/en/tour/`       | After final Birkenau block (block 58)                                       | "This guide covers 50+ locations across both camps — built from 20 years of guiding. If it helped you plan a more meaningful visit, consider a small thank-you."                                           |
| `/en/supplement/` | After visitor testimonials section (~block 15) — before survivor narratives | "Years of guiding experience condensed into one page — so you arrive prepared, not overwhelmed. If this made your visit more meaningful, consider supporting the work."                                    |
| `/en/faq/`        | After final accordion (block 14, History Basics)                            | "These answers come from 20 years of answering the same questions at the gate. If they saved you hours of research, a small contribution keeps this resource free."                                        |

**Implementation:** `mcp__visitauschwitz-cms-local__updatePages` — fetch current layout, append new Content block, update.

---

## Part 2 — SEO Metadata (EN only)

**CTR gaps:**

| Page              | Clicks | Impressions | CTR   | Problem                                         |
| ----------------- | ------ | ----------- | ----- | ----------------------------------------------- |
| `/en/tickets/`    | 634    | 112,457     | 0.56% | PL version = 2.35% — title too generic          |
| `/en/supplement/` | 517    | 94,608      | 0.55% | Title is vague, matches no real query           |
| `/en/arrival/`    | 2,588  | 143,492     | 1.80% | Biggest absolute opportunity (143k impressions) |
| `/en/faq/`        | 148    | 22,371      | 0.66% | Could be more specific                          |
| `/en/tour/`       | 462    | 56,173      | 0.82% | Lacks differentiator                            |

**Proposed changes:**

**`/en/tickets/`**

- Current title: `Auschwitz Tickets & Tours: How to Book`
- New title: `Auschwitz Tickets 2026: Free Entry & How to Book Safely`
- New desc: `Entry to Auschwitz is completely free in the afternoon — no ticket needed. Learn how to book guided tours, avoid fake booking sites, and visit without stress. Updated 2026.`

**`/en/supplement/`**

- Current title: `Auschwitz: What Most Visitors Wish They Knew`
- New title: `Auschwitz Visit Guide: What to Bring, Rules & Insider Tips`
- New desc: `Luggage policy, dress code, best times to visit, spots beyond the standard route, and survival tips from a licensed guide. Everything you need before you go.`

**`/en/arrival/`**

- Current title: `How to Get to Auschwitz: Transport & Parking Guide`
- New title: `How to Get to Auschwitz from Kraków: Bus, Train & Parking 2026`
- New desc: `Compare every transport option from Kraków to Auschwitz: direct buses, trains, private transfers, and driving routes. Includes parking, travel times and arrival tips.`

**`/en/faq/`**

- Current title: `Auschwitz FAQ: Tickets, Tours & Transport Explained`
- New title: `Auschwitz FAQ 2026: Tickets, Entry, Tours & What to Expect`
- New desc: `Expert answers on free entry, online booking, getting there from Kraków, tour options, dress code, opening hours and what to expect at the memorial. Updated 2026.`

**`/en/tour/`**

- Current title: `Auschwitz Tour Routes: Main Sites & Interactive Map`
- New title: `Auschwitz Tour Route 2026: 50 Locations, Map & Guide Tips`
- New desc: `Detailed walkthrough of every significant location across Auschwitz I and Birkenau — 50+ sites with an interactive map, guide commentary, and what not to miss.`

**Implementation:** `mcp__visitauschwitz-cms-local__updatePages` — update `meta.title` + `meta.description` fields per page.

---

## Verification

- [ ] Fetch each updated page via MCP — confirm donation block in layout and new SEO fields
- [ ] Check admin UI — confirm donation blocks render correctly in layout editor
- [ ] SEO: check GSC in ~4 weeks — target CTR lift especially on `/en/tickets/` and `/en/supplement/`
- [ ] Donations: monitor Stripe for referral patterns from content pages (not just `/support/`)

> > > > > > > > > > > > > > > > > > > > > > > > >

ok, so now - why so late? "/en/tickets/`| After block 22 (final scam/cheap-tour accordion)" is far too      
  late, before it you have place like "free tours" which is perfect for "this is the only site where you will  
  find constantly updated info on how to do it for free, but it costs me real money, please help...            
  blablabla" you know what i mean? i expected sth much better than footer banner which is OBVIOUS!!! but keep  
  the file, do not remove anything there, just think harder and give me more ideas now,check the context,      
  find similar sites, check online what dangers visitors face and how i can solve them (with new contents      
  too! just tell me); do deep research on scams and issues visitors talk about; analyse the tripadvisor and    
  google opinions and comments; also reddit and facebook posts; man, why do i have to explain this to you?     
  you are a specialist! now, regarding 'New title:`Auschwitz Tickets 2026: Free Entry & How to Book Safely`'

- it seems to me you have not read any of the claude skills, TODOs (both here and in CMS folder!) and  
  context related files, very bad... fix it please! for "How to Get to Auschwitz from Kraków: Bus, Train &  
  Parking 2026`" it seems you do not understand what this page is and how it is different from a post about  
  krakow arrival... and so on... and so on... fix this to have a deeper understanding of what this site  
  actually is and how all is connected, as sometimes obvious things are not there for abig reason and the  
  reason is only aquired in deep analysis = your job!!! now get to work again, get more context, go deep and  
  update a new PLAN2.md file i just created; but this time for each of your ideas also add WHY it is  
  important in relation to everything else, and HOW this will improve it all
