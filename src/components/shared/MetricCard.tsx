'use client';

import { motion } from 'framer-motion';
import type { DataProvenance } from '@/src/types';
import { ProvenanceBadge } from './ProvenanceBadge';

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  provenance?: DataProvenance;
  accent?: boolean;
  large?: boolean;
  className?: string;
}

export function MetricCard({
  label,
  value,
  subValue,
  trend,
  trendLabel,
  provenance,
  accent,
  large,
  className = '',
}: MetricCardProps) {
  const trendColor =
    trend === 'up' ? '#00875a' : trend === 'down' ? '#db0011' : '#888';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-white rounded border p-4 ${accent ? 'border-l-4' : ''} ${className}`}
      style={accent ? { borderLeftColor: '#db0011', borderColor: '#e2e2e2' } : { borderColor: '#e2e2e2' }}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#888' }}>
          {label}
        </p>
        {provenance && <ProvenanceBadge type={provenance} />}
      </div>
      <p
        className={`font-bold leading-none ${large ? 'text-3xl' : 'text-2xl'}`}
        style={{ color: accent ? '#db0011' : '#111' }}
      >
        {value}
      </p>
      {(subValue || trendLabel) && (
        <div className="mt-1.5 flex items-center gap-2">
          {trendLabel && (
            <span className="text-xs font-medium" style={{ color: trendColor }}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendLabel}
            </span>
          )}
          {subValue && (
            <span className="text-xs" style={{ color: '#888' }}>
              {subValue}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
