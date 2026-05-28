# cards-frontend — Task List

Last updated: 2026-05-22 (Phase 4.8 complete ✅ — Embeddable Booking Widget shipped)

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

## Phase 4.1 — Billing & Monetization ✅ Complete

### P0 — Public Pricing Page

- [x] `/pricing` page — `app/pricing/page.tsx`
  - SSR, SEO meta tags, OG preview
  - Plan comparison table: Free / Pro / Business (Custom)
  - Feature checklist per plan
  - `"Get started free"` CTA → sign in page
  - `"Upgrade to Pro"` CTA → dashboard billing (for logged-in) or sign up (for new)
  - FAQ section — "What are AI Credits?", "What is Recall.ai?", "Can I cancel anytime?"

---

## Phase 4.8 — Embeddable Booking Widget ✅ Complete

> Cal.com-style iframe embed. All 5 changes are frontend-only in this repo — no backend changes needed.

### P0 — Allow iframing

- [x] `next.config.ts` — custom headers for `/schedule/**`: `X-Frame-Options: ALLOWALL` + `Content-Security-Policy: frame-ancestors *`

### P1 — Embed mode UI

- [x] `schedule/[username]/[slug]/page.tsx` — read `searchParams.embed`, pass `isEmbed: boolean` to `<BookingFlow />`
- [x] `schedule/[username]/[slug]/BookingFlow.tsx` — when `isEmbed`: hide nav/header, remove top padding, `bg-transparent`
- [x] `schedule/[username]/[slug]/confirmed/ConfirmedClient.tsx` — read `?embed=1` from `useSearchParams`, strip chrome when present

### P2 — postMessage bridge

- [x] `BookingFlow.tsx` — fire `CRELYZOR:booking-confirmed` postMessage after `createBooking()` succeeds in embed mode
- [x] `BookingFlow.tsx` — fire `CRELYZOR:resize` on content height changes via `ResizeObserver`
- [x] Pass `?embed=1` through to confirmed redirect URL

### P3 — embed.js script

- [x] `public/embed.js` — vanilla JS, no deps, exposes `window.Crelyzor('init', { link, container, onBooking })`, listens for resize + booking-confirmed postMessages

---

## Phase 4.9 — In-App Notifications

> No changes in this repo. In-app notifications are authenticated-dashboard-only (`crelyzor-frontend`). The only Resend emails sent from public flows (booking confirmation to guest, booking cancelled) still go via email — no in-app notification is created for guest users who are not logged in.

---

## Phase 5 — Encryption at Rest

> Full design spec: `../docs/superpowers/specs/2026-05-16-encryption-at-rest-design.md`
> Almost nothing changes in this repo — encryption is server-side. Public pages render plaintext as before.

### P0 — Privacy / trust copy

- [ ] **Update `/privacy` page** (or create one if missing) — add an "Encryption at rest" section explaining: Google Cloud KMS, per-user encryption keys, AES-256-GCM, what's encrypted (meeting transcripts, notes, AI content, tasks, private contacts, booking PII), what's not (public card profile, IDs, timestamps). Tone: factual, not marketing.
- [ ] **Landing/marketing copy audit** — if the homepage or any marketing page makes claims about data security, update them to reflect "encrypted at rest with Google Cloud KMS" — claims must match reality.
- [ ] **Booking confirmation page** — small footer line: _"Your booking details (email, notes) are encrypted at rest."_ — reassures non-Crelyzor guests submitting through `/schedule/*`.

---

## Phase 6 — Teams (Public)

> Full design spec: `../docs/internal/superpowers/specs/2026-05-09-teams-design.md`
> Aesthetic: **Premium. Dark. Tactile.** — match existing card aesthetic exactly (Inter font, `#0a0a0a` card surfaces, gold `#d4af61` accent used sparingly, white detail anchor section). The team page should feel like a luxury directory, not a corporate "About us".

New public routes for Teams. All SSR, SEO-critical.

---

### P0 — Email Invite Acceptance Page

New route: `app/invite/[token]/page.tsx` (SSR).

- [ ] **SSR fetch** — `GET /public/invites/:token` (new backend endpoint). Returns `{ team: { name, slug, logoUrl }, role, inviter: { name }, expiresAt }` or 404/410.
- [ ] **Page layout** — `bg-neutral-100` page; centered white card (`rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)]`, max-w-md, px-8 py-10):
  - Team logo (72px, `rounded-xl`) centered. If no logo: initials block with gold accent (`bg-[rgba(212,175,97,0.1)] text-[#d4af61]`).
  - Heading: `text-lg font-medium text-neutral-900` — "You've been invited to **[Team]**".
  - Subtitle: `text-xs uppercase tracking-widest text-neutral-500` — "Invited by [inviter] as [role]".
  - Divider.
  - If user is signed in:
    - `Accept invitation` button — `h-11 rounded-xl bg-neutral-900 text-white text-sm font-medium w-full`. Calls `POST /invites/:token/accept` (with JWT cookie), redirects to dashboard `/teams/:teamId`.
    - `Decline` link below (text-xs neutral-500).
  - If not signed in:
    - `Sign in with Google to accept` button — same style as Accept, with Google G icon (16px) left.
    - Triggers OAuth flow with `state` carrying the token; on callback, backend auto-accepts and redirects to dashboard.
- [ ] **Expired state** — `Clock` icon (24px neutral-400) + "This invitation has expired" + subtitle "Ask [inviter] to send a new one." No CTA.
- [ ] **Already accepted/declined/cancelled** — subtitle reflects state ("You've already joined [Team]" → link to dashboard; "You declined this invitation").
- [ ] **404** for invalid token.
- [ ] **OG meta** — `"You're invited to [Team] on Crelyzor"`, OG image with team logo.

---

### P1 — Team Public Page

New route: `app/t/[slug]/page.tsx` (SSR).

- [ ] **SSR fetch** — `GET /public/teams/:slug`. Returns team name, slug, description, logoUrl, createdAt, member list (active only).
- [ ] **Page layout** — `bg-neutral-100`, centered max-w-2xl, py-12. Hero section (centered text):
  - Team logo (96px, `rounded-2xl`, dark `bg-[#0a0a0a]` surface with gold border `border-[#d4af61]/40`) — or initials block with gold accent if no logo.
  - Team name `text-3xl font-medium text-neutral-900 tracking-tight mt-6`.
  - Description `text-sm text-neutral-600 max-w-md mx-auto mt-2`.
  - Meta row (gap-4 text-[11px] uppercase tracking-widest text-neutral-500): `Users2` icon + "6 members" · `Calendar` icon + "Since May 2026".
- [ ] **Members section** — below hero, white anchor card (`bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] mt-10 p-6`):
  - Section header: `text-[10px] uppercase tracking-widest text-neutral-500 mb-4` — "MEMBERS".
  - Grid (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3`). Each member tile (`rounded-xl border border-neutral-200 p-4 hover:border-neutral-300 transition-colors`):
    - 40px avatar (`rounded-lg`) — or gold initials block fallback.
    - Name `text-sm font-medium text-neutral-900 mt-3`.
    - Role pill (`text-[10px] uppercase tracking-widest text-neutral-500 mt-1`) — e.g. "OWNER".
    - If member has team scheduling enabled: `Book a call →` link (`text-xs text-neutral-700 mt-3`) → `/schedule/t/[slug]/[username]`.
- [ ] **Footer** — `text-[11px] tracking-wide uppercase text-neutral-400 text-center mt-12` — "Powered by Crelyzor".
- [ ] **OG meta** — `"[Team] — on Crelyzor"`, description from team description, OG image with team logo on `#0a0a0a` background with gold accent line.
- [ ] **JSON-LD** — Organization schema via `safeJsonLd()` helper.
- [ ] **404** — `notFound()` when slug missing or team `isDeleted: true`.

---

### P2 — Team Member Booking Page

New route: `app/schedule/t/[slug]/[username]/page.tsx` (SSR).

- [ ] **SSR** — fetch team profile (`/public/scheduling/team/:slug/profile`) + member's team-scoped event types (`/public/scheduling/team/:slug/:username`).
- [ ] **Page header** (above booking UI):
  - Small bar (`flex items-center gap-3 text-xs text-neutral-500`): 28px team logo (`rounded-lg`) + team name (`text-neutral-900 font-medium`) + `→` (neutral-300) + "Book with **[Member Name]**".
  - Subtle gold underline (`h-px bg-[#d4af61]/30 w-12 mt-3`) — single accent touch, no more.
- [ ] **Booking flow** — reuse the existing personal booking layout (`app/schedule/[username]/[slug]/page.tsx` patterns). Event type list → slot picker → booking form → confirmation. No structural change; just data source.
- [ ] **Booking submit** — `POST /public/bookings` (no change — booking references the EventType which carries `teamId`).
- [ ] **Confirmation page** — small footer line: "Booked with [Member Name] at [Team]." + existing encryption assurance line.
- [ ] **OG meta** — `"Book with [Member Name] at [Team] — Crelyzor"`.
- [ ] **404** — team not found, member not on team, or member has no team-scoped scheduling.

---

### P3 — Backend Coordination (dependencies for above)

Listed here for visibility — these are tracked in `crelyzor-backend/TASKS.md` Phase 6 P2 and P6:

- [ ] `GET /public/invites/:token` — no auth.
- [ ] `POST /invites/:token/accept` — requires JWT.
- [ ] `GET /public/teams/:slug` — no auth.
- [ ] `GET /public/scheduling/team/:slug/profile` — no auth.
- [ ] `GET /public/scheduling/team/:slug/:username` — no auth.

---

## Future

- [ ] Wallet pass support (Apple Wallet, Google Wallet)
- [ ] Custom domain support
- [ ] Multiple cards selector on public page
