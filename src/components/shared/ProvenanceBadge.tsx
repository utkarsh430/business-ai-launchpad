'use client';

import type { DataProvenance } from '@/src/types';

const CONFIG: Record<DataProvenance, { label: string; bg: string; color: string; border: string }> = {
  simulated: { label: 'Simulated', bg: '#eef2ff', color: '#3730a3', border: '#c7d2fe' },
  derived: { label: 'Derived', bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  'illustrative-benchmark': { label: 'Illustrative Benchmark', bg: '#fff7ed', color: '#9a3412', border: '#fed7aa' },
  estimated: { label: 'Estimated', bg: '#fdf4ff', color: '#6b21a8', border: '#e9d5ff' },
  'pilot-target': { label: 'Pilot Target', bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
};

export function ProvenanceBadge({
  type,
  className = '',
}: {
  type: DataProvenance;
  className?: string;
}) {
  const cfg = CONFIG[type];
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded border ${className}`}
      style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}
    >
      {cfg.label}
    </span>
  );
}
