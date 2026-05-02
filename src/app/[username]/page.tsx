import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCard } from '@/lib/api';
import { CardView } from '@/components/CardView';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  if (username.includes('.')) return { title: 'Not Found' };
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crelyzor.app';
  try {
    const data = await getCard(username);
    const { card, user } = data;
    const title = `${card.displayName}${card.title ? ` — ${card.title}` : ''}`;
    const description =
      card.bio ?? `Connect with ${card.displayName} on Crelyzor.`;
    const ogImage = `/api/og/${user.username}`;
    const canonical = `${base}/${username}`;

    // Parse firstName/lastName from displayName
    const nameParts = card.displayName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

    return {
      title,
      description,
      alternates: { canonical },
      manifest: `/api/manifest/${username}`,
      openGraph: {
        title,
        description,
        images: [{ url: ogImage, width: 1200, height: 630 }],
        type: 'profile',
        firstName,
        lastName,
        username,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return { title: 'Card Not Found', manifest: `/api/manifest/${username}` };
  }
}

export default async function UserCardPage({ params }: Props) {
  const { username } = await params;
  // Block file-like requests (favicon.ico, robots.txt, etc.) from hitting the API
  if (username.includes('.')) notFound();
  let data;
  try {
    data = await getCard(username);
  } catch {
    notFound();
  }

  const { card } = data;
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crelyzor.app';
  const canonical = `${base}/${username}`;
  const ogImage = `/api/og/${data.user.username}`;

  // Collect social profile URLs from links
  const socialTypes = new Set([
    'twitter', 'linkedin', 'github', 'instagram', 'facebook',
    'youtube', 'tiktok', 'pinterest', 'snapchat', 'reddit',
  ]);
  const sameAs = card.links
    .filter((l) => socialTypes.has(l.type.toLowerCase()) && l.url)
    .map((l) => l.url);

  const personJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: card.displayName,
    url: canonical,
    image: card.avatarUrl || `${base}${ogImage}`,
    sameAs,
  };
  if (card.title) personJsonLd.jobTitle = card.title;
  if (card.bio) personJsonLd.description = card.bio;
  if (card.contactFields.email) personJsonLd.email = card.contactFields.email;
  if (card.contactFields.phone) personJsonLd.telephone = card.contactFields.phone;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <CardView data={data} username={username} />
    </>
  );
}
