import { ImageResponse } from 'next/og';
import { getPublicTeam } from '@/lib/api';

export const runtime = 'edge';

const WIDTH = 1200;
const HEIGHT = 630;
const GOLD = '#d4af61';

const ALLOWED_LOGO_HOSTS = new Set([
  'storage.googleapis.com',
  'lh3.googleusercontent.com',
]);

function isAllowedLogoHost(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === 'https:' && ALLOWED_LOGO_HOSTS.has(hostname);
  } catch {
    return false;
  }
}

function initialsFor(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let teamName = slug;
  let description = '';
  let memberCount = 0;
  let logoUrl: string | null = null;

  try {
    const { team, stats } = await getPublicTeam(slug);
    teamName = team.name;
    description = team.description ?? '';
    memberCount = stats.memberCount;
    logoUrl = team.logoUrl ?? null;
  } catch {
    // Use defaults on fetch failure
  }

  let logoSrc: string | null = null;
  if (logoUrl && isAllowedLogoHost(logoUrl)) {
    try {
      const res = await fetch(logoUrl);
      const buf = await res.arrayBuffer();
      const mime = res.headers.get('content-type') ?? 'image/png';
      const b64 =
        typeof Buffer !== 'undefined'
          ? Buffer.from(buf).toString('base64')
          : btoa(String.fromCharCode(...new Uint8Array(buf)));
      logoSrc = `data:${mime};base64,${b64}`;
    } catch {
      // Fall back to initials
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
      {/* Radial gold glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, ${GOLD}14 0%, transparent 65%)`,
        }}
      />

      {/* Bottom gold accent bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${GOLD}, ${GOLD}44)`,
        }}
      />

      {/* Team logo or initials */}
      {logoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoSrc}
          alt={teamName}
          style={{
            width: 96,
            height: 96,
            borderRadius: 20,
            objectFit: 'cover',
            marginBottom: 32,
            border: `2px solid ${GOLD}66`,
          }}
        />
      ) : (
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 20,
            backgroundColor: '#1a1a1a',
            border: `2px solid ${GOLD}66`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
          }}
        >
          <span style={{ fontSize: 36, fontWeight: 600, color: GOLD }}>
            {initialsFor(teamName)}
          </span>
        </div>
      )}

      {/* Team name */}
      <div
        style={{
          fontSize: 54,
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-1px',
          marginBottom: 12,
          maxWidth: 900,
          textAlign: 'center',
        }}
      >
        {teamName}
      </div>

      {/* Description or member count */}
      {description ? (
        <div
          style={{
            fontSize: 24,
            color: '#888888',
            maxWidth: 700,
            textAlign: 'center',
            marginBottom: memberCount > 0 ? 20 : 40,
            lineHeight: 1.4,
          }}
        >
          {description.length > 80
            ? description.slice(0, 80) + '…'
            : description}
        </div>
      ) : null}

      {memberCount > 0 && (
        <div
          style={{
            fontSize: 18,
            color: GOLD,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: 40,
          }}
        >
          {memberCount} {memberCount === 1 ? 'member' : 'members'}
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
