import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ApiError, getInvitePreview } from '@/lib/api';
import type { PublicInvitePreview } from '@/types/invite';
import { Clock } from 'lucide-react';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.crelyzor.app';

interface Props {
  params: Promise<{ token: string }>;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function initialsFor(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function roleLabel(role: PublicInvitePreview['role']): string {
  return role === 'ADMIN' ? 'admin' : 'member';
}

function formatExpiry(iso: string): string {
  const target = new Date(iso).getTime();
  const diff = target - Date.now();
  if (diff <= 0) return 'soon';
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days <= 0) return 'in less than a day';
  if (days === 1) return 'in 1 day';
  return `in ${days} days`;
}

// ── Metadata ───────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crelyzor.app';
  const canonical = `${base}/invite/${token}`;
  try {
    const preview = await getInvitePreview(token);
    if (!preview) {
      return {
        title: 'Invitation not found · Crelyzor',
        robots: { index: false, follow: false },
      };
    }
    return {
      title: `You're invited to ${preview.team.name} · Crelyzor`,
      description: `${preview.inviter.name} invited you to join ${preview.team.name} on Crelyzor as a ${roleLabel(preview.role)}.`,
      robots: { index: false, follow: false },
      alternates: { canonical },
      openGraph: {
        title: `You're invited to ${preview.team.name}`,
        description: `${preview.inviter.name} invited you to join ${preview.team.name} on Crelyzor.`,
        type: 'website',
        url: canonical,
        images: preview.team.logoUrl ? [{ url: preview.team.logoUrl }] : [],
      },
    };
  } catch {
    return {
      title: 'Invitation · Crelyzor',
      robots: { index: false, follow: false },
    };
  }
}

// ── Page shells ────────────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center px-6 py-12">
      <div
        className="w-full max-w-md bg-white rounded-2xl px-8 py-10"
        style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
      >
        {children}
      </div>
      <Link
        href="/"
        className="mt-8 text-[11px] tracking-widest uppercase text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        Powered by Crelyzor
      </Link>
    </div>
  );
}

function TeamAvatar({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl: string | null;
}) {
  if (logoUrl) {
    /* eslint-disable-next-line @next/next/no-img-element */
    return (
      <img
        src={logoUrl}
        alt={name}
        referrerPolicy="no-referrer"
        className="w-[72px] h-[72px] rounded-xl object-cover mx-auto"
      />
    );
  }
  return (
    <div
      className="w-[72px] h-[72px] rounded-xl flex items-center justify-center mx-auto"
      style={{ background: 'rgba(212,175,97,0.1)' }}
    >
      <span className="text-xl font-semibold" style={{ color: '#d4af61' }}>
        {initialsFor(name)}
      </span>
    </div>
  );
}

function ExpiredCard() {
  return (
    <Shell>
      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto">
        <Clock className="w-6 h-6 text-neutral-400" />
      </div>
      <h1 className="text-lg font-medium text-neutral-900 text-center mt-6 tracking-tight">
        This invitation has expired
      </h1>
      <p className="text-sm text-neutral-500 text-center mt-2">
        Ask the team owner to send a new invitation.
      </p>
    </Shell>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function InvitePage({ params }: Props) {
  const { token } = await params;

  let preview: PublicInvitePreview | null;
  try {
    preview = await getInvitePreview(token);
  } catch (err) {
    if (err instanceof ApiError && err.status === 410) {
      return <ExpiredCard />;
    }
    throw err;
  }

  if (!preview) notFound();

  const role = roleLabel(preview.role);
  const acceptHref = `${APP_URL}/invite/${token}`;

  return (
    <Shell>
      <TeamAvatar name={preview.team.name} logoUrl={preview.team.logoUrl} />

      <h1 className="text-lg font-medium text-neutral-900 text-center mt-6 tracking-tight">
        You&rsquo;ve been invited to{' '}
        <span className="font-semibold">{preview.team.name}</span>
      </h1>
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 text-center mt-2">
        Invited by {preview.inviter.name} as {role}
      </p>

      <div className="h-px bg-neutral-200 my-6" />

      <a
        href={acceptHref}
        referrerPolicy="no-referrer"
        className="h-11 rounded-xl bg-neutral-900 text-white text-sm font-medium w-full flex items-center justify-center hover:bg-neutral-800 transition-colors"
      >
        Open in Crelyzor to accept
      </a>
      <p className="text-[11px] text-neutral-500 text-center mt-3">
        Expires {formatExpiry(preview.expiresAt)}
      </p>
    </Shell>
  );
}
