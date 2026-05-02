'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

const GOLD = '#d4af61';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

export function HomeNavbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4 sm:px-8 sm:py-5 flex items-center justify-between"
      style={{
        backgroundColor: 'var(--nav-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center">
        <Image src="/assets/logo-light.svg" alt="Crelyzor" width={120} height={28} className="h-7 w-auto block dark:hidden" />
        <Image src="/assets/logo-dark.svg" alt="Crelyzor" width={120} height={28} className="h-7 w-auto hidden dark:block" />
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          href="/pricing"
          className="text-xs font-medium px-3 py-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors hidden sm:block"
        >
          Pricing
        </Link>
        <a
          href={`${APP_URL}/signin`}
          className="text-xs font-medium px-3 py-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors hidden sm:block"
        >
          Sign in
        </a>
        <a
          href={`${APP_URL}/signin`}
          className="text-xs font-medium px-4 py-2 rounded-full text-[#0a0a0a] transition-opacity hover:opacity-90"
          style={{ backgroundColor: GOLD }}
        >
          Get started free
        </a>
      </div>
    </motion.header>
  );
}
