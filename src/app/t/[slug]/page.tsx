import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Calendar, Users2 } from 'lucide-react';
import { getPublicTeam, getPublicTeamScheduling } from '@/lib/api';
import { safeJsonLd } from '@/lib/jsonLd';
import type {
  PublicTeamMember,
  PublicTeamProfile,
  PublicTeamRole,
} from '@/types/team';

interface Props {
  params: Promise<{ slug: string }>;
}

const ROLE_LABEL: Record<PublicTeamRole, string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  MEMBER: 'Member',
};

// ── Helpers ────────────────────────────────────────────────────────────────

function initialsFor(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatJoinedSince(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// ── Metadata ───────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crelyzor.app';
  const canonical = `${base}/t/${slug}`;
  try {
    const { team } = await getPublicTeam(slug);
    const description =
      team.description ?? `${team.name} — a team on Crelyzor.`;
    return {
      title: `${team.name} · Crelyzor`,
      description,
      robots: { index: true, follow: true },
      alternates: { canonical },
      openGraph: {
        title: `${team.name} on Crelyzor`,
        description,
        type: 'website',
        url: canonical,
        images: team.logoUrl ? [{ url: team.logoUrl }] : [],
      },
      twitter: {
        card: 'summary',
        title: `${team.name} on Crelyzor`,
        description,
      },
    };
  } catch {
    return {
      title: 'Team not found · Crelyzor',
      robots: { index: false, follow: false },
    };
  }
}

// ── Visual primitives ─────────────────────────────────────────────────────

function TeamHero({
  team,
  memberCount,
}: {
  team: PublicTeamProfile['team'];
  memberCount: number;
}) {
  return (
    <section className="flex flex-col items-center text-center">
      {team.logoUrl ? (
        <div
          className="w-24 h-24 rounded-2xl flex items-center justify-center p-3"
          style={{
            background: '#0a0a0a',
            border: '1px solid rgba(212,175,97,0.4)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={team.logoUrl}
            alt={team.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div
          className="w-24 h-24 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(212,175,97,0.1)' }}
        >
          <span className="text-2xl font-semibold" style={{ color: '#d4af61' }}>
            {initialsFor(team.name)}
          </span>
        </div>
      )}

      <h1 className="text-3xl font-medium tracking-tight text-neutral-900 mt-6">
        {team.name}
      </h1>

      {team.description && (
        <p className="text-sm text-neutral-600 max-w-md mx-auto mt-2 leading-relaxed">
          {team.description}
        </p>
      )}

      <div className="flex items-center justify-center gap-4 mt-5 text-[11px] uppercase tracking-widest text-neutral-500">
        <span className="inline-flex items-center gap-1.5">
          <Users2 className="w-3 h-3" />
          {memberCount} {memberCount === 1 ? 'member' : 'members'}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="w-3 h-3" />
          Since {formatJoinedSince(team.createdAt)}
        </span>
      </div>
    </section>
  );
}

function MemberAvatar({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl: string | null;
}) {
  if (avatarUrl) {
    /* eslint-disable-next-line @next/next/no-img-element */
    return (
      <img
        src={avatarUrl}
        alt={name}
        referrerPolicy="no-referrer"
        className="w-10 h-10 rounded-lg object-cover"
      />
    );
  }
  return (
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center"
      style={{ background: 'rgba(212,175,97,0.1)' }}
    >
      <span className="text-sm font-semibold" style={{ color: '#d4af61' }}>
        {initialsFor(name)}
      </span>
    </div>
  );
}

function MemberTile({
  member,
  bookable,
  teamSlug,
}: {
  member: PublicTeamMember;
  bookable: boolean;
  teamSlug: string;
}) {
  const displayName = member.user.name ?? member.user.username ?? 'Member';
  return (
    <article className="rounded-xl border border-neutral-200 p-4 hover:border-neutral-300 transition-colors flex flex-col items-start">
      <MemberAvatar name={displayName} avatarUrl={member.user.avatarUrl} />
      <p className="text-sm font-medium text-neutral-900 mt-3 line-clamp-1">
        {displayName}
      </p>
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">
        {ROLE_LABEL[member.role]}
      </p>
      {bookable && member.user.username && (
        <Link
          href={`/schedule/t/${teamSlug}/${member.user.username}`}
          className="text-xs text-neutral-700 mt-3 hover:text-neutral-900 transition-colors"
        >
          Book a call →
        </Link>
      )}
    </article>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function TeamPage({ params }: Props) {
  const { slug } = await params;

  let profile: PublicTeamProfile;
  try {
    profile = await getPublicTeam(slug);
  } catch {
    notFound();
  }

  // Fetch the scheduling subset in parallel — degrade to empty bookable set on
  // failure so the team profile still renders.
  let bookableUsernames = new Set<string>();
  try {
    const scheduling = await getPublicTeamScheduling(slug);
    bookableUsernames = new Set(
      scheduling.members
        .map((m) => m.user.username)
        .filter((u): u is string => Boolean(u))
    );
  } catch {
    // intentionally empty — bookable set stays empty
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crelyzor.app';
  const canonical = `${base}/t/${profile.team.slug}`;

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: profile.team.name,
    url: canonical,
    ...(profile.team.logoUrl ? { logo: profile.team.logoUrl } : {}),
    ...(profile.team.description
      ? { description: profile.team.description }
      : {}),
    member: profile.members.map((m) => ({
      '@type': 'Person',
      name: m.user.name ?? m.user.username ?? 'Member',
    })),
  };

  return (
    <main className="min-h-screen bg-neutral-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <TeamHero team={profile.team} memberCount={profile.stats.memberCount} />

        <section
          className="bg-white rounded-2xl mt-10 p-6"
          style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
        >
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-4">
            Members
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {profile.members.map((m) => (
              <MemberTile
                key={m.user.id}
                member={m}
                bookable={
                  m.user.username
                    ? bookableUsernames.has(m.user.username)
                    : false
                }
                teamSlug={profile.team.slug}
              />
            ))}
          </div>
        </section>

        <Link
          href="/"
          className="block mt-12 text-[11px] tracking-widest uppercase text-neutral-400 hover:text-neutral-600 transition-colors text-center"
        >
          Powered by Crelyzor
        </Link>
      </div>
    </main>
  );
}
