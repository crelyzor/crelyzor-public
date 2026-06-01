# cards-frontend — Task List

Last updated: 2026-06-01 (Phase 6 P14.c shipped ✅ — Public SSR /t/:slug team profile page. Hero with dark logo wrapper + gold border (or gold-initials fallback), white anchor card with member roster (avatar + role pill + bookable "Book a call →" link), JSON-LD Organization schema, dual-fetch with single-failure tolerance. P14.a + P14.b also live. P14.d team-member booking page is next.)

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

### P0 — Email Invite Acceptance Page ✅ Preview shipped (P14.a — 2026-05-30)

Dev notes: `../docs/dev-notes/phase-6-p14a-public-invite-preview.md`.

Route: `app/invite/[token]/page.tsx` (SSR). Backend endpoint is already `GET /api/v1/invites/:token` (no auth) per indexRouter.ts:113.

- [x] **SSR fetch** — `getInvitePreview(token)` in `src/lib/api.ts`. Returns `PublicInvitePreview | null`; throws `ApiError(410)` on expired so the page can render the expired-card variant.
- [x] **Page layout** — `bg-neutral-100` page; centered white card (`rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)]`, max-w-md, px-8 py-10). Team logo (72px, `rounded-xl`) or gold-initials fallback on `rgba(212,175,97,0.1)` bg with `#d4af61` text. Heading + micro-label subtitle + divider + dark CTA + expires sub-line.
- [x] **CTA → dashboard** — `Open in Crelyzor to accept` → `${NEXT_PUBLIC_APP_URL}/invite/${token}` with `referrerPolicy="no-referrer"` to prevent token-leak via Referer header. The actual accept POST lives in the dashboard (requires JWT) — ships in P14.b.
- [x] **Expired state** — `Clock` icon (neutral-100 disc) + "This invitation has expired" + "Ask the team owner to send a new invitation." No CTA. Triggered by `ApiError.status === 410`.
- [x] **404** — `notFound()` falls through to existing not-found.tsx for invalid / cancelled / declined / accepted / team-deleted tokens.
- [x] **OG meta** — `"You're invited to [Team] · Crelyzor"`, robots noindex, OG image from `team.logoUrl` when available, canonical alternates.
- [~] **In-app accept/decline directly on this page** — NOT built here by design. Accept requires JWT; the public site is auth-free. CTA hands off to the dashboard. The reviewer-approved split keeps crelyzor-public clean.

---

### P1 — Team Public Page ✅ Complete (P14.c — 2026-06-01)

Dev notes: `../docs/dev-notes/phase-6-p14c-public-team-page.md`.

Route: `app/t/[slug]/page.tsx` (SSR). Dual fetch: `GET /api/v1/public/teams/:slug` (required) + `GET /api/v1/public/scheduling/team/:slug/profile` (optional, degrades gracefully).

- [x] **SSR fetch** — `getPublicTeam(slug)` + `getPublicTeamScheduling(slug)` in `src/lib/api.ts`. Scheduling fetch wrapped in try/catch so the team profile still renders if that endpoint hiccups.
- [x] **Page layout** — `bg-neutral-100`, centered max-w-2xl, py-12. Hero (centered): 96px dark `#0a0a0a` logo wrapper with gold `#d4af61` border, or gold-initials fallback. Team name 3xl, optional description, meta row "N members" + "Since [Month YYYY]" with Users2 + Calendar icons.
- [x] **Members section** — white anchor card (`bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] mt-10 p-6`) with "MEMBERS" micro-label + responsive 1/2/3-column grid. Each tile: 40px avatar (or gold initials) + name + role pill ("Owner" / "Admin" / "Member") + optional "Book a call →" Link.
- [x] **Bookable detection** — Set intersection of usernames from `/public/scheduling/team/:slug/profile` ∩ team members. Only members in the strict bookable subset get the "Book a call" link.
- [x] **Footer** — "Powered by Crelyzor" Link to `/`.
- [x] **OG meta** — `[Team] · Crelyzor` title, description, OG image from `team.logoUrl` when present, alternates canonical, robots index:true, Twitter summary card.
- [x] **JSON-LD** — Organization schema via `safeJsonLd()` helper. Name, url, optional logo, optional description, member array.
- [x] **404** — `notFound()` falls through to existing not-found.tsx when team missing or soft-deleted.
- [~] **OG image with dark background + gold accent line** — using the team's raw logoUrl directly; a dynamic ImageResponse rendering on `#0a0a0a` is a follow-up polish task.

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
