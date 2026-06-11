'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, FileText, FileCheck, AlertTriangle, CheckCircle, Clock, Upload, RefreshCw,
} from 'lucide-react';
import { SectionHeader } from '../../shared/SectionHeader';
import { POLICY } from '@/src/data/strategy-modules';

const RED = '#db0011';

const IMPACT_COLOR: Record<string, { color: string; bg: string }> = {
  Low: { color: '#00875a', bg: '#f0fdf4' },
  'Low to Medium': { color: '#d97706', bg: '#fff7ed' },
  Medium: { color: '#d97706', bg: '#fff7ed' },
  High: { color: '#db0011', bg: '#fef2f2' },
};

const PRIORITY_COLOR: Record<string, { color: string; bg: string }> = {
  High: { color: '#db0011', bg: '#fef2f2' },
  Medium: { color: '#d97706', bg: '#fff7ed' },
  Low: { color: '#00875a', bg: '#f0fdf4' },
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

export function PolicyMonitor() {
  const [selected, setSelected] = useState(POLICY.updates[0]!.id);
  const [analyzed, setAnalyzed] = useState(false);
  const active = POLICY.updates.find((p) => p.id === selected) ?? POLICY.updates[0]!;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Policy Monitor™"
        subtitle="Understand upcoming policy changes, what they mean for the business, and the practical actions to prepare."
        provenance="simulated"
      />

      <p className="text-xs" style={{ color: '#888' }}>
        Simulated prototype for guidance only — not legal advice.
      </p>

      {/* 1. Regulatory updates dashboard */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#111' }}>Regulatory updates</h3>
        <div className="grid lg:grid-cols-3 gap-4">
          {POLICY.updates.map((p) => {
            const isSel = p.id === selected;
            const impact = IMPACT_COLOR[p.impact]!;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className="text-left bg-white rounded border p-4 transition-all"
                style={{ borderColor: isSel ? RED : '#e2e2e2', borderLeft: `3px solid ${isSel ? RED : '#e2e2e2'}` }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Scale size={16} style={{ color: isSel ? RED : '#888' }} />
                  <span className="text-xs font-medium px-2 py-0.5 rounded shrink-0" style={{ background: impact.bg, color: impact.color }}>
                    {p.impact} impact
                  </span>
                </div>
                <h4 className="text-sm font-semibold mb-1" style={{ color: '#111' }}>{p.title}</h4>
                <p className="text-xs mb-2" style={{ color: '#888' }}>Effective: {p.effective}</p>
                <div className="flex flex-wrap gap-1">
                  {p.areas.map((a) => (
                    <span key={a} className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#f4f4f4', color: '#555' }}>{a}</span>
                  ))}
                </div>
                <p className="text-xs mt-2 font-medium" style={{ color: isSel ? RED : '#888' }}>{p.urgency}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Compliance timeline */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Clock size={15} style={{ color: RED }} />
          <p className="text-sm font-semibold" style={{ color: '#111' }}>Compliance timeline</p>
        </div>
        <div className="relative flex justify-between">
          <div className="absolute left-0 right-0 top-2 h-0.5" style={{ background: '#e2e2e2' }} />
          {POLICY.updates.map((p) => (
            <div key={p.id} className="relative flex flex-col items-center text-center" style={{ width: '32%' }}>
              <span className="w-4 h-4 rounded-full border-2 bg-white z-10" style={{ borderColor: p.id === selected ? RED : '#bbb' }} />
              <p className="text-xs font-semibold mt-2" style={{ color: '#111' }}>{p.effective}</p>
              <p className="text-xs mt-0.5" style={{ color: '#888' }}>{p.title}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* 2. Business impact assessment */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#888' }}>Business impact assessment</p>
        <h3 className="text-base font-bold mb-3" style={{ color: '#111' }}>{active.title}</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: RED }}>What has changed</p>
            <p className="text-sm mb-3" style={{ color: '#555' }}>{active.whatChanged}</p>
            <p className="text-xs font-semibold mb-1" style={{ color: RED }}>Why it matters</p>
            <p className="text-sm" style={{ color: '#555' }}>{active.whyMatters}</p>
          </div>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: RED }}>Areas affected</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {active.affected.map((a) => (
                <span key={a} className="text-xs px-2 py-0.5 rounded" style={{ background: '#f4f4f4', color: '#555' }}>{a}</span>
              ))}
            </div>
            <p className="text-xs font-semibold mb-1" style={{ color: RED }}>Recommended next steps</p>
            <ul className="space-y-1.5">
              {active.nextSteps.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm" style={{ color: '#555' }}>
                  <CheckCircle size={13} className="mt-0.5 shrink-0" style={{ color: '#00875a' }} />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* 3. Compliance action centre */}
      <Card>
        <p className="text-sm font-semibold mb-3" style={{ color: '#111' }}>Compliance action centre</p>
        <div className="space-y-2">
          {POLICY.complianceActions.map((a) => {
            const pri = PRIORITY_COLOR[a.priority]!;
            const st = STATUS_COLOR[a.status]!;
            return (
              <div key={a.task} className="flex flex-wrap items-center justify-between gap-2 rounded border p-3" style={{ borderColor: '#eee' }}>
                <div className="flex items-center gap-2 min-w-0">
                  <FileCheck size={15} className="shrink-0" style={{ color: '#888' }} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#111' }}>{a.task}</p>
                    <p className="text-xs" style={{ color: '#888' }}>{a.owner} · Due: {a.due}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: st.bg, color: st.color }}>{a.status}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: pri.bg, color: pri.color }}>{a.priority}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 4. Legal Document Analyzer */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold" style={{ color: '#111' }}>Legal Document Analyzer™</p>
          <span className="text-xs" style={{ color: '#888' }}>Prototype review, not legal advice</span>
        </div>

        <div className="rounded border-2 border-dashed p-4 flex flex-wrap items-center justify-between gap-3" style={{ borderColor: '#d4d4d4', background: '#fafafa' }}>
          <div className="flex items-center gap-3">
            <FileText size={22} style={{ color: RED }} />
            <div>
              <p className="text-sm font-medium" style={{ color: '#111' }}>{POLICY.document.name}</p>
              <p className="text-xs" style={{ color: '#888' }}>Attached document · ready to analyse</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setAnalyzed(true)}
              className="px-4 py-2 rounded text-xs font-semibold text-white"
              style={{ background: RED }}
            >
              Analyze Document
            </button>
            <button
              onClick={() => setAnalyzed(false)}
              className="px-3 py-2 rounded text-xs font-medium border flex items-center gap-1.5"
              style={{ borderColor: '#e2e2e2', color: '#555' }}
            >
              <RefreshCw size={12} /> Replace File
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {POLICY.document.supportedTypes.map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 rounded flex items-center gap-1" style={{ background: '#f4f4f4', color: '#666' }}>
              <Upload size={10} /> {t}
            </span>
          ))}
        </div>

        <AnimatePresence>
          {analyzed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="grid lg:grid-cols-2 gap-4 mt-4">
                <div className="rounded border p-4" style={{ borderColor: '#eee' }}>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#888' }}>Contract summary</p>
                  <ul className="space-y-2">
                    {POLICY.document.contractSummary.map((c) => (
                      <li key={c.label} className="text-xs flex justify-between gap-3">
                        <span style={{ color: '#888' }}>{c.label}</span>
                        <span className="text-right font-medium" style={{ color: '#111' }}>{c.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded border p-4" style={{ borderColor: '#fecaca', background: '#fef2f2' }}>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9a1c1c' }}>Risk assessment</p>
                  <ul className="space-y-1.5">
                    {POLICY.document.riskAssessment.map((r) => (
                      <li key={r} className="text-xs flex items-start gap-2" style={{ color: '#7f1d1d' }}>
                        <AlertTriangle size={12} className="mt-0.5 shrink-0" style={{ color: RED }} />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded border p-4" style={{ borderColor: '#fed7aa', background: '#fff7ed' }}>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9a3412' }}>Compliance check</p>
                  <ul className="space-y-1.5">
                    {POLICY.document.complianceCheck.map((c) => (
                      <li key={c} className="text-xs flex items-start gap-2" style={{ color: '#7c2d12' }}>
                        <Clock size={12} className="mt-0.5 shrink-0" style={{ color: '#d97706' }} />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded border p-4" style={{ borderColor: '#bbf7d0', background: '#f0fdf4' }}>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#166534' }}>Recommended actions</p>
                  <ol className="space-y-1.5">
                    {POLICY.document.recommendedActions.map((a, i) => (
                      <li key={a} className="text-xs flex items-start gap-2" style={{ color: '#166534' }}>
                        <span className="font-bold shrink-0">{i + 1}.</span>
                        {a}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* 5. AI Compliance Insights */}
      <div className="rounded border p-5" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
        <h3 className="text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>AI Compliance Insights</h3>
        <p className="text-sm leading-relaxed" style={{ color: '#1e40af' }}>{POLICY.aiComplianceInsight}</p>
        <p className="text-xs mt-2" style={{ color: '#6b7280' }}>Illustrative prototype insight.</p>
      </div>
    </div>
  );
}
