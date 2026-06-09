'use client';

import { motion } from 'framer-motion';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';
import { SectionHeader } from '../../shared/SectionHeader';
import { BRIGHTCART } from '@/src/data/brightcart';
import { formatCurrency } from '@/src/lib/formatters';

const { competitiveness } = BRIGHTCART;

function BenchmarkBar({
  value,
  median,
  topQ,
  max,
  lowerIsBetter,
  unit,
}: {
  value: number;
  median: number;
  topQ?: number | null;
  max: number;
  lowerIsBetter?: boolean;
  unit: string;
}) {
  const pct = (v: number) => Math.min(100, (v / max) * 100);
  const isAboveMedian = lowerIsBetter ? value <= median : value >= median;

  return (
    <div className="relative h-7 rounded" style={{ background: '#f4f4f4' }}>
      {/* Company bar */}
      <motion.div
        className="absolute top-0 bottom-0 rounded"
        style={{
          width: `${pct(value)}%`,
          background: isAboveMedian ? 'rgba(0,135,90,0.15)' : 'rgba(219,0,17,0.12)',
        }}
        initial={{ width: 0 }}
        animate={{ width: `${pct(value)}%` }}
        transition={{ duration: 0.8 }}
      />
      {/* Median marker */}
      <div
        className="absolute top-0 bottom-0 w-0.5"
        style={{ left: `${pct(median)}%`, background: '#888' }}
        title={`Peer median: ${median}${unit}`}
      />
      {/* Top Q marker */}
      {topQ && (
        <div
          className="absolute top-0 bottom-0 w-0.5"
          style={{ left: `${pct(topQ)}%`, background: '#1d4ed8' }}
          title={`Top quartile: ${topQ}${unit}`}
        />
      )}
      {/* Company dot */}
      <motion.div
        className="absolute top-1 bottom-1 w-1.5 rounded-full"
        style={{
          left: `calc(${pct(value)}% - 3px)`,
          background: isAboveMedian ? '#00875a' : '#db0011',
        }}
        initial={{ left: 0 }}
        animate={{ left: `calc(${pct(value)}% - 3px)` }}
        transition={{ duration: 0.8 }}
      />
    </div>
  );
}

export function Competitiveness() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Competitiveness Engine"
        subtitle="BrightCart vs illustrative sector peers · Prototype benchmarks only"
        provenance="illustrative-benchmark"
      />

      {/* Percentile banner */}
      <div
        className="rounded border p-4 flex items-center gap-4"
        style={{ borderColor: '#e2e2e2', background: 'white' }}
      >
        <div
          className="text-4xl font-bold shrink-0"
          style={{ color: '#d97706' }}
        >
          42nd
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: '#111' }}>
            Overall competitive position
          </p>
          <p className="text-xs" style={{ color: '#888' }}>
            {competitiveness.insight}
          </p>
        </div>
        <ProvenanceBadge type="illustrative-benchmark" className="ml-auto shrink-0" />
      </div>

      {/* Metrics */}
      <div className="space-y-4">
        {competitiveness.metrics.map((m, i) => {
          const isAbove =
            m.status === 'Above median';
          const statusColor =
            m.status === 'Above median'
              ? '#00875a'
              : m.status === 'Needs attention'
              ? '#db0011'
              : '#d97706';
          const max =
            m.id === 'inventory-turnover'
              ? 10
              : m.id === 'stockout-rate'
              ? 15
              : m.id === 'return-rate'
              ? 18
              : m.id === 'revenue-per-employee'
              ? 200_000
              : m.id === 'order-processing'
              ? 6
              : m.id === 'digital-maturity'
              ? 100
              : 40;
          const displayValue =
            m.id === 'revenue-per-employee'
              ? formatCurrency(m.value)
              : m.id === 'energy-intensity'
              ? `${m.value}%`
              : `${m.value}${m.unit}`;
          const displayMedian =
            m.id === 'revenue-per-employee'
              ? formatCurrency(m.median)
              : m.id === 'energy-intensity'
              ? 'Sector median'
              : `${m.median}${m.unit}`;

          return (
            <motion.div
              key={m.id}
              className="bg-white rounded border p-5"
              style={{ borderColor: '#e2e2e2' }}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="flex flex-wrap items-start gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold" style={{ color: '#111' }}>
                      {m.label}
                    </h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded font-medium"
                      style={{
                        background: isAbove ? '#f0fdf4' : m.status === 'Needs attention' ? '#fff0f0' : '#fff7ed',
                        color: statusColor,
                      }}
                    >
                      {m.status}
                    </span>
                    <ProvenanceBadge type="illustrative-benchmark" />
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right shrink-0">
                  <div>
                    <div className="text-xl font-bold" style={{ color: statusColor }}>
                      {displayValue}
                    </div>
                    <div className="text-xs" style={{ color: '#888' }}>
                      BrightCart
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#888' }}>
                      {displayMedian}
                    </div>
                    <div className="text-xs" style={{ color: '#bbb' }}>
                      Peer median
                    </div>
                  </div>
                  {m.topQ && (
                    <div>
                      <div className="text-sm font-medium" style={{ color: '#1d4ed8' }}>
                        {m.id === 'revenue-per-employee' ? formatCurrency(m.topQ) : `${m.topQ}${m.unit}`}
                      </div>
                      <div className="text-xs" style={{ color: '#bbb' }}>
                        Top quartile
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {m.id !== 'energy-intensity' && (
                <div className="mb-3">
                  <BenchmarkBar
                    value={m.value}
                    median={m.median}
                    topQ={m.topQ}
                    max={max}
                    lowerIsBetter={m.lowerIsBetter}
                    unit={m.unit}
                  />
                  <div className="flex justify-between mt-1 text-xs" style={{ color: '#bbb' }}>
                    <span>0</span>
                    <span
                      style={{ marginLeft: `${(m.median / max) * 100}%`, transform: 'translateX(-50%)' }}
                    >
                      Median
                    </span>
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-3 mt-2">
                <div
                  className="text-xs p-2 rounded"
                  style={{ background: '#f9f9f9', color: '#555' }}
                >
                  <span className="font-medium">Impact: </span>
                  {m.implication}
                </div>
                <div
                  className="text-xs p-2 rounded"
                  style={{ background: '#f9f9f9', color: '#555' }}
                >
                  <span className="font-medium">Response: </span>
                  {m.response}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div
        className="rounded border p-3 text-xs"
        style={{ borderColor: '#fed7aa', background: '#fff7ed', color: '#7c2d12' }}
      >
        All peer benchmarks are illustrative prototype values created to demonstrate comparison
        functionality. They do not represent real market data or HSBC research.
      </div>
    </div>
  );
}
