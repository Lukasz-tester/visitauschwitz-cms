## newsletter building

- [x] 1. Create CMS Page via MCP (slug: `newsletter`, hero + content blocks)
- [x] 2. Create newsletter page route — reuse `NewsletterSignup` via `insertNode` (same pattern as homepage)
- [x] 4. Create CF Function proxy (`visitauschwitz-frontend/functions/api/subscribe.js`)
- [x] 5. Modify `useNewsletterSubmit` hook → POST to `/api/subscribe` instead of `/api/contact`
- [x] 6. Add i18n keys to `en.json` + `pl.json`
- [x] 7. Modify FooterNewsletter → add "Learn more" link to `/newsletter`
- [x] 8. Add newsletter CTA to contact form auto-reply (`functions/api/contact.js`)

## newsletter preview

http://localhost:3000/api/newsletter-email-preview?locale=en

2.  Open http://localhost:3000/api/confirmation-email-preview — verify English version
3.  Open http://localhost:3000/api/confirmation-email-preview?locale=pl — verify Polish version
4.  Compare side-by-side with http://localhost:3000/api/newsletter-email-preview for visual consistency

## double opt-in

- [x] Confirmation email template (`src/email/generateConfirmationEmail.ts`) + i18n keys
- [x] `Subscribers` collection — fields: `email`, `confirmed`, `token`, `locale`, `confirmedAt` (9 locales)
- [x] Form submission hook — on newsletter submit: create subscriber, generate token, send confirmation email
- [x] `/api/confirm?token=xxx` endpoint — validate token, mark confirmed, send lead magnet email, redirect
- [x] Lead magnet email (`src/email/generateNewsletterEmail.ts`) — checklist email sent after confirmation
- [x] Redirect after confirm → `/?confirmed=true`
- [x] `/api/unsubscribe?token=xxx` endpoint — deletes subscriber, shows confirmation page
- [x] `List-Unsubscribe` + `List-Unsubscribe-Post` headers on all outgoing emails
- [x] Unsubscribe link in email footer (confirmation + lead magnet)
- [x] All email strings in i18n (`en.json`) — ready for translation

## campaign (next steps)

- [ ] `Campaigns` collection — localized `subject` + `body` fields (AI-translated like posts)
- [ ] Send action — query confirmed subscribers by locale, send via `payload.sendEmail()`
- [ ] Batch sending with rate limiting (Resend free: 100/day, 3k/month)
- [ ] Campaign status tracking (draft/sent/sending)
- [ ] Add i18n translations for email strings (`pl.json` + other locales)

# kill localhosts

lsof -ti :3000,3002 | xargs kill -9 2>/dev/null; echo "Done"

## moje:

- powysylaj przypomnienia zeby mnie dodac na stronkach!
- awesome claude code - fajne narzedzie, pewnie sa tez podobne? https://github.com/claude-ai/awesome-claude-code
- Usun konto Pinterest, sprawdzić twittera
- wyslij nowa stronke do lajkonika to rozpromuja!!! pytaj o Adama, jest grafikiem

## GSC data

Najczęstsze zapytania | Kliknięcia | Wyświetlenia
bus from krakow to auschwitz 169 2 008
auschwitz bilety cennik 124 4 454
krakow to auschwitz 115 11 739
krakow to auschwitz bus 108 1 968
oświęcim bilety 90 3 377
auschwitz bilety 80 10 088
bus krakow to auschwitz 66 725
bus to auschwitz from krakow 60 851
bilety auschwitz 59 1 321
how to get to auschwitz from krakow 50 2 987
visit auschwitz 45 8 398
how to get from krakow to auschwitz 45 1 822
oswiecim bilety 42 1 239
auschwitz bilety bez przewodnika 37 764
kraków to auschwitz bus timetable 29 234
auschwitz tickets 26 10 651
oświęcim bilety online 26 947
krakow auschwitz bus 22 427
auschwitz bilety online 21 566
lajkonik bus krakow to auschwitz 21 463

### Must-Create Pages

- [x] **`/faq`** — Created. H2 per question, FAQPage schema via accordion blocks with `isFAQ: true`.
- [ ] **`/contact`** — Dedicated contact page. Forms currently only embedded, no standalone page.
- [ ] **`/prepare`** or expand `/supplement` — Emotional + practical preparation as standalone content.
- [ ] **`/newsletter`** — Landing page for ad campaigns and direct email capture.

### Must-Create Blog Posts (Content Marketing Engine)

Done:

- [x] "Can You Visit Auschwitz Without a Guide? Honest Comparison"
- [x] "What to Wear to Auschwitz: Complete Dress Code Guide"
- [x] "Visiting Auschwitz with Children: What Parents Need to Know"
- [x] "Auschwitz vs Birkenau: Understanding Both Sites"
- [x] "Krakow to Auschwitz Day Trip: Complete Planning Guide"
- [x] "Auschwitz Tickets Online Only in 2026: What Changed"

Priority order (new from keyword gap analysis):

1. [x] "How to Get to Auschwitz from Krakow: Bus, Train & Car" — #1 organic cluster (~613 clicks, 22K impressions)
2. [x] "Auschwitz Ticket Scams: How to Spot Fake Sites" — URGENT, trust-building
3. [x] "Best Time to Visit Auschwitz: Month-by-Month Guide" — covers 2 gaps (best time + how far in advance to book)
4. [ ] "How Long Does It Take to Visit Auschwitz? Time Planning"
5. [ ] "Auschwitz Photography Rules: What You Can and Cannot Capture"
6. [x] "Auschwitz Emotional Preparation: What to Expect and How to Process" — merged with reading list, lead magnet CTA
7. [ ] "Where to Eat Near Auschwitz: Restaurants and Cafes"
8. [ ] "Auschwitz in Winter: Month-by-Month Visitor Guide"
9. [ ] "Auschwitz Accessibility Guide: Wheelchair & Mobility Info"
10. [x] "10 Things Most Visitors Miss at Auschwitz"
11. [ ] "Post-Visit: Books, Films & Resources After Auschwitz"
12. [ ] "Auschwitz from Warsaw: Is It Worth a Day Trip?"

- nowy post o rasizm na grupie (kiedys)
- aukcja https://wydarzenia.interia.pl/zagranica/news-dokumenty-i-listy-z-czasow-holokaustu-na-sprzedaz-cyniczne-i,nId,22454576

---

## 5. Email Collection Strategy

### Current State

Newsletter in footer + homepage block. No lead magnets. No content upgrades. No dedicated landing page. **Weak.**

### Action Items

- [ ] Add email CTA to EVERY page (not just homepage)
- [ ] Create 3 lead magnets (email-gated PDFs):
  1. "Auschwitz Visit Checklist" — printable preparation checklist
  2. "Auschwitz Map with Guide Notes" — annotated map PDF
  3. "Pre-Visit Reading List" — curated books + context summaries
- [ ] Create `/newsletter` landing page for ad campaigns
- [ ] Deploy exit-intent popup (popup variant exists in code, not active)
- [ ] Add inline email capture after each blog post
- [ ] Add "Get the checklist" CTA in /tickets and /supplement pages

---

## 6. Monetization Expansion

### Tier 1 — Digital Products (High margin, scalable)

- [ ] Online video course: "Preparing for Your Auschwitz Visit" (19-29 EUR)
  - 5-10 video modules: history context, what to expect, emotional prep, route walkthrough, post-visit reflection
  - Sell via Gumroad/Teachable, promote via email list
- [ ] Premium app features: advanced quiz levels, AR map overlay, offline audio guide
- [ ] Printable educational worksheets for teachers (9-15 EUR pack)
- [ ] Virtual guided tour video (pre-recorded, 9-15 EUR)

### Tier 2 — Services (Expertise monetization)

- [ ] 15-min paid video prep calls (25-35 EUR) — "Ask the Guide Before You Go"
- [ ] Custom group preparation briefings (schools, corporate, faith groups) — 50-100 EUR/session
- [ ] Teacher/educator certification program — "Holocaust Education Facilitator" course
- [ ] Private virtual tour for remote audiences (live, 50-100 EUR/group)

### Tier 3 — Affiliate & Partnership

- [ ] Transport affiliates: Lajkonik bus, FlixBus, local transfer companies
- [ ] Accommodation: hotels in Oswiecim (Hampton by Hilton, Centre for Dialogue)
- [ ] Book affiliates: Amazon links to recommended reading (Primo Levi, Elie Wiesel, Edith Eger)
- [ ] Combo tour partners: Salt Mine + Auschwitz, Schindler's Factory + Auschwitz
- [ ] Audio guide app partnerships

### Tier 4 — Content Platform

- [ ] YouTube channel: walkthrough videos, "Stories from the Blocks" series (prisoner stories per block on the map)
- [ ] Podcast: monthly episodes on specific blocks/stories — drives email signups
- [ ] Substack/newsletter: weekly historical facts — warm audience for product launches

---

## 7. Map Exploitation Strategy

The interactive map is the site's unique asset. Expand it:

- [ ] **Block stories layer:** Each block on the map links to prisoner stories (connects to upcoming books)
- [ ] **"What happened here" POI markers** with 2-3 sentence summaries
- [ ] **Downloadable offline map** (email-gated PDF — top lead magnet)
- [ ] **Before/after photo overlay** on map (1944 aerial photos vs today)
- [ ] **Route planner:** Let users build custom routes based on available time (1h, 2h, 3.5h, full day)
- [ ] **Mobile-first map experience** — most users will be ON SITE with phones
- [ ] **Hidden spots layer** — toggle to show beyond-regular-route locations
- [ ] **AR future:** camera overlay showing historical context at physical locations (app feature)

---

## 8. Keyword Gaps — Queries Not Ranked For

### English

| Query                                  | Intent        | Target                               | Status                                      |
| -------------------------------------- | ------------- | ------------------------------------ | ------------------------------------------- |
| how to get to auschwitz from krakow    | informational | NEW POST: "How to Get from Krakow"   | **TODO** — #1 priority                      |
| is auschwitz free to visit             | informational | /tickets H2 + /faq                   | page update                                 |
| how long does auschwitz take           | informational | NEW POST: "How Long Does It Take"    | **TODO**                                    |
| auschwitz dress code / what to wear    | informational | post: "What to Wear"                 | DONE                                        |
| can you take photos at auschwitz       | informational | NEW POST: "Photography Rules"        | **TODO**                                    |
| visiting auschwitz with children       | informational | post: "With Children"                | DONE                                        |
| auschwitz I vs birkenau difference     | informational | post: "Auschwitz vs Birkenau"        | DONE                                        |
| auschwitz skip the line tickets        | transactional | /tickets H2 + /faq                   | page update                                 |
| best time to visit auschwitz           | informational | NEW POST: "Best Time to Visit"       | **TODO** — also covers "how far in advance" |
| how far in advance to book auschwitz   | informational | covered by "Best Time to Visit" post | **TODO** (merged)                           |
| auschwitz self-guided tour worth it    | informational | post: "Without a Guide"              | DONE                                        |
| krakow to auschwitz day trip           | transactional | post: "Krakow Day Trip"              | DONE                                        |
| auschwitz virtual tour                 | informational | future product                       | parked                                      |
| auschwitz audio guide                  | informational | /tour H2 + "Without a Guide" post    | page update + SEO tune existing post        |
| where to eat near auschwitz            | informational | NEW POST: "Where to Eat"             | **TODO**                                    |
| auschwitz winter visit                 | informational | NEW POST: "Auschwitz in Winter"      | **TODO**                                    |
| auschwitz accessibility wheelchair     | informational | NEW POST: "Accessibility Guide"      | **TODO**                                    |
| auschwitz emotional preparation        | informational | NEW POST: "Emotional Preparation"    | **TODO** — merged with reading list         |
| what to read before visiting auschwitz | informational | covered by "Emotional Preparation"   | **TODO** (merged, lead magnet CTA)          |
| auschwitz online tickets 2026          | transactional | post: "Tickets Online Only in 2026"  | DONE                                        |
| auschwitz ticket scam                  | informational | NEW POST: "Ticket Scams"             | **TODO** — URGENT                           |

### Polish

| Query                               | Target                                     | Status                            |
| ----------------------------------- | ------------------------------------------ | --------------------------------- |
| jak dojechac do auschwitz z krakowa | PL translation of "How to Get from Krakow" | **TODO** — translate new post     |
| ile trwa zwiedzanie auschwitz       | PL translation of "How Long Does It Take"  | **TODO** — translate new post     |
| co zabrac do auschwitz              | post: "What to Wear" (PL exists)           | DONE — SEO tune PL version        |
| auschwitz z dziecmi                 | post: "With Children" (PL exists)          | DONE — SEO tune PL version        |
| auschwitz zima                      | PL translation of "Winter" post            | **TODO** — translate new post     |
| auschwitz cennik 2026               | /tickets PL                                | page update — ensure 2026 pricing |

---

## 10. Blog Content Calendar (First 3 Months)

### Month 1 (Done — March 2026)

- [x] Week 1: "Auschwitz Tickets Online Only in 2026: What Changed"
- [x] Week 2: "Can You Visit Auschwitz Without a Guide? Honest Comparison"
- [x] Week 3: "What to Wear to Auschwitz: Complete Dress Code Guide"
- [x] Week 4: "Krakow to Auschwitz Day Trip: Complete Planning Guide"

### Month 2 (Done/In Progress)

- [x] Week 1: "Visiting Auschwitz with Children: What Parents Need to Know"
- [x] Week 2: "Auschwitz vs Birkenau: Understanding Both Sites"
- [ ] Week 3: "How to Get to Auschwitz from Krakow: Bus, Train & Car"
- [ ] Week 4: "Auschwitz Ticket Scams: How to Spot Fake Sites" (URGENT)

### Month 3

- [ ] Week 1: "Best Time to Visit Auschwitz: Month-by-Month Guide"
- [ ] Week 2: "How Long Does It Take to Visit Auschwitz? Time Planning"
- [ ] Week 3: "Auschwitz Photography Rules: What You Can & Cannot Capture"
- [ ] Week 4: "10 Hidden Spots Most Visitors Miss at Auschwitz"

### Month 4

- [ ] Week 1: "Auschwitz Emotional Preparation: What to Expect and How to Process"
- [ ] Week 2: "Where to Eat Near Auschwitz: Restaurants and Cafes"
- [ ] Week 3: "Auschwitz Accessibility: Wheelchair & Mobility Guide"
- [ ] Week 4: "Auschwitz in Winter: Month-by-Month Visitor Guide"

### To Improve

- [ ] Deploy the popup newsletter variant (code exists, not active)
- [ ] Add `HowTo` schema to /arrival page (step-by-step transport guides)
- [ ] Consider `VideoObject` schema when YouTube content launches
- [ ] Add hreflang tags when more locales activate

---

## 12. Quick Wins (Do This Week)

1. [ ] Activate popup newsletter (code exists)
2. [ ] Add email CTA block to /supplement and /tour pages (reuse homepage variant)

## future options for cf builds:

- Local CMS for CF Pages builds — not practical unfortunately. CF Pages builds run on Cloudflare's servers, not your machine. They can't reach localhost. You'd need a tunnel (Cloudflare Tunnel / ngrok) running 24/7, and your machine would need to be on during every build. Fragile.
- Local build + deploy static output — viable. You could build the frontend locally (hitting localhost:3000 Payload API), then deploy only the static output to CF Pages. Zero Vercel API calls during builds. Downside: manual step (or scripted), and your machine must be on.
  Strategy (maybe not worth it): Long cache + Deploy Hook to purge
  1. Set s-maxage to 7 days (or even 30 days)
  2. Create a Vercel Deploy Hook (Vercel Dashboard → Project → Settings → Git → Deploy Hooks)
  3. Before deploying CF Pages, curl -X POST <deploy-hook-url> → triggers Vercel redeployment → clears all CDN cache
  4. Wait ~2 min for Vercel to redeploy
  5. Deploy CF Pages → gets fresh data
     Deploy Hooks are free on all plans. It's just a URL you POST to.  
     But here's the honest math question: With ~0.5% of your 100GB FOT quota used by builds (even with 9 locales), is the extra complexity worth it? The  
     1-hour cache already:
  - Deduplicates globals durin builds
  - Caches between repeat builds
  - The /api/media/file/\* block saves more FOT than longer caching would

---

## Future: Eliminating Vercel Fast Origin Transfer on CF Pages Builds

### The problem

Every CF Pages build re-fetches ALL content from the Vercel CMS with `cache: 'no-store'`. This bypasses Vercel's edge cache entirely — every API call hits the Vercel origin, generating Fast Origin Transfer.

**Current scale:** ~95 API calls/build × ~1.5MB avg response = **~150MB Fast Origin Transfer per build** (2 locales, 15 docs).

**At 9 locales + 30 docs:** ~585 API calls/build = **~1.35GB per build**. 27 builds/month = ~36GB Fast Origin Transfer/month.

**Also worth fixing regardless of which option is chosen:** `generateMetadata` and the page component both call `fetchPayloadData` with the same URL + `cache: 'no-store'`, meaning each page is fetched TWICE per locale — ~50% of all per-document API calls are wasted. Fix: hoist the fetch result in `page.tsx` and pass it to both functions. Quick win, no infrastructure change needed.

---

### Option A: Cloudflare Worker as Caching Proxy (no GH Actions needed)

A small CF Worker sits in front of the Vercel CMS and caches API responses in CF KV. Builds fetch from the Worker URL instead of Vercel directly.

```
CF Pages Build → Worker (KV cache) → Vercel CMS (only on cache miss / after purge)
```

**How it works:**
1. Worker receives `GET /api/pages?where[slug]=...` → checks KV for cached entry
2. Cache hit → returns JSON from KV, Vercel is never contacted
3. Cache miss → fetches from Vercel, stores response in KV (30-day TTL), returns it
4. On content publish → Payload `afterChange` hook POSTs to Worker's purge endpoint
5. Worker deletes KV keys for the changed document (all locales) + list endpoints
6. Next CF Pages build → cache miss only for the changed doc → 1-2 Vercel origin hits instead of 585

**CF Pages auto-builds keep working. No CI changes needed. Frontend `cache: 'no-store'` can stay as-is** — the Worker handles caching transparently at the HTTP layer.

**Cost:**
- CF Workers free tier: 100k requests/day — covers even 9 locales × 585 calls × many builds/day
- CF KV free tier: 100k reads/day, 1k writes/day, 1GB storage — trivially covered
- If scale demands: Workers Paid = $5/month (10M requests included)

**What to build:**

1. New directory `cms-cache-worker/`:
   - `wrangler.toml` — KV namespace binding `CMS_CACHE`, custom domain `cms-api.visitauschwitz.info`
   - `src/index.ts` (~150 lines):
     - Proxy all `GET /api/*` with KV caching (key = `sha256(url)`)
     - `POST /api/purge` endpoint (auth via `x-purge-secret` header) — accepts `{ collection, slug, locales[] }` → deletes KV entries for each `GET /api/{collection}?where[slug][equals]={slug}&locale={locale}&depth=2` per locale + list endpoints (`/api/pages?limit=1000`, `/api/posts?limit=1000`, globals)
     - Cache TTL: 30 days (content rarely changes; purge handles freshness)

2. **CMS hooks** — update `revalidatePage.ts` and `revalidatePost.ts` to call the Worker purge endpoint alongside the existing `revalidatePath()`:
   ```ts
   await fetch(`https://cms-api.visitauschwitz.info/api/purge`, {
     method: 'POST',
     headers: { 'x-purge-secret': process.env.CF_PROXY_PURGE_SECRET! },
     body: JSON.stringify({ collection: 'pages', slug: doc.slug, locales: ['en', 'pl'] }),
   })
   // Locales must be read from src/i18n/localization.ts dynamically — never hardcoded
   ```

3. **Frontend env** — change `CMS_PUBLIC_SERVER_URL` from `https://auschwitz.vercel.app` to `https://cms-api.visitauschwitz.info`

4. **New env vars:**
   - CMS `.env`: `CF_PROXY_PURGE_SECRET=<random>`
   - Worker secrets (via `wrangler secret put`): `CF_PROXY_PURGE_SECRET`, `CMS_ORIGIN_URL=https://auschwitz.vercel.app`

---

### Option B: GitHub Actions Build Cache (no new infrastructure)

Move frontend builds from CF Pages auto-deploy to GitHub Actions, which persists the Next.js fetch cache between runs. Only changed content re-fetches from Vercel.

```
Payload change → GH repo dispatch webhook → GH Actions (cached .next/cache/) → wrangler pages deploy
```

**How it works:**
1. Change `cmsFetch.ts` and `fetchPayloadData.js`: `cache: 'no-store'` → `cache: 'force-cache'`
2. GH Actions caches `.next/cache/fetch-cache/` between runs (persists across builds)
3. Pre-build script fetches a lightweight manifest from CMS: `GET /api/pages?limit=1000&select=slug,updatedAt` + same for posts (~5KB total, 2 calls)
4. Compares manifest with `scripts/content-manifest.json` saved from the previous build (also cached)
5. For each slug where `updatedAt` changed: computes SHA-256 hash of each fetch URL per locale, deletes matching files from `.next/cache/fetch-cache/`
6. `next build` runs — deleted entries re-fetch from Vercel; all others use disk cache

**Disabling CF Pages auto-builds:**
- CF Pages Dashboard → Settings → Builds → disable automatic builds
- Deploy exclusively from GH Actions via `wrangler pages deploy out --project-name visitauschwitz-frontend`

**Trigger from Payload afterChange hooks:**
```ts
await fetch('https://api.github.com/repos/Lukasz-tester/visitauschwitz-frontend/dispatches', {
  method: 'POST',
  headers: { Authorization: `Bearer ${process.env.GH_DISPATCH_TOKEN}` },
  body: JSON.stringify({
    event_type: 'content-change',
    client_payload: { collection: 'pages', slug: doc.slug },
  }),
})
```

**What to build:**

1. `visitauschwitz-frontend/.github/workflows/deploy.yml` (~80 lines):
   - Triggers: `repository_dispatch` (from Payload hook) + manual `workflow_dispatch`
   - Steps: checkout → restore `.next/cache/` → pnpm install → run bust-stale-cache script → build → save cache → `wrangler pages deploy`
   - GH Actions secrets needed: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `GH_DISPATCH_TOKEN`

2. `visitauschwitz-frontend/scripts/bust-stale-cache.mjs` (~70 lines):
   - Fetches manifest (2 API calls)
   - Loads previous `scripts/content-manifest.json`
   - For each changed slug: computes `crypto.createHash('sha256').update(url).digest('hex')`, deletes matching file in `.next/cache/fetch-cache/`
   - Saves updated manifest

3. `visitauschwitz-frontend/src/utilities/cmsFetch.ts` + `fetchPayloadData.js`:
   - Remove `cache: 'no-store'`, replace with `cache: 'force-cache'`

**GH Actions minutes:** ~5-7 min/build on Linux (1× multiplier). Free tier: 2000 min/month on private repos (400 builds/month). Public repos: unlimited.

**Risks to design for:**

1. **Cache key mismatch → stale content deployed (medium)** — The bust-stale-cache script must compute the exact same hash Next.js uses for `.next/cache/fetch-cache/` filenames. If wrong, stale content is deployed silently. Also breaks if Next.js changes its internal cache key format after an upgrade. **Fix:** script must fall back to deleting the entire cache (full rebuild) if anything looks wrong — never deploy potentially stale content.

2. **Dispatch webhook failure → no rebuild after publish (low-medium)** — If the Payload→GitHub API call fails (network blip, expired token), the CMS saves but no build fires. Site shows old content until next manual deploy. **Fix:** log errors in the hook; keep `workflow_dispatch` manual trigger in the workflow as a fallback.

3. **Race condition on rapid successive publishes (low)** — Two builds triggered seconds apart may deploy in wrong order, leaving one change stale. **Fix:** add GH Actions concurrency group (`cancel-in-progress: false`) to queue builds instead of running in parallel.

4. **Next.js upgrade breaks cache format (low)** — Cache files may be ignored or cause errors after `pnpm upgrade next`. **Fix:** harmless — worst case is a full rebuild. Clear GH Actions cache once after upgrading Next.js.

5. **Operational overhead** — CI pipeline failures require debugging (failed step, stale secrets, wrangler CLI version change). Not a blocker, but more work than CF Pages auto-build. Manual `workflow_dispatch` button in GH UI means you're never blocked.

**Not a risk:** public repo (GH secrets are server-side only, never exposed), subscriber data (stays in MongoDB on CMS), public content (stale = UX issue not security issue), GH minutes (unlimited for public repos).

---

### Comparison

|  | Option A (CF Worker Proxy) | Option B (GH Actions Cache) |
|---|---|---|
| Frontend code changes | None | `cache: 'no-store'` → `force-cache` in 2 files |
| Build pipeline | CF Pages auto-builds unchanged | Migrate to GH Actions, disable CF Pages auto-builds |
| New infrastructure | CF Worker + KV namespace | GH Actions workflow + cache busting script |
| Vercel FOT after content change | ~1-2 API calls (changed doc only) | ~1-2 API calls (changed doc only) |
| Vercel FOT with no content change | 0 (100% KV cache hits) | 0 (100% disk cache hits) |
| Works with existing `cache: 'no-store'` | Yes | No — must change to `force-cache` |
| Cost | Free / $5 Workers Paid | Free (GH Actions minutes) |
| Recommended | Yes — no pipeline changes needed | If adding CF Worker infrastructure is unwanted |

---

## Done this session (2026-04-08): Quick FOT reduction fixes in visitauschwitz-frontend

**Problem:** Every CF Pages build was fetching each page/post TWICE (once in `generateMetadata`, once in the Page component) due to `cache: 'no-store'` disabling React's deduplication. Also, `cache: 'no-store'` was sending `Cache-Control: no-store` in every HTTP request, which told Vercel's edge to bypass its own CDN cache — so the middleware's `s-maxage=3600` was doing nothing.

**Fixes applied:**

1. ~~`src/utilities/cmsFetch.ts` + `src/utilities/fetchPayloadData.js` — changed `cache: 'no-store'` → `cache: 'force-cache'`~~ **REVERTED** — `force-cache` causes builds to receive stale content from Vercel's edge CDN when content was recently updated. There is no clean way to purge query-param-specific API cache entries on Vercel without the CF Worker proxy. Stays as `no-store`.

2. Added `React.cache()` deduplication to 4 route files — each now fetches each doc only once per locale per render, shared between `generateMetadata` and the page component:
   - `src/app/(frontend)/[locale]/[slug]/page.tsx`
   - `src/app/(frontend)/[locale]/posts/[slug]/page.tsx`
   - `src/app/(frontend)/[locale]/newsletter/page.tsx`
   - `src/app/(frontend)/[locale]/page.tsx`

**Expected effect:** ~50% fewer per-doc API calls per build. Between builds (within 1h), Vercel edge cache serves responses → near-zero Fast Origin Transfer for repeated builds.

**Still to do (see "Future" section above):** CF Worker proxy (Option A) or GH Actions cache (Option B) for full incremental build support.
