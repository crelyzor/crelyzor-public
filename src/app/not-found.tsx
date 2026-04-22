import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <p className="text-8xl font-thin text-neutral-300 tracking-tighter leading-none">
          404
        </p>
        <p className="text-neutral-600 font-medium mt-4">
          This card doesn&apos;t exist
        </p>
        <p className="text-neutral-400 text-sm mt-2">
          The link may be wrong or the card has been removed.
        </p>
        <Link
          href="/"
          className="inline-block mt-8 px-6 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: '#0a0a0a', color: '#d4af61' }}
        >
          Go to Crelyzor
        </Link>
        <p className="text-[10px] text-neutral-300 tracking-widest uppercase mt-8">
          Powered by Crelyzor
        </p>
      </div>
    </div>
  );
}
