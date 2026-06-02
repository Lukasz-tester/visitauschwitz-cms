# Marketing Email System — Build Progress

**Plan:** `~/.claude/plans/stateful-tickling-peach.md`
**Repo:** `visitauschwitz-cms`

Every session: read this file first, continue from the first unchecked step.

---

## Checklist

- [x] **Step 1** — `MarketingCampaigns` collection + payload.config.ts + `pnpm generate:types`
- [x] **Step 2** — `src/email/generateMarketingEmail.ts`
- [x] **Step 3** — `src/app/(payload)/api/marketing/send/route.ts`
- [x] **Step 4** — `src/collections/MarketingCampaigns/components/SendView.tsx` + wired into collection
- [ ] **Step 5** — End-to-end test: create campaign → translate → dry run → send batch of 1 → verify email + status update

---

## Files Created/Modified

- `src/collections/MarketingCampaigns/index.ts` — collection config with Send tab
- `src/collections/MarketingCampaigns/components/SendView.tsx` — admin send UI
- `src/email/generateMarketingEmail.ts` — email HTML generator (all 9 locales)
- `src/app/(payload)/api/marketing/send/route.ts` — send endpoint with auth, dry run, batching
- `src/payload.config.ts` — added MarketingCampaigns + translator plugin entry
- `MARKETING_EMAIL_PROGRESS.md` — this file

## Notes

- Step 5 requires deploying to test (Resend not available locally without env vars)
- Auth: uses `payload.auth({ headers })` — user must have `role === 'admin'`
- Supported CMS locales for campaign content: en, pl (others fall back to en)
- Batch size hard-capped at 90 server-side (Resend free tier: 100/day)
