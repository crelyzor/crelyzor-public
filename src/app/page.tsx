import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crelyzor Cards — Share Your Professional Identity',
  description:
    'Share your professional identity with a single link. Clean, fast, and memorable.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Logo mark */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-900 mb-8">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            className="w-7 h-7"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </div>

        <h1 className="text-3xl font-semibold text-neutral-950 tracking-tight">
          Digital Cards
        </h1>
        <p className="text-neutral-500 mt-3 text-base leading-relaxed max-w-sm mx-auto">
          Share your professional identity with a single link. Clean, fast, and
          memorable.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {[
            'One-tap contact sharing',
            'QR codes',
            'Link tracking',
            'vCard export',
          ].map((feature) => (
            <span
              key={feature}
              className="px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-xs font-medium text-neutral-600"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10">
          <a
            href={
              process.env.NEXT_PUBLIC_CALENDAR_URL ?? 'http://localhost:5173'
            }
            className="inline-flex items-center justify-center h-12 px-8 rounded-2xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Create your card
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4 ml-2"
            >
              <path
                d="M5 12h14M12 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <p className="text-[11px] text-neutral-300 mt-16 tracking-wide">
          Powered by Crelyzor
        </p>
      </div>
    </div>
  );
}
