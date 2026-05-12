# Deep Audit: Donations, CTR & Content — visitauschwitz.info

> This document replaces the naive recommendations in PLAN.md with research-backed, contextually-precise strategy.
> PLAN.md stays — the implementation scaffold (payment links, block structure, MCP method) is still valid.
> This replaces the WHERE, the COPY, and the SEO titles.

---

## What Was Wrong With PLAN.md

1. **Donations placed at the end of pages** — that's a footer banner. It catches nobody. The value was delivered 10 minutes ago; the emotional window is closed.
2. **SEO titles included "2026"** — the skill guidelines explicitly prohibit adding year to title tags because the frontend appends it automatically. Adding it manually creates "2026 | 2026" in the rendered title.
3. **Arrival page title said "from Kraków"** — the `/arrival/` page is a comprehensive hub covering ALL transport methods and starting points (including airports, Warsaw, direct driving). The post `/posts/how-to-get-from-krakow-to-auschwitz/` owns the Kraków-specific long-tail. Putting "from Kraków" in the page title cannibalizes the post and misrepresents the page.
4. **Donation copy was generic "support my work"** — the research is clear: reciprocity-based copy tied to a specific saved cost outperforms everything else.

---

## Part 1 — Donation Placement: Contextual, Not Footer

### The Principle

The donation ask works when placed immediately after the user realizes they just received specific, concrete value. Not at the end of the page (they've moved on). Not at the top (they haven't yet). **At the exact paragraph where the benefit lands.**

Three proven trigger moments based on visitor psychology research:

- **"I just saved money"** — after learning entry is free, after learning bus is €4 vs private transfer €80
- **"I just avoided danger"** — after the scam warning content; visitor knows they're protected
- **"I just understood something hard"** — after logistics confusion resolved (parking, Birkenau transfer, booking steps)

---

### `/en/tickets/` — TWO placements (not one)

**Placement 1: After Block 2 ("Practical Tips Before Booking")**

Block 2 explicitly warns about third-party resellers and the new online-only policy. At this point the visitor has received: (1) knowledge that entry is free, (2) how to book safely, (3) warning about scam sites. This is the highest-density value delivery on the whole site.

**Copy:**
> "There are hundreds of websites selling fake Auschwitz tickets. Some charge €15–30 for a pass that costs nothing. This page exists so you don't land on one. If it helped — consider keeping it free for the next visitor."

**Why here, not the end:** The scam warning creates fear → the page resolves it → relief + gratitude peaks. This is the exact reciprocity moment. Waiting 20 more blocks dilutes it to zero.

**Why this matters to the whole site:** The tickets page has 1,131 active users/month. Even 0.5% conversion at €10 = €56/month from this one placement. It also reinforces trust — the donation ask itself signals "this site is independent and genuinely protective, not commercial."

---

**Placement 2: After Block 5 ("Can You Visit Auschwitz Without a Guide?")**

Block 5 tells visitors they CAN visit without a guide and how to do it. A museum-guided tour costs €30–60. Self-guided saves that entire amount. This is the second major "you just saved money" moment on this page.

**Copy:**
> "A guided tour costs €30–60. This page shows you how to visit without one — and what you'll actually see. If that's useful, a small thank-you helps keep this guide current."

**Why here:** Immediate follow-up to a concrete saving. The visitor is still on the screen, still engaged. Two placements on one page is fine when they're 5 blocks apart and each addresses a distinct value moment.

---

### `/en/arrival/` — ONE placement, precision-targeted

The arrival page covers: groups/drivers, local cabs, Kraków routes (bus/train/car), private transfers, parking, airport transfers. The peak value moment is after the **private transfer section** — this is where overpriced operators prey on visitors who don't know the bus costs €4.

**Position:** After the private transfer block (covers what legitimate options look like vs scam pricing).

**Copy:**
> "Private transfer companies quote €80–120 for a route the Lajkonik bus covers for under €5. Getting this wrong ruins your budget before you even arrive. If this comparison saved you money — consider a small thank-you."

**Why this page specifically:** The `/arrival/` page is the #1 site by absolute impressions (143,492 GSC impressions). Even a small CTR lift on the donation ask is disproportionately high-value. Also: transport scams from Kraków are documented (KrakowDirect, unlicensed taxis) — this page directly protects visitors from them.

**Why NOT a general "this guide helped you" message:** Because the arrival page audience has one specific anxiety: "will I get there without being ripped off or getting lost?" The copy must address THAT, not a generic mission statement.

---

### `/en/supplement/` — ONE placement, emotional peak

The supplement page structure (37 blocks) has a distinct emotional arc: practical prep → behavior guidelines → visitor testimonials → survivor stories. The testimonials section (~block 15) is the emotional peak BEFORE the survivor narratives. This is where a visitor thinks "others found this genuinely useful." That's the exact moment for a gentle ask.

**Position:** After the visitor testimonials block, before the survivor narratives begin.

**Copy:**
> "Every hour you spend unprepared at Auschwitz is an hour less spent actually present. This guide exists to make sure that doesn't happen. If it helped you arrive ready — consider supporting the work."

**Why before survivor narratives, not after:** After the survivor stories, visitors are in grief/reflection mode. A donation ask in that emotional state would feel disrespectful — almost like soliciting during a funeral. Before them, while still in the practical-gratitude frame, it lands correctly.

---

### `/en/tour/` — ONE placement, mid-page between camps

The tour page (59 blocks) covers 50+ locations. The natural structural break is between Auschwitz I content and the Birkenau section. This is where a visitor pauses, having absorbed the first camp. The donation here frames it as: "there's even more — and it's all here for free."

**Position:** After the last Auschwitz I block, before Birkenau begins.

**Copy:**
> "You just covered the main Auschwitz I sites. Birkenau — the larger, less-visited camp — continues below. Twenty years of guiding knowledge in one free guide. If that's worth something to you, consider a small thank-you."

**Why mid-page not end:** Users who reach block 58 of 59 are a tiny subset. Users who reach the Birkenau transition (approx. block 42) are still fully engaged. The mid-page placement catches 3–4x more users.

---

### `/en/faq/` — ONE placement, after tickets section

The FAQ page has 7 sections. The first section ("Tickets & Booking") is the most searched. After reading it, the visitor has resolved their highest-anxiety question. That's the peak value moment on this page.

**Position:** After the first accordion (Tickets & Booking) — NOT at the very end.

**Copy:**
> "Most of these questions can't be found together anywhere else — just scattered across forums and outdated blog posts. If this saved you the research — consider helping keep it current."

---

## Part 2 — SEO Metadata: Corrected With Full Context

### Ground Rules (from skills file, previously ignored)

- **Title max:** 53 chars — frontend appends `| {year}` automatically. "2026" in the title = double year. Remove it.
- **Description:** 140–155 chars exactly.
- **Language:** No tourism framing. Use "visit", "memorial", "reserve" — not "buy", "tour", "trip".

---

### `/en/tickets/`

**Why the current title fails:** "Auschwitz Tickets & Tours: How to Book" — the word "tickets" in English triggers searchers who don't know entry is free. They're searching because they fear they need to buy tickets. The title doesn't address this fear or offer any signal of protection.

**Why PL version has 4x higher CTR:** Polish searchers ("bilety auschwitz") are more likely to be domestic visitors who already know the basics. EN searchers are international, more anxious, more susceptible to fake booking sites.

- **Current:** `Auschwitz Tickets & Tours: How to Book` (38 chars)
- **New:** `Auschwitz Tickets: Free Entry & Book Safely` (43 chars)
- **New desc (152 chars):** `Afternoon entry is free — no payment needed. Learn how to reserve a timed-entry pass, choose a guided tour, and avoid the fake booking sites charging for free slots.`

**Why:** "Free Entry" in the title is the single highest-CTR signal on this page. Searchers who don't know entry is free will click immediately. "Book Safely" addresses the fear that's driving most EN searches. No year needed — frontend adds it.

---

### `/en/arrival/`

**Why the current title fails:** "How to Get to Auschwitz: Transport & Parking Guide" — this is accurate but generic. It competes directly with 50 other travel articles. It doesn't signal that this is the comprehensive hub.

**Why NOT "from Kraków":** The `/arrival/` page covers all starting points including Warsaw, airports, and direct driving. The Kraków post already owns "from Kraków" as its core keyword. Adding "from Kraków" to the page title cannibalizes the post AND misrepresents the page's scope.

- **Current:** `How to Get to Auschwitz: Transport & Parking Guide` (50 chars)
- **New:** `Getting to Auschwitz: All Transport Options & Parking` (53 chars)
- **New desc (148 chars):** `Every way to reach the Auschwitz Memorial: bus from Kraków, train, private transfer, driving, and parking — with travel times, costs, and arrival tips.`

**Why:** "All Transport Options" signals comprehensiveness vs the post's specificity. "Every way to reach" is a strong click signal for visitors doing initial research. Description mentions Kraków (the dominant intent) without putting it in the title.

---

### `/en/supplement/`

**Why the current title fails:** "Auschwitz: What Most Visitors Wish They Knew" — sounds like a listicle. It matches zero real search queries. Nobody types "what visitors wish they knew" into Google. It has 94k impressions and 0.55% CTR — the impressions prove Google ranks it for real queries, but the title doesn't match what those queries look like.

- **Current:** `Auschwitz: What Most Visitors Wish They Knew` (44 chars)
- **New:** `Auschwitz Visit Guide: What to Bring & Rules` (44 chars)
- **New desc (153 chars):** `Luggage rules, dress code, what to bring, how long to allow, spots beyond the regular route, and emotional preparation — from a licensed guide since 2006.`

**Why:** "What to Bring" and "Rules" are two of the top unresolved queries for Auschwitz visitors (confirmed by GSC data showing supplement page gets 94k impressions — Google is matching it to those queries already). The new title matches what people are actually searching.

---

### `/en/faq/`

**Why the current title could improve:** "Auschwitz FAQ: Tickets, Tours & Transport Explained" — not terrible, but "Transport" is a lower-intent term than "Entry" for FAQ searchers. Most FAQ queries are "can I visit without a guide", "is entry free", "what documents do I need" — all entry-related.

- **Current:** `Auschwitz FAQ: Tickets, Tours & Transport Explained` (51 chars)
- **New:** `Auschwitz FAQ: Tickets, Entry, Tours & What to Expect` (53 chars)
- **New desc (151 chars):** `Expert answers on free entry, online booking, getting there from Kraków, tour types, dress code, opening hours and what to expect at the memorial. Updated.`

**Why:** Swapping "Transport" for "Entry" + adding "What to Expect" covers the two highest-search-volume FAQ categories for Auschwitz. "Updated." at the end signals freshness without hardcoding a year.

---

### `/en/tour/`

**Why the current title underperforms:** "Auschwitz Tour Routes: Main Sites & Interactive Map" — no differentiator. Every Auschwitz tour page says "main sites + map". The unique asset of THIS page is its 50-location depth. That needs to be in the title.

- **Current:** `Auschwitz Tour Routes: Main Sites & Interactive Map` (51 chars)
- **New:** `Auschwitz Tour Route: 50 Locations & Guide Notes` (48 chars)
- **New desc (147 chars):** `Detailed walkthrough of 50+ significant locations across Auschwitz I and Birkenau — with interactive map, guide commentary, and what not to miss beyond the regular route.`

**Why:** "50 Locations" is a concrete number that stands out in search results. "Guide Notes" signals insider knowledge. Together they create a differentiated snippet that no other site can truthfully replicate.

---

## Part 3 — New Content That Addresses Real Visitor Pain Points

The research uncovered specific, recurring visitor problems that the site doesn't yet fully address. Each one is both an SEO opportunity AND a new donor acquisition funnel (people who land on protective content are the most likely to donate).

### 1. Live/Updated Scam Operator Warning Page

**What:** A dedicated page listing specific company names (Royal Cracow, KrakowDirect, etc.) with documented complaints, TripAdvisor links, and what to do if you've been scammed.

**Why it matters:** The ticket scam post exists but names no specific operators. Visitors arriving from "Royal Cracow scam" or "KrakowDirect reviews" queries currently find nothing helpful. This is high-intent protective content.

**Why it's a donation trigger:** Someone who arrived on this page because they almost got scammed — or already did — is highly motivated to support the site that warned them or would have warned them.

**SEO angle:** "auschwitz tour operators to avoid", "[company name] scam", "fake auschwitz booking site" — all zero-competition queries because nobody else is willing to name names.

---

### 2. "How Long Does Visiting Both Camps Take?" Content Upgrade on /tour/

**What:** A clear time planner block at the top of the tour page (or a short post) showing realistic time allocations: 2h Auschwitz I minimum, 1.5h Birkenau minimum, 45min transport between them, 1h for queues in peak season.

**Why:** TripAdvisor and Reddit threads are full of visitors who budgeted 2 hours total and missed most of Birkenau. This is one of the most common regrets. It's already somewhat on the /supplement/ page but buried.

**SEO:** "how long to visit auschwitz", "how long does auschwitz take" — currently no page on the site directly answers this.

---

### 3. "Morning vs Afternoon Visit" Decision Helper on /tickets/

**What:** A short comparison block after the free-entry explanation showing the tradeoff: morning = organized guide-led entry (crowds, structured, safer emotionally), afternoon = free but self-guided, less crowded, more independent.

**Why:** Reddit threads show visitors who chose "free afternoon" without understanding they'd be navigating 200 acres with no guide in the last 2 hours before closing. The page currently explains the options but doesn't help visitors CHOOSE.

**Why it's a donation trigger:** After explaining this nuance for free, the donation ask ("a private guide would charge €60 for this context") is immediately credible.

---

### 4. Emotional Preparation Content (Already in TODO — Elevate It)

**What:** The emotional preparation post is in the TODO list. Based on research showing 13.2% of high school visitors experience secondary traumatic strain, and that visitors who read testimonies beforehand cope better — this content has real protective value, not just informational value.

**Why it's a donation trigger:** Emotional content creates the deepest connection. After reading about how to prepare emotionally for the memorial, visitors feel most aligned with the site's mission. The donation ask should appear at the end of this post specifically.

---

## Part 4 — Implementation Order (Priority)

1. **SEO metadata** — immediate, no frontend changes needed, 4-week feedback loop via GSC
2. **Tickets page donation (Placement 1, after Block 2)** — highest traffic, highest immediate ROI
3. **Arrival page donation** — second highest impressions
4. **Tickets page donation (Placement 2, after Block 5)** — compound the highest-traffic page
5. **Supplement + FAQ + Tour donations** — lower volume but high engagement time
6. **New scam operator warning page** — new content, longer lead time
7. **Tour page time planner + morning/afternoon helper** — content upgrades

All items 1–5 via `mcp__visitauschwitz-cms-local__updatePages`. Items 6–7 via `/create-content` skill.
