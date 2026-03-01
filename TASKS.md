# cards-frontend — Task List

Last updated: 2026-03-02

> **Rule:** When you complete a task, change `- [ ]` to `- [x]` and move it to the Done section.
> **Legend:** `[ ]` Not started · `[~]` Has code but broken/incomplete · `[x]` Done and working

---

## In Progress

_Nothing in progress right now._

---

## Phase 1 — Polish (Low Priority — Cards Work Fine)

### Resilience
- [ ] Handle missing avatar — initials fallback (gold initial on dark bg)
- [ ] Handle missing bio / links / contact fields — hide empty sections cleanly
- [ ] Error state when card not found — nice 404, not broken page
- [ ] Loading skeleton — match card shape and dark bg while fetching
- [ ] Smooth avatar image load — fade in, no layout shift

### Contact Form
- [ ] Form validation (name required + email or phone required)
- [ ] Success state after submission
- [ ] Error state if submission fails
- [ ] Loading state during submit

### vCard Download
- [ ] Verify vCard works on iOS and Android
- [ ] Verify all fields populate correctly in phone contacts

### SEO & Meta
- [ ] Dynamic `<title>` — `{name} — Crelyzor`
- [ ] Open Graph tags (for link previews)
- [ ] `description` meta from card bio

---

## Phase 1 — Done ✅

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
