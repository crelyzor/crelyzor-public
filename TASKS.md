# cards-frontend — Task List

Last updated: 2026-03-26 (Phase 1.2 public booking pages built)

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

- [x] Page at `app/m/[id]/page.tsx` — SSR, fetches from `GET /public/meetings/:shortId`
- [x] Dynamic OG tags — meeting title, summary excerpt
- [x] Show published sections conditionally (transcript / summary / tasks — based on `publishedFields`)
- [x] Transcript section — speaker-labeled, timestamped segments (grouped by speaker)
- [x] Summary section — AI summary + key points
- [x] Tasks section — checklist display (read-only)
- [x] "Shared via Crelyzor" footer CTA
- [x] 404 state — meeting not found or not published (notFound() → not-found.tsx)
- [x] Empty state when all sections null

---

## Phase 1.2 — Public Booking Pages ← current

Design doc: `docs/dev-notes/phase-1.2-scheduling.md`

Depends on: backend P2 (slot engine + booking creation API) must exist before building these pages.

- [x] **`/schedule/:username` — event type listing page:** SSR. Fetch active event types via `GET /public/scheduling/profile/:username`. Show event type cards (title, duration, location icon, description). Each links to `/schedule/:username/:slug`. OG meta: "{name}'s booking page". Handle: user not found → 404. Scheduling disabled → "Not accepting bookings" page.
- [x] **`/schedule/:username/:slug` — date + slot picker:** SSR for initial render (event type details). Client-side for slot loading. Month calendar grid. Guest picks date → fetch slots `GET /public/scheduling/slots/:username/:slug?date=` client-side. Slot grid below calendar. Timezone shown (auto-detected via `Intl.DateTimeFormat`). Loading + empty slot state.
- [x] **Booking form:** After guest selects slot — inline form with: name (required), email (required), note (optional), timezone display (read-only, auto-detected). Submit → `POST /public/bookings`. Loading state during submit. 409 conflict auto-refetches slots.
- [x] **`/schedule/:username/:slug/confirmed?bookingId=` — confirmation page:** Reads booking data from sessionStorage. Shows: event type title, host name, date + time (in guest's timezone), format. "Add to Google Calendar" button (generates gcal URL). "Add to Apple Calendar" (.ics download). Fallback for page refresh shows booking ID + email prompt.
- [x] **OG meta tags:** All pages have proper OG titles, descriptions. Profile: "Book time with {name}". Booking: "Book {duration}-min {title} · {name}". Confirmed: static "Booking Confirmed".

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
