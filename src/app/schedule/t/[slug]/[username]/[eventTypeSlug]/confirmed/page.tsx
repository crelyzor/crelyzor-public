import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronRight } from 'lucide-react';
import { ConfirmedClient } from '@/app/schedule/[username]/[slug]/confirmed/ConfirmedClient';
import { getPublicTeamMemberScheduling } from '@/lib/api';
import type { PublicTeamMemberSchedulingProfile } from '@/types/team';

export const metadata: Metadata = {
  title: 'Booking Confirmed · Crelyzor',
  description: 'Your meeting is confirmed.',
};

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

async function TeamChrome({
  slug,
  username,
}: {
  slug: string;
  username: string;
}) {
  let profile: PublicTeamMemberSchedulingProfile | null = null;
  try {
    profile = await getPublicTeamMemberScheduling(slug, username);
  } catch {
    return null;
  }

  const memberName = displayNameFor(profile.user);

  return (
    <div className="max-w-sm mx-auto px-4 pt-8 pb-2">
      <div className="flex items-center gap-3 text-xs text-neutral-500">
        {profile.team.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.team.logoUrl}
            alt={profile.team.name}
            referrerPolicy="no-referrer"
            className="w-6 h-6 rounded-md object-cover shrink-0"
          />
        ) : (
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
            style={{ background: 'rgba(212,175,97,0.1)' }}
          >
            <span
              className="text-[9px] font-semibold"
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
          href={`/schedule/t/${slug}/${username}`}
          className="hover:text-neutral-900 hover:underline"
        >
          {memberName}
        </Link>
      </div>
    </div>
  );
}

export default async function TeamConfirmedPage({ params }: Props) {
  const { slug, username } = await params;

  return (
    <div>
      <TeamChrome slug={slug} username={username} />
      <Suspense>
        <ConfirmedClient />
      </Suspense>
    </div>
  );
}
