import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCard } from '@/lib/api';
import { CardView } from '@/components/CardView';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  try {
    const data = await getCard(username);
    const { card, user } = data;
    const title = `${card.displayName}${card.title ? ` — ${card.title}` : ''}`;
    const description =
      card.bio ?? `Connect with ${card.displayName} on Crelyzor.`;
    const ogImage = `/api/og/${user.username}`;

    return {
      title,
      description,
      manifest: `/api/manifest/${username}`,
      openGraph: {
        title,
        description,
        images: [{ url: ogImage, width: 1200, height: 630 }],
        type: 'profile',
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
  let data;
  try {
    data = await getCard(username);
  } catch {
    notFound();
  }

  return <CardView data={data} username={username} />;
}
