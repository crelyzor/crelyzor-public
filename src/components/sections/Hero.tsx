'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from 'motion/react';
import {
  Search,
  Home,
  Calendar,
  Settings,
  CreditCard,
  Mic,
  Sun,
  LayoutGrid,
  ChevronDown,
  ArrowLeft,
  Share2,
  MoreHorizontal,
  Eye,
  Users,
  Copy,
  QrCode,
  X,
  CheckSquare,
  CalendarDays,
  Sparkles,
  Tag,
} from 'lucide-react';

const GOLD = '#d4af61';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

function MockNavbar({
  activePath,
}: {
  activePath: 'home' | 'calendar' | 'cards' | 'tasks' | 'meetings';
}) {
  const icons: { Icon: React.ElementType; id: string }[] = [
    { Icon: Home, id: 'home' },
    { Icon: Calendar, id: 'calendar' },
    { Icon: CalendarDays, id: 'meetings' },
    { Icon: CheckSquare, id: 'tasks' },
    { Icon: CreditCard, id: 'cards' },
    { Icon: Mic, id: 'mic' },
    { Icon: Settings, id: 'settings' },
  ];
  return (
    <div
      className="flex items-center justify-between px-4 py-2 border-b border-neutral-800/60 shrink-0"
      style={{ backgroundColor: '#0d0d0d' }}
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center shrink-0">
          <span className="text-[9px] text-neutral-300 font-medium">HR</span>
        </div>
        <span className="text-sm text-neutral-200 font-medium">
          Harshit Rai
        </span>
        <ChevronDown className="w-3 h-3 text-neutral-500" />
      </div>
      <div className="flex items-center gap-1.5 bg-neutral-800/60 rounded-lg px-3 py-1.5">
        <Search className="w-3 h-3 text-neutral-500" />
        <span className="text-[10px] text-neutral-500">Search anything</span>
        <span className="ml-2 text-[9px] text-neutral-700 border border-neutral-700 rounded px-1">
          ⌘K
        </span>
      </div>
      <div className="flex items-center gap-0.5">
        {icons.map(({ Icon, id }) => (
          <div
            key={id}
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: activePath === id ? '#fff' : 'transparent',
            }}
          >
            <Icon
              className="w-3.5 h-3.5"
              style={{ color: activePath === id ? '#000' : '#555' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeBody() {
  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div className="text-center pt-6 pb-4 shrink-0">
        <p className="text-[9px] tracking-[0.15em] text-neutral-500 uppercase mb-1">
          Good Evening, Harshit
        </p>
        <p className="text-white font-semibold text-xl mb-1">
          It&apos;s Thursday, March 6
        </p>
        <p className="text-neutral-500 text-[11px]">
          Your busiest day this week is Wednesday
        </p>
      </div>
      <div className="flex items-center justify-center gap-6 mb-5 shrink-0">
        {[
          { label: 'Meetings', Icon: Calendar },
          { label: 'Voice Notes', Icon: Mic },
          { label: 'Cards', Icon: CreditCard },
        ].map(({ label, Icon }) => (
          <div key={label} className="flex flex-col items-center gap-1.5">
            <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center">
              <Icon className="w-5 h-5 text-neutral-300" />
            </div>
            <span className="text-[10px] text-neutral-400">{label}</span>
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-5 gap-3 px-4 pb-4 min-h-0">
        <div className="col-span-3 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <p className="text-[8px] tracking-[0.12em] text-neutral-600 uppercase font-medium">
              Recent Meetings
            </p>
            <span className="text-[8px] text-neutral-700">See all →</span>
          </div>
          {[
            {
              time: '12:26 PM',
              dur: '3 min',
              title: 'Ethics and Safety in AI Development',
            },
            {
              time: '5:25 AM',
              dur: '0 min',
              title: 'Offline Meeting Overview and Updates',
            },
            {
              time: '1:29 AM',
              dur: '0 min',
              title: 'Recording · Mar 3, 01:30 AM',
            },
          ].map((m, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-2.5 py-2 mb-1.5 rounded-lg border border-neutral-800"
              style={{ backgroundColor: '#111' }}
            >
              <div className="shrink-0 text-right w-11">
                <p className="text-[8px] font-medium text-neutral-500">
                  {m.time}
                </p>
                <p className="text-[7px] text-neutral-700">{m.dur}</p>
              </div>
              <div className="w-px h-3.5 bg-neutral-800 shrink-0" />
              <p className="text-[10px] text-neutral-300 truncate">{m.title}</p>
            </div>
          ))}
        </div>
        <div className="col-span-2 flex flex-col gap-2 min-h-0">
          <div
            className="rounded-xl border border-neutral-800 overflow-hidden"
            style={{ backgroundColor: '#111' }}
          >
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-neutral-800/50">
              <p className="text-[8px] tracking-[0.1em] text-neutral-600 uppercase">
                Your Card
              </p>
              <span className="text-[8px] text-neutral-700">↗</span>
            </div>
            <div className="p-2">
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #1f1f1f',
                  aspectRatio: '1.586/1',
                }}
              >
                <div className="w-full h-full p-2 flex flex-col justify-between">
                  <div>
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center mb-1"
                      style={{
                        backgroundColor: '#1a1a1a',
                        border: `1px solid ${GOLD}50`,
                      }}
                    >
                      <span
                        style={{ color: GOLD }}
                        className="text-[7px] font-bold"
                      >
                        C
                      </span>
                    </div>
                    <p className="text-white text-[9px] font-semibold leading-tight">
                      Harshit Rai
                    </p>
                    <p
                      className="text-[7px] uppercase tracking-wider mt-0.5"
                      style={{ color: GOLD }}
                    >
                      Co-Founder
                    </p>
                  </div>
                  <p className="text-neutral-600 text-[7px]">
                    harshit@crelyzor.app
                  </p>
                </div>
                <div
                  className="h-px w-full"
                  style={{
                    background: `linear-gradient(90deg, ${GOLD}, ${GOLD}40)`,
                  }}
                />
              </div>
            </div>
          </div>
          <div
            className="rounded-xl border border-neutral-800 overflow-hidden flex-1"
            style={{ backgroundColor: '#111' }}
          >
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-neutral-800/50">
              <p className="text-[8px] tracking-[0.1em] text-neutral-600 uppercase">
                Voice Notes
              </p>
              <span className="text-[8px] text-neutral-700">See all →</span>
            </div>
            <div className="p-2">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                  <Mic className="w-2.5 h-2.5 text-neutral-400" />
                </div>
                <div>
                  <p className="text-[9px] text-neutral-300 leading-tight">
                    Voice Notes Discussion
                  </p>
                  <p className="text-[7px] text-neutral-600">Mar 3 · 0 min</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MeetingBody() {
  return (
    <div
      className="flex flex-col h-full overflow-hidden px-5 py-4"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div className="flex items-center gap-2 mb-3 text-neutral-600 shrink-0">
        <ArrowLeft className="w-3 h-3" />
        <span className="text-[10px]">Back to Meetings</span>
      </div>
      <div
        className="rounded-xl border border-neutral-800 p-4 mb-3 shrink-0"
        style={{ backgroundColor: '#111' }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white font-semibold text-sm leading-tight">
              Ethics and Safety in AI Development
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] text-neutral-500">Mar 4, 2026</span>
              <span className="text-neutral-700">·</span>
              <span className="text-[9px] text-neutral-500">3 min</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Share2 className="w-3.5 h-3.5 text-neutral-600" />
            <MoreHorizontal className="w-3.5 h-3.5 text-neutral-600" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-3">
          <Users className="w-3 h-3 text-neutral-600" />
          <span className="text-[8px] tracking-wider text-neutral-600 uppercase mr-1">
            Speakers (2)
          </span>
          {['Dadrio', 'Nikhil'].map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 rounded-full border border-neutral-700 text-[8px] text-neutral-400"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
      <div
        className="flex border-b border-neutral-800 mb-3 shrink-0"
        style={{ overflowX: 'auto', scrollbarWidth: 'none' }}
      >
        {[
          'Recording',
          'Transcript',
          'AI Summary',
          'Tasks',
          'Notes',
          'Ask AI',
          'Generate',
        ].map((tab, i) => (
          <button
            key={tab}
            className="px-2.5 py-1.5 text-[9px] shrink-0 border-b-2 -mb-px whitespace-nowrap"
            style={{
              borderColor: i === 2 ? '#fff' : 'transparent',
              color: i === 2 ? '#fff' : '#555',
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex-1 space-y-3 overflow-hidden">
        <div>
          <p className="text-[8px] tracking-wider text-neutral-600 uppercase mb-1.5">
            Summary
          </p>
          <p className="text-neutral-400 text-[10px] leading-relaxed">
            Discussion covered ethical frameworks for AI development — bias
            mitigation, transparency requirements, and responsible deployment
            strategies for production systems.
          </p>
        </div>
        <div>
          <p className="text-[8px] tracking-wider text-neutral-600 uppercase mb-1.5">
            Key Points
          </p>
          <div className="space-y-1.5">
            {[
              'Establish bias testing protocols before model deployment',
              'Transparency reports required for enterprise AI usage',
              'Follow-up scheduled for regulatory compliance review',
            ].map((pt, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-neutral-600 mt-1.5 shrink-0" />
                <p className="text-neutral-500 text-[10px] leading-relaxed">
                  {pt}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[8px] tracking-wider text-neutral-600 uppercase mb-1.5">
            Action Items
          </p>
          <div className="space-y-1">
            {[
              'Draft bias testing framework doc',
              'Schedule regulatory review call',
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-neutral-800"
                style={{ backgroundColor: '#111' }}
              >
                <div className="w-3 h-3 rounded border border-neutral-700 shrink-0" />
                <p className="text-[9px] text-neutral-400">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CardBody() {
  return (
    <div
      className="flex flex-col h-full relative overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div className="absolute inset-0 px-5 py-4 opacity-20 blur-sm pointer-events-none">
        <p className="text-[8px] tracking-widest text-neutral-600 uppercase mb-3">
          Your Cards
        </p>
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl border border-neutral-800"
            style={{ backgroundColor: '#111' }}
          >
            <div
              className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0"
              style={{ borderColor: GOLD + '60' }}
            >
              <span style={{ color: GOLD }} className="text-[11px] font-bold">
                C
              </span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Crelyzor</p>
              <p className="text-neutral-500 text-[10px]">
                Harshit Rai | Co-Founder
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div
          className="w-full max-w-[260px] rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl"
          style={{ backgroundColor: '#111' }}
        >
          <div className="p-3">
            <div
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #1f1f1f',
                aspectRatio: '1.586/1',
              }}
            >
              <div
                className="w-full h-full p-3 flex flex-col justify-between"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(135deg, transparent, transparent 8px, rgba(255,255,255,0.015) 8px, rgba(255,255,255,0.015) 9px)',
                }}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: '#1a1a1a',
                      border: `1.5px solid ${GOLD}`,
                    }}
                  >
                    <span style={{ color: GOLD }} className="text-xs font-bold">
                      C
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Crelyzor</p>
                    <p className="text-[9px] mt-0.5" style={{ color: GOLD }}>
                      Harshit Rai | Co-Founder
                    </p>
                    <div
                      className="w-5 h-px mt-1"
                      style={{ backgroundColor: GOLD }}
                    />
                  </div>
                </div>
              </div>
              <div
                className="h-0.5 w-full"
                style={{
                  background: `linear-gradient(90deg, ${GOLD}, ${GOLD}40)`,
                }}
              />
            </div>
          </div>
          <div className="px-3 pb-2">
            <p className="text-white font-semibold text-sm">Crelyzor</p>
            <p className="text-neutral-500 text-[10px]">
              Harshit Rai | Co-Founder
            </p>
            <p className="text-neutral-700 text-[9px] mt-0.5">/card-2</p>
            <div className="flex items-center gap-3 mt-1.5">
              <div className="flex items-center gap-1">
                <Eye className="w-2.5 h-2.5 text-neutral-600" />
                <span className="text-[9px] text-neutral-500">24 views</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-2.5 h-2.5 text-neutral-600" />
                <span className="text-[9px] text-neutral-500">0 contacts</span>
              </div>
            </div>
          </div>
          <div className="px-3 pb-3 flex gap-2">
            <button className="flex-1 py-2 rounded-xl bg-white text-black text-[10px] font-semibold flex items-center justify-center gap-1">
              <span>↗</span> Edit card
            </button>
            <button className="w-8 h-8 rounded-xl border border-neutral-700 flex items-center justify-center shrink-0">
              <Copy className="w-3 h-3 text-neutral-400" />
            </button>
            <button className="w-8 h-8 rounded-xl border border-neutral-700 flex items-center justify-center shrink-0">
              <QrCode className="w-3 h-3 text-neutral-400" />
            </button>
            <button className="w-8 h-8 rounded-xl border border-neutral-700 flex items-center justify-center shrink-0">
              <X className="w-3 h-3 text-neutral-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TasksBody() {
  const cols = [
    {
      label: 'Todo',
      color: '#555',
      tasks: [
        'Draft bias testing framework',
        'Schedule regulatory review call',
        'Update onboarding docs',
      ],
    },
    {
      label: 'In Progress',
      color: GOLD,
      tasks: ['Build card analytics page', 'Deepgram integration test'],
    },
    {
      label: 'Done',
      color: '#4ade80',
      tasks: [
        'Google OAuth setup',
        'AI summary pipeline',
        'Email signature generator',
      ],
    },
  ];
  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div className="flex items-center justify-between px-5 pt-4 pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <p className="text-white font-semibold text-sm">Tasks</p>
          <div className="flex items-center gap-1">
            {['Inbox', 'Today', 'Upcoming', 'All', 'From Meetings'].map(
              (v, i) => (
                <button
                  key={v}
                  className="px-2 py-0.5 rounded text-[9px]"
                  style={{
                    backgroundColor: i === 0 ? '#1f1f1f' : 'transparent',
                    color: i === 0 ? '#fff' : '#555',
                  }}
                >
                  {v}
                </button>
              )
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-[9px] px-2 py-1 rounded-lg border border-neutral-800 text-neutral-500">
            List
          </button>
          <button
            className="text-[9px] px-2 py-1 rounded-lg border text-white"
            style={{ borderColor: GOLD + 50, backgroundColor: GOLD + '15' }}
          >
            Board
          </button>
        </div>
      </div>
      <div className="flex-1 flex gap-3 px-4 pb-4 overflow-hidden">
        {cols.map((col) => (
          <div key={col.label} className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-1.5 mb-2 shrink-0">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: col.color }}
              />
              <p
                className="text-[9px] font-medium tracking-wider uppercase"
                style={{ color: col.color }}
              >
                {col.label}
              </p>
              <span className="text-[8px] text-neutral-700 ml-auto">
                {col.tasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 overflow-hidden">
              {col.tasks.map((t, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-neutral-800 px-2.5 py-2"
                  style={{ backgroundColor: '#111' }}
                >
                  <div className="flex items-start gap-1.5">
                    <div className="w-3 h-3 rounded border border-neutral-700 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-neutral-300 leading-tight">
                      {t}
                    </p>
                  </div>
                  {i === 0 && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span
                        className="text-[7px] px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: GOLD + '20', color: GOLD }}
                      >
                        High
                      </span>
                      <span className="text-[7px] text-neutral-600">
                        Due Apr 24
                      </span>
                    </div>
                  )}
                </div>
              ))}
              <button className="w-full py-1.5 rounded-lg border border-dashed border-neutral-800 text-[9px] text-neutral-700 hover:text-neutral-500">
                + Add task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarBody() {
  const hours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM'];
  const days = ['Mon 21', 'Tue 22', 'Wed 23', 'Thu 24', 'Fri 25'];
  const events = [
    { day: 1, start: 0, label: 'Standup', dur: 1 },
    { day: 0, start: 1, label: 'Ethics & Safety in AI', dur: 2, gold: true },
    { day: 2, start: 2, label: '30 min with Harsh', dur: 1 },
    { day: 3, start: 1, label: 'Regulatory Review', dur: 2 },
    { day: 1, start: 3, label: 'Task: Draft doc', dur: 1, task: true },
  ];
  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
        <p className="text-white text-sm font-semibold">Apr 21 – Apr 25</p>
        <div className="flex items-center gap-1">
          {['Month', 'Week', 'Day'].map((v, i) => (
            <button
              key={v}
              className="text-[9px] px-2 py-0.5 rounded"
              style={{
                backgroundColor: i === 1 ? '#1f1f1f' : 'transparent',
                color: i === 1 ? '#fff' : '#555',
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden px-2 pb-2">
        <div className="flex flex-col gap-0 w-8 shrink-0 pt-5">
          {hours.map((h) => (
            <div key={h} className="flex-1 flex items-start">
              <span className="text-[7px] text-neutral-700">{h}</span>
            </div>
          ))}
        </div>
        <div
          className="flex-1 grid gap-px"
          style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}
        >
          {days.map((d, di) => (
            <div key={d} className="flex flex-col">
              <p
                className="text-[8px] text-center mb-1"
                style={{ color: di === 1 ? '#fff' : '#555' }}
              >
                {d}
              </p>
              <div
                className="flex-1 relative"
                style={{
                  display: 'grid',
                  gridTemplateRows: `repeat(${hours.length}, 1fr)`,
                }}
              >
                {hours.map((_, hi) => (
                  <div key={hi} className="border-t border-neutral-900" />
                ))}
                {events
                  .filter((e) => e.day === di)
                  .map((e, ei) => (
                    <div
                      key={ei}
                      className="absolute left-0.5 right-0.5 rounded px-1 py-0.5 overflow-hidden"
                      style={{
                        top: `${e.start * (100 / hours.length)}%`,
                        height: `${e.dur * (100 / hours.length)}%`,
                        backgroundColor: e.gold
                          ? GOLD + '25'
                          : e.task
                            ? '#1e3a2a'
                            : '#1f1f1f',
                        borderLeft: `2px solid ${e.gold ? GOLD : e.task ? '#4ade80' : '#333'}`,
                      }}
                    >
                      <p
                        className="text-[7px] leading-tight"
                        style={{
                          color: e.gold ? GOLD : e.task ? '#4ade80' : '#aaa',
                        }}
                      >
                        {e.label}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const STEPS: {
  label: string;
  desc: string;
  activePath: 'home' | 'calendar' | 'cards' | 'tasks' | 'meetings';
  Body: React.FC;
  urlPath: string;
}[] = [
  {
    label: 'Your command center',
    desc: 'One view. Your meetings, overdue tasks, your digital card — everything at a glance, every morning.',
    activePath: 'home',
    Body: HomeBody,
    urlPath: 'app.crelyzor.app/home',
  },
  {
    label: 'Meetings that remember',
    desc: 'Every meeting transcribed, summarized, and turned into action items. Automatically.',
    activePath: 'meetings',
    Body: MeetingBody,
    urlPath: 'app.crelyzor.app/meetings/ethics-ai',
  },
  {
    label: 'Tasks, the way you think',
    desc: 'Kanban board, list view, natural language input. AI extracts tasks from meetings automatically.',
    activePath: 'tasks',
    Body: TasksBody,
    urlPath: 'app.crelyzor.app/tasks',
  },
  {
    label: 'Your whole week, one view',
    desc: 'Meetings, GCal events, and tasks with due dates — all on one calendar. Drag to reschedule.',
    activePath: 'calendar',
    Body: CalendarBody,
    urlPath: 'app.crelyzor.app/calendar',
  },
  {
    label: 'Your identity, everywhere',
    desc: "One digital card. Shareable link, QR code, connected to everyone you've ever met.",
    activePath: 'cards',
    Body: CardBody,
    urlPath: 'app.crelyzor.app/cards',
  },
];

export function Hero() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setActiveStep(
      Math.min(STEPS.length - 1, Math.floor(latest * STEPS.length))
    );
  });

  const ActiveNavPath = STEPS[activeStep].activePath;
  const ActiveBody = STEPS[activeStep].Body;

  return (
    <section className="bg-background">
      {/* Hero text */}
      <div className="relative pt-24 pb-14 px-4 sm:pt-32 sm:pb-20 sm:px-8 overflow-hidden bg-background">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at top, #d4af6108 0%, transparent 70%)',
          }}
        />
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 text-xs text-neutral-500 mb-8"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: GOLD }}
            />
            Early access — limited spots
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-semibold text-[var(--foreground)] leading-[1.04] tracking-tight mb-6"
            style={{ fontSize: 'clamp(48px, 7vw, 88px)' }}
          >
            Your meetings
            <br />
            remember <span style={{ color: GOLD }}>everything.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="flex flex-col sm:flex-row sm:items-end gap-6"
          >
            <p className="text-[var(--muted-foreground)] text-lg leading-relaxed max-w-sm">
              Cards, scheduling, AI transcription, tasks — one tool for your
              identity and your work.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={`${APP_URL}/signin`}
                className="px-6 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-90 shrink-0"
                style={{ backgroundColor: GOLD, color: '#0a0a0a' }}
              >
                Get started free
              </a>
              <Link
                href="/pricing"
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-sm transition-colors shrink-0"
              >
                See pricing →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Product walkthrough */}
      <div id="product">
        {/* Mobile: tap-to-switch */}
        <div className="md:hidden px-4 pt-2 pb-16">
          <div className="flex gap-2 mb-5">
            {STEPS.map((step, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className="flex-1 py-2 rounded-lg border text-[10px] font-medium tracking-wide transition-all"
                style={{
                  borderColor: activeStep === i ? `${GOLD}60` : '#2a2a2a',
                  backgroundColor:
                    activeStep === i ? `${GOLD}12` : 'transparent',
                  color: activeStep === i ? GOLD : '#555',
                }}
              >
                {STEPS[i].label.split(' ').slice(0, 2).join(' ')}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`mob-step-${activeStep}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="mb-5"
            >
              <div
                className="w-1.5 h-1.5 rounded-full mb-2"
                style={{ backgroundColor: GOLD }}
              />
              <h3 className="text-[var(--foreground)] font-semibold text-lg leading-tight mb-1">
                {STEPS[activeStep].label}
              </h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                {STEPS[activeStep].desc}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="overflow-x-auto -mx-4 px-4">
            <div
              className="rounded-2xl overflow-hidden border border-neutral-800"
              style={{
                minWidth: '400px',
                boxShadow:
                  '0 24px 60px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.4)',
              }}
            >
              <div
                className="flex items-center gap-3 px-4 py-2.5 border-b border-neutral-800"
                style={{ backgroundColor: '#111' }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                </div>
                <div className="flex-1 flex justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`mob-url-${activeStep}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-1.5 bg-neutral-800 rounded-md px-3 py-1 text-[10px] text-neutral-500"
                    >
                      <div className="w-1.5 h-1.5 rounded-full border border-neutral-600 shrink-0" />
                      {STEPS[activeStep].urlPath}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`mob-nav-${STEPS[activeStep].activePath}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MockNavbar activePath={STEPS[activeStep].activePath} />
                </motion.div>
              </AnimatePresence>
              <div style={{ height: '380px', overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`mob-body-${activeStep}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="h-full"
                  >
                    <ActiveBody />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: activeStep === i ? '20px' : '6px',
                  height: '6px',
                  backgroundColor: activeStep === i ? GOLD : '#2a2a2a',
                }}
              />
            ))}
          </div>
        </div>

        {/* Desktop: scroll-driven */}
        <div
          ref={scrollRef}
          className="relative hidden md:block"
          style={{ height: '500vh' }}
        >
          <div className="sticky top-0 h-screen flex items-center overflow-hidden">
            <div className="max-w-6xl mx-auto w-full px-8">
              <div className="grid grid-cols-5 gap-16 items-center">
                {/* Left: steps */}
                <div className="col-span-2 space-y-8">
                  {STEPS.map((step, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: activeStep === i ? 1 : 0.2 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full mb-3 transition-colors duration-300"
                        style={{
                          backgroundColor: activeStep === i ? GOLD : '#2a2a2a',
                        }}
                      />
                      <h3 className="text-[var(--foreground)] font-semibold text-xl mb-2 leading-tight">
                        {step.label}
                      </h3>
                      <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </motion.div>
                  ))}
                  <p className="text-[var(--muted-foreground)] text-[10px] tracking-widest uppercase opacity-30">
                    scroll to explore
                  </p>
                </div>

                {/* Right: browser frame */}
                <div className="col-span-3">
                  <div
                    className="rounded-2xl overflow-hidden border border-neutral-800"
                    style={{
                      boxShadow:
                        '0 40px 100px rgba(0,0,0,0.8), 0 8px 32px rgba(0,0,0,0.5)',
                    }}
                  >
                    <div
                      className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800 shrink-0"
                      style={{ backgroundColor: '#111' }}
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-neutral-700" />
                        <div className="w-3 h-3 rounded-full bg-neutral-700" />
                        <div className="w-3 h-3 rounded-full bg-neutral-700" />
                      </div>
                      <div className="flex-1 flex justify-center">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeStep}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2 bg-neutral-800 rounded-md px-3 py-1 text-[11px] text-neutral-500"
                            style={{ minWidth: '180px' }}
                          >
                            <div className="w-2 h-2 rounded-full border border-neutral-600 shrink-0" />
                            {STEPS[activeStep].urlPath}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`nav-${ActiveNavPath}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <MockNavbar activePath={ActiveNavPath} />
                      </motion.div>
                    </AnimatePresence>

                    <div style={{ height: '420px', overflow: 'hidden' }}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeStep}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.25, 0.1, 0.25, 1],
                          }}
                          className="h-full"
                        >
                          <ActiveBody />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-5">
                    {STEPS.map((_, i) => (
                      <div
                        key={i}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: activeStep === i ? '20px' : '6px',
                          height: '6px',
                          backgroundColor:
                            activeStep === i ? GOLD : 'var(--border)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
