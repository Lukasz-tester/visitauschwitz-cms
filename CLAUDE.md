# visitauschwitz-cms

## Project

Payload CMS v3 backend for **visitauschwitz.info** — a practical guide for visiting the Auschwitz-Birkenau Memorial and Museum. Created by Lukasz, a licensed Auschwitz guide since 2006. This is a public-service resource for visitor preparation, not a commercial tourism site.

**Audience:** international visitors (primarily travelling from Krakow), planning their first visit.
**Content scope:** tickets, transport, museum logistics, tour routes, preparation tips, rules, nearby sites.

## Dev

- **Package manager:** pnpm
- **Dev server:** `pnpm dev` (Next.js 15 + Turbopack)
- **Build:** `pnpm build`
- **Locales:** `en` (default), `pl` — more commented out in `src/i18n/localization.ts`

## MCP Tool Priority

- **Always check for `visitauschwitz-cms-local` first** (dev server). Only fall back to `visitauschwitz-cms-prod` if local is unavailable.

## Skill Routing

Detailed content workflows live in `.claude/skills/` and are loaded on demand. Auto-invoke the matching skill before starting the task.

- **Content creation** (new post, new page, write article, add blocks) → `/create-content`
- **Content updates** (translate, localize, change heading, edit block text, modify existing layout) → `/update-content`
