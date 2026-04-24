'use client';

import { motion } from 'motion/react';

const GOLD = '#d4af61';
const FOUNDER_EMAIL = 'harsh@crelyzor.app';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.crelyzor.app';

export function CTA() {
  return (
    <section
      id="cta"
      className="pt-12 pb-20 px-4 sm:pt-16 sm:pb-28 sm:px-8 border-t border-[var(--border)] bg-background relative overflow-hidden"
    >
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at bottom, ${GOLD}0a 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Part 1 — Product CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2
            className="font-semibold text-[var(--foreground)] leading-[1.04] tracking-tight mb-4"
            style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}
          >
            One tool.
            <br />
            <span style={{ color: GOLD }}>Everything connected.</span>
          </h2>
          <p className="text-[var(--muted-foreground)] text-sm leading-relaxed mb-8 max-w-sm">
            Cards, AI meetings, scheduling, tasks — free to start. No waitlist.
            No credit card.
          </p>
          <a
            href={`${APP_URL}/signin`}
            className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: GOLD, color: '#0a0a0a' }}
          >
            Get started free →
          </a>
        </motion.div>

        {/* Part 2 — Founder note */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-16 pt-10 border-t border-[var(--border)]"
        >
          <p className="text-[var(--foreground)] text-sm leading-relaxed max-w-lg mb-5">
            Crelyzor is young. We know that. We&apos;re a small team building
            something we wish existed — and we&apos;d rather have real people
            using it and telling us what&apos;s wrong than spend months
            perfecting it in private.
            <br />
            <br />
            If something breaks, feels off, or you have an idea — I want to hear
            it directly.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${FOUNDER_EMAIL}`}
              className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors underline underline-offset-4"
            >
              {FOUNDER_EMAIL}
            </a>
            <span className="text-[var(--border)]">·</span>
            <a
              href={`mailto:${FOUNDER_EMAIL}?subject=${encodeURIComponent('Bug report')}`}
              className="text-sm transition-colors hover:opacity-80"
              style={{ color: GOLD }}
            >
              Report a bug →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
