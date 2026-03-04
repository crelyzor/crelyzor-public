# cards-frontend — UI Intelligence

> Public-facing frontend for Crelyzor. Read this before touching anything here.

---

## What This Repo Is

The public frontend for Crelyzor — all SEO-critical, shareable, no-auth pages.

**Framework: Next.js App Router.** SSR is required — public pages need proper OG previews and Google indexing.

- No auth required. Fully public.
- All public URLs for the entire Crelyzor product live here
- `calendar-frontend` (authenticated dashboard) has zero public routes

**Current public routes:**

- `/:username` — public card / profile page
- `/:username/:slug` — specific card
- `/m/:id` — published meeting page (transcript, summary, tasks — Phase 1 P2)
- `/schedule/:username` — availability + booking (Phase 1.2)

**This repo is the public frontend, not just cards.** Do not add dashboard/management UI here.
Dashboard features live in `calendar-frontend`. Both repos are fully independent — no shared packages.

---

## Plugin

Use the **frontend-design** skill when building or modifying UI here.

---

## The Vibe

**Premium. Dark. Tactile.**

If `calendar-frontend` is minimal and professional, `cards-frontend` is premium and tactile.

- Near-black backgrounds (`#0a0a0a`) — card feels physical, printed
- Gold accent only (`#d4af61`) — one accent, used sparingly
- The card literally flips in 3D — the product IS a physical card metaphor
- Inter font — clean, slightly more neutral than DM Sans
- Micro-typography dominant — business cards are small and dense by nature
- White detail section below the card — anchors the dark card on a neutral surface

**Reference:** Think premium NFC business card meets Stripe's dark product pages.

---

## Design Tokens

```css
/* Backgrounds */
Card face: #0a0a0a (near black)
Page bg: bg-neutral-100 (very light gray)
Detail section: #ffffff with subtle shadow

/* Gold accent */
Primary accent: #d4af61
Gradient: linear-gradient(to right, #d4af61, rgba(212, 175, 97, 0.4))

/* Text */
On dark: white, neutral-300, neutral-400, neutral-500
On light: neutral-900, neutral-600, neutral-500

/* Borders */
Card border: neutral-700/40 (subtle on dark)
Detail border: rgba(0,0,0,0.06) shadow, no harsh borders
```

---

## The Card Component

**3D Flip — The Core Interaction**

```tsx
// Outer wrapper — enables 3D
style={{ perspective: "1200px" }}

// Card body — rotates
style={{
  transformStyle: "preserve-3d",
  transition: "transform 700ms cubic-bezier(0.4, 0, 0.2, 1)",
  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
}}

// Each face
style={{ backfaceVisibility: "hidden" }}
// Back face additionally: rotateY(180deg) in base state
```

**Card proportions:** Aspect ratio 1.586:1 (standard business card)

**Card front:**

- Diagonal texture: `repeating-linear-gradient(135deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 80px)`
- Avatar: 56px, `rounded-xl`, gold accent border `border-[#d4af61]/50`
- Name: `text-sm font-medium text-white`
- Title: `text-[10px] text-neutral-400 uppercase tracking-widest`
- Contact icons: 10px text, icon 8-9px (micro)
- Bottom gold bar: gradient from `#d4af61` to `#d4af61/40`
- "Tap to flip" hint: `text-[8px] text-neutral-500 uppercase tracking-widest`

**Card back:**

- Texture: 45deg (different angle from front)
- Gold bar at top instead of bottom
- Bio: `text-[11px] text-neutral-300 line-clamp-3`
- Social links: `gap-3`, each icon in `p-2 rounded-lg bg-white/5`
- Website: `text-[10px] text-neutral-400 truncate`

---

## Typography

- **Font:** Inter (loaded from Google Fonts)
- **Hierarchy:**
  - Card name: `text-sm font-medium` — precise, not large
  - Card title: `text-[10px] uppercase tracking-widest`
  - Body/bio: `text-[11px]`
  - Actions: `text-xs`
  - Footer: `text-[11px] tracking-wide uppercase text-neutral-300`
- **Sizing philosophy:** Business cards are small. Use 8-12px text intentionally.

---

## Detail Section (Below Card)

White card below the dark flip card. Anchors the design.

```tsx
className="bg-white rounded-2xl"
style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
```

**Quick action buttons:**

```tsx
// Primary action (Save Contact)
className="flex-1 h-10 rounded-xl bg-neutral-900 text-white text-xs font-medium"

// Gold action (if premium)
style={{ background: "#d4af61", color: "#0a0a0a" }}

// Secondary (Phone, Website)
className="h-10 rounded-xl border border-neutral-200 text-neutral-600 text-xs"
```

**Links list items:**

```tsx
className =
  'flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-50 transition-colors';
```

---

## Avatar Initials (No Photo)

```tsx
// When no avatar URL
<div
  className="w-14 h-14 rounded-xl flex items-center justify-center"
  style={{ background: 'rgba(212,175,97,0.1)' }}
>
  <span style={{ color: '#d4af61' }} className="text-lg font-semibold">
    {name[0].toUpperCase()}
  </span>
</div>
```

---

## File Structure (Next.js App Router)

```
app/
├── page.tsx                        ← Home/landing (Crelyzor promo)
├── not-found.tsx                   ← 404
├── [username]/
│   ├── page.tsx                    ← Default card page (SSR)
│   └── [slug]/
│       └── page.tsx                ← Specific card (SSR)
├── m/
│   └── [id]/
│       └── page.tsx                ← Published meeting page (SSR, Phase 1 P2)
└── schedule/
    └── [username]/
        └── page.tsx                ← Availability + booking (Phase 1.2)

components/
├── card/
│   ├── CardFlip.tsx                ← 3D flip card (client component)
│   ├── CardFront.tsx
│   ├── CardBack.tsx
│   └── CardDetail.tsx
└── meeting/
    └── PublishedMeeting.tsx        ← Published meeting view (Phase 1 P2)

lib/
└── api.ts                          ← API calls to calendar-backend

types/
├── card.ts
└── meeting.ts
```

---

## API Calls

All calls go to `calendar-backend`. Use the API client in `lib/api.ts`.

Key endpoints:

```
GET  /api/v1/public/cards/:username          → Default card
GET  /api/v1/public/cards/:username/:slug    → Specific card
POST /api/v1/public/cards/:username/contact  → Submit contact form
GET  /api/v1/public/cards/:username/vcard    → Download vCard

GET  /api/v1/public/meetings/:shortId        → Published meeting data (Phase 1 P2)

GET  /api/v1/meetings/availability/:username → User availability (Phase 1.2)
POST /api/v1/meetings/book                   → Submit a booking (Phase 1.2)
```

No auth token needed. All public.

---

## Next.js Conventions

```tsx
// SSR pages — use async server components and generateMetadata
export async function generateMetadata({ params }) {
  const card = await fetchCard(params.username);
  return { title: `${card.name} — Crelyzor`, openGraph: { ... } };
}

// Client components — mark with 'use client' (only for interactivity)
// The 3D flip card must be a client component
'use client';

// Fetch data in server components — call backend directly (no React Query)
// React Query is only for calendar-frontend (authenticated, client-side)
const card = await api.getCard(username); // server component fetch
```

## What NOT To Do

- Do NOT add dashboard/management UI here — that's `calendar-frontend`
- Do NOT add authentication — this is fully public
- Do NOT use DM Sans — this repo uses Inter
- Do NOT use colors other than neutrals + gold (`#d4af61`)
- Do NOT make the card anything other than dark (`#0a0a0a`)
- Do NOT change the 1.586:1 aspect ratio — it's a standard business card
- Do NOT import from `calendar-frontend` — repos are fully independent
- Do NOT add heavy dependencies — keep this repo lean
- Do NOT add animations heavier than the 700ms flip and subtle hovers
- Do NOT use React Query here — this is Next.js SSR, fetch in server components
- Do NOT add public routes to `calendar-frontend` — all public URLs live here
