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
} from 'lucide-react';

const GOLD = '#d4af61';

const features = [
  {
    icon: CreditCard,
    name: 'Digital Cards',
    desc: 'Shareable URL, QR code, NFC-ready, vCard download, card analytics, multiple cards per profile.',
  },
  {
    icon: Mic,
    name: 'AI Transcription',
    desc: 'Upload any recording — Deepgram transcribes with speaker diarization. Who said what, timestamped.',
  },
  {
    icon: Sparkles,
    name: 'Smart AI Summary',
    desc: 'Auto-generated summary, key points, decisions made, and action items — from every meeting.',
  },
  {
    icon: MessageSquare,
    name: 'Ask AI',
    desc: 'Chat interface for any meeting. "What did Sarah say about the timeline?" — answered instantly.',
  },
  {
    icon: FileText,
    name: 'AI Content Generation',
    desc: 'Generate follow-up emails, meeting reports, and social posts directly from your transcripts.',
  },
  {
    icon: CalendarDays,
    name: 'Smart Scheduling',
    desc: 'Booking links, availability management, Google Calendar sync — all in one place.',
  },
  {
    icon: CheckSquare,
    name: 'Tasks',
    desc: 'AI-extracted from meetings automatically. Create manually, link to meetings and contacts.',
  },
  {
    icon: Search,
    name: 'Global Search',
    desc: 'Search across meetings, cards, contacts, and tasks — everything, instantly.',
  },
];

export function Features() {
  return (
    <section className="bg-[#0a0a0a] py-20 px-4 sm:py-28 sm:px-8 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-16"
        >
          <p className="text-[10px] tracking-[0.15em] text-neutral-600 uppercase font-medium mb-4">
            Everything included
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2
              className="font-semibold text-white leading-[1.06] tracking-tight"
              style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
            >
              One product.
              <br />
              <span style={{ color: GOLD }}>Eight superpowers.</span>
            </h2>
            <p className="text-neutral-600 text-sm leading-relaxed max-w-xs sm:text-right">
              Replaces HiHello, Cal.com, Otter.ai, and Todoist — with AI woven
              through every layer.
            </p>
          </div>
        </motion.div>

        {/* Feature grid — 2 rows of 4, editorial spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-900">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (i % 4) * 0.06 }}
                className="bg-[#0a0a0a] p-6 flex flex-col gap-3 group"
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
                  <p className="text-white text-sm font-medium mb-1.5">
                    {feature.name}
                  </p>
                  <p className="text-neutral-600 text-[13px] leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
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
          className="mt-10 pt-8 border-t border-neutral-900 flex flex-wrap items-center gap-x-6 gap-y-2"
        >
          <p className="text-neutral-700 text-[11px] uppercase tracking-widest">
            Replaces
          </p>
          {['HiHello', 'Cal.com', 'Otter.ai', 'Todoist'].map((tool) => (
            <span
              key={tool}
              className="text-neutral-600 text-[12px] line-through decoration-neutral-800"
            >
              {tool}
            </span>
          ))}
          <span className="text-neutral-700 text-[11px]">—</span>
          <span className="text-[12px]" style={{ color: GOLD }}>
            Crelyzor
          </span>
        </motion.div>
      </div>
    </section>
  );
}
