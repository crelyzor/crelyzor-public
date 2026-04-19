'use client';

import { useState } from 'react';
import { motion } from 'motion/react';

const GOLD = '#d4af61';

export function CTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="waitlist"
      className="pt-12 pb-20 px-4 sm:pt-16 sm:pb-28 sm:px-8 border-t border-neutral-900 bg-[#0a0a0a] relative overflow-hidden"
    >
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at bottom, ${GOLD}0a 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-[10px] tracking-[0.15em] text-neutral-600 uppercase font-medium mb-4">
            Early Access
          </p>
          <h2
            className="font-semibold text-white leading-[1.04] tracking-tight mb-4"
            style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}
          >
            One tool.
            <br />
            Everything connected.
            <br />
            <span style={{ color: GOLD }}>Built for you.</span>
          </h2>
          <p className="text-neutral-600 text-sm leading-relaxed mb-8 max-w-sm">
            Join the waitlist for early access before public launch. Cards, AI meetings, scheduling, and tasks — all in one place.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 max-w-md"
        >
          {submitted ? (
            <div
              className="py-3 px-5 rounded-xl border text-sm font-medium"
              style={{
                borderColor: GOLD + '40',
                backgroundColor: GOLD + '0d',
                color: GOLD,
              }}
            >
              You&apos;re on the list. We&apos;ll be in touch.
            </div>
          ) : (
            <>
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-700 text-sm focus:outline-none focus:border-neutral-700 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl text-sm font-medium shrink-0 transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: GOLD, color: '#0a0a0a' }}
              >
                {loading ? 'Joining...' : 'Join waitlist'}
              </button>
            </>
          )}
        </motion.form>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        <p className="text-neutral-800 text-xs mt-4">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
