'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Mail, Mic, Languages, Sparkles, Inbox, Play, Pause, Save, Search, Copy,
  Clock, CheckCircle, ChevronDown, ChevronUp, Users, FolderOpen,
} from 'lucide-react';
import { SectionHeader } from '../../shared/SectionHeader';
import { EMAIL_MEETING } from '@/src/data/strategy-modules';

const RED = '#db0011';
const TONES = ['Professional', 'Formal', 'Friendly', 'Concise', 'Detailed'] as const;

const PRIORITY_COLOR: Record<string, { color: string; bg: string }> = {
  High: { color: '#db0011', bg: '#fef2f2' },
  Medium: { color: '#d97706', bg: '#fff7ed' },
  Low: { color: '#888', bg: '#f4f4f4' },
};

const STATUS_COLOR: Record<string, { color: string; bg: string }> = {
  'Not started': { color: '#888', bg: '#f4f4f4' },
  'In progress': { color: '#1d4ed8', bg: '#eff6ff' },
  Complete: { color: '#00875a', bg: '#f0fdf4' },
};

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded border p-5 ${className}`} style={{ borderColor: '#e2e2e2' }}>
      {children}
    </div>
  );
}

function SummaryBlock({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color }}>{title}</p>
      <ul className="space-y-1.5">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2 text-xs" style={{ color: '#555' }}>
            <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ================================================================== *
 * Email tab
 * ================================================================== */
function EmailTab() {
  const [tone, setTone] = useState<string>('Professional');
  const [selectedEmail, setSelectedEmail] = useState(EMAIL_MEETING.priorityEmails[0]!.id);
  const active = EMAIL_MEETING.priorityEmails.find((e) => e.id === selectedEmail) ?? EMAIL_MEETING.priorityEmails[0]!;

  return (
    <div className="space-y-6">
      {/* 1. Smart Email Summary */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#111' }}>
          <Mail size={15} style={{ color: RED }} /> Smart Email Summary
        </h3>
        <div className="grid lg:grid-cols-2 gap-4">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#888' }}>
              Email thread · Supplier shipment delay
            </p>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {EMAIL_MEETING.emailThread.map((m, i) => (
                <div key={i} className="rounded p-3" style={{ background: '#fafafa' }}>
                  <div className="flex justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold" style={{ color: '#111' }}>{m.sender}</span>
                    <span className="text-xs shrink-0" style={{ color: '#aaa' }}>{m.time}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#555' }}>{m.body}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} style={{ color: RED }} />
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#888' }}>AI-generated summary</p>
            </div>
            <div className="space-y-3">
              <SummaryBlock title="Key discussion points" items={EMAIL_MEETING.emailSummary.keyPoints} color="#111" />
              <SummaryBlock title="Decisions made" items={EMAIL_MEETING.emailSummary.decisions} color="#00875a" />
              <SummaryBlock title="Questions requiring response" items={EMAIL_MEETING.emailSummary.questions} color="#1d4ed8" />
              <SummaryBlock title="Outstanding actions" items={EMAIL_MEETING.emailSummary.actions} color={RED} />
            </div>
          </Card>
        </div>
      </div>

      {/* 2 + 3 row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* AI Translation */}
        <Card>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#111' }}>
            <Languages size={15} style={{ color: RED }} /> AI Translation
          </h3>
          <div className="rounded p-3 mb-2" style={{ background: '#fafafa' }}>
            <p className="text-xs font-medium mb-1" style={{ color: '#888' }}>Original · {EMAIL_MEETING.translation.sourceLanguage} supplier message</p>
            <p className="text-xs italic" style={{ color: '#555' }}>{EMAIL_MEETING.translation.original}</p>
          </div>
          <div className="rounded p-3 mb-3" style={{ background: '#f0fdf4' }}>
            <p className="text-xs font-medium mb-1" style={{ color: '#166534' }}>Translated · English business summary</p>
            <p className="text-xs" style={{ color: '#166534' }}>{EMAIL_MEETING.translation.translatedSummary}</p>
          </div>
          <TranslationResponse />
        </Card>

        {/* Response Generator */}
        <Card>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#111' }}>
            <Sparkles size={15} style={{ color: RED }} /> Response Generator
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className="px-3 py-1.5 text-xs rounded font-medium border transition-all"
                style={{
                  background: tone === t ? RED : 'white',
                  color: tone === t ? 'white' : '#555',
                  borderColor: tone === t ? RED : '#e2e2e2',
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <motion.pre
            key={tone}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs rounded p-3 whitespace-pre-wrap font-sans leading-relaxed"
            style={{ background: '#fafafa', color: '#444' }}
          >
            {EMAIL_MEETING.responseTones[tone]}
          </motion.pre>
        </Card>
      </div>

      {/* 4. Priority Detection */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#111' }}>
          <Inbox size={15} style={{ color: RED }} /> Priority Detection
        </h3>
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded border overflow-hidden" style={{ borderColor: '#e2e2e2' }}>
            {EMAIL_MEETING.priorityEmails.map((e) => {
              const pri = PRIORITY_COLOR[e.priority]!;
              return (
                <button
                  key={e.id}
                  onClick={() => setSelectedEmail(e.id)}
                  className="w-full text-left flex items-center justify-between gap-3 px-4 py-3 transition-colors"
                  style={{ borderBottom: '1px solid #f0f0f0', background: e.id === selectedEmail ? '#fff0f0' : 'white' }}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#111' }}>{e.subject}</p>
                    <p className="text-xs truncate" style={{ color: '#888' }}>{e.preview}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded shrink-0" style={{ background: pri.bg, color: pri.color }}>
                    {e.priority}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="rounded border p-4" style={{ borderColor: active.priority === 'High' ? '#fecaca' : '#e2e2e2', background: active.priority === 'High' ? '#fef2f2' : 'white' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#888' }}>Selected email</p>
            <p className="text-sm font-semibold mb-3" style={{ color: '#111' }}>{active.subject}</p>
            {active.businessImpact ? (
              <>
                <div className="mb-3">
                  <p className="text-xs font-semibold mb-1" style={{ color: RED }}>Business impact</p>
                  <p className="text-xs" style={{ color: '#555' }}>{active.businessImpact}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: RED }}>Recommended action</p>
                  <p className="text-xs" style={{ color: '#555' }}>{active.recommendedAction}</p>
                </div>
              </>
            ) : (
              <p className="text-xs" style={{ color: '#888' }}>No escalation required. Routine handling is sufficient for this {active.priority.toLowerCase()}-priority message.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TranslationResponse() {
  const [shown, setShown] = useState(false);
  return (
    <div>
      <button
        onClick={() => setShown(true)}
        className="px-3 py-1.5 text-xs rounded font-semibold text-white"
        style={{ background: RED }}
      >
        Generate Translated Response
      </button>
      <AnimatePresence>
        {shown && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-xs rounded p-3 mt-3" style={{ background: '#eff6ff', color: '#1e40af' }}
          >
            {EMAIL_MEETING.translation.generatedResponse}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== *
 * Meeting tab
 * ================================================================== */
function ListeningOrb({ active, reduce }: { active: boolean; reduce: boolean | null }) {
  const bars = Array.from({ length: 9 });
  return (
    <div className="relative flex items-center justify-center" style={{ width: 168, height: 168 }}>
      {/* pulsing rings */}
      {active && !reduce && [0, 1].map((i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ width: 96, height: 96, border: `2px solid ${RED}` }}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.7, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 1 }}
        />
      ))}
      {/* core */}
      <motion.div
        className="rounded-full flex items-center justify-center shrink-0"
        style={{ width: 96, height: 96, background: `radial-gradient(circle at 30% 30%, #ff4d5e, ${RED})`, boxShadow: `0 8px 30px ${RED}55` }}
        animate={active && !reduce ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={{ duration: 1.4, repeat: active && !reduce ? Infinity : 0 }}
      >
        {/* waveform */}
        <div className="flex items-end gap-1" style={{ height: 34 }}>
          {bars.map((_, i) => (
            <motion.span
              key={i}
              className="rounded-full"
              style={{ width: 3, background: 'rgba(255,255,255,0.9)' }}
              animate={active && !reduce ? { height: [6, 12 + (i % 4) * 6, 6] } : { height: 6 }}
              transition={{ duration: 0.8 + (i % 3) * 0.2, repeat: active && !reduce ? Infinity : 0, delay: i * 0.06 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function MeetingTab() {
  const reduce = useReducedMotion();
  const [state, setState] = useState<'idle' | 'running' | 'paused' | 'saved'>('idle');
  const [visible, setVisible] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  const transcript = EMAIL_MEETING.meetingTranscript;
  const started = state !== 'idle';

  useEffect(() => {
    if (state !== 'running' || visible >= transcript.length) return;
    const t = setTimeout(() => setVisible((v) => v + 1), 1100);
    return () => clearTimeout(t);
  }, [state, visible, transcript.length]);

  function start() {
    setState('running');
    if (visible === 0) setVisible(1);
  }

  function copyTranscript() {
    const text = EMAIL_MEETING.fullTranscript.map((l) => `[${l.time}] ${l.speaker}: ${l.text}`).join('\n');
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="space-y-6">
      {/* 1. Meeting Capture Simulation */}
      <Card>
        <h3 className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: '#111' }}>
          <Mic size={15} style={{ color: RED }} /> Meeting Capture Simulation
        </h3>
        <p className="text-xs mb-4" style={{ color: '#888' }}>Simulated capture — no real microphone access.</p>

        <div className="flex flex-col items-center">
          <ListeningOrb active={state === 'running'} reduce={reduce} />
          <p className="text-xs mt-2 font-medium" style={{ color: state === 'running' ? RED : '#888' }}>
            {state === 'running' ? 'Listening…' : state === 'paused' ? 'Paused' : state === 'saved' ? 'Meeting saved' : 'Ready'}
          </p>

          <div className="flex gap-2 mt-4">
            <button onClick={start} className="px-4 py-2 rounded text-xs font-semibold text-white flex items-center gap-1.5" style={{ background: RED }}>
              <Play size={12} /> Start Demo Meeting
            </button>
            <button onClick={() => setState('paused')} disabled={state !== 'running'} className="px-4 py-2 rounded text-xs font-medium border flex items-center gap-1.5 disabled:opacity-40" style={{ borderColor: '#e2e2e2', color: '#555' }}>
              <Pause size={12} /> Pause
            </button>
            <button onClick={() => setState('saved')} disabled={!started} className="px-4 py-2 rounded text-xs font-medium border flex items-center gap-1.5 disabled:opacity-40" style={{ borderColor: '#e2e2e2', color: '#555' }}>
              <Save size={12} /> Save Meeting
            </button>
          </div>
        </div>

        {/* live transcript */}
        <div className="mt-5 rounded p-3 min-h-24" style={{ background: '#fafafa' }}>
          {visible === 0 && <p className="text-xs text-center py-4" style={{ color: '#aaa' }}>Start the demo meeting to see the live transcript appear.</p>}
          <div className="space-y-2">
            {transcript.slice(0, visible).map((l, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2">
                <span className="text-xs font-semibold shrink-0" style={{ color: RED, width: 56 }}>{l.speaker}</span>
                <span className="text-xs" style={{ color: '#555' }}>{l.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {/* 2. Speaker Identification */}
      <Card>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#111' }}>
          <Users size={15} style={{ color: RED }} /> Speaker Identification
        </h3>
        <div className="flex flex-wrap gap-3">
          {EMAIL_MEETING.speakers.map((s) => {
            const initials = s.split(' ').map((p) => p[0]).join('');
            return (
              <div key={s} className="flex items-center gap-2 rounded border px-3 py-2" style={{ borderColor: '#e2e2e2' }}>
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: RED }}>{initials}</span>
                <span className="text-sm" style={{ color: '#333' }}>{s}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 3. Meeting Summary */}
      <Card>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#111' }}>Meeting Summary</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <SummaryBlock title="Key discussion points" items={EMAIL_MEETING.meetingSummary.keyPoints} color="#111" />
          <SummaryBlock title="Decisions made" items={EMAIL_MEETING.meetingSummary.decisions} color="#00875a" />
          <SummaryBlock title="Risks identified" items={EMAIL_MEETING.meetingSummary.risks} color={RED} />
          <SummaryBlock title="Opportunities" items={EMAIL_MEETING.meetingSummary.opportunities} color="#1d4ed8" />
        </div>
      </Card>

      {/* 4. Action Item Extraction */}
      <Card>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#111' }}>
          <CheckCircle size={15} style={{ color: RED }} /> Action Items
        </h3>
        <div className="space-y-2">
          {EMAIL_MEETING.actionItems.map((a) => {
            const st = STATUS_COLOR[a.status]!;
            return (
              <div key={a.owner + a.task} className="flex flex-wrap items-center justify-between gap-2 rounded border p-3" style={{ borderColor: '#eee' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#111' }}>{a.task}</p>
                  <p className="text-xs" style={{ color: '#888' }}>{a.owner} · Due: {a.due}</p>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: st.bg, color: st.color }}>{a.status}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 5. Full Transcript */}
      <Card>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold" style={{ color: '#111' }}>Full Transcript</h3>
          <button onClick={() => setShowTranscript((v) => !v)} className="text-xs font-medium flex items-center gap-1" style={{ color: RED }}>
            {showTranscript ? 'Hide' : 'Show'} Full Transcript {showTranscript ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
        <AnimatePresence>
          {showTranscript && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
              <div className="mt-3">
                <div className="flex flex-wrap gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-48 rounded border px-3 py-1.5" style={{ borderColor: '#e2e2e2' }}>
                    <Search size={13} style={{ color: '#888' }} />
                    <input
                      value={query}
                      onChange={(e) => { setQuery(e.target.value); setSearched(false); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') setSearched(true); }}
                      placeholder={EMAIL_MEETING.meetingSearch.placeholder}
                      className="flex-1 text-xs outline-none bg-transparent"
                      style={{ color: '#333' }}
                    />
                    <button onClick={() => setSearched(true)} className="text-xs font-medium" style={{ color: RED }}>Search</button>
                  </div>
                  <button onClick={copyTranscript} className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium" style={{ borderColor: '#e2e2e2', color: '#555' }}>
                    <Copy size={12} /> {copied ? 'Copied' : 'Copy / Export'}
                  </button>
                </div>

                {searched && query.trim() && (
                  <div className="rounded p-3 mb-3 text-xs" style={{ background: '#eff6ff', color: '#1e40af' }}>
                    <span className="font-semibold">AI answer: </span>{EMAIL_MEETING.meetingSearch.answer}
                  </div>
                )}

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {EMAIL_MEETING.fullTranscript.map((l, i) => (
                    <div key={i} className="flex gap-2 text-xs">
                      <span className="shrink-0 font-mono" style={{ color: '#bbb', width: 42 }}>{l.time}</span>
                      <span className="shrink-0 font-semibold" style={{ color: RED, width: 56 }}>{l.speaker}</span>
                      <span style={{ color: '#555' }}>{l.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* 6. Meeting Knowledge Repository */}
      <Card>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#111' }}>
          <FolderOpen size={15} style={{ color: RED }} /> Meeting Knowledge Repository
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {EMAIL_MEETING.savedMeetings.map((m) => (
            <div key={m.title} className="rounded border p-3 flex items-center justify-between gap-2" style={{ borderColor: '#eee' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: '#111' }}>{m.title}</p>
                <p className="text-xs" style={{ color: '#888' }}>{m.date} · {m.duration}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded shrink-0" style={{ background: '#f4f4f4', color: '#555' }}>{m.actions} actions</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 7. Productivity Impact Dashboard */}
      <Card>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#111' }}>
          <Clock size={15} style={{ color: RED }} /> Productivity Impact
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {EMAIL_MEETING.productivity.map((p) => (
            <div key={p.label} className="rounded border p-3 text-center" style={{ borderColor: '#eee' }}>
              <p className="text-2xl font-bold" style={{ color: RED }}>{p.value}</p>
              <p className="text-xs mt-1" style={{ color: '#888' }}>{p.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs rounded p-3" style={{ background: '#fafafa', color: '#555' }}>{EMAIL_MEETING.productivityInsight}</p>
      </Card>
    </div>
  );
}

/* ================================================================== *
 * Main component with tabs
 * ================================================================== */
export function EmailMeetingIntelligence() {
  const [tab, setTab] = useState<'email' | 'meeting'>('email');

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Email & Meeting Intelligence™"
        subtitle="An AI productivity assistant that summarises communications, drafts responses, captures meetings and extracts action items."
        provenance="simulated"
      />

      <p className="text-xs" style={{ color: '#888' }}>
        Simulated prototype — no real email access or meeting recording.
      </p>

      {/* Tabs */}
      <div className="flex gap-2">
        {([['email', 'Email Intelligence™', Mail], ['meeting', 'Meeting Intelligence™', Mic]] as const).map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded font-medium border transition-all"
            style={{
              background: tab === id ? RED : 'white',
              color: tab === id ? 'white' : '#555',
              borderColor: tab === id ? RED : '#e2e2e2',
            }}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'email' ? <EmailTab /> : <MeetingTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
