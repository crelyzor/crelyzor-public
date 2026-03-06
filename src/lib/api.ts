import type { PublicCardResponse } from '@/types/card';
import type { PublicMeetingResponse } from '@/types/meeting';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';

// ── Server-side helpers ────────────────────────────────────────────────

async function serverRequest<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  const json = await res.json();
  if (json && typeof json === 'object' && 'data' in json) {
    return json.data as T;
  }
  return json as T;
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

export async function downloadVCard(
  username: string,
  slug?: string
): Promise<void> {
  const url = getVCardUrl(username, slug);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download: ${res.status}`);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = `${username}${slug ? `-${slug}` : ''}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}
