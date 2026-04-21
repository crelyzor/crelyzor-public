'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';

const GOLD = '#d4af61';

// The business card is intentionally always dark — it's a physical card preview
function BusinessCard({
  flipped,
  onFlip,
}: {
  flipped: boolean;
  onFlip: () => void;
}) {
  return (
    <div
      className="w-full cursor-pointer select-none"
      style={{ perspective: '1200px', aspectRatio: '1.586 / 1' }}
      onClick={onFlip}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 700ms cubic-bezier(0.4,0,0.2,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            backgroundColor: '#0a0a0a',
            boxShadow:
              '0 32px 80px rgba(0,0,0,0.8), 0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)',
            }}
          />
          <div className="relative h-full flex flex-col justify-between p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <div
                className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: '#1a1a1a',
                  boxShadow: `0 0 0 1.5px ${GOLD}`,
                }}
              >
                <span style={{ color: GOLD }} className="text-xl font-semibold">
                  H
                </span>
              </div>
              <div className="min-w-0 pt-1">
                <h3 className="text-white font-semibold text-[17px] leading-tight">
                  Harshit Rai
                </h3>
                <p
                  className="text-[11px] mt-1.5 uppercase tracking-widest"
                  style={{ color: GOLD }}
                >
                  Founder, Crelyzor
                </p>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="space-y-1.5">
                <p className="text-neutral-400 text-[10px] tracking-wide">
                  harshit@crelyzor.com
                </p>
                <p className="text-neutral-400 text-[10px] tracking-wide">
                  crelyzor.com
                </p>
              </div>
              <p className="text-neutral-700 text-[8px] tracking-widest uppercase">
                Tap to flip
              </p>
            </div>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5"
            style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD}55)` }}
          />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: '#0a0a0a',
            boxShadow:
              '0 32px 80px rgba(0,0,0,0.8), 0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)',
            }}
          />
          <div className="relative h-full flex flex-col justify-between p-6 sm:p-7">
            <p className="text-neutral-400 text-[12px] leading-relaxed">
              Building the all-in-one productivity OS for solo professionals —
              identity, schedule, meetings, and work in one place.
            </p>
            <div className="flex items-end justify-between">
              <div className="flex gap-3">
                {['in', 'tw', 'gh'].map((s) => (
                  <div
                    key={s}
                    className="p-2 rounded-lg bg-white/5"
                    style={{ color: GOLD }}
                  >
                    <span className="text-[9px] font-semibold uppercase">
                      {s}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-neutral-700 text-[8px] tracking-widest uppercase">
                Tap to flip
              </p>
            </div>
          </div>
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: `linear-gradient(90deg, ${GOLD}55, ${GOLD})` }}
          />
        </div>
      </div>
    </div>
  );
}

export function Demo() {
  const [flipped, setFlipped] = useState(false);

  return (
    <section
      id="demo"
      className="bg-background pt-16 pb-12 px-4 sm:pt-28 sm:pb-16 sm:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-[10px] tracking-[0.15em] text-[var(--muted-foreground)] uppercase font-medium mb-3 opacity-60">
              Digital Identity
            </p>
            <h2
              className="font-semibold text-[var(--foreground)] leading-[1.06] tracking-tight mb-5"
              style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}
            >
              Your identity.
              <br />
              <span className="text-[var(--muted-foreground)]">
                Physical. Digital.
              </span>
              <br />
              Shareable.
            </h2>
            <p className="text-[var(--muted-foreground)] text-base leading-relaxed mb-6">
              A premium digital business card — with a 3D flip, NFC-ready, and
              connected to everything you do.
            </p>
            <button
              onClick={() => setFlipped((f) => !f)}
              className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Flip the card
            </button>
          </motion.div>

          {/* Card — always dark by design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <BusinessCard
              flipped={flipped}
              onFlip={() => setFlipped((f) => !f)}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
