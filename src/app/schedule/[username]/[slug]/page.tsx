import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSchedulingProfile } from '@/lib/api';
import { BookingFlow } from './BookingFlow';

interface Props {
  params: Promise<{ username: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, slug } = await params;
  try {
    const profile = await getSchedulingProfile(username);
    const et = profile.eventTypes.find((e) => e.slug === slug);
    if (!et) return { title: 'Not Found' };
    const title = `Book ${et.duration}-min ${et.title} · ${profile.user.name}`;
    return {
      title,
      description: `Schedule a ${et.duration}-minute ${et.title} with ${profile.user.name}.`,
      openGraph: { title, type: 'website' },
    };
  } catch {
    return { title: 'Booking Not Found' };
  }
}

export default async function BookingPage({ params }: Props) {
  const { username, slug } = await params;

  let profile;
  try {
    profile = await getSchedulingProfile(username);
  } catch {
    notFound();
  }

  const eventType = profile.eventTypes.find((et) => et.slug === slug);
  if (!eventType) notFound();

  return (
    <BookingFlow
      username={username}
      eventType={eventType}
      host={profile.user}
    />
  );
}
