import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSchedulingProfile } from '@/lib/api';
import { BookingFlow } from './BookingFlow';

export const revalidate = 60;

interface Props {
  params: Promise<{ username: string; slug: string }>;
  searchParams: Promise<{ reschedule?: string; embed?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, slug } = await params;
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crelyzor.app';
  try {
    const profile = await getSchedulingProfile(username);
    const et = profile.eventTypes.find((e) => e.slug === slug);
    if (!et) return { title: 'Not Found' };
    const title = `Book ${et.duration}-min ${et.title} · ${profile.user.name}`;
    return {
      title,
      description: `Schedule a ${et.duration}-minute ${et.title} with ${profile.user.name}.`,
      alternates: { canonical: `${base}/schedule/${username}/${slug}` },
      openGraph: { title, type: 'website' },
    };
  } catch {
    return { title: 'Booking Not Found' };
  }
}

export default async function BookingPage({ params, searchParams }: Props) {
  const { username, slug } = await params;
  const { reschedule: rescheduleId, embed } = await searchParams;
  const isEmbed = embed === '1';

  let profile;
  try {
    profile = await getSchedulingProfile(username);
  } catch {
    notFound();
  }

  const eventType = profile.eventTypes.find((et) => et.slug === slug);
  if (!eventType) notFound();

  // If rescheduling, fetch old booking details to prefill
  let oldBooking = null;
  if (rescheduleId) {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api/v1';
      const res = await fetch(
        `${apiUrl}/public/bookings/${rescheduleId}?username=${encodeURIComponent(username)}&slug=${encodeURIComponent(slug)}`,
        { cache: 'no-store' }
      );
      if (res.ok) {
        const json = await res.json();
        const bookingData = json.data?.booking;
        // Verify this booking belongs to the exact same host/eventType logic to prevent spoofing UI
        if (
          bookingData &&
          bookingData.status !== 'CANCELLED' &&
          bookingData.status !== 'RESCHEDULED'
        ) {
          oldBooking = {
            id: bookingData.id,
            guestName: bookingData.guestName,
            guestEmail: bookingData.guestEmail,
          };
        }
      }
    } catch (err) {
      // Best effort - ignore to allow normal booking fallback
    }
  }

  return (
    <BookingFlow
      username={username}
      eventType={eventType}
      host={profile.user}
      oldBooking={oldBooking}
      isEmbed={isEmbed}
    />
  );
}
