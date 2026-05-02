import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublicMeeting } from '@/lib/api';
import type {
  PublicMeetingResponse,
  PublicMeetingSpeaker,
  PublicMeetingTranscriptSegment,
} from '@/types/meeting';

// ── Helpers ────────────────────────────────────────────────────────────────

function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function resolveSpeaker(
  label: string,
  speakers: PublicMeetingSpeaker[]
): string {
  const match = speakers.find((s) => s.speakerLabel === label);
  return match?.displayName ?? label;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function meetingTypeLabel(
  type: PublicMeetingResponse['meeting']['type']
): string {
  if (type === 'VOICE_NOTE') return 'Voice Note';
  if (type === 'RECORDED') return 'Recording';
  return 'Meeting';
}

// ── Metadata ──────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://crelyzor.app';
  try {
    const data = await getPublicMeeting(id);
    const { meeting, summary } = data;
    const description = summary
      ? summary.summary.slice(0, 160)
      : `${meetingTypeLabel(meeting.type)} shared via Crelyzor.`;
    const canonical = `${base}/m/${id}`;

    return {
      title: meeting.title,
      description,
      robots: { index: true, follow: true },
      alternates: { canonical },
      openGraph: {
        title: meeting.title,
        description,
        type: 'article',
        url: canonical,
      },
      twitter: {
        card: 'summary_large_image',
        title: meeting.title,
        description,
      },
    };
  } catch {
    return { title: 'Meeting Not Found' };
  }
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function PublishedMeetingPage({ params }: Props) {
  const { id } = await params;
  let data: PublicMeetingResponse;

  try {
    data = await getPublicMeeting(id);
  } catch {
    notFound();
  }

  const { meeting, speakers, transcript, summary, tasks } = data;
  const hasContent = transcript !== null || summary !== null || tasks !== null;
  const dateStr = meeting.startTime
    ? formatDate(meeting.startTime)
    : formatDate(meeting.createdAt);

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <div className="px-4 pt-12 pb-8" style={{ background: '#0a0a0a' }}>
        <div className="max-w-2xl mx-auto">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-medium text-neutral-400 border border-neutral-700 mb-4">
            {meetingTypeLabel(meeting.type)}
          </span>
          <h1 className="text-xl font-semibold text-white leading-snug mb-2">
            {meeting.title}
          </h1>
          <p className="text-xs text-neutral-500">{dateStr}</p>
          {/* Gold accent bar */}
          <div
            className="mt-6 h-px w-16"
            style={{
              background:
                'linear-gradient(to right, #d4af61, rgba(212,175,97,0.2))',
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {!hasContent && (
          <div
            className="bg-white rounded-2xl p-8 text-center"
            style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
          >
            <p className="text-sm text-neutral-400">
              No content has been shared for this meeting.
            </p>
          </div>
        )}

        {/* Summary */}
        {summary && (
          <section
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
          >
            <div className="px-5 py-4 border-b border-neutral-100">
              <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                Summary
              </h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-neutral-700 leading-relaxed">
                {summary.summary}
              </p>
              {summary.keyPoints.length > 0 && (
                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-2">
                    Key Points
                  </p>
                  <ul className="space-y-2">
                    {summary.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span
                          className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                          style={{ background: '#d4af61' }}
                        />
                        <span className="text-sm text-neutral-600 leading-relaxed">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Tasks */}
        {tasks && tasks.length > 0 && (
          <section
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
          >
            <div className="px-5 py-4 border-b border-neutral-100">
              <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                Tasks
              </h2>
            </div>
            <ul className="px-5 py-3 divide-y divide-neutral-50">
              {tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-3 py-2.5">
                  <span
                    className={`mt-0.5 w-4 h-4 rounded shrink-0 border flex items-center justify-center ${
                      task.isCompleted
                        ? 'bg-neutral-900 border-neutral-900'
                        : 'border-neutral-300'
                    }`}
                  >
                    {task.isCompleted && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M2 5l2.5 2.5L8 3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span
                    className={`text-sm leading-relaxed ${
                      task.isCompleted
                        ? 'text-neutral-400 line-through'
                        : 'text-neutral-700'
                    }`}
                  >
                    {task.title}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Transcript */}
        {transcript && transcript.length > 0 && (
          <section
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
          >
            <div className="px-5 py-4 border-b border-neutral-100">
              <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                Transcript
              </h2>
            </div>
            <div className="px-5 py-3 space-y-4">
              <TranscriptSegmentList
                segments={transcript}
                speakers={speakers}
              />
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="pt-4 pb-8 text-center">
          <Link
            href="/"
            className="text-[11px] tracking-widest uppercase text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            Powered by Crelyzor
          </Link>
        </footer>
      </div>
    </div>
  );
}

// ── Transcript sub-component (server) ─────────────────────────────────────

function TranscriptSegmentList({
  segments,
  speakers,
}: {
  segments: PublicMeetingTranscriptSegment[];
  speakers: PublicMeetingSpeaker[];
}) {
  // Group consecutive segments by speaker for readability
  const groups: {
    speaker: string;
    segments: PublicMeetingTranscriptSegment[];
  }[] = [];

  for (const seg of segments) {
    const last = groups[groups.length - 1];
    if (last && last.speaker === seg.speaker) {
      last.segments.push(seg);
    } else {
      groups.push({ speaker: seg.speaker, segments: [seg] });
    }
  }

  return (
    <>
      {groups.map((group, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] uppercase tracking-wider font-medium text-neutral-900">
              {resolveSpeaker(group.speaker, speakers)}
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">
              {formatSeconds(group.segments[0].startTime)}
            </span>
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed pl-0">
            {group.segments.map((s) => s.text).join(' ')}
          </p>
        </div>
      ))}
    </>
  );
}
