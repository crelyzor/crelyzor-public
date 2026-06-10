// Aesthetic: editorial dark grid — asymmetric layout with a large hero feature
// and supporting items in a dense list. Gold on feature icons only. No shadows.
'use client';

import { motion } from 'motion/react';
import {
  CreditCard,
  Mic,
  Sparkles,
  MessageSquare,
  FileText,
  CalendarDays,
  CheckSquare,
  Search,
  Lock,
  Users,
} from 'lucide-react';

const GOLD = '#d4af61';

const features = [
  {
    icon: CreditCard,
    name: 'Digital Cards',
    desc: 'Your digital business card. Shareable link, QR code, vCard. Multiple cards for different contexts.',
  },
  {
    icon: Mic,
    name: 'AI Transcription',
    desc: 'Drop in any recording and get a full transcript with speaker labels. In person or on a call.',
  },
  {
    icon: Sparkles,
    name: 'Smart AI Summary',
    desc: 'Every meeting gets a clean summary, key points, and action items pulled out automatically.',
  },
  {
    icon: MessageSquare,
    name: 'Ask AI',
    desc: 'Ask anything about a meeting in plain English. Works on recordings you uploaded months ago.',
  },
  {
    icon: FileText,
    name: 'AI Content Generation',
    desc: 'Turn any transcript into a follow-up email, meeting report, or blog post in seconds.',
  },
  {
    icon: CalendarDays,
    name: 'Smart Scheduling',
    desc: 'Booking links that sync with Google Calendar. Guests pick a time, you just show up.',
  },
  {
    icon: CheckSquare,
    name: 'Tasks',
    desc: 'AI pulls tasks from every meeting automatically. Add your own and link them to meetings or contacts.',
  },
  {
    icon: Search,
    name: 'Global Search',
    desc: 'One search bar for meetings, cards, contacts, and tasks. Everything findable from one place.',
  },
  {
    icon: Lock,
    name: 'Encrypted at Rest',
    desc: 'Every transcript, summary, note, and contact is encrypted with a key only you control. Delete your account and every byte is gone.',
  },
  {
    icon: Users,
    name: 'Built for Teams',
    desc: 'Invite your team to a shared workspace. Team cards, shared scheduling pages, and everyone keeps their own profile.',
  },
];

export function Features() {
  return (
    <section className="bg-background py-20 px-4 sm:py-28 sm:px-8 border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-16"
        >
          <p className="text-[10px] tracking-[0.15em] text-[var(--muted-foreground)] uppercase font-medium mb-4 opacity-60">
            Everything in Crelyzor
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2
              className="font-semibold text-[var(--foreground)] leading-[1.06] tracking-tight"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
            >
              One product.
              <br />
              <span style={{ color: GOLD }}>Ten superpowers.</span>
            </h2>
            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed max-w-xs sm:text-right">
              Replaces HiHello, Cal.com, Otter.ai, and Todoist. AI woven
              through every layer.
            </p>
          </div>
        </motion.div>

        {/* Feature grid — first 8 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)]">
          {features.slice(0, 8).map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (i % 4) * 0.06 }}
                className="bg-background p-6 flex flex-col gap-3 group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${GOLD}12`,
                    border: `1px solid ${GOLD}25`,
                  }}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: GOLD }}
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <p className="text-[var(--foreground)] text-sm font-medium mb-1.5">
                    {feature.name}
                  </p>
                  <p className="text-[var(--muted-foreground)] text-[13px] leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Featured row — last 2 (Encryption + Teams) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--border)] mt-px">
          {features.slice(8).map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="bg-background p-6 flex flex-col gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${GOLD}12`,
                      border: `1px solid ${GOLD}25`,
                    }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: GOLD }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <p className="text-[var(--foreground)] text-sm font-medium">
                    {feature.name}
                  </p>
                </div>
                <p className="text-[var(--muted-foreground)] text-[13px] leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom rule with replacements */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 pt-8 border-t border-[var(--border)] flex flex-wrap items-center gap-x-6 gap-y-2"
        >
          <p className="text-[var(--muted-foreground)] text-[11px] uppercase tracking-widest opacity-40">
            Replaces
          </p>
          {['HiHello', 'Cal.com', 'Otter.ai', 'Todoist'].map((tool) => (
            <span
              key={tool}
              className="text-[var(--muted-foreground)] text-[12px] line-through opacity-50"
            >
              {tool}
            </span>
          ))}
          <span className="text-[var(--muted-foreground)] text-[11px] opacity-40">
            ·
          </span>
          <span className="text-[12px]" style={{ color: GOLD }}>
            Crelyzor
          </span>
        </motion.div>
      </div>
    </section>
  );
}
