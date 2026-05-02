import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getSchedulingProfile } from '@/lib/api';
import type { SchedulingEventType } from '@/types/scheduling';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crelyzor.app';
  try {
    const profile = await getSchedulingProfile(username);
    const title = `Book time with ${profile.user.name}`;
    const description = `Schedule a meeting with ${profile.user.name} via Crelyzor.`;
    const ogImage = `/api/og/${username}`;
    return {
      title,
      description,
      alternates: { canonical: `${base}/schedule/${username}` },
      openGraph: {
        title,
        description,
        type: 'website',
        images: [{ url: ogImage, width: 1200, height: 630 }],
      },
    };
  } catch {
    return { title: 'Booking Page Not Found' };
  }
}

function ClockIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.9L15 14" />
      <rect x="3" y="7" width="12" height="10" rx="2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function EventTypeRow({
  et,
  username,
  isLast,
}: {
  et: SchedulingEventType;
  username: string;
  isLast: boolean;
}) {
  return (
    <Link href={`/schedule/${username}/${et.slug}`}>
      <div
        className={`flex items-center justify-between px-5 py-4 hover:bg-neutral-50 transition-colors duration-150 active:bg-neutral-100 ${
          !isLast ? 'border-b border-neutral-100' : ''
        }`}
      >
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-sm font-medium text-neutral-900">{et.title}</h3>
          {et.description && (
            <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
              {et.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-[11px] text-neutral-400">
              <ClockIcon />
              {et.duration} min
            </span>
            <span className="text-neutral-200">·</span>
            <span className="flex items-center gap-1 text-[11px] text-neutral-400">
              {et.locationType === 'ONLINE' ? <VideoIcon /> : <PinIcon />}
              {et.locationType === 'ONLINE' ? 'Online' : 'In person'}
            </span>
          </div>
        </div>
        <span
          className="text-[11px] font-medium shrink-0"
          style={{ color: '#d4af61' }}
        >
          Book →
        </span>
      </div>
    </Link>
  );
}

export default async function SchedulingProfilePage({ params }: Props) {
  const { username } = await params;

  let profile;
  try {
    profile = await getSchedulingProfile(username);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Dark header */}
      <div className="pt-8 pb-10" style={{ background: '#0a0a0a' }}>
        <div className="max-w-sm mx-auto px-4">
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-3">
            Booking
          </p>
          <div className="flex items-center gap-3">
            {profile.user.avatarUrl ? (
              <Image
                src={profile.user.avatarUrl}
                alt={profile.user.name}
                width={44}
                height={44}
                className="rounded-xl object-cover shrink-0"
                style={{ border: '1px solid rgba(212,175,97,0.3)' }}
              />
            ) : (
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(212,175,97,0.1)' }}
              >
                <span
                  style={{ color: '#d4af61' }}
                  className="text-base font-semibold"
                >
                  {profile.user.name[0].toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-lg font-semibold text-white leading-tight">
                {profile.user.name}
              </h1>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Select a meeting type to get started
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Event type list */}
      <div className="max-w-sm mx-auto px-4 -mt-5 pb-10">
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
        >
          {profile.eventTypes.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-neutral-400">
                No booking options available right now.
              </p>
            </div>
          ) : (
            profile.eventTypes.map((et, i) => (
              <EventTypeRow
                key={et.id}
                et={et}
                username={username}
                isLast={i === profile.eventTypes.length - 1}
              />
            ))
          )}
        </div>

        <div className="pt-8 text-center">
          <Link
            href="/"
            className="text-[11px] tracking-widest uppercase text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            Powered by Crelyzor
          </Link>
        </div>
      </div>
    </div>
  );
}
