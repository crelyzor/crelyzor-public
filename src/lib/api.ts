const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  const json = await res.json();
  if (
    json &&
    typeof json === 'object' &&
    'data' in json &&
    'statusCode' in json
  ) {
    return json.data as T;
  }
  return json as T;
}

export const api = {
  getCard: (username: string, slug?: string) =>
    request<import('../types/card').PublicCardResponse>(
      `/public/card/${username}${slug ? `/${slug}` : ''}`
    ),

  submitContact: (
    cardId: string,
    data: {
      name: string;
      email?: string;
      phone?: string;
      company?: string;
      note?: string;
    }
  ) =>
    request<{ id: string }>(`/public/card/${cardId}/contact`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  trackClick: (cardId: string, clickedLink: string) =>
    request<void>(`/public/card/${cardId}/click`, {
      method: 'POST',
      body: JSON.stringify({ clickedLink }),
    }),

  getVCardUrl: (username: string, slug?: string) =>
    `${API_BASE}/public/card/${username}${slug ? `/${slug}` : ''}/vcard`,

  /** Fetch vCard as blob and trigger a secure same-origin download */
  downloadVCard: async (username: string, slug?: string): Promise<void> => {
    const url = `${API_BASE}/public/card/${username}${slug ? `/${slug}` : ''}/vcard`;
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
  },
};
