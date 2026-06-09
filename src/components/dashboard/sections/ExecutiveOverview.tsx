'use client';

import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { ReadinessRing } from '../../charts/ReadinessRing';
import { JourneyRail } from '../../motion/JourneyRail';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';
import { BRIGHTCART } from '@/src/data/brightcart';

const { readiness, competitiveness, opportunities } = BRIGHTCART;

export function ExecutiveOverview() {
  const topOpp = opportunities[0]!;

  return (
    <div className="space-y-6">
      {/* Top command row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'AI Readiness',
            value: `${readiness.overall}/100`,
            sub: readiness.label,
            accent: true,
            prov: 'simulated' as const,
          },
          {
            label: 'Competitive Position',
            value: `${competitiveness.overallPercentile}th percentile`,
            sub: 'vs illustrative peers',
            prov: 'illustrative-benchmark' as const,
          },
          {
            label: 'Est. Annual Net Value',
            value: '£42,000',
            sub: 'Demand optimisation pilot',
            prov: 'estimated' as const,
          },
          {
            label: 'Implementation Timeline',
            value: '90 days',
            sub: 'Demand pilot roadmap',
            prov: 'pilot-target' as const,
          },
        ].map((m) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded border p-4"
            style={{ borderColor: m.accent ? '#db0011' : '#e2e2e2', borderLeftWidth: m.accent ? 3 : 1 }}
          >
            <div className="flex items-start justify-between mb-1">
              <p className="text-xs uppercase tracking-wide font-medium" style={{ color: '#888' }}>
                {m.label}
              </p>
              <ProvenanceBadge type={m.prov} />
            </div>
            <p className="text-2xl font-bold" style={{ color: m.accent ? '#db0011' : '#111' }}>
              {m.value}
            </p>
            <p className="text-xs mt-1" style={{ color: '#888' }}>
              {m.sub}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Readiness Ring */}
        <div className="bg-white rounded border p-6" style={{ borderColor: '#e2e2e2' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: '#111' }}>
              AI Readiness Passport
            </h3>
            <ProvenanceBadge type="simulated" />
          </div>
          <div className="flex flex-col items-center mb-4">
            <ReadinessRing
              score={readiness.overall}
              size={160}
              sublabel={readiness.label}
            />
          </div>
          <div className="space-y-2 mt-2">
            {readiness.dimensions.map((d) => (
              <div key={d.id} className="flex items-center gap-2">
                <span className="text-xs w-32 truncate" style={{ color: '#555' }}>
                  {d.label}
                </span>
                <div className="flex-1 h-1.5 rounded-full" style={{ background: '#f0f0f0' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: d.score >= 70 ? '#00875a' : d.score >= 55 ? '#d97706' : '#db0011',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${d.score}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
                <span className="text-xs font-medium w-6 text-right" style={{ color: '#111' }}>
                  {d.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top opportunity */}
        <div className="bg-white rounded border p-6" style={{ borderColor: '#e2e2e2' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: '#111' }}>
              Priority Opportunity
            </h3>
            <ProvenanceBadge type="estimated" />
          </div>
          <div
            className="rounded p-4 mb-4"
            style={{ background: '#f9f9f9', borderLeft: '3px solid #db0011' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#db0011' }}>
              Score {topOpp.score}/100
            </p>
            <h4 className="font-bold text-base mb-2" style={{ color: '#111' }}>
              {topOpp.title}
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: '#555' }}>
              {topOpp.reason}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded" style={{ background: '#f0fdf4' }}>
              <div className="text-lg font-bold" style={{ color: '#00875a' }}>
                £42–58k
              </div>
              <div className="text-xs" style={{ color: '#166534' }}>
                Est. annual value
              </div>
            </div>
            <div className="p-3 rounded" style={{ background: '#eff6ff' }}>
              <div className="text-lg font-bold" style={{ color: '#1e40af' }}>
                8–12 wks
              </div>
              <div className="text-xs" style={{ color: '#1e40af' }}>
                Time to value
              </div>
            </div>
            <div className="p-3 rounded" style={{ background: '#fff7ed' }}>
              <div className="text-lg font-bold" style={{ color: '#d97706' }}>
                £8,000
              </div>
              <div className="text-xs" style={{ color: '#9a3412' }}>
                Funding match
              </div>
            </div>
            <div className="p-3 rounded" style={{ background: '#f4f4f4' }}>
              <div className="text-lg font-bold" style={{ color: '#111' }}>
                £15,000
              </div>
              <div className="text-xs" style={{ color: '#555' }}>
                Financing need
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Blockers */}
        <div className="bg-white rounded border p-6 space-y-4" style={{ borderColor: '#e2e2e2' }}>
          <div>
            <h3 className="font-semibold mb-3" style={{ color: '#111' }}>
              Key Strengths
            </h3>
            <ul className="space-y-2">
              {readiness.strengths.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <CheckCircle size={13} className="mt-0.5 shrink-0" style={{ color: '#00875a' }} />
                  <span className="text-sm" style={{ color: '#444' }}>
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
            <h3 className="font-semibold mb-3" style={{ color: '#111' }}>
              Key Blockers
            </h3>
            <ul className="space-y-2">
              {readiness.blockers.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <AlertTriangle size={13} className="mt-0.5 shrink-0" style={{ color: '#d97706' }} />
                  <span className="text-sm" style={{ color: '#444' }}>
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="rounded p-3 mt-2"
            style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
          >
            <p className="text-xs font-semibold mb-1" style={{ color: '#1e40af' }}>
              Recommended Next Action
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#1e40af' }}>
              Validate supplier lead-time data and begin a controlled demand-optimisation pilot.
            </p>
          </div>
        </div>
      </div>

      {/* Journey Rail */}
      <div className="bg-white rounded border p-6" style={{ borderColor: '#e2e2e2' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold" style={{ color: '#111' }}>
            Transformation Journey
          </h3>
          <span className="text-xs" style={{ color: '#888' }}>
            BrightCart current stage: Pilot
          </span>
        </div>
        <JourneyRail activeStage="pilot" />
      </div>

      {/* Financing summary */}
      <div className="bg-white rounded border p-6" style={{ borderColor: '#e2e2e2' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: '#111' }}>
            Financing Summary
          </h3>
          <ProvenanceBadge type="estimated" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Project Cost', value: '£28,000', color: '#111' },
            { label: 'Funding Match', value: '£8,000', color: '#00875a' },
            { label: 'SME Contribution', value: '£5,000', color: '#d97706' },
            { label: 'Financing Required', value: '£15,000', color: '#db0011' },
          ].map((f) => (
            <div key={f.label} className="text-center">
              <div className="text-2xl font-bold" style={{ color: f.color }}>
                {f.value}
              </div>
              <div className="text-xs mt-1" style={{ color: '#888' }}>
                {f.label}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 flex items-center gap-2" style={{ borderTop: '1px solid #f0f0f0' }}>
          <ArrowRight size={14} style={{ color: '#db0011' }} />
          <p className="text-xs" style={{ color: '#555' }}>
            Base-case payback: <strong style={{ color: '#111' }}>8 months</strong> · 3-year estimated net benefit:{' '}
            <strong style={{ color: '#111' }}>£98,000</strong> · All figures estimated
          </p>
        </div>
      </div>

      {/* Responsible AI summary */}
      <div
        className="rounded border p-5 flex items-center justify-between gap-4"
        style={{ borderColor: '#bbf7d0', background: '#f0fdf4' }}
      >
        <div className="flex items-center gap-3">
          <CheckCircle size={20} style={{ color: '#00875a' }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: '#166534' }}>
              Responsible AI Risk: Low operational risk
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#166534', opacity: 0.8 }}>
              Demand optimisation classified as operational decision support · Human approval required · Monthly monitoring
            </p>
          </div>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded" style={{ background: '#bbf7d0', color: '#166534' }}>
          Conditional Approval
        </span>
      </div>

      {/* Data Trust summary */}
      <div
        className="rounded border p-4"
        style={{ borderColor: '#e2e2e2', background: '#fafafa' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#888' }}>
          Data Provenance Summary
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { type: 'simulated' as const, note: 'Company profile, financials' },
            { type: 'illustrative-benchmark' as const, note: 'Peer comparisons' },
            { type: 'estimated' as const, note: 'AI value, cash flow' },
            { type: 'pilot-target' as const, note: 'Impact targets' },
          ].map((p) => (
            <ProvenanceBadge key={p.type} type={p.type} />
          ))}
        </div>
      </div>
    </div>
  );
}
