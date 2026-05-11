'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { BookingConfirmationData } from '@/types/scheduling';

// ── Time formatting ───────────────────────────────────────────────────────────

function formatTimezone(tz: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZoneName: 'short',
    timeZone: tz,
  }).formatToParts(new Date());
  return parts.find((p) => p.type === 'timeZoneName')?.value ?? tz;
}

function formatTime(isoUtc: string, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: tz,
  }).format(new Date(isoUtc));
}

function formatDateFull(isoUtc: string, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: tz,
  }).format(new Date(isoUtc));
}

// ── Calendar helpers ───────────────────────────────────────────────────────────

function makeGCalUrl(booking: BookingConfirmationData['booking']): string {
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const title = encodeURIComponent(booking.eventType.title);
  const details = encodeURIComponent(
    `Meeting with ${booking.host.name} via Crelyzor`
  );
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(start)}/${fmt(end)}&details=${details}`;
}

function downloadIcs(booking: BookingConfirmationData['booking']): void {
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const start = fmt(new Date(booking.startTime));
  const end = fmt(new Date(booking.endTime));

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Crelyzor//EN',
    'BEGIN:VEVENT',
    `UID:${booking.id}@crelyzor.com`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${booking.eventType.title}`,
    `DESCRIPTION:Meeting with ${booking.host.name}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'booking.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── ConfirmedClient ────────────────────────────────────────────────────────────

export function ConfirmedClient() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const isEmbed = searchParams.get('embed') === '1';

  const [guestTimezone] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [confirmation, setConfirmation] =
    useState<BookingConfirmationData | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('crelyzor_booking_confirmation');
      if (stored) {
        setConfirmation(JSON.parse(stored) as BookingConfirmationData);
        sessionStorage.removeItem('crelyzor_booking_confirmation');
      }
    } catch {
      // sessionStorage unavailable — use fallback UI
    }
  }, []);

  return (
    <div className={isEmbed ? 'bg-transparent' : 'min-h-screen bg-neutral-100'}>
      {/* Dark header */}
      <div className={`px-4 pb-8 ${isEmbed ? 'pt-6' : 'pt-12'}`} style={{ background: '#0a0a0a' }}>
        <div className="max-w-sm mx-auto">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'rgba(212,175,97,0.12)' }}
          >
            {confirmation?.booking.status === 'CONFIRMED' ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#d4af61"
                strokeWidth={2.5}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#d4af61"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            )}
          </div>
          <h1 className="text-xl font-semibold text-white">
            {confirmation?.booking.status === 'CONFIRMED'
              ? "You're confirmed!"
              : 'Request sent'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            {confirmation?.booking.status === 'CONFIRMED'
              ? 'A confirmation has been sent to your email.'
              : "We'll notify you once the host approves your request."}
          </p>
          <div
            className="mt-6 h-px w-16"
            style={{
              background:
                'linear-gradient(to right, #d4af61, rgba(212,175,97,0.2))',
            }}
          />
        </div>
      </div>

      <div className="max-w-sm mx-auto px-4 py-6 space-y-4">
        {confirmation ? (
          <>
            {/* Booking detail card */}
            <div
              className="bg-white rounded-2xl p-5 space-y-4"
              style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
            >
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                  Meeting
                </p>
                <p className="text-sm font-medium text-neutral-900">
                  {confirmation.booking.eventType.title}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                  With
                </p>
                <p className="text-sm text-neutral-900">
                  {confirmation.booking.host.name}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                  When
                </p>
                <p className="text-sm text-neutral-900">
                  {formatDateFull(
                    confirmation.booking.startTime,
                    guestTimezone
                  )}
                </p>
                <p className="text-sm text-neutral-600 mt-0.5">
                  {formatTime(confirmation.booking.startTime, guestTimezone)}
                  {' — '}
                  {formatTime(confirmation.booking.endTime, guestTimezone)}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {formatTimezone(guestTimezone)}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                  Format
                </p>
                <p className="text-sm text-neutral-900">
                  {confirmation.booking.eventType.locationType === 'ONLINE'
                    ? confirmation.booking.status === 'CONFIRMED'
                      ? 'Video call — link sent to your email'
                      : 'Video call — link will be shared after host approval'
                    : 'In person'}
                </p>
              </div>
            </div>

            {/* Add to calendar — only once confirmed */}
            {confirmation.booking.status === 'CONFIRMED' && (
              <div className="space-y-2">
                <a
                  href={makeGCalUrl(confirmation.booking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-neutral-200 text-sm text-neutral-700 bg-white hover:border-neutral-400 transition-colors"
                  style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Add to Google Calendar
                </a>

                <button
                  onClick={() => downloadIcs(confirmation.booking)}
                  className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-neutral-200 text-sm text-neutral-700 bg-white hover:border-neutral-400 transition-colors"
                  style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Add to Apple Calendar (.ics)
                </button>
              </div>
            )}
          </>
        ) : (
          /* Fallback — sessionStorage unavailable or refreshed */
          <div
            className="bg-white rounded-2xl p-8 text-center"
            style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
          >
            <p className="text-sm text-neutral-600">
              Your request has been sent.
            </p>
            {bookingId && (
              <p className="text-[11px] text-neutral-400 mt-2 font-mono">
                {bookingId}
              </p>
            )}
            <p className="text-xs text-neutral-400 mt-3">
              You&apos;ll receive an email once the host approves.
            </p>
          </div>
        )}

        <div className="pt-4 pb-8 text-center">
          <Link
            href="/"
            className="text-[11px] tracking-widest uppercase text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            Powered by Crelyzor
          </Link>
        </div>
      </div>
    </div>
  );
}
