import type { PublicCardResponse } from '@/types/card';
import type { PublicMeetingResponse } from '@/types/meeting';
import type {
  SchedulingProfile,
  SlotsResponse,
  BookingCreateInput,
  BookingConfirmationData,
} from '@/types/scheduling';

type ApiEnvelope<T> = {
  status?: string;
  statusCode?: number;
  message?: string;
  data?: T;
};

type ApiErrorBody = {
  status?: string;
  statusCode?: number;
  code?: string;
  message?: string;
  details?: unknown;
};

// Structured API error for client-side error handling (e.g. 409 slot conflict)
export class ApiError extends Error {
  status: number;
  statusText: string;
  code?: string;
  details?: unknown;

  constructor(
    status: number,
    statusText: string,
    message: string,
    options?: { code?: string; details?: unknown }
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.code = options?.code;
    this.details = options?.details;
  }
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api/v1';

function unwrapData<T>(json: unknown): T {
  if (json && typeof json === 'object' && 'data' in json) {
    return (json as ApiEnvelope<T>).data as T;
  }
  return json as T;
}

function parseApiErrorBody(json: unknown): {
  message: string;
  code?: string;
  details?: unknown;
} {
  if (!json || typeof json !== 'object') {
    return { message: 'Request failed' };
  }

  const body = json as ApiErrorBody;

  return {
    message: body.message ?? 'Request failed',
    code: body.code,
    details: body.details,
  };
}

async function throwApiError(
  res: Response,
  fallbackMessage: string
): Promise<never> {
  const errJson = await res.json().catch(() => null);
  const parsed = parseApiErrorBody(errJson);

  throw new ApiError(
    res.status,
    res.statusText,
    parsed.message || fallbackMessage,
    {
      code: parsed.code,
      details: parsed.details,
    }
  );
}

// ── Server-side helpers ────────────────────────────────────────────────

async function serverRequest<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return unwrapData<T>(json);
}

export function getCard(
  username: string,
  slug?: string
): Promise<PublicCardResponse> {
  return serverRequest<PublicCardResponse>(
    `/public/card/${username}${slug ? `/${slug}` : ''}`
  );
}

export function getPublicMeeting(
  shortId: string
): Promise<PublicMeetingResponse> {
  return serverRequest<PublicMeetingResponse>(`/public/meetings/${shortId}`);
}

export function getVCardUrl(username: string, slug?: string): string {
  return `${API_BASE}/public/card/${username}${slug ? `/${slug}` : ''}/vcard`;
}

// ── Client-callable functions ──────────────────────────────────────────

export async function submitContact(
  cardId: string,
  data: {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    note?: string;
  }
): Promise<{ id: string }> {
  const res = await fetch(`${API_BASE}/public/card/${cardId}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  const json = await res.json();
  return (json.data ?? json) as { id: string };
}

export async function trackClick(
  cardId: string,
  clickedLink: string
): Promise<void> {
  await fetch(`${API_BASE}/public/card/${cardId}/click`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clickedLink }),
  });
}

// ── Scheduling ────────────────────────────────────────────────────────

/**
 * Server-side: fetch a user's public scheduling profile.
 * Throws on 404 (user not found or scheduling disabled).
 */
export function getSchedulingProfile(
  username: string
): Promise<SchedulingProfile> {
  return serverRequest<SchedulingProfile>(
    `/public/scheduling/profile/${username}`
  );
}

/**
 * Client-side: fetch available slots for a date.
 * date must be YYYY-MM-DD format.
 */
export async function getSlots(
  username: string,
  slug: string,
  date: string,
  signal?: AbortSignal
): Promise<SlotsResponse> {
  const res = await fetch(
    `${API_BASE}/public/scheduling/slots/${username}/${slug}?date=${date}`,
    { cache: 'no-store', signal }
  );
  if (!res.ok) {
    await throwApiError(res, 'Could not load available slots');
  }
  const json = await res.json();
  return unwrapData<SlotsResponse>(json);
}

/**
 * Client-side: create a booking.
 * Throws ApiError(409) when the slot is no longer available.
 */
export async function createBooking(
  data: BookingCreateInput
): Promise<BookingConfirmationData> {
  const res = await fetch(`${API_BASE}/public/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    await throwApiError(res, 'Booking failed');
  }
  const json = await res.json();
  return unwrapData<BookingConfirmationData>(json);
}

export async function downloadVCard(
  username: string,
  slug?: string
): Promise<void> {
  const url = getVCardUrl(username, slug);

  const userAgent = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to download: ${res.status}`);

    const blob = await res.blob();

    // Mobile share sheet provides the most reliable save/open flow on modern devices.
    const file = new File([blob], `${username}${slug ? `-${slug}` : ''}.vcf`, {
      type: 'text/vcard',
    });
    if (
      typeof navigator !== 'undefined' &&
      'canShare' in navigator &&
      navigator.canShare({ files: [file] }) &&
      'share' in navigator
    ) {
      try {
        await navigator.share({ files: [file], title: 'Save Contact' });
      } catch (err) {
        // User-cancelled share should be a no-op, not a forced fallback open.
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        throw err;
      }
      return;
    }

    // Mobile Safari/Chrome can block blob-based downloads in some contexts.
    if (isIOS || isAndroid) {
      window.location.assign(url);
      return;
    }

    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `${username}${slug ? `-${slug}` : ''}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
