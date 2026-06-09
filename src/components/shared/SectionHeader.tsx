'use client';

import type { DataProvenance } from '@/src/types';
import { ProvenanceBadge } from './ProvenanceBadge';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  provenance?: DataProvenance;
  action?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, provenance, action }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-xl font-bold" style={{ color: '#111' }}>
            {title}
          </h2>
          {provenance && <ProvenanceBadge type={provenance} />}
        </div>
        {subtitle && (
          <p className="text-sm" style={{ color: '#666' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
