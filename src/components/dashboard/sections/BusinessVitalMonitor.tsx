'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Activity, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { SectionHeader } from '../../shared/SectionHeader';
import { VITALS, VITAL_INSIGHT, VITAL_ACTIONS, type VitalLevel } from '@/src/data/strategy-modules';

const LEVEL = {
  critical: { color: '#db0011', bg: '#fef2f2', border: '#fecaca', label: 'Critical' },
  warning: { color: '#d97706', bg: '#fff7ed', border: '#fed7aa', label: 'Warning' },
  healthy: { color: '#00875a', bg: '#f0fdf4', border: '#bbf7d0', label: 'Healthy' },
} as const;

function HeartbeatLine({ color, height = 28, reduce }: { color: string; height?: number; reduce: boolean | null }) {
  const path = 'M0 14 L18 14 L24 4 L30 24 L36 14 L54 14 L60 8 L66 20 L72 14 L120 14';
  return (
    <svg viewBox="0 0 120 28" width="100%" height={height} preserveAspectRatio="none">
      <path d={path} fill="none" stroke={`${color}33`} strokeWidth={1.5} />
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={240}
        initial={{ strokeDashoffset: 240 }}
        animate={reduce ? { strokeDashoffset: 0 } : { strokeDashoffset: [240, 0, -240] }}
        transition={reduce ? { duration: 0 } : { duration: 2.6, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  );
}

export function BusinessVitalMonitor() {
  const reduce = useReducedMotion();

  const counts = VITALS.reduce(
    (acc, v) => { acc[v.level] += 1; return acc; },
    { critical: 0, warning: 0, healthy: 0 } as Record<VitalLevel, number>,
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Business Vital Monitor™"
        subtitle="A live-style health monitor showing which parts of the business are healthy, which need watching, and which need attention."
        provenance="simulated"
      />

      <p className="text-xs" style={{ color: '#888' }}>
        Simulated prototype monitor using illustrative BrightCart demo data.
      </p>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4">
        {([
          { level: 'critical' as const, count: counts.critical, Icon: AlertCircle },
          { level: 'warning' as const, count: counts.warning, Icon: AlertTriangle },
          { level: 'healthy' as const, count: counts.healthy, Icon: CheckCircle },
        ]).map(({ level, count, Icon }) => {
          const cfg = LEVEL[level];
          return (
            <motion.div
              key={level}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded border p-4 flex items-center gap-3"
              style={{ background: cfg.bg, borderColor: cfg.border }}
            >
              <Icon size={22} style={{ color: cfg.color }} />
              <div>
                <p className="text-2xl font-bold leading-none" style={{ color: cfg.color }}>{count}</p>
                <p className="text-xs font-medium mt-1" style={{ color: cfg.color }}>{cfg.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Heartbeat divider */}
      <div className="bg-white rounded border px-4 py-2 flex items-center gap-3" style={{ borderColor: '#e2e2e2' }}>
        <Activity size={16} style={{ color: '#db0011' }} />
        <div className="flex-1">
          <HeartbeatLine color="#db0011" reduce={reduce} />
        </div>
        <span className="text-xs font-medium shrink-0" style={{ color: '#888' }}>Live-style monitor</span>
      </div>

      {/* Vital cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {VITALS.map((v, i) => {
          const cfg = LEVEL[v.level];
          return (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded border overflow-hidden"
              style={{ borderColor: '#e2e2e2', borderLeft: `3px solid ${cfg.color}` }}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold" style={{ color: '#111' }}>{v.label}</h3>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded shrink-0"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                </div>
                <div className="mb-2" style={{ opacity: 0.9 }}>
                  <HeartbeatLine color={cfg.color} height={22} reduce={reduce} />
                </div>
                <p className="text-lg font-bold leading-tight" style={{ color: cfg.color }}>{v.position}</p>
                <p className="text-xs mt-0.5" style={{ color: '#666' }}>{v.status}</p>
                <div className="mt-3 pt-2 flex justify-between text-xs" style={{ borderTop: '1px solid #f0f0f0' }}>
                  <span style={{ color: '#888' }}>{v.metaLabel}</span>
                  <span className="font-semibold" style={{ color: '#111' }}>{v.metaValue}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Insight */}
      <div className="rounded border p-5" style={{ background: '#0b1f33', borderColor: '#0b1f33' }}>
        <div className="flex items-center gap-2 mb-2">
          <Activity size={16} style={{ color: '#ff5a6a' }} />
          <h3 className="text-base font-bold text-white">AI Insight</h3>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)' }}>{VITAL_INSIGHT}</p>
      </div>

      {/* Recommended actions */}
      <div className="grid lg:grid-cols-3 gap-4">
        {([
          { title: 'High Priority', items: VITAL_ACTIONS.high, color: '#db0011', bg: '#fef2f2', border: '#fecaca' },
          { title: 'Medium Priority', items: VITAL_ACTIONS.medium, color: '#d97706', bg: '#fff7ed', border: '#fed7aa' },
          { title: 'Monitoring', items: VITAL_ACTIONS.monitoring, color: '#0f766e', bg: '#f0fdfa', border: '#99f6e4' },
        ]).map((group) => (
          <div key={group.title} className="bg-white rounded border p-4" style={{ borderColor: '#e2e2e2' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full" style={{ background: group.color }} />
              <h4 className="text-sm font-semibold" style={{ color: '#111' }}>{group.title}</h4>
            </div>
            <ul className="space-y-2">
              {group.items.map((item) => (
                <li key={item} className="text-xs flex items-start gap-2 rounded p-2" style={{ background: group.bg }}>
                  <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: group.color }} />
                  <span style={{ color: '#444' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
