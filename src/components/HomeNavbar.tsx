'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

const GOLD = '#d4af61';
const APP_URL =
  process.env.NEXT_PUBLIC_CALENDAR_URL ?? 'https://app.crelyzor.com';

export function HomeNavbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4 sm:px-8 sm:py-5 flex items-center justify-between"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg border flex items-center justify-center"
          style={{ borderColor: `${GOLD}50`, backgroundColor: '#111' }}
        >
          <span style={{ color: GOLD }} className="text-[11px] font-semibold">
            C
          </span>
        </div>
        <span className="text-white font-medium text-sm tracking-tight">
          Crelyzor
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          href="/pricing"
          className="text-xs font-medium px-3 py-1.5 text-neutral-400 hover:text-white transition-colors hidden sm:block"
        >
          Pricing
        </Link>
        <a
          href={APP_URL}
          className="text-xs font-medium px-3 py-1.5 text-neutral-400 hover:text-white transition-colors hidden sm:block"
        >
          Sign in
        </a>
        <a
          href={`${APP_URL}/signup`}
          className="text-xs font-medium px-4 py-2 rounded-full text-[#0a0a0a] transition-opacity hover:opacity-90"
          style={{ backgroundColor: GOLD }}
        >
          Get started free
        </a>
      </div>
    </motion.header>
  );
}
