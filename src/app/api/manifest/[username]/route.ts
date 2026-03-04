import { NextRequest, NextResponse } from 'next/server';
import { getCard } from '@/lib/api';

export const runtime = 'edge';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  let appName = 'Crelyzor Cards';
  let shortName = 'Crelyzor';

  try {
    const data = await getCard(username);
    appName = data.card.displayName;
    // Short name: first word of display name (e.g. "John" from "John Smith")
    shortName = data.card.displayName.split(/\s+/)[0];
  } catch {
    // Card not found or API error — fall back to generic name
  }

  const manifest = {
    name: appName,
    short_name: shortName,
    description: `Connect with ${appName} on Crelyzor.`,
    start_url: `/${username}`,
    id: `/${username}`,
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    orientation: 'portrait',
    categories: ['business', 'productivity'],
    icons: [
      {
        src: '/api/icon?size=192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/api/icon?size=192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/api/icon?size=512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/api/icon?size=512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      // Cache for 5 minutes so name changes propagate reasonably fast
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
    },
  });
}
