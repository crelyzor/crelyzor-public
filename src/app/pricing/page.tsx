// Aesthetic: Premium editorial dark — confident type scale, gold accent on Pro tier only,
// generous vertical rhythm, no decorative clutter. Stripe pricing meets a premium card product.

import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, X, ArrowRight, Mail } from 'lucide-react';
import { HomeNavbar } from '@/components/HomeNavbar';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
const SUPPORT_EMAIL = 'harshkeshari100@gmail.com';
const GOLD = '#d4af61';

export const metadata: Metadata = {
  title: 'Pricing — Crelyzor',
  description:
    'Simple, transparent pricing for Crelyzor. Start free, upgrade when you need more transcription, AI credits, and auto-recording.',
  openGraph: {
    title: 'Pricing — Crelyzor',
    description:
      'Start free. Upgrade to Pro for 5× more transcription, 20× more AI credits, and auto-recording.',
    type: 'website',
  },
};

// ── Plan data ─────────────────────────────────────────────────────────────────

const freePlan = {
  id: 'free',
  label: 'Open',
  name: 'Free',
  price: '₹0',
  period: 'forever',
  description: 'For individuals exploring Crelyzor.',
  cta: 'Get started free',
  ctaHref: `${APP_URL}/signin`,
  features: [
    { text: '120 transcription minutes / month' },
    { text: '50 AI credits / month' },
    { text: 'Google Meet auto-record', negative: true },
    { text: '2 GB storage' },
    { text: 'Digital Cards + QR codes' },
    { text: 'Meeting notes & tasks' },
    { text: 'Scheduling (unlimited bookings)' },
    { text: 'Global search' },
  ],
} as const;

const enterprisePlan = {
  id: 'enterprise',
  label: 'Enterprise',
  tag: 'Recommended',
  name: 'Custom',
  description: 'For teams with high volume or custom needs.',
  cta: 'Book a Demo',
  ctaHref: `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Business Plan Inquiry')}`,
  features: [
    { text: 'Unlimited transcription' },
    { text: 'Unlimited AI credits' },
    { text: 'Unlimited auto-record & transcribe (Google Meet)' },
    { text: 'Unlimited storage' },
    { text: 'Custom onboarding' },
    { text: 'SLA & dedicated support' },
    { text: 'Invoiced billing' },
  ],
} as const;

// ── Comparison table ──────────────────────────────────────────────────────────

const comparisonRows = [
  { label: 'Transcription', free: '120 min / mo', enterprise: 'Unlimited' },
  { label: 'AI Credits', free: '50 / mo', enterprise: 'Unlimited' },
  {
    label: 'Auto-record & Transcribe (Google Meet)',
    free: false,
    enterprise: 'Unlimited',
  },
  { label: 'Storage', free: '2 GB', enterprise: 'Unlimited' },
  { label: 'Digital Cards', free: true, enterprise: true },
  { label: 'Scheduling', free: true, enterprise: true },
  { label: 'Ask AI', free: true, enterprise: true },
  { label: 'AI Content Generation', free: true, enterprise: true },
  { label: 'Global Search', free: true, enterprise: true },
  { label: 'Priority Support', free: false, enterprise: true },
  { label: 'SLA & Dedicated Support', free: false, enterprise: true },
  { label: 'Custom Onboarding', free: false, enterprise: true },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: 'What counts as an AI credit?',
    a: 'One credit ≈ one AI operation (a summary, a task extraction, a content generation, or a few Ask AI messages). Credits are calculated from OpenAI token usage — 1 credit per ~1,300 input tokens or ~220 output tokens.',
  },
  {
    q: 'What is auto-record & transcribe for Google Meet?',
    a: 'Crelyzor automatically joins your Google Meet calls just before they start, records the audio, transcribes it, and runs the full AI pipeline — summary, key points, and tasks — no manual upload needed. Available on Pro and Business.',
  },
  {
    q: 'Do credits roll over month to month?',
    a: 'No — transcription minutes, AI credits, and recording hours reset on the 1st of each month. Unused credits do not carry over.',
  },
  {
    q: 'How do I upgrade right now?',
    a: `Email us at ${SUPPORT_EMAIL} and we'll upgrade your account manually within 24 hours. A self-serve payment flow is coming soon.`,
  },
  {
    q: 'Can I downgrade back to Free?',
    a: "Yes — just email us and we'll downgrade your account at the end of your current billing period.",
  },
  {
    q: 'Is there a team plan?',
    a: 'Not yet — Crelyzor is currently designed for individual professionals. Team billing is on the roadmap. Reach out if this is a blocker.',
  },
];

// ── Cell renderer ─────────────────────────────────────────────────────────────

function TableCell({
  value,
  accent,
}: {
  value: string | boolean;
  accent?: string;
}) {
  if (value === true)
    return (
      <Check
        className="mx-auto"
        style={{ width: 15, height: 15, color: accent ?? 'var(--muted-foreground)' }}
      />
    );
  if (value === false)
    return (
      <X className="mx-auto text-muted/40" style={{ width: 14, height: 14 }} />
    );
  return (
    <span
      className="text-xs font-medium tabular-nums"
      style={{ color: accent ?? 'var(--muted-foreground)' }}
    >
      {value}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* ── Nav ── */}
      <HomeNavbar />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 px-5 sm:px-8 overflow-hidden">
        {/* Ambient glow — dark mode only */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-80 opacity-20 dark:opacity-100"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,175,97,0.07) 0%, transparent 100%)`,
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-5">
            Pricing
          </p>
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.1] text-foreground">
            One tool.
            <br />
            <span className="text-muted-foreground font-normal">
              Everything connected.
            </span>
          </h1>
          <p className="mt-6 text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
            No credit card required. Every plan includes meetings, cards,
            scheduling, and AI — right out of the box.
          </p>
        </div>
      </section>

      {/* ── Plan cards ── */}
      <section className="px-5 sm:px-8 pb-24">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* ── Free — light tray (dark: zinc tray) ── */}
          <div className="flex flex-col rounded-2xl bg-[#F4F4F5] dark:bg-zinc-800 p-1.5 ring-1 ring-zinc-900/5 dark:ring-zinc-700/30 shadow-sm">
            {/* Header inner card */}
            <div className="flex flex-col px-5 py-4 sm:px-7 sm:pt-6 sm:pb-6 h-[212px] rounded-xl bg-white dark:bg-zinc-900 ring-1 ring-zinc-200/80 dark:ring-zinc-700/40 shadow-sm">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  {freePlan.label}
                </h3>
                <div className="mt-2.5 flex items-baseline leading-none">
                  <span className="text-[30px] sm:text-[36px] font-bold tracking-tight text-zinc-950 dark:text-white">
                    {freePlan.name}
                  </span>
                </div>
                <p className="mt-2.5 text-[13.5px] font-medium text-zinc-600 dark:text-zinc-400">
                  {freePlan.description}
                </p>
              </div>
              <a
                href={freePlan.ctaHref}
                className="mt-auto inline-flex w-full cursor-pointer items-center justify-center rounded-xl bg-zinc-950 dark:bg-white py-3 px-4 text-[14px] font-semibold text-white dark:text-zinc-950 shadow-md transition-[transform,background-color] duration-150 hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
              >
                {freePlan.cta}
              </a>
            </div>

            {/* Features inner card */}
            <div className="flex-1 mt-1.5 rounded-xl bg-white dark:bg-zinc-900 ring-1 ring-zinc-200/80 dark:ring-zinc-700/40 shadow-sm px-5 py-5 sm:px-7 sm:py-6">
              <ul className="flex flex-col gap-y-2.5">
                {freePlan.features.map((f, i) => {
                  const isNeg = 'negative' in f && f.negative;
                  return (
                    <li
                      key={i}
                      className="flex items-center gap-2.5 text-[13.5px] font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      {isNeg ? (
                        <X className="size-4 shrink-0 text-zinc-300 dark:text-zinc-600" />
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          className="size-4 shrink-0"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            fill="#18181B"
                            className="dark:fill-zinc-600"
                          />
                          <path
                            d="M8 12.5L10.5 15L16 9"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      <span
                        className={
                          isNeg
                            ? 'text-zinc-400 dark:text-zinc-600 line-through'
                            : ''
                        }
                      >
                        {f.text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* ── Enterprise — dark tray ── */}
          <div className="flex flex-col rounded-2xl bg-[#3f3f46] p-1.5 shadow-2xl">
            {/* Header inner card */}
            <div className="flex flex-col px-5 py-4 sm:px-7 sm:pt-6 sm:pb-6 h-[212px] rounded-xl bg-[#18181b]">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    {enterprisePlan.label}
                  </h3>
                  <span
                    className="rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase"
                    style={{ backgroundColor: `${GOLD}22`, color: GOLD }}
                  >
                    {enterprisePlan.tag}
                  </span>
                </div>
                <div className="mt-2.5 flex items-baseline leading-none">
                  <span className="text-[30px] sm:text-[36px] font-bold tracking-tight text-white">
                    {enterprisePlan.name}
                  </span>
                </div>
                <p className="mt-2.5 text-[13.5px] font-medium text-zinc-400">
                  {enterprisePlan.description}
                </p>
              </div>
              <a
                href={enterprisePlan.ctaHref}
                className="mt-auto inline-flex w-full cursor-pointer items-center justify-center rounded-xl py-3 px-4 text-[14px] font-semibold shadow-md transition-transform duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2"
                style={{ backgroundColor: GOLD, color: '#0a0a0a' }}
              >
                {enterprisePlan.cta}
              </a>
            </div>

            {/* Features inner card */}
            <div className="flex-1 mt-1.5 rounded-xl bg-[#222225] border border-white/5 px-5 py-5 sm:px-7 sm:py-6">
              <p className="font-mono text-[12px] text-zinc-400 mb-4">
                Everything in Free, plus:
              </p>
              <ul className="flex flex-col gap-y-2.5">
                {enterprisePlan.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 text-[13.5px] font-medium text-zinc-200"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="size-4 shrink-0"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9.5"
                        stroke="#52525B"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M8 12.5L10.5 15L16 9"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {f.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison table ── */}
      <section className="px-5 sm:px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">
              Full comparison
            </h2>
            <p className="mt-2 text-sm text-muted">
              Everything side by side — no surprises.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider w-[55%]">
                    Feature
                  </th>
                  <th className="text-center py-4 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {freePlan.label}
                  </th>
                  <th
                    className="text-center py-4 px-4 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: GOLD }}
                  >
                    {enterprisePlan.label}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.label}
                    className="border-b border-border/50 last:border-0 transition-colors hover:bg-surface-raised/40"
                    style={{
                      background:
                        i % 2 === 0
                          ? 'var(--surface)'
                          : 'var(--surface-raised)/20',
                    }}
                  >
                    <td className="py-3.5 px-6 text-foreground/70 text-sm">
                      {row.label}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <TableCell value={row.free} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <TableCell value={row.enterprise} accent={GOLD} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-5 sm:px-8 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">
              Common questions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 max-w-5xl mx-auto">
            {faqs.map((faq, i) => (
              <div key={faq.q}>
                <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="text-sm font-semibold text-foreground mb-2 leading-snug">
                  {faq.q}
                </p>
                <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner — always white, intentional contrast ── */}
      <section className="px-5 sm:px-8 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl bg-neutral-950 dark:bg-zinc-800/60 dark:border dark:border-zinc-700/50 px-8 sm:px-16 py-14 text-center">
            <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 dark:text-zinc-500 mb-4">
              Ready to upgrade?
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-3">
              Your next meeting,
              <br />
              fully covered.
            </h2>
            <p className="text-sm text-neutral-400 dark:text-zinc-400 mb-8 max-w-xs mx-auto leading-relaxed">
              Email us and we&apos;ll upgrade your account within 24 hours.
              Self-serve payments coming soon.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=Upgrade to Pro`}
                className="inline-flex items-center gap-2.5 h-11 px-6 rounded-xl text-sm font-medium transition-colors"
                style={{ backgroundColor: GOLD, color: '#0a0a0a' }}
              >
                <Mail className="w-4 h-4" />
                {SUPPORT_EMAIL}
              </a>
              <a
                href={`${APP_URL}/signin`}
                className="inline-flex items-center gap-2 h-11 px-6 rounded-xl border border-neutral-700 dark:border-zinc-600 text-neutral-300 dark:text-zinc-300 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-zinc-700 transition-colors"
              >
                Start free first
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Crelyzor. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              Cards
            </Link>
            <a
              href={`${APP_URL}/signin`}
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              App
            </a>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
