'use client';

import { useState, useEffect } from 'react';
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

function get12HourInfo(
  isoUtc: string,
  tz: string
): { hour12: number; minute: number; ampm: 'AM' | 'PM' } {
  const parts = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: tz,
  }).formatToParts(new Date(isoUtc));
  const h = Number(parts.find((p) => p.type === 'hour')?.value ?? '12');
  const m = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');
  const ap = (parts.find((p) => p.type === 'dayPeriod')?.value?.toUpperCase() ??
    'AM') as 'AM' | 'PM';
  return { hour12: h === 0 ? 12 : h, minute: m, ampm: ap };
}

// Returns CSS rotation degrees: 0° = 12 o'clock, 90° = 3 o'clock
function clockAngleDeg(hour12: number, minute: number): number {
  return ((hour12 % 12) / 12 + minute / 720) * 360;
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

// ── ClockSlotPicker ───────────────────────────────────────────────────────────

interface ClockSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  guestTimezone: string;
  onSelect: (slot: TimeSlot) => void;
}

function ClockSlotPicker({
  slots,
  selectedSlot,
  guestTimezone,
  onSelect,
}: ClockSlotPickerProps) {
  const hasAM = slots.some((s) => getAmPm(s.startTime, guestTimezone) === 'AM');
  const hasPM = slots.some((s) => getAmPm(s.startTime, guestTimezone) === 'PM');
  const showToggle = hasAM && hasPM;

  const [amPm, setAmPm] = useState<'AM' | 'PM'>(() => (hasAM ? 'AM' : 'PM'));

  const visibleSlots = showToggle
    ? slots.filter((s) => getAmPm(s.startTime, guestTimezone) === amPm)
    : slots;

  const selectedInfo = selectedSlot
    ? get12HourInfo(selectedSlot.startTime, guestTimezone)
    : null;

  const C = 140; // SVG center
  const SLOT_R = 82; // radius where slot dots live
  const HOUR_LEN = 52; // hour hand length
  const MIN_LEN = 76; // minute hand length
  const toRad = (d: number) => (d * Math.PI) / 180;

  return (
    <div className="space-y-3">
      {/* AM / PM toggle */}
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

      {/* Alarm clock face */}
      <div className="mx-auto" style={{ width: 280, height: 280 }}>
        <svg width={280} height={280} viewBox="0 0 280 280">
          {/* Face background */}
          <circle cx={C} cy={C} r={132} fill="#0f0f0f" />

          {/* Double border ring */}
          <circle
            cx={C}
            cy={C}
            r={132}
            fill="none"
            stroke="#d4af61"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          <circle
            cx={C}
            cy={C}
            r={127}
            fill="none"
            stroke="#d4af61"
            strokeWidth="0.5"
            strokeOpacity="0.2"
          />

          {/* Tick marks — 60 minute ticks, hour ticks longer */}
          {Array.from({ length: 60 }, (_, i) => {
            const isHour = i % 5 === 0;
            const a = toRad((i / 60) * 360 - 90);
            return (
              <line
                key={i}
                x1={C + Math.cos(a) * (isHour ? 113 : 119)}
                y1={C + Math.sin(a) * (isHour ? 113 : 119)}
                x2={C + Math.cos(a) * 124}
                y2={C + Math.sin(a) * 124}
                stroke={
                  isHour ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)'
                }
                strokeWidth={isHour ? 1.5 : 0.75}
              />
            );
          })}

          {/* Hour labels — 12, 3, 6, 9 only */}
          {[
            { n: '12', a: -90 },
            { n: '3', a: 0 },
            { n: '6', a: 90 },
            { n: '9', a: 180 },
          ].map(({ n, a }) => {
            const r = toRad(a);
            return (
              <text
                key={n}
                x={C + Math.cos(r) * 99}
                y={C + Math.sin(r) * 99}
                textAnchor="middle"
                dominantBaseline="central"
                fill="rgba(255,255,255,0.45)"
                fontSize="11"
                fontFamily="Inter, system-ui, sans-serif"
              >
                {n}
              </text>
            );
          })}

          {/* Available slot dots */}
          {visibleSlots.map((slot, i) => {
            const { hour12, minute } = get12HourInfo(
              slot.startTime,
              guestTimezone
            );
            const a = toRad(clockAngleDeg(hour12, minute) - 90);
            const x = C + Math.cos(a) * SLOT_R;
            const y = C + Math.sin(a) * SLOT_R;
            const isSel = selectedSlot?.startTime === slot.startTime;
            return (
              <g
                key={i}
                style={{ cursor: 'pointer' }}
                onClick={() => onSelect(slot)}
              >
                {isSel && (
                  <circle
                    cx={x}
                    cy={y}
                    r={15}
                    fill="#d4af61"
                    fillOpacity="0.15"
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={isSel ? 9 : 6.5}
                  fill={isSel ? '#d4af61' : 'rgba(255,255,255,0.18)'}
                  stroke={isSel ? '#d4af61' : 'rgba(255,255,255,0.32)'}
                  strokeWidth="1"
                />
                {isSel && <circle cx={x} cy={y} r={3} fill="#0f0f0f" />}
              </g>
            );
          })}

          {/* Minute hand — drawn pointing up, rotated via CSS */}
          {selectedInfo && (
            <line
              x1={C}
              y1={C}
              x2={C}
              y2={C - MIN_LEN}
              stroke="#d4af61"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeOpacity="0.85"
              style={{
                transformOrigin: `${C}px ${C}px`,
                transform: `rotate(${selectedInfo.minute * 6}deg)`,
                transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          )}

          {/* Hour hand */}
          {selectedInfo && (
            <line
              x1={C}
              y1={C}
              x2={C}
              y2={C - HOUR_LEN}
              stroke="#d4af61"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{
                transformOrigin: `${C}px ${C}px`,
                transform: `rotate(${clockAngleDeg(selectedInfo.hour12, selectedInfo.minute)}deg)`,
                transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          )}

          {/* Center pivot */}
          <circle cx={C} cy={C} r={5} fill="#d4af61" />
          <circle cx={C} cy={C} r={2.5} fill="#0f0f0f" />
        </svg>
      </div>

      {/* Selected time label */}
      <p className="text-center text-sm font-medium text-neutral-900 min-h-[1.25rem]">
        {selectedSlot ? (
          formatTime(selectedSlot.startTime, guestTimezone)
        ) : (
          <span className="text-[11px] font-normal text-neutral-400">
            Tap a dot to pick a time
          </span>
        )}
      </p>
    </div>
  );
}

// ── BookingFlow ────────────────────────────────────────────────────────────────

export function BookingFlow({ username, eventType, host, oldBooking, isEmbed = false }: Props) {
  const router = useRouter();

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
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Form state
  const [guestName, setGuestName] = useState(oldBooking?.guestName ?? '');
  const [guestEmail, setGuestEmail] = useState(oldBooking?.guestEmail ?? '');
  const [guestNote, setGuestNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Notify parent iframe of height changes when in embed mode
  useEffect(() => {
    if (!isEmbed) return;
    const sendHeight = () =>
      window.parent.postMessage(
        { type: 'CRELYZOR:resize', height: document.documentElement.scrollHeight },
        '*'
      );
    sendHeight();
    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, [isEmbed]);

  // Fetch slots on date change — also clears slot/form state
  useEffect(() => {
    if (!selectedDate) return;
    const controller = new AbortController();

    setSlotsLoading(true);
    setSlotsError(null);
    setSlots([]);
    setSelectedSlot(null);
    setSubmitError(null);

    getSlots(username, eventType.slug, selectedDate, controller.signal)
      .then((data) => setSlots(filterFutureSlots(data.slots)))
      .catch((err) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        setSlotsError('Could not load available times. Please try again.');
      })
      .finally(() => setSlotsLoading(false));

    return () => controller.abort();
  }, [selectedDate, username, eventType.slug]);

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
        window.parent.postMessage(
          { type: 'CRELYZOR:booking-confirmed', data: result },
          '*'
        );
      }

      router.push(
        `/schedule/${username}/${eventType.slug}/confirmed?bookingId=${result.booking.id}${isEmbed ? '&embed=1' : ''}`
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
          getSlots(username, eventType.slug, selectedDate)
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
          getSlots(username, eventType.slug, selectedDate)
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
      <div className={`px-4 pb-8 ${isEmbed ? 'pt-6' : 'pt-12'}`} style={{ background: '#0a0a0a' }}>
        <div className="max-w-sm mx-auto">
          {!isEmbed && (
            <Link
              href={`/schedule/${username}`}
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

          {/* Timezone */}
          <p className="text-[10px] text-neutral-400 mt-4 text-center">
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
              <div className="flex justify-center py-2">
                <div className="w-[280px] h-[280px] rounded-full bg-neutral-100 animate-pulse" />
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
                <p className="text-xs text-neutral-500">{slotsError}</p>
              </div>
            )}

            {!slotsLoading && !slotsError && slots.length === 0 && (
              <p className="text-xs text-neutral-400 text-center py-4">
                No available times on this day.
              </p>
            )}

            {!slotsLoading && slots.length > 0 && (
              <ClockSlotPicker
                slots={slots}
                selectedSlot={selectedSlot}
                guestTimezone={guestTimezone}
                onSelect={(slot) => {
                  setSelectedSlot(slot);
                  setSubmitError(null);
                }}
              />
            )}
          </div>
        )}

        {/* ── Booking form ── */}
        {selectedSlot && (
          <div
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
                <span className="text-[11px] text-neutral-500">
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
