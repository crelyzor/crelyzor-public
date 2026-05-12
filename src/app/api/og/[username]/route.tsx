import { ImageResponse } from 'next/og';
import { getCard } from '@/lib/api';

export const runtime = 'edge';

const WIDTH = 1200;
const HEIGHT = 630;

const ALLOWED_AVATAR_HOSTS = new Set([
  'storage.googleapis.com',
  'lh3.googleusercontent.com',
]);

function isAllowedAvatarHost(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === 'https:' && ALLOWED_AVATAR_HOSTS.has(hostname);
  } catch {
    return false;
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  let displayName = username;
  let title = '';
  let accent = '#d4af61';
  let avatarUrl: string | null = null;

  try {
    const data = await getCard(username);
    displayName = data.card.displayName;
    title = data.card.title ?? '';
    accent = data.card.theme?.primaryColor ?? '#d4af61';
    avatarUrl = data.card.avatarUrl ?? null;
  } catch {
    // Use defaults if card fetch fails
  }

  // Attempt to inline the avatar as a base64 data URI for edge ImageResponse
  let avatarSrc: string | null = null;
  if (avatarUrl && isAllowedAvatarHost(avatarUrl)) {
    try {
      const res = await fetch(avatarUrl);
      const buf = await res.arrayBuffer();
      const mime = res.headers.get('content-type') ?? 'image/jpeg';
      // Buffer is available as a global in the Next.js edge runtime
      const b64 =
        typeof Buffer !== 'undefined'
          ? Buffer.from(buf).toString('base64')
          : btoa(String.fromCharCode(...new Uint8Array(buf)));
      avatarSrc = `data:${mime};base64,${b64}`;
    } catch {
      // Fall back to initial letter
    }
  }

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        fontFamily: 'sans-serif',
        position: 'relative',
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 30% 50%, ${accent}18 0%, transparent 60%)`,
        }}
      />

      {/* Bottom accent bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${accent}, ${accent}66)`,
        }}
      />

      {/* Card avatar */}
      {avatarSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarSrc}
          alt={displayName}
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            objectFit: 'cover',
            marginBottom: 32,
            border: `2px solid ${accent}`,
          }}
        />
      ) : (
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            backgroundColor: '#1a1a1a',
            border: `2px solid ${accent}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
          }}
        >
          <span style={{ fontSize: 40, fontWeight: 600, color: accent }}>
            {displayName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      {/* Name */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-1px',
          marginBottom: 12,
          maxWidth: 900,
          textAlign: 'center',
        }}
      >
        {displayName}
      </div>

      {/* Title */}
      {title && (
        <div
          style={{
            fontSize: 28,
            color: accent,
            letterSpacing: '0.5px',
            marginBottom: 40,
          }}
        >
          {title}
        </div>
      )}

      {/* Crelyzor branding */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          right: 40,
          fontSize: 18,
          color: '#555555',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}
      >
        Crelyzor
      </div>
    </div>,
    { width: WIDTH, height: HEIGHT }
  );
}
