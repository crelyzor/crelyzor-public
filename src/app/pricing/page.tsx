import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Check,
  Zap,
  Sparkles,
  Mic,
  Bot,
  HardDrive,
  Mail,
  ArrowRight,
  X,
} from 'lucide-react';

const APP_URL =
  process.env.NEXT_PUBLIC_CALENDAR_URL ?? 'https://app.crelyzor.com';
const SUPPORT_EMAIL = 'support@crelyzor.com';

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

// ── Plan data ────────────────────────────────────────────────────────────────

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    tag: null,
    description: 'For individuals exploring Crelyzor.',
    cta: 'Get started free',
    ctaHref: `${APP_URL}/signup`,
    ctaVariant: 'outline' as const,
    features: [
      { icon: Mic, text: '120 transcription minutes / month' },
      { icon: Sparkles, text: '50 AI credits / month' },
      { icon: Bot, text: 'No Google Meet auto-record', negative: true },
      { icon: HardDrive, text: '2 GB storage' },
      { icon: Check, text: 'Digital Cards + QR codes' },
      { icon: Check, text: 'Meeting notes & tasks' },
      { icon: Check, text: 'Scheduling (unlimited bookings)' },
      { icon: Check, text: 'Global search' },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹1,499',
    period: 'per month',
    tag: 'Most popular',
    description: 'For professionals who run on meetings.',
    cta: 'Upgrade to Pro',
    ctaHref: `mailto:${SUPPORT_EMAIL}?subject=Upgrade to Pro&body=Hi, I'd like to upgrade to the Crelyzor Pro plan.`,
    ctaVariant: 'primary' as const,
    features: [
      { icon: Mic, text: '600 transcription minutes / month' },
      { icon: Sparkles, text: '1,000 AI credits / month' },
      { icon: Bot, text: '5 hrs auto-record & transcribe Google Meet calls' },
      { icon: HardDrive, text: '20 GB storage' },
      { icon: Check, text: 'Everything in Free' },
      { icon: Check, text: 'Ask AI — unlimited questions per meeting' },
      {
        icon: Check,
        text: 'AI content generation (reports, emails, social posts)',
      },
      { icon: Check, text: 'Priority support' },
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
      { icon: Mic, text: 'Unlimited transcription' },
      { icon: Sparkles, text: 'Unlimited AI credits' },
      {
        icon: Bot,
        text: 'Unlimited auto-record & transcribe Google Meet calls',
      },
      { icon: HardDrive, text: 'Unlimited storage' },
      { icon: Check, text: 'Everything in Pro' },
      { icon: Check, text: 'Custom onboarding' },
      { icon: Check, text: 'SLA & dedicated support' },
      { icon: Check, text: 'Invoiced billing' },
    ],
  },
] as const;

// ── Comparison table ─────────────────────────────────────────────────────────

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
    free: '—',
    pro: '5 hrs / mo',
    business: 'Unlimited',
  },
  { label: 'Storage', free: '2 GB', pro: '20 GB', business: 'Unlimited' },
  { label: 'Digital Cards', free: '✓', pro: '✓', business: '✓' },
  { label: 'Scheduling', free: '✓', pro: '✓', business: '✓' },
  { label: 'Ask AI', free: '✓', pro: '✓', business: '✓' },
  { label: 'AI Content Generation', free: '✓', pro: '✓', business: '✓' },
  { label: 'Global Search', free: '✓', pro: '✓', business: '✓' },
  { label: 'Priority Support', free: '—', pro: '✓', business: '✓' },
  { label: 'SLA & Dedicated Support', free: '—', pro: '—', business: '✓' },
  { label: 'Custom Onboarding', free: '—', pro: '—', business: '✓' },
];

// ── FAQ ──────────────────────────────────────────────────────────────────────

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
    a: 'No — transcription minutes, AI credits, and Recall hours reset on the 1st of each month. Unused credits do not carry over.',
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

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-sm font-semibold text-neutral-100"
          >
            <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                className="w-4 h-4"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </span>
            Crelyzor
          </Link>
          <div className="flex items-center gap-4">
            <a
              href={APP_URL}
              className="text-xs font-medium text-neutral-400 hover:text-neutral-100 transition-colors hidden sm:block"
            >
              Sign in
            </a>
            <a
              href={`${APP_URL}/signup`}
              className="inline-flex items-center gap-1.5 h-8 px-4 rounded-full bg-white text-neutral-900 text-xs font-medium hover:bg-neutral-100 transition-colors"
            >
              Get started free
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/8 border border-white/10 text-xs font-medium text-neutral-300 mb-6">
            <Zap className="w-3 h-3" />
            Simple, transparent pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-neutral-50 tracking-tight leading-tight">
            Start free.{' '}
            <span className="text-neutral-400">Upgrade when ready.</span>
          </h1>
          <p className="mt-4 text-neutral-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            No credit card required. No hidden fees. Every plan includes
            meetings, tasks, cards, scheduling, and AI — right out of the box.
          </p>
        </div>
      </section>

      {/* Plan cards */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const isPro = plan.id === 'pro';
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border flex flex-col ${
                  isPro
                    ? 'border-neutral-500 ring-1 ring-neutral-500 bg-neutral-900'
                    : 'border-neutral-800 bg-neutral-900'
                }`}
              >
                {/* Pro header block */}
                {isPro ? (
                  <div className="bg-white rounded-t-2xl px-6 pt-5 pb-4 text-neutral-950">
                    {plan.tag && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-900 text-white mb-3">
                        {plan.tag}
                      </span>
                    )}
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                      {plan.name}
                    </p>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold tracking-tight text-neutral-950">
                        {plan.price}
                      </span>
                      {(plan.price as string) !== 'Custom' && (
                        <span className="text-sm text-neutral-500 mb-1">
                          /{plan.period}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      {plan.description}
                    </p>
                  </div>
                ) : (
                  <div className="px-6 pt-5 pb-4">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                      {plan.name}
                    </p>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold text-neutral-50 tracking-tight">
                        {plan.price}
                      </span>
                      {(plan.price as string) !== 'Custom' && (
                        <span className="text-sm text-neutral-500 mb-1">
                          /{plan.period}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      {plan.description}
                    </p>
                  </div>
                )}

                <div className="px-6 pb-6 flex flex-col gap-5 flex-1">
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f, i) => {
                      const Icon = f.icon;
                      const isNeg = 'negative' in f && f.negative;
                      return (
                        <li key={i} className="flex items-start gap-2">
                          <Icon
                            className={`w-4 h-4 mt-0.5 shrink-0 ${
                              isNeg ? 'text-neutral-600' : 'text-neutral-400'
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              isNeg
                                ? 'text-neutral-600 line-through'
                                : 'text-neutral-300'
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
                    className={`flex items-center justify-center gap-1.5 h-10 rounded-xl text-sm font-medium transition-colors ${
                      plan.ctaVariant === 'primary'
                        ? 'bg-white text-neutral-950 hover:bg-neutral-100'
                        : 'border border-neutral-700 text-neutral-300 hover:bg-white/5'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison table */}
      <section className="px-4 sm:px-6 pb-20 bg-neutral-900/50">
        <div className="max-w-5xl mx-auto pt-16">
          <h2 className="text-2xl font-semibold text-neutral-50 text-center mb-2">
            Full comparison
          </h2>
          <p className="text-sm text-neutral-500 text-center mb-10">
            Everything side by side so there are no surprises.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left py-4 px-5 font-medium text-neutral-500 w-1/2">
                    Feature
                  </th>
                  {plans.map((p) => (
                    <th
                      key={p.id}
                      className={`text-center py-4 px-3 font-semibold ${
                        p.id === 'pro' ? 'text-neutral-100' : 'text-neutral-400'
                      }`}
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
                    className={`border-b border-neutral-800/60 ${
                      i % 2 === 0 ? 'bg-neutral-900' : 'bg-neutral-800/30'
                    }`}
                  >
                    <td className="py-3.5 px-5 text-neutral-300 font-medium">
                      {row.label}
                    </td>
                    {[row.free, row.pro, row.business].map((val, j) => (
                      <td key={j} className="py-3.5 px-3 text-center">
                        {val === '✓' ? (
                          <Check className="w-4 h-4 text-neutral-400 mx-auto" />
                        ) : val === '—' ? (
                          <X className="w-4 h-4 text-neutral-700 mx-auto" />
                        ) : (
                          <span
                            className={`text-xs font-medium ${
                              j === 1 ? 'text-neutral-100' : 'text-neutral-400'
                            }`}
                          >
                            {val}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 sm:px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-neutral-50 text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="divide-y divide-neutral-800">
            {faqs.map((faq) => (
              <div key={faq.q} className="py-5">
                <p className="font-medium text-neutral-100 mb-2">{faq.q}</p>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner — inverted (white on dark page) */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-3xl mx-auto rounded-2xl bg-white px-8 py-12 text-center text-neutral-950">
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-5 h-5 text-neutral-700" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mb-2 text-neutral-950">
            Ready to upgrade?
          </h2>
          <p className="text-neutral-500 text-sm mb-6 max-w-sm mx-auto">
            Email us and we&apos;ll upgrade your account within 24 hours.
            Self-serve payments coming soon.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=Upgrade to Pro`}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-2xl bg-neutral-950 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              <Mail className="w-4 h-4" />
              {SUPPORT_EMAIL}
            </a>
            <a
              href={`${APP_URL}/signup`}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-2xl border border-neutral-200 text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition-colors"
            >
              Start free first
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} Crelyzor. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="text-xs text-neutral-600 hover:text-neutral-300 transition-colors"
            >
              Cards
            </Link>
            <a
              href={APP_URL}
              className="text-xs text-neutral-600 hover:text-neutral-300 transition-colors"
            >
              App
            </a>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-xs text-neutral-600 hover:text-neutral-300 transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
