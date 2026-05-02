import type { Metadata } from 'next';
import Link from 'next/link';
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

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Crelyzor',
  url: 'https://crelyzor.app',
  logo: 'https://crelyzor.app/assets/icon-512.png',
  description:
    'All-in-one professional identity platform — digital cards, AI meeting transcription, and smart scheduling.',
  sameAs: [],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Crelyzor',
  url: 'https://crelyzor.app',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://crelyzor.app/{search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const softwareAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Crelyzor',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://crelyzor.app',
  description:
    'All-in-one professional identity platform — digital cards, AI meeting transcription, smart scheduling, and task management.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      <HomeNavbar />
      <Hero />
      <Features />
      <Demo />
      <CTA />

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 px-6 bg-background">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <img
              src="/assets/logo-light.svg"
              alt="Crelyzor"
              className="h-5 w-auto block dark:hidden"
            />
            <img
              src="/assets/logo-dark.svg"
              alt="Crelyzor"
              className="h-5 w-auto hidden dark:block"
            />
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/terms"
              className="text-[11px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors opacity-60 hover:opacity-100"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-[11px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors opacity-60 hover:opacity-100"
            >
              Privacy
            </Link>
            <p className="text-[var(--muted-foreground)] text-[11px] tracking-widest uppercase opacity-40">
              © {new Date().getFullYear()} Crelyzor
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
