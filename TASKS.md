# cards-frontend — Task List

Last updated: 2026-04-07 (Phase 3.2/3.3 complete, Phase 3.4 next)

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

## P0 — Fix the Front Door (from product review 2026-04-04)

> These are the first things a stranger sees. Fix before anything else.

- [x] **Avatar fallback** — when no avatar URL: show initials on gold background (`rgba(212,175,97,0.1)` bg, `#d4af61` text). Already spec'd in CLAUDE.md — just not implemented.
- [x] **Loading skeleton** — match card shape and dark bg while fetching. Two rects: card (aspect-ratio 1.586, near-black), detail section below (white). Animate with CSS `animate-pulse`.
- [x] **Proper 404** — when card not found: call Next.js `notFound()` → `not-found.tsx` with on-brand dark layout, "This card doesn't exist" message, link to crelyzor.com home.
- [x] **Smooth avatar image load** — wrap `<img>` in a container with the gold initials fallback behind it. On `onLoad`, fade the image in. Prevents layout shift.
- [x] **Hide empty sections** — bio, links, contact fields: don't render the section if the data is null/empty. Currently shows empty containers.

## P1 — Contact Form States

> The contact exchange is a core feature. It currently has no feedback states.

- [x] **Form validation** — name required + (email OR phone) required. Show inline error messages per field. Disable submit button when invalid.
- [x] **Loading state during submit** — spinner on the submit button, disable inputs while in-flight.
- [x] **Success state** — after successful submission: replace form with a confirmation message ("Thanks, [name] has your details"). No redirect needed.
- [x] **Error state** — on API failure: show inline error ("Something went wrong — try again"). Keep form data so user doesn't have to re-type.

## P2 — Mobile Verification

- [x] **Verify vCard on iOS** — Save Contact flow verified and closed.
- [x] **Verify vCard on Android** — Save Contact flow verified and closed.
- [x] **Harden vCard mobile behavior in code** — use Web Share API with `.vcf` file when available; fallback to direct vCard URL navigation on iOS/Android to avoid blocked blob downloads.
- [x] **Booking page on mobile** — verify the date picker + slot grid in `/schedule/:username/:slug` is usable on a 390px screen. Fix any overflow or tap-target issues.

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
