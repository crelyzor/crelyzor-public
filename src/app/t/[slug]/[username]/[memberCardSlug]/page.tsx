import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getTeamMemberCard } from '@/lib/api';
import { TeamCardFlip } from '@/components/TeamCardFlip';
import { safeJsonLd } from '@/lib/jsonLd';

interface Props {
  params: Promise<{ slug: string; username: string; memberCardSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, username, memberCardSlug } = await params;
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crelyzor.app';
  try {
    const { card, team, member } = await getTeamMemberCard(slug, username, memberCardSlug);
    const name = member?.name ?? username;
    const title = `${card.displayName}${card.title ? ` — ${card.title}` : ''} · ${team.name}`;
    const description =
      card.bio ?? `Connect with ${name} from ${team.name} on Crelyzor.`;
    const canonical = `${base}/t/${slug}/${username}/${memberCardSlug}`;
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        type: 'profile',
        url: canonical,
        images: card.avatarUrl ? [{ url: card.avatarUrl }] : [],
      },
      twitter: { card: 'summary', title, description },
    };
  } catch {
    return { title: 'Card not found · Crelyzor', robots: { index: false, follow: false } };
  }
}

export default async function TeamMemberCardPage({ params }: Props) {
  const { slug, username, memberCardSlug } = await params;

  let data;
  try {
    data = await getTeamMemberCard(slug, username, memberCardSlug);
  } catch {
    notFound();
  }

  const { card, team, member } = data;
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crelyzor.app';
  const canonical = `${base}/t/${slug}/${username}/${memberCardSlug}`;

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: card.displayName,
    url: canonical,
    ...(card.title ? { jobTitle: card.title } : {}),
    ...(card.bio ? { description: card.bio } : {}),
    ...(card.avatarUrl ? { image: card.avatarUrl } : {}),
    ...(card.contactFields?.email ? { email: card.contactFields.email } : {}),
    ...(card.contactFields?.phone ? { telephone: card.contactFields.phone } : {}),
    memberOf: {
      '@type': 'Organization',
      name: team.name,
      url: `${base}/t/${team.slug}`,
    },
  };

  return (
    <main className="min-h-screen bg-neutral-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(personJsonLd) }}
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

        {/* Card detail */}
        <div
          className="mt-4 rounded-2xl"
          style={{ background: '#ffffff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
        >
          <div className="px-5 pt-5 pb-4">
            <h1 className="text-base font-semibold text-neutral-900 leading-tight">
              {card.displayName}
            </h1>
            {card.title && (
              <p className="text-xs text-neutral-500 mt-0.5">{card.title}</p>
            )}
            {member?.designation && (
              <p
                className="text-[10px] uppercase tracking-widest mt-1"
                style={{ color: '#d4af61' }}
              >
                {member.designation}
              </p>
            )}
            {card.bio && (
              <p className="text-xs text-neutral-600 mt-3 leading-relaxed">{card.bio}</p>
            )}
          </div>

          {/* Contact fields */}
          {(card.contactFields?.email ||
            card.contactFields?.phone ||
            card.contactFields?.location ||
            card.contactFields?.website) && (
            <div className="border-t border-neutral-100 px-5 py-4 space-y-2.5">
              {card.contactFields.email && (
                <a
                  href={`mailto:${card.contactFields.email}`}
                  className="flex items-center gap-2.5 text-xs text-neutral-700 hover:text-neutral-900 transition-colors"
                >
                  <span className="text-neutral-400">✉</span>
                  {card.contactFields.email}
                </a>
              )}
              {card.contactFields.phone && (
                <a
                  href={`tel:${card.contactFields.phone}`}
                  className="flex items-center gap-2.5 text-xs text-neutral-700 hover:text-neutral-900 transition-colors"
                >
                  <span className="text-neutral-400">✆</span>
                  {card.contactFields.phone}
                </a>
              )}
              {card.contactFields.location && (
                <p className="flex items-center gap-2.5 text-xs text-neutral-600">
                  <span className="text-neutral-400">⌖</span>
                  {card.contactFields.location}
                </p>
              )}
              {card.contactFields.website && (
                <a
                  href={card.contactFields.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-xs text-neutral-700 hover:text-neutral-900 transition-colors truncate"
                >
                  <span className="text-neutral-400">⌘</span>
                  {card.contactFields.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          )}
        </div>

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
