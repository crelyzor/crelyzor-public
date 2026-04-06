import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CancelForm } from './cancel-form';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Cancel Booking | Crelyzor',
  robots: {
    index: false,
    follow: false,
  },
};

// Next.js config - public endpoints revalidate whenever requested
export const revalidate = 0;

async function getBookingDetails(id: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api/v1';
    const res = await fetch(`${apiUrl}/public/bookings/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch booking');
    }

    const json = await res.json();
    return json.data.booking;
  } catch (error) {
    console.error('Error fetching booking details:', error);
    return null;
  }
}

function formatBookingTime(startTime: string, endTime: string, timezone: string) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return `${dateFormatter.format(start)} at ${timeFormatter.format(start)} - ${timeFormatter.format(end)}`;
}

export default async function CancelBookingPage({ params }: PageProps) {
  const resolvedParams = await params;
  const booking = await getBookingDetails(resolvedParams.id);

  if (!booking) {
    notFound();
  }

  const isCancelled = booking.status === 'CANCELLED';

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
              {isCancelled ? 'Booking Cancelled' : 'Cancel Booking'}
            </h1>
            <p className="text-neutral-500 mt-2 text-sm leading-relaxed">
              {isCancelled 
                ? 'This booking has already been cancelled. No further action is required.'
                : 'Are you sure you want to cancel this booking? This action cannot be undone.'}
            </p>
          </div>

          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 mb-8 space-y-3">
            <div>
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Event</p>
              <p className="text-sm font-medium text-neutral-900">{booking.eventType.title}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">With</p>
              <p className="text-sm font-medium text-neutral-900">{booking.host.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">When</p>
              <p className="text-sm font-medium text-neutral-900">
                {formatBookingTime(booking.startTime, booking.endTime, booking.timezone)}
              </p>
            </div>
          </div>

          {!isCancelled && (
            <CancelForm bookingId={booking.id} />
          )}

          {isCancelled && (
            <button
              disabled
              className="w-full py-2.5 px-4 text-sm font-medium rounded-lg text-neutral-400 bg-neutral-100 cursor-not-allowed border border-neutral-200"
            >
              Cancelled
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
