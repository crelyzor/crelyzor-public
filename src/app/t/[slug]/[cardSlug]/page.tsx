import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getTeamCard, type PublicTeamCardMember } from '@/lib/api';
import { TeamCardFlip } from '@/components/TeamCardFlip';
import { safeJsonLd } from '@/lib/jsonLd';

interface Props {
  params: Promise<{ slug: string; cardSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, cardSlug } = await params;
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crelyzor.app';
  try {
    const { card, team } = await getTeamCard(slug, cardSlug);
    const title = `${card.displayName}${card.title ? ` — ${card.title}` : ''} · ${team.name}`;
    const description = card.bio ?? `${card.displayName} — ${team.name} on Crelyzor.`;
    const canonical = `${base}/t/${slug}/${cardSlug}`;
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        type: 'website',
        url: canonical,
        images: card.avatarUrl ? [{ url: card.avatarUrl }] : [],
      },
      twitter: { card: 'summary', title, description },
    };
  } catch {
    return { title: 'Card not found · Crelyzor', robots: { index: false, follow: false } };
  }
}

const GOLD = '#d4af61';

function initialsFor(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function MemberRow({
  member,
  teamSlug,
}: {
  member: PublicTeamCardMember;
  teamSlug: string;
}) {
  const displayName = member.name ?? member.username ?? 'Team member';
  const hasCard = member.username && member.cardSlug;
  const href = hasCard
    ? `/t/${teamSlug}/${member.username}/${member.cardSlug}`
    : undefined;

  const content = (
    <div className="flex items-center gap-3 px-4 py-3.5 group">
      {member.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={member.avatarUrl}
          alt={displayName}
          referrerPolicy="no-referrer"
          className="w-9 h-9 rounded-full object-cover shrink-0"
        />
      ) : (
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[11px] font-semibold"
          style={{ background: 'rgba(212,175,97,0.10)', color: GOLD }}
        >
          {initialsFor(displayName)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-neutral-200 leading-tight truncate">
          {displayName}
        </p>
        {member.designation && (
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest leading-tight mt-0.5 truncate">
            {member.designation}
          </p>
        )}
      </div>
      {hasCard && (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className="w-3.5 h-3.5 shrink-0 text-neutral-700 group-hover:text-neutral-400 transition-colors"
        >
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );

  if (!href) return <div>{content}</div>;
  return (
    <Link href={href} className="block hover:bg-white/5 transition-colors">
      {content}
    </Link>
  );
}

export default async function TeamCardPage({ params }: Props) {
  const { slug, cardSlug } = await params;

  let data;
  try {
    data = await getTeamCard(slug, cardSlug);
  } catch {
    notFound();
  }

  const { card, team, members = [] } = data;
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crelyzor.app';
  const canonical = `${base}/t/${slug}/${cardSlug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: card.displayName,
    url: canonical,
    ...(card.avatarUrl ? { logo: card.avatarUrl } : {}),
    ...(card.bio ? { description: card.bio } : {}),
  };

  return (
    <main className="min-h-screen bg-neutral-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      <div className="max-w-md mx-auto px-5 py-10">
        {/* Team breadcrumb */}
        <Link
          href={`/t/${team.slug}`}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-500 hover:text-neutral-700 transition-colors mb-6"
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
            <path
              d="M10 12L6 8l4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {team.name}
        </Link>

        {/* Card */}
        {card.htmlContent ? (
          <TeamCardFlip
            htmlContent={card.htmlContent}
            htmlBackContent={card.htmlBackContent ?? ''}
          />
        ) : (
          <div
            className="w-full rounded-2xl flex items-center justify-center"
            style={{
              aspectRatio: '1.586 / 1',
              background: '#0a0a0a',
              border: '1px solid rgba(212,175,97,0.2)',
            }}
          >
            <p className="text-[11px] text-neutral-600">{card.displayName}</p>
          </div>
        )}

        {/* Card identity */}
        <div
          className="mt-4 mb-8 px-5 py-4 rounded-2xl"
          style={{ background: '#ffffff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
        >
          <h1 className="text-base font-semibold text-neutral-900 leading-tight">
            {card.displayName}
          </h1>
          {card.title && (
            <p className="text-xs text-neutral-500 mt-0.5">{card.title}</p>
          )}
          {card.bio && (
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">{card.bio}</p>
          )}
        </div>

        {/* Member list */}
        {members.length > 0 && (
          <section
            className="rounded-2xl overflow-hidden"
            style={{
              background: '#111111',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <p className="px-4 pt-4 pb-2 text-[10px] uppercase tracking-widest font-medium text-neutral-500">
              Team members
            </p>
            <div className="divide-y divide-white/5">
              {members.map((m) => (
                <MemberRow
                  key={m.username ?? m.name ?? 'member'}
                  member={m}
                  teamSlug={team.slug}
                />
              ))}
            </div>
          </section>
        )}

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
