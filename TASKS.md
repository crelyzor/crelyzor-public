# cards-frontend — Task List

Last updated: 2026-03-02

---

## In Progress

_Nothing in progress right now._

---

## Phase 1 — Pending

### Polish & Reliability

- [ ] Handle missing avatar gracefully (initials fallback — gold initial on dark bg)
- [ ] Handle missing bio, links, contact fields (hide sections if empty, not blank space)
- [ ] Error state when card not found (nice 404, not broken page)
- [ ] Loading skeleton while card fetches (match card shape, dark skeleton)
- [ ] Smooth image loading (fade in avatar on load, no layout shift)

### Contact Form

- [ ] Form validation (name required, email or phone required)
- [ ] Success state after submission (confirmation message)
- [ ] Error state if submission fails
- [ ] Loading state during submit

### vCard Download

- [ ] Verify vCard format works on iOS and Android
- [ ] Test that all fields populate correctly in phone contacts

### SEO & Meta

- [ ] Dynamic `<title>` per card (`{name} — Crelyzor`)
- [ ] Open Graph tags (for link previews when shared)
- [ ] `description` meta tag from card bio

---

## Phase 1 — Done

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

## Phase 1.2 — Future

- [ ] Wallet pass support (Apple Wallet, Google Wallet)
- [ ] NFC tap-to-view preparation (meta tags, URL structure)

---

## Future (V2)

- [ ] Custom domain support (`card.yourdomain.com`)
- [ ] Analytics pixel (view tracking)
- [ ] Multiple cards selector on public page
