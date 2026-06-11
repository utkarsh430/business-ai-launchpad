'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Mic, Languages, Sparkles, Inbox, Upload, FileText,
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
 * Meeting tab — upload, transcript, summary
 * ================================================================== */
function MeetingTab() {
  return (
    <div className="space-y-6">
      {/* Upload meeting file */}
      <Card>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#111' }}>
          <Upload size={15} style={{ color: RED }} /> Upload meeting file
        </h3>
        <div className="rounded border-2 border-dashed p-6 flex flex-col items-center text-center" style={{ borderColor: '#d4d4d4', background: '#fafafa' }}>
          <FileText size={28} style={{ color: RED }} />
          <p className="text-sm font-medium mt-2" style={{ color: '#111' }}>operations-review-meeting.mp3</p>
          <p className="text-xs mt-0.5" style={{ color: '#888' }}>Attached meeting file · ready to process</p>
          <label className="mt-3 px-4 py-2 rounded text-xs font-semibold text-white cursor-pointer" style={{ background: RED }}>
            Choose meeting file
            <input type="file" className="hidden" aria-label="Upload meeting file" />
          </label>
        </div>
        <p className="text-xs mt-2" style={{ color: '#888' }}>Simulated upload — no real file is processed.</p>
      </Card>

      {/* Transcript */}
      <Card>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#111' }}>Transcript</h3>
        <div className="space-y-2">
          {EMAIL_MEETING.fullTranscript.map((l, i) => (
            <div key={i} className="flex gap-2 text-xs">
              <span className="shrink-0 font-mono" style={{ color: '#bbb', width: 42 }}>{l.time}</span>
              <span className="shrink-0 font-semibold" style={{ color: RED, width: 56 }}>{l.speaker}</span>
              <span style={{ color: '#555' }}>{l.text}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary */}
      <Card>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#111' }}>Summary</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <SummaryBlock title="Key discussion points" items={EMAIL_MEETING.meetingSummary.keyPoints} color="#111" />
          <SummaryBlock title="Decisions made" items={EMAIL_MEETING.meetingSummary.decisions} color="#00875a" />
          <SummaryBlock title="Risks identified" items={EMAIL_MEETING.meetingSummary.risks} color={RED} />
          <SummaryBlock title="Opportunities" items={EMAIL_MEETING.meetingSummary.opportunities} color="#1d4ed8" />
        </div>
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
