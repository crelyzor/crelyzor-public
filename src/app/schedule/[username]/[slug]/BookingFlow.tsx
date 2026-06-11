'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSlots, createBooking, ApiError } from '@/lib/api';
import type {
  SchedulingEventType,
  TimeSlot,
  BookingConfirmationData,
} from '@/types/scheduling';

interface Props {
  username: string;
  eventType: SchedulingEventType;
  host: {
    username: string;
    name: string;
    avatarUrl: string | null;
    timezone: string | null;
  };
  oldBooking?: {
    id: string;
    guestName: string;
    guestEmail: string;
  } | null;
  isEmbed?: boolean;
  teamSlug?: string;
  /** Base path for the post-confirm redirect. Defaults to `/schedule/${username}`. */
  redirectBase?: string;
  /** Href for the back-link in the header. Defaults to `/schedule/${username}`. */
  backHref?: string;
}

// ── Time formatting helpers ────────────────────────────────────────────────────

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

function formatDateFull(dateStr: string, tz: string): string {
  // dateStr is YYYY-MM-DD; use noon UTC to avoid timezone off-by-one
  const [y, m, d] = dateStr.split('-').map(Number);
  const noonUTC = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: tz,
  }).format(noonUTC);
}

function getAmPm(isoUtc: string, tz: string): 'AM' | 'PM' {
  const parts = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    hour12: true,
    timeZone: tz,
  }).formatToParts(new Date(isoUtc));
  const dp =
    parts.find((p) => p.type === 'dayPeriod')?.value?.toUpperCase() ?? 'AM';
  return dp as 'AM' | 'PM';
}

function toDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function filterFutureSlots(slots: TimeSlot[]): TimeSlot[] {
  const now = Date.now();
  return slots.filter((slot) => new Date(slot.startTime).getTime() > now);
}

// ── Icon components ─────────────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-neutral-400 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// ── Constants ─────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MAX_WINDOW_DAYS = 60;

// ── SlotPicker ────────────────────────────────────────────────────────────────

interface SlotPickerProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  guestTimezone: string;
  onSelect: (slot: TimeSlot) => void;
}

function SlotPicker({
  slots,
  selectedSlot,
  guestTimezone,
  onSelect,
}: SlotPickerProps) {
  const hasAM = slots.some((s) => getAmPm(s.startTime, guestTimezone) === 'AM');
  const hasPM = slots.some((s) => getAmPm(s.startTime, guestTimezone) === 'PM');
  const showToggle = hasAM && hasPM;

  const [amPm, setAmPm] = useState<'AM' | 'PM'>(() => (hasAM ? 'AM' : 'PM'));

  const visibleSlots = showToggle
    ? slots.filter((s) => getAmPm(s.startTime, guestTimezone) === amPm)
    : slots;

  return (
    <div className="space-y-3">
      {showToggle && (
        <div className="flex gap-0.5 p-0.5 rounded-lg bg-neutral-100 w-fit mx-auto">
          {(['AM', 'PM'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setAmPm(period)}
              className={[
                'px-5 py-1 rounded-md text-xs font-medium transition-all',
                amPm === period
                  ? 'text-[#0a0a0a]'
                  : 'text-neutral-500 hover:text-neutral-700',
              ].join(' ')}
              style={amPm === period ? { background: '#d4af61' } : undefined}
            >
              {period}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-1.5 max-h-72 overflow-y-auto">
        {visibleSlots.map((slot) => {
          const isSel = selectedSlot?.startTime === slot.startTime;
          return (
            <button
              key={slot.startTime}
              onClick={() => onSelect(slot)}
              className={[
                'w-full h-11 rounded-xl text-sm font-medium transition-all border',
                isSel
                  ? 'text-[#0a0a0a] border-transparent'
                  : 'text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50',
              ].join(' ')}
              style={isSel ? { background: '#d4af61' } : undefined}
            >
              {formatTime(slot.startTime, guestTimezone)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── BookingFlow ────────────────────────────────────────────────────────────────

export function BookingFlow({
  username,
  eventType,
  host,
  oldBooking,
  isEmbed = false,
  teamSlug,
  redirectBase,
  backHref,
}: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  const [guestTimezone] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Calendar state
  const today = new Date();
  const todayStr = toDateStr(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Slots state
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [slotsRetryKey, setSlotsRetryKey] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Form state
  const [guestName, setGuestName] = useState(oldBooking?.guestName ?? '');
  const [guestEmail, setGuestEmail] = useState(oldBooking?.guestEmail ?? '');
  const [guestNote, setGuestNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Notify parent iframe of height changes when in embed mode.
  // Derive parent origin from document.referrer to avoid posting to '*'.
  const parentOrigin =
    isEmbed && typeof document !== 'undefined' && document.referrer
      ? new URL(document.referrer).origin
      : '*';

  useEffect(() => {
    if (!isEmbed) return;
    const sendHeight = () =>
      window.parent.postMessage(
        {
          type: 'CRELYZOR:resize',
          height: document.documentElement.scrollHeight,
        },
        parentOrigin
      );
    sendHeight();
    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, [isEmbed, parentOrigin]);

  // Fetch slots on date change — also clears slot/form state
  useEffect(() => {
    if (!selectedDate) return;
    const controller = new AbortController();

    setSlotsLoading(true);
    setSlotsError(null);
    setSlots([]);
    setSelectedSlot(null);
    setSubmitError(null);

    getSlots(
      username,
      eventType.slug,
      selectedDate,
      controller.signal,
      teamSlug
    )
      .then((data) => setSlots(filterFutureSlots(data.slots)))
      .catch((err) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        setSlotsError('Could not load available times. Please try again.');
      })
      .finally(() => setSlotsLoading(false));

    return () => controller.abort();
  }, [selectedDate, username, eventType.slug, slotsRetryKey, teamSlug]);

  // ── Calendar helpers ──────────────────────────────────────────────────────────

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const maxDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + MAX_WINDOW_DAYS
  );
  const maxDateStr = toDateStr(
    maxDate.getFullYear(),
    maxDate.getMonth(),
    maxDate.getDate()
  );

  const isPrevMonthDisabled =
    viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // ── Form submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !guestName.trim() || !guestEmail.trim()) return;

    // Guard against stale slot selection when the user keeps the page open.
    if (new Date(selectedSlot.startTime) <= new Date()) {
      setSubmitError(
        'This time has already passed. Please choose a later slot.'
      );
      setSelectedSlot(null);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const result: BookingConfirmationData = await createBooking({
        username,
        eventTypeSlug: eventType.slug,
        startTime: selectedSlot.startTime,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim().toLowerCase(),
        guestNote: guestNote.trim() || undefined,
        guestTimezone,
        rescheduleBookingId: oldBooking ? oldBooking.id : undefined,
      });

      // Store for confirmed page (sessionStorage — safe for single-tab flow)
      try {
        sessionStorage.setItem(
          'crelyzor_booking_confirmation',
          JSON.stringify(result)
        );
      } catch {
        // Ignore if sessionStorage is unavailable
      }

      if (isEmbed) {
        // Send minimal payload — never expose PII (guestName/guestEmail) to the parent origin
        window.parent.postMessage(
          {
            type: 'CRELYZOR:booking-confirmed',
            data: {
              bookingId: result.booking.id,
              status: result.booking.status,
            },
          },
          parentOrigin
        );
      }

      const base = redirectBase ?? `/schedule/${username}`;
      router.push(
        `${base}/${eventType.slug}/confirmed?bookingId=${result.booking.id}${isEmbed ? '&embed=1' : ''}`
      );
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setSubmitError(
          'This time slot was just taken. Please choose another time.'
        );
        setSelectedSlot(null);
        // Re-fetch slots for the same date
        if (selectedDate) {
          setSlotsLoading(true);
          getSlots(username, eventType.slug, selectedDate, undefined, teamSlug)
            .then((data) => setSlots(filterFutureSlots(data.slots)))
            .catch(() => {})
            .finally(() => setSlotsLoading(false));
        }
      } else if (err instanceof ApiError && err.status === 400) {
        setSubmitError(
          'This time is no longer valid. Please choose another slot.'
        );
        setSelectedSlot(null);

        if (selectedDate) {
          setSlotsLoading(true);
          getSlots(username, eventType.slug, selectedDate, undefined, teamSlug)
            .then((data) => setSlots(filterFutureSlots(data.slots)))
            .catch(() => {})
            .finally(() => setSlotsLoading(false));
        }
      } else if (err instanceof ApiError) {
        setSubmitError(
          err.message || 'Something went wrong. Please try again.'
        );
      } else {
        setSubmitError('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className={isEmbed ? 'bg-transparent' : 'min-h-screen bg-neutral-100'}>
      {/* Dark header */}
      <div
        className={`px-4 pb-8 ${isEmbed ? 'pt-6' : 'pt-12'}`}
        style={{ background: '#0a0a0a' }}
      >
        <div className="max-w-sm mx-auto">
          {!isEmbed && (
            <Link
              href={backHref ?? `/schedule/${username}`}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-500 hover:text-neutral-400 transition-colors mb-4"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              {host.name}
            </Link>
          )}
          <h1 className="text-xl font-semibold text-white">
            {eventType.title}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] text-neutral-400">
              {eventType.duration} min
            </span>
            <span className="text-neutral-700">·</span>
            <span className="text-[11px] text-neutral-400">
              {eventType.locationType === 'ONLINE' ? 'Video call' : 'In person'}
            </span>
          </div>
          {oldBooking && (
            <div className="mt-4 px-3 py-2 bg-neutral-800 rounded-lg border border-neutral-700">
              <p className="text-xs text-neutral-300">
                You are rescheduling an existing booking for{' '}
                <span className="font-medium text-white">
                  {oldBooking.guestEmail}
                </span>
                .
              </p>
            </div>
          )}
          <div
            className="mt-5 h-px w-16"
            style={{
              background:
                'linear-gradient(to right, #d4af61, rgba(212,175,97,0.2))',
            }}
          />
        </div>
      </div>

      <div className="max-w-sm mx-auto px-4 py-6 space-y-4">
        {/* ── Calendar ── */}
        <div
          className="bg-white rounded-2xl p-5"
          style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
        >
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={prevMonth}
              disabled={isPrevMonthDisabled}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft />
            </button>
            <span className="text-sm font-medium text-neutral-900">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_LABELS.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] text-neutral-400 uppercase tracking-wider py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {/* Leading empty cells */}
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = toDateStr(viewYear, viewMonth, day);
              const isPast = dateStr < todayStr;
              const isBeyond = dateStr > maxDateStr;
              const isDisabled = isPast || isBeyond;
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === todayStr;

              return (
                <button
                  key={day}
                  onClick={() => {
                    if (!isDisabled) setSelectedDate(dateStr);
                  }}
                  disabled={isDisabled}
                  className={[
                    'aspect-square flex items-center justify-center text-xs rounded-lg transition-colors',
                    isDisabled
                      ? 'text-neutral-300 cursor-not-allowed'
                      : 'cursor-pointer',
                    !isDisabled && !isSelected
                      ? 'hover:bg-neutral-50 text-neutral-700'
                      : '',
                    isToday && !isSelected
                      ? 'font-semibold text-neutral-900'
                      : '',
                    isSelected ? 'text-white font-medium' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={isSelected ? { background: '#d4af61' } : undefined}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Timezone — intentionally locale-dependent; server renders UTC */}
          <p
            className="text-[10px] text-neutral-400 mt-4 text-center"
            suppressHydrationWarning
          >
            {formatTimezone(guestTimezone)}
          </p>
        </div>

        {/* ── Slot grid ── */}
        {selectedDate && (
          <div
            className="bg-white rounded-2xl p-5"
            style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
          >
            <p className="text-xs font-medium text-neutral-500 mb-3">
              {formatDateFull(selectedDate, guestTimezone)}
            </p>

            {slotsLoading && (
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    className="h-10 rounded-xl bg-neutral-100 animate-pulse"
                  />
                ))}
              </div>
            )}

            {slotsError && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                <svg
                  className="w-3.5 h-3.5 text-neutral-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-xs text-neutral-500 flex-1">{slotsError}</p>
                <button
                  onClick={() => setSlotsRetryKey((k) => k + 1)}
                  className="text-xs text-neutral-600 underline underline-offset-2 shrink-0"
                >
                  Retry
                </button>
              </div>
            )}

            {!slotsLoading && !slotsError && slots.length === 0 && (
              <p className="text-xs text-neutral-400 text-center py-4">
                No available times on this day.
              </p>
            )}

            {!slotsLoading && slots.length > 0 && (
              <SlotPicker
                slots={slots}
                selectedSlot={selectedSlot}
                guestTimezone={guestTimezone}
                onSelect={(slot) => {
                  setSelectedSlot(slot);
                  setSubmitError(null);
                  setTimeout(
                    () =>
                      formRef.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      }),
                    50
                  );
                }}
              />
            )}
          </div>
        )}

        {/* ── Booking form ── */}
        {selectedSlot && (
          <div
            ref={formRef}
            className="bg-white rounded-2xl p-5"
            style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
          >
            {/* Selected time summary */}
            <div className="mb-5 pb-4 border-b border-neutral-100">
              <p className="text-sm font-medium text-neutral-900">
                {formatTime(selectedSlot.startTime, guestTimezone)}
                {' — '}
                {formatTime(selectedSlot.endTime, guestTimezone)}
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {formatDateFull(selectedDate!, guestTimezone)}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Name */}
              <div>
                <label className="block text-[11px] text-neutral-500 mb-1.5">
                  Your name
                </label>
                <input
                  required
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  disabled={!!oldBooking}
                  placeholder="Jane Doe"
                  className="w-full h-10 px-3 text-sm rounded-lg border border-neutral-200 outline-none focus:border-neutral-400 disabled:bg-neutral-100 disabled:text-neutral-500 transition-colors placeholder:text-neutral-300 text-neutral-900"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] text-neutral-500 mb-1.5">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  disabled={!!oldBooking}
                  placeholder="jane@example.com"
                  className="w-full h-10 px-3 text-sm rounded-lg border border-neutral-200 outline-none focus:border-neutral-400 disabled:bg-neutral-100 disabled:text-neutral-500 transition-colors placeholder:text-neutral-300 text-neutral-900"
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-[11px] text-neutral-500 mb-1.5">
                  Note <span className="text-neutral-300">(optional)</span>
                </label>
                <textarea
                  value={guestNote}
                  onChange={(e) => setGuestNote(e.target.value)}
                  placeholder="Anything you'd like to share before the meeting…"
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-neutral-200 outline-none focus:border-neutral-400 transition-colors resize-none placeholder:text-neutral-300 text-neutral-900"
                />
              </div>

              {/* Timezone read-only */}
              <div className="flex items-center gap-2 py-2 px-3 bg-neutral-50 rounded-lg">
                <GlobeIcon />
                <span
                  className="text-[11px] text-neutral-500"
                  suppressHydrationWarning
                >
                  {formatTimezone(guestTimezone)}
                </span>
              </div>

              {submitError && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                  <svg
                    className="w-3.5 h-3.5 text-neutral-400 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-xs text-neutral-500">{submitError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !guestName.trim() || !guestEmail.trim()}
                className="w-full h-11 rounded-xl text-sm font-medium text-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
                style={{ background: '#d4af61' }}
              >
                {submitting && (
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth={3}
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                )}
                {submitting
                  ? 'Confirming…'
                  : oldBooking
                    ? 'Confirm reschedule'
                    : 'Confirm booking'}
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
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
