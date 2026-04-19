import type { Metadata } from 'next';
import { HomeNavbar } from '@/components/HomeNavbar';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { Demo } from '@/components/sections/Demo';
import { CTA } from '@/components/sections/CTA';

export const metadata: Metadata = {
  title: 'Crelyzor — Your meetings remember everything',
  description:
    'One tool for your identity, schedule, meetings, and work. Digital cards, AI meeting transcription, smart scheduling — all connected.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <HomeNavbar />
      <Hero />
      <Features />
      <Demo />
      <CTA />

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-8 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-lg border flex items-center justify-center"
              style={{ borderColor: '#d4af61', backgroundColor: '#0a0a0a' }}
            >
              <span
                style={{ color: '#d4af61' }}
                className="text-[10px] font-semibold"
              >
                C
              </span>
            </div>
            <span className="text-neutral-600 text-sm tracking-wide">
              Crelyzor
            </span>
          </div>
          <p className="text-neutral-800 text-[11px] tracking-widest uppercase">
            © {new Date().getFullYear()} Crelyzor
          </p>
        </div>
      </footer>
    </main>
  );
}
