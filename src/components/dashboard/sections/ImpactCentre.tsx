'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from '../../shared/SectionHeader';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';
import { BRIGHTCART } from '@/src/data/brightcart';
import { formatCurrency } from '@/src/lib/formatters';

const { impact } = BRIGHTCART;

function BeforeAfterBar({
  label,
  baseline,
  target,
  format,
  lowerIsBetter = false,
  max,
}: {
  label: string;
  baseline: number;
  target: number;
  format: (v: number) => string;
  lowerIsBetter?: boolean;
  max: number;
}) {
  const isImproved = lowerIsBetter ? target < baseline : target > baseline;
  const improvementColor = '#00875a';
  const change = ((target - baseline) / baseline) * 100;

  return (
    <div className="bg-white rounded border p-4" style={{ borderColor: '#e2e2e2' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium" style={{ color: '#111' }}>
          {label}
        </p>
        <span className="text-xs font-medium" style={{ color: isImproved ? improvementColor : '#db0011' }}>
          {change > 0 ? '+' : ''}{change.toFixed(1)}%
        </span>
      </div>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: '#888' }}>Baseline</span>
            <span style={{ color: '#db0011', fontWeight: 600 }}>{format(baseline)}</span>
          </div>
          <div className="h-3 rounded-full" style={{ background: '#f0f0f0' }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${(baseline / max) * 100}%`, background: '#db0011', opacity: 0.6 }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: '#888' }}>Pilot target</span>
            <span style={{ color: improvementColor, fontWeight: 600 }}>{format(target)}</span>
          </div>
          <div className="h-3 rounded-full" style={{ background: '#f0f0f0' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: improvementColor }}
              initial={{ width: 0 }}
              animate={{ width: `${(target / max) * 100}%` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
      <ProvenanceBadge type="pilot-target" className="mt-3" />
    </div>
  );
}

export function ImpactCentre() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Impact Centre"
        subtitle="Pilot targets and expected outcomes — not realised production results"
        provenance="pilot-target"
      />

      <div
        className="rounded border p-4 text-sm"
        style={{ background: '#eff6ff', borderColor: '#bfdbfe', color: '#1e40af' }}
      >
        All figures on this page are pilot targets — desired future outcomes to guide the 90-day pilot.
        They are not actual or realised results.
      </div>

      {/* Financial impact banner */}
      <div
        className="rounded border p-5 flex flex-wrap items-center gap-6"
        style={{ background: '#111', borderColor: '#222' }}
      >
        {[
          { label: 'Est. Annual Net Benefit', value: formatCurrency(impact.target.annualNetBenefit), color: '#00875a', size: 'text-4xl' },
          { label: 'Energy Reduction Target', value: `${impact.target.energyReduction}%`, color: '#1d4ed8', size: 'text-3xl' },
          { label: 'Employee Adoption Target', value: `${impact.target.employeeAdoption}%`, color: '#d97706', size: 'text-3xl' },
        ].map((m) => (
          <div key={m.label}>
            <motion.div
              className={`font-bold ${m.size}`}
              style={{ color: m.color }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {m.value}
            </motion.div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* Before/After metrics */}
      <div className="grid sm:grid-cols-2 gap-4">
        <BeforeAfterBar
          label="Stockout Rate"
          baseline={impact.baseline.stockoutRate}
          target={impact.target.stockoutRate}
          format={(v) => `${v}%`}
          lowerIsBetter
          max={12}
        />
        <BeforeAfterBar
          label="Inventory Turnover"
          baseline={impact.baseline.inventoryTurnover}
          target={impact.target.inventoryTurnover}
          format={(v) => `${v}x`}
          max={8}
        />
        <BeforeAfterBar
          label="Excess Inventory"
          baseline={impact.baseline.excessInventory}
          target={impact.target.excessInventory}
          format={(v) => formatCurrency(v, true)}
          lowerIsBetter
          max={350_000}
        />
        <BeforeAfterBar
          label="Forecast Error"
          baseline={impact.baseline.forecastError}
          target={impact.target.forecastError}
          format={(v) => `${v}%`}
          lowerIsBetter
          max={45}
        />
      </div>

      {/* Operational & Sustainability */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Baseline stockout rate', value: `${impact.baseline.stockoutRate}%`, target: `${impact.target.stockoutRate}%`, category: 'Operational' },
          { label: 'Baseline inventory turnover', value: `${impact.baseline.inventoryTurnover}x`, target: `${impact.target.inventoryTurnover}x`, category: 'Operational' },
          { label: 'Energy reduction target', value: 'Current', target: `−${impact.target.energyReduction}%`, category: 'Sustainability' },
          { label: 'Carbon reduction', value: 'Baseline', target: '−9.6 tCO₂e/yr', category: 'Sustainability' },
          { label: 'Employee adoption', value: '0%', target: `${impact.target.employeeAdoption}% of operations team`, category: 'Adoption' },
          { label: 'Human override rate', value: 'N/A', target: '<30% with reasons', category: 'Governance' },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded border p-4" style={{ borderColor: '#e2e2e2' }}>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs px-1.5 py-0.5 rounded"
                style={{
                  background:
                    m.category === 'Operational'
                      ? '#eff6ff'
                      : m.category === 'Sustainability'
                      ? '#f0fdf4'
                      : m.category === 'Adoption'
                      ? '#fff7ed'
                      : '#fdf4ff',
                  color:
                    m.category === 'Operational'
                      ? '#1e40af'
                      : m.category === 'Sustainability'
                      ? '#166534'
                      : m.category === 'Adoption'
                      ? '#9a3412'
                      : '#6b21a8',
                }}
              >
                {m.category}
              </span>
            </div>
            <p className="text-xs mb-1" style={{ color: '#888' }}>
              {m.label}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: '#bbb', textDecoration: 'line-through' }}>
                {m.value}
              </span>
              <span className="text-base font-bold" style={{ color: '#00875a' }}>
                → {m.target}
              </span>
            </div>
            <ProvenanceBadge type="pilot-target" className="mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
