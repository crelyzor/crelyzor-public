/**
 * Phase 6 P14.d — Team-member event-type picker.
 *
 * Lists a single team member's team-scoped event types and links each one to
 * the booking flow. Mirrors the personal `/schedule/[username]` layout but
 * leads with team chrome so the guest knows they're booking via a team.
 */
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Calendar, ChevronRight, Clock, MapPin, Video } from 'lucide-react';
import { getPublicTeamMemberScheduling } from '@/lib/api';
import type {
  PublicTeamMemberSchedulingEventType,
  PublicTeamMemberSchedulingProfile,
} from '@/types/team';

interface Props {
  params: Promise<{ slug: string; username: string }>;
}

function initialsFor(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function displayNameFor(
  user: PublicTeamMemberSchedulingProfile['user']
): string {
  return user.name ?? user.username;
}

// ── Metadata ───────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, username } = await params;
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crelyzor.app';
  const canonical = `${base}/schedule/t/${slug}/${username}`;
  try {
    const profile = await getPublicTeamMemberScheduling(slug, username);
    const member = displayNameFor(profile.user);
    return {
      title: `Book with ${member} at ${profile.team.name} · Crelyzor`,
      description: `Schedule time with ${member} on the ${profile.team.name} team via Crelyzor.`,
      robots: { index: true, follow: true },
      alternates: { canonical },
      openGraph: {
        title: `Book with ${member} at ${profile.team.name}`,
        description: `Schedule time on the ${profile.team.name} team.`,
        type: 'website',
        url: canonical,
      },
    };
  } catch {
    return {
      title: 'Booking page not found · Crelyzor',
      robots: { index: false, follow: false },
    };
  }
}

// ── Visual primitives ─────────────────────────────────────────────────────

function TeamChromeStrip({
  profile,
}: {
  profile: PublicTeamMemberSchedulingProfile;
}) {
  const memberName = displayNameFor(profile.user);
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 text-xs text-neutral-500">
        {profile.team.logoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={profile.team.logoUrl}
            alt={profile.team.name}
            referrerPolicy="no-referrer"
            className="w-7 h-7 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'rgba(212,175,97,0.1)' }}
          >
            <span
              className="text-[10px] font-semibold"
              style={{ color: '#d4af61' }}
            >
              {initialsFor(profile.team.name)}
            </span>
          </div>
        )}
        <Link
          href={`/t/${profile.team.slug}`}
          className="text-neutral-900 font-medium hover:underline"
        >
          {profile.team.name}
        </Link>
        <ChevronRight className="w-3 h-3 text-neutral-300" />
        <span>
          Book with{' '}
          <span className="text-neutral-900 font-medium">{memberName}</span>
        </span>
      </div>
      <div
        className="h-px w-12 mt-3"
        style={{ background: 'rgba(212,175,97,0.3)' }}
      />
    </div>
  );
}

function LocationBadge({ locationType }: { locationType: string }) {
  const isOnline = locationType === 'ONLINE';
  const Icon = isOnline ? Video : MapPin;
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500">
      <Icon className="w-3 h-3" />
      {isOnline ? 'Video call' : 'In person'}
    </span>
  );
}

function EventTypeCard({
  teamSlug,
  username,
  eventType,
}: {
  teamSlug: string;
  username: string;
  eventType: PublicTeamMemberSchedulingEventType;
}) {
  return (
    <Link
      href={`/schedule/t/${teamSlug}/${username}/${eventType.slug}`}
      className="block rounded-xl border border-neutral-200 p-4 hover:border-neutral-300 transition-colors group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-neutral-900">
            {eventType.title}
          </p>
          {eventType.description && (
            <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
              {eventType.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500">
              <Clock className="w-3 h-3" />
              {eventType.duration} min
            </span>
            <LocationBadge locationType={eventType.locationType} />
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 shrink-0 mt-1" />
      </div>
    </Link>
  );
}

function MemberHero({
  profile,
}: {
  profile: PublicTeamMemberSchedulingProfile;
}) {
  const memberName = displayNameFor(profile.user);
  return (
    <section className="flex flex-col items-center text-center">
      {profile.user.avatarUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={profile.user.avatarUrl}
          alt={memberName}
          referrerPolicy="no-referrer"
          className="w-16 h-16 rounded-2xl object-cover"
        />
      ) : (
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(212,175,97,0.1)' }}
        >
          <span className="text-lg font-semibold" style={{ color: '#d4af61' }}>
            {initialsFor(memberName)}
          </span>
        </div>
      )}
      <h1 className="text-2xl font-medium tracking-tight text-neutral-900 mt-4">
        {memberName}
      </h1>
      <p className="text-xs text-neutral-500 mt-1">
        Pick a session below to see available times.
      </p>
    </section>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function TeamMemberSchedulingPage({ params }: Props) {
  const { slug, username } = await params;

  let profile: PublicTeamMemberSchedulingProfile;
  try {
    profile = await getPublicTeamMemberScheduling(slug, username);
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="max-w-xl mx-auto px-6 py-12">
        <TeamChromeStrip profile={profile} />
        <section
          className="bg-white rounded-2xl p-6"
          style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
        >
          <MemberHero profile={profile} />

          <div className="mt-8">
            {profile.eventTypes.length === 0 ? (
              <div className="flex flex-col items-center text-center py-10">
                <Calendar className="w-8 h-8 text-neutral-300" />
                <p className="text-sm font-medium text-neutral-700 mt-3">
                  Nothing bookable yet
                </p>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                  {displayNameFor(profile.user)} hasn&rsquo;t set up any team
                  event types for {profile.team.name} yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {profile.eventTypes.map((et) => (
                  <EventTypeCard
                    key={et.id}
                    teamSlug={profile.team.slug}
                    username={profile.user.username}
                    eventType={et}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <Link
          href={`/t/${profile.team.slug}`}
          className="block mt-8 text-[11px] tracking-widest uppercase text-neutral-400 hover:text-neutral-600 transition-colors text-center"
        >
          ← Back to {profile.team.name}
        </Link>
      </div>
    </main>
  );
}
