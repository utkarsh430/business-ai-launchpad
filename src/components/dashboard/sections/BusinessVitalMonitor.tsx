'use client';

import { SectionHeader } from '../../shared/SectionHeader';
import { VITALS, VITAL_INSIGHT, VITAL_ACTIONS, type VitalLevel } from '@/src/data/strategy-modules';

const LEVEL = {
  critical: { color: '#db0011', bg: '#fef2f2', border: '#fecaca', label: 'Critical' },
  warning: { color: '#d97706', bg: '#fff7ed', border: '#fed7aa', label: 'Warning' },
  healthy: { color: '#00875a', bg: '#f0fdf4', border: '#bbf7d0', label: 'Healthy' },
} as const;

export function BusinessVitalMonitor() {
  const counts = VITALS.reduce(
    (acc, v) => { acc[v.level] += 1; return acc; },
    { critical: 0, warning: 0, healthy: 0 } as Record<VitalLevel, number>,
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Business Vital Monitor™"
        subtitle="A simple health check showing which parts of the business are healthy, which need watching, and which need attention."
        provenance="simulated"
      />

      <p className="text-xs" style={{ color: '#888' }}>
        Simulated prototype using illustrative BrightCart demo data.
      </p>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4">
        {([
          { level: 'critical' as const, count: counts.critical },
          { level: 'warning' as const, count: counts.warning },
          { level: 'healthy' as const, count: counts.healthy },
        ]).map(({ level, count }) => {
          const cfg = LEVEL[level];
          return (
            <div key={level} className="rounded border p-4 text-center" style={{ background: cfg.bg, borderColor: cfg.border }}>
              <p className="text-2xl font-bold" style={{ color: cfg.color }}>{count}</p>
              <p className="text-xs font-medium mt-1" style={{ color: cfg.color }}>{cfg.label}</p>
            </div>
          );
        })}
      </div>

      {/* Vital cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {VITALS.map((v) => {
          const cfg = LEVEL[v.level];
          return (
            <div
              key={v.id}
              className="bg-white rounded border p-4"
              style={{ borderColor: '#e2e2e2', borderLeft: `3px solid ${cfg.color}` }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold" style={{ color: '#111' }}>{v.label}</h3>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded shrink-0"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  {cfg.label}
                </span>
              </div>
              <p className="text-base font-bold" style={{ color: cfg.color }}>{v.position}</p>
              <p className="text-xs mt-0.5" style={{ color: '#666' }}>{v.status}</p>
              <div className="mt-3 pt-2 flex justify-between text-xs" style={{ borderTop: '1px solid #f0f0f0' }}>
                <span style={{ color: '#888' }}>{v.metaLabel}</span>
                <span className="font-semibold" style={{ color: '#111' }}>{v.metaValue}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Insight */}
      <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2', borderLeft: '3px solid #db0011' }}>
        <h3 className="text-sm font-semibold mb-2" style={{ color: '#111' }}>AI Insight</h3>
        <p className="text-sm leading-relaxed" style={{ color: '#555' }}>{VITAL_INSIGHT}</p>
      </div>

      {/* Recommended actions */}
      <div className="grid lg:grid-cols-3 gap-4">
        {([
          { title: 'High Priority', items: VITAL_ACTIONS.high, color: '#db0011' },
          { title: 'Medium Priority', items: VITAL_ACTIONS.medium, color: '#d97706' },
          { title: 'Monitoring', items: VITAL_ACTIONS.monitoring, color: '#0f766e' },
        ]).map((group) => (
          <div key={group.title} className="bg-white rounded border p-4" style={{ borderColor: '#e2e2e2' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full" style={{ background: group.color }} />
              <h4 className="text-sm font-semibold" style={{ color: '#111' }}>{group.title}</h4>
            </div>
            <ul className="space-y-2">
              {group.items.map((item) => (
                <li key={item} className="text-xs flex items-start gap-2" style={{ color: '#555' }}>
                  <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: group.color }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
