# cards-frontend — Task List

Last updated: 2026-03-04

> **Rule:** When you complete a task, change `- [ ]` to `- [x]` and move it to the Done section.
> **Legend:** `[ ]` Not started · `[~]` Has code but broken/incomplete · `[x]` Done and working

---

## In Progress

_Nothing in progress right now._

---

## P0 — Next.js Migration (Do First)

This repo is migrating from Vite + React to **Next.js App Router**.

**Why:** All public pages (card, published meeting, availability/booking) need SSR for SEO and
proper OG previews. Vite/CSR cannot serve this.

**Scope:**

- [ ] Init Next.js App Router project with TypeScript + TailwindCSS 4 + shadcn/ui
- [ ] Migrate existing card pages (`/:username`, `/:username/:slug`) — preserve all design + animations
- [ ] Migrate existing API client (`src/lib/api.ts`)
- [ ] Add dynamic OG meta tags per page (`generateMetadata` in App Router)
- [ ] Verify 3D flip animation works in SSR context (client component boundary)
- [ ] Verify vCard download works
- [ ] Confirm dev server runs on :5174

**Design must not change.** Same dark/gold vibe, same card proportions, same flip animation.

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
