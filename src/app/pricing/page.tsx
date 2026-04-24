// Aesthetic: Premium editorial dark — confident type scale, gold accent on Pro tier only,
// generous vertical rhythm, no decorative clutter. Stripe pricing meets a premium card product.

import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, X, ArrowRight, Mail } from 'lucide-react';
import { HomeNavbar } from '@/components/HomeNavbar';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
const SUPPORT_EMAIL = 'support@crelyzor.app';
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

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    tag: null,
    description: 'For individuals exploring Crelyzor.',
    cta: 'Get started free',
    ctaHref: `${APP_URL}/signin`,
    ctaVariant: 'outline' as const,
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
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹1,499',
    period: 'per month',
    tag: 'Most popular',
    description: 'For professionals who run on meetings.',
    cta: 'Get Pro — email us',
    ctaHref: `mailto:${SUPPORT_EMAIL}?subject=I want Pro&body=Hi, I'd like to upgrade to the Crelyzor Pro plan.`,
    ctaVariant: 'primary' as const,
    features: [
      { text: '600 transcription minutes / month' },
      { text: '1,000 AI credits / month' },
      { text: 'Auto-record & transcribe Google Meet calls' },
      { text: '20 GB storage' },
      { text: 'Everything in Free' },
      { text: 'Ask AI — unlimited questions per meeting' },
      { text: 'AI content generation (reports, emails, social posts)' },
      { text: 'Priority support' },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: 'Custom',
    period: 'negotiated per deal',
    tag: null,
    description: 'For teams with high volume or custom needs.',
    cta: 'Contact us',
    ctaHref: `mailto:${SUPPORT_EMAIL}?subject=Business Plan Inquiry`,
    ctaVariant: 'outline' as const,
    features: [
      { text: 'Unlimited transcription' },
      { text: 'Unlimited AI credits' },
      { text: 'Unlimited auto-record & transcribe (Google Meet)' },
      { text: 'Unlimited storage' },
      { text: 'Everything in Pro' },
      { text: 'Custom onboarding' },
      { text: 'SLA & dedicated support' },
      { text: 'Invoiced billing' },
    ],
  },
] as const;

// ── Comparison table ──────────────────────────────────────────────────────────

const comparisonRows = [
  {
    label: 'Transcription',
    free: '120 min / mo',
    pro: '600 min / mo',
    business: 'Unlimited',
  },
  {
    label: 'AI Credits',
    free: '50 / mo',
    pro: '1,000 / mo',
    business: 'Unlimited',
  },
  {
    label: 'Auto-record & Transcribe (Google Meet)',
    free: false,
    pro: '5 hrs / mo',
    business: 'Unlimited',
  },
  { label: 'Storage', free: '2 GB', pro: '20 GB', business: 'Unlimited' },
  { label: 'Digital Cards', free: true, pro: true, business: true },
  { label: 'Scheduling', free: true, pro: true, business: true },
  { label: 'Ask AI', free: true, pro: true, business: true },
  { label: 'AI Content Generation', free: true, pro: true, business: true },
  { label: 'Global Search', free: true, pro: true, business: true },
  { label: 'Priority Support', free: false, pro: true, business: true },
  { label: 'SLA & Dedicated Support', free: false, pro: false, business: true },
  { label: 'Custom Onboarding', free: false, pro: false, business: true },
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
  isPro,
}: {
  value: string | boolean;
  isPro: boolean;
}) {
  if (value === true) {
    return (
      <Check
        className="mx-auto"
        style={{
          width: 15,
          height: 15,
          color: isPro ? GOLD : 'var(--muted-foreground)',
        }}
      />
    );
  }
  if (value === false) {
    return (
      <X className="mx-auto text-muted/40" style={{ width: 14, height: 14 }} />
    );
  }
  return (
    <span
      className="text-xs font-medium tabular-nums"
      style={{ color: isPro ? GOLD : 'var(--muted-foreground)' }}
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
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isPro = plan.id === 'pro';
            const isBusiness = plan.id === 'business';

            return (
              <div
                key={plan.id}
                className="relative rounded-2xl flex flex-col overflow-hidden"
                style={
                  isPro
                    ? {
                        border: `1px solid rgba(212,175,97,0.25)`,
                        boxShadow: `0 0 0 1px rgba(212,175,97,0.08), 0 24px 48px rgba(0,0,0,0.3)`,
                        background: 'var(--surface)',
                      }
                    : {
                        border: '1px solid var(--border)',
                        background: 'var(--surface)',
                      }
                }
              >
                {/* Pro — white in light, dark gold in dark mode */}
                {isPro && (
                  <div className="px-7 pt-6 pb-5 bg-white dark:bg-neutral-900">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
                        {plan.name}
                      </span>
                      {plan.tag && (
                        <span
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: GOLD, color: '#0a0a0a' }}
                        >
                          {plan.tag}
                        </span>
                      )}
                    </div>
                    <div className="flex items-end gap-1.5">
                      <span className="text-4xl font-bold tracking-tight text-neutral-950 dark:text-white leading-none">
                        {plan.price}
                      </span>
                      {(plan.price as string) !== 'Custom' && (
                        <span className="text-sm text-neutral-400 mb-0.5">
                          / {plan.period}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>
                )}

                {/* Free & Business — dark header */}
                {!isPro && (
                  <div className="px-7 pt-6 pb-5 border-b border-border">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-muted">
                        {plan.name}
                      </span>
                    </div>
                    <div className="flex items-end gap-1.5">
                      <span className="text-4xl font-bold tracking-tight text-foreground leading-none">
                        {plan.price}
                      </span>
                      {(plan.price as string) !== 'Custom' && (
                        <span className="text-sm text-muted mb-0.5">
                          / {plan.period}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-2 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>
                )}

                {/* Features */}
                <div className="px-7 py-6 flex flex-col flex-1 gap-6">
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((f, i) => {
                      const isNeg = 'negative' in f && f.negative;
                      return (
                        <li key={i} className="flex items-start gap-3">
                          {isNeg ? (
                            <X className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted/50" />
                          ) : (
                            <Check
                              className="w-3.5 h-3.5 mt-0.5 shrink-0"
                              style={{
                                color: isPro ? GOLD : 'var(--muted-foreground)',
                              }}
                            />
                          )}
                          <span
                            className={`text-sm leading-snug ${
                              isNeg
                                ? 'text-muted/50 line-through'
                                : 'text-foreground/80'
                            }`}
                          >
                            {f.text}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  <a
                    href={plan.ctaHref}
                    className={
                      isPro
                        ? 'flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-medium transition-opacity hover:opacity-85 cta-gold'
                        : 'flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-medium transition-all border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                    }
                  >
                    {plan.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Comparison table ── */}
      <section className="px-5 sm:px-8 pb-24">
        <div className="max-w-6xl mx-auto">
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
                  <th className="text-left py-4 px-6 text-xs font-semibold text-muted uppercase tracking-wider w-[45%]">
                    Feature
                  </th>
                  {plans.map((p) => (
                    <th
                      key={p.id}
                      className="text-center py-4 px-4 text-xs font-semibold uppercase tracking-wider"
                      style={{
                        color:
                          p.id === 'pro' ? GOLD : 'var(--muted-foreground)',
                      }}
                    >
                      {p.name}
                    </th>
                  ))}
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
                      <TableCell value={row.free} isPro={false} />
                    </td>
                    <td
                      className="py-3.5 px-4 text-center"
                      style={{ background: 'rgba(212,175,97,0.03)' }}
                    >
                      <TableCell value={row.pro} isPro={true} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <TableCell value={row.business} isPro={false} />
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
          <div className="rounded-2xl bg-neutral-950 dark:bg-white px-8 sm:px-16 py-14 text-center">
            <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400 mb-4">
              Ready to upgrade?
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white dark:text-neutral-950 mb-3">
              Your next meeting,
              <br />
              fully covered.
            </h2>
            <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-8 max-w-xs mx-auto leading-relaxed">
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
                className="inline-flex items-center gap-2 h-11 px-6 rounded-xl border border-neutral-700 dark:border-neutral-200 text-neutral-300 dark:text-neutral-600 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-50 transition-colors"
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
