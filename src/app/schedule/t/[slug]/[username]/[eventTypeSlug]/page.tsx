/**
 * Phase 6 P14.d — Team-member booking flow.
 *
 * Reuses the existing personal `<BookingFlow>` component. Slot fetching +
 * booking submission go through the personal /public/scheduling/slots and
 * /public/bookings endpoints — they resolve EventType by (userId, slug) and
 * the backend infers teamId from the resolved row. No team-id is required
 * in the wire payload.
 *
 * TODO(P14.d-follow-up): BookingFlow hardcodes the confirmed-page redirect
 * (`/schedule/${username}/${slug}/confirmed`) and the back-link to the
 * member's personal `/schedule/${username}`. For team bookings that lands
 * the guest in the personal URL space on the confirm step. Acceptable for
 * v1; a `redirectBase` / `backHref` prop is the cleanest fix.
 */
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronRight } from 'lucide-react';
import { BookingFlow } from '@/app/schedule/[username]/[slug]/BookingFlow';
import { getPublicTeamMemberScheduling } from '@/lib/api';
import type {
  PublicTeamMemberSchedulingEventType,
  PublicTeamMemberSchedulingProfile,
} from '@/types/team';

interface Props {
  params: Promise<{ slug: string; username: string; eventTypeSlug: string }>;
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
  const { slug, username, eventTypeSlug } = await params;
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crelyzor.app';
  const canonical = `${base}/schedule/t/${slug}/${username}/${eventTypeSlug}`;
  try {
    const profile = await getPublicTeamMemberScheduling(slug, username);
    const et = profile.eventTypes.find(
      (e: PublicTeamMemberSchedulingEventType) => e.slug === eventTypeSlug
    );
    if (!et) {
      return {
        title: 'Booking page not found · Crelyzor',
        robots: { index: false, follow: false },
      };
    }
    const member = displayNameFor(profile.user);
    return {
      title: `Book ${et.duration}-min ${et.title} with ${member} · ${profile.team.name}`,
      description: `Schedule a ${et.duration}-minute ${et.title} with ${member} on the ${profile.team.name} team.`,
      robots: { index: true, follow: true },
      alternates: { canonical },
      openGraph: {
        title: `Book ${et.title} with ${member} at ${profile.team.name}`,
        description: `${et.duration}-minute ${et.title}.`,
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

// ── Team chrome strip ─────────────────────────────────────────────────────

function TeamChromeStrip({
  profile,
}: {
  profile: PublicTeamMemberSchedulingProfile;
}) {
  const memberName = displayNameFor(profile.user);
  return (
    <div className="max-w-xl mx-auto px-6 pt-8">
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
        <Link
          href={`/schedule/t/${profile.team.slug}/${profile.user.username}`}
          className="hover:text-neutral-900 hover:underline"
        >
          Book with{' '}
          <span className="text-neutral-900 font-medium">{memberName}</span>
        </Link>
      </div>
      <div
        className="h-px w-12 mt-3"
        style={{ background: 'rgba(212,175,97,0.3)' }}
      />
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function TeamMemberBookingPage({ params }: Props) {
  const { slug, username, eventTypeSlug } = await params;

  let profile: PublicTeamMemberSchedulingProfile;
  try {
    profile = await getPublicTeamMemberScheduling(slug, username);
  } catch {
    notFound();
  }

  const eventType = profile.eventTypes.find(
    (e: PublicTeamMemberSchedulingEventType) => e.slug === eventTypeSlug
  );
  if (!eventType) notFound();

  return (
    <main className="min-h-screen bg-neutral-100">
      <TeamChromeStrip profile={profile} />
      <BookingFlow
        username={profile.user.username}
        eventType={eventType}
        host={{
          username: profile.user.username,
          name: displayNameFor(profile.user),
          avatarUrl: profile.user.avatarUrl,
          timezone: profile.user.timezone,
        }}
        isEmbed={false}
      />
    </main>
  );
}
