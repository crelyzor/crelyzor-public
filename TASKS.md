# cards-frontend — Task List

Last updated: 2026-03-04

> **Rule:** When you complete a task, change `- [ ]` to `- [x]` and move it to the Done section.
> **Legend:** `[ ]` Not started · `[~]` Has code but broken/incomplete · `[x]` Done and working

---

## In Progress

_Nothing in progress right now._

---

## P0 — Next.js Migration ✅ Done

This repo has been fully migrated from Vite + React to **Next.js App Router**.

**Scope:**

- [x] Init Next.js App Router project with TypeScript + TailwindCSS 3 + shadcn/ui
- [x] Migrate existing card pages (`/:username`, `/:username/:slug`) — preserved all design + animations
- [x] Migrate existing API client (`src/lib/api.ts`)
- [x] Add dynamic OG meta tags per page (`generateMetadata` in App Router)
- [x] 3D flip animation works in SSR context (CardView is a `'use client'` component)
- [x] vCard download works (uses fetch + blob URL, falls back to window.open)
- [x] Dev server runs on :5174 (`next dev -p 5174`)
- [x] **Mobile-first** — all pages built mobile-first (`max-w-sm`, narrow card layout scales up)
- [x] **PWA setup** — `app/manifest.ts` (root), `app/api/icon/route.tsx` (dynamic icon via ImageResponse), `app/api/manifest/[username]/route.ts` (per-user manifest with name/start_url from card data)

---

## P1 — Published Meeting Page (after Next.js migration)

New public route: `/m/:id` — shows a published meeting's selected content.

- [ ] Page at `app/m/[id]/page.tsx` — SSR, fetches from `GET /public/meetings/:shortId`
- [ ] Dynamic OG tags — meeting title, summary excerpt
- [ ] Show published sections conditionally (transcript / summary / tasks — based on `publishedFields`)
- [ ] Transcript section — speaker-labeled, timestamped segments
- [ ] Summary section — AI summary + key points
- [ ] Tasks section — checklist display (read-only)
- [ ] "Powered by Crelyzor" footer CTA
- [ ] Loading skeleton
- [ ] 404 state — meeting not found or not published

---

## P2 — Availability / Booking Page (Phase 1.2)

New public route: `/schedule/:username` — Cal.com-style booking page.

- [ ] Page at `app/schedule/[username]/page.tsx`
- [ ] Fetch user availability from backend
- [ ] Calendar/time slot picker UI
- [ ] Booking form (name, email, note)
- [ ] Confirmation screen
- [ ] Dynamic OG tags — "Book time with {name}"
- [ ] Time zone detection + display

---

## P3 — Cards Polish

- [ ] Handle missing avatar — initials fallback (gold initial on dark bg)
- [ ] Handle missing bio / links / contact fields — hide empty sections cleanly
- [ ] Error state when card not found — nice 404, not broken page
- [ ] Loading skeleton — match card shape and dark bg while fetching
- [ ] Smooth avatar image load — fade in, no layout shift
- [ ] Form validation (name required + email or phone required)
- [ ] Success state after submission
- [ ] Error state if submission fails
- [ ] Loading state during submit
- [ ] Verify vCard works on iOS and Android

---

## Done ✅

- [x] Public card page with 3D flip animation
- [x] Card front (avatar, name, title, contact icons)
- [x] Card back (bio, social links, website)
- [x] Detail section (quick actions, links list)
- [x] Contact form submission
- [x] vCard download button
- [x] Home/landing page
- [x] Not found page
- [x] API integration with calendar-backend

---

## Future

- [ ] Wallet pass support (Apple Wallet, Google Wallet)
- [ ] Custom domain support
- [ ] Multiple cards selector on public page
