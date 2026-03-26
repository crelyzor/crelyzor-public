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
  try {
    const profile = await getSchedulingProfile(username);
    const title = `Book time with ${profile.user.name}`;
    return {
      title,
      description: `Schedule a meeting with ${profile.user.name} via Crelyzor.`,
      openGraph: { title, type: 'website' },
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

function EventTypeCard({
  et,
  username,
}: {
  et: SchedulingEventType;
  username: string;
}) {
  return (
    <Link href={`/schedule/${username}/${et.slug}`}>
      <div
        className="bg-white rounded-2xl p-5 hover:shadow-md transition-all duration-200 active:scale-[0.99]"
        style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
      >
        <h3 className="text-sm font-medium text-neutral-900">{et.title}</h3>
        {et.description && (
          <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
            {et.description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-3">
          <span className="flex items-center gap-1.5 text-[11px] text-neutral-500">
            <ClockIcon />
            {et.duration} min
          </span>
          <span className="text-neutral-200">·</span>
          <span className="flex items-center gap-1.5 text-[11px] text-neutral-500">
            {et.locationType === 'ONLINE' ? <VideoIcon /> : <PinIcon />}
            {et.locationType === 'ONLINE' ? 'Online' : 'In person'}
          </span>
        </div>
        <div
          className="mt-4 h-px"
          style={{
            background:
              'linear-gradient(to right, #d4af61, rgba(212,175,97,0.1))',
          }}
        />
        <p
          className="text-[10px] mt-3 font-medium"
          style={{ color: '#d4af61' }}
        >
          Schedule →
        </p>
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
      <div className="px-4 pt-12 pb-8" style={{ background: '#0a0a0a' }}>
        <div className="max-w-sm mx-auto">
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-3">
            Booking
          </p>
          <div className="flex items-center gap-3 mb-1">
            {profile.user.avatarUrl && (
              <Image
                src={profile.user.avatarUrl}
                alt={profile.user.name}
                width={36}
                height={36}
                className="rounded-xl object-cover"
                style={{ border: '1px solid rgba(212,175,97,0.3)' }}
              />
            )}
            <h1 className="text-xl font-semibold text-white">
              {profile.user.name}
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Select a meeting type to get started
          </p>
          <div
            className="mt-6 h-px w-16"
            style={{
              background:
                'linear-gradient(to right, #d4af61, rgba(212,175,97,0.2))',
            }}
          />
        </div>
      </div>

      {/* Event type cards */}
      <div className="max-w-sm mx-auto px-4 py-6 space-y-3">
        {profile.eventTypes.length === 0 ? (
          <div
            className="bg-white rounded-2xl p-8 text-center"
            style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
          >
            <p className="text-sm text-neutral-400">
              No booking options are available right now.
            </p>
          </div>
        ) : (
          profile.eventTypes.map((et) => (
            <EventTypeCard key={et.id} et={et} username={username} />
          ))
        )}

        <div className="pt-4 pb-8 text-center">
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
