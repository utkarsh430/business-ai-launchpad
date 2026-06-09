'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../../shared/SectionHeader';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';
import { BRIGHTCART } from '@/src/data/brightcart';
import { calcPaybackMonths } from '@/src/lib/calculations';
import { formatCurrency } from '@/src/lib/formatters';

const { financing } = BRIGHTCART;

type Scenario = 'base' | 'downside' | 'upside';

export function FinancingPlanner() {
  const [scenario, setScenario] = useState<Scenario>('base');

  const scenarioMultipliers = useMemo<Record<Scenario, number>>(
    () => ({ base: 1.0, downside: 0.65, upside: 1.25 }),
    [],
  );

  const adjustedNetBenefit = useMemo(
    () => Math.round(financing.annualNetBenefit * scenarioMultipliers[scenario]),
    [scenario, scenarioMultipliers],
  );

  const paybackMonths = useMemo(
    () => calcPaybackMonths(financing.financingRequirement, financing.projectCost, financing.annualNetBenefit, scenario),
    [scenario],
  );

  const threeYear = useMemo(
    () => Math.round(adjustedNetBenefit * 3 - financing.annualOperatingCost * 3 + financing.potentialIncentive),
    [adjustedNetBenefit],
  );

  const stackItems = [
    { label: 'Potential Incentive', value: financing.potentialIncentive, color: '#00875a', pct: (financing.potentialIncentive / financing.projectCost) * 100 },
    { label: 'SME Contribution', value: financing.smeContribution, color: '#d97706', pct: (financing.smeContribution / financing.projectCost) * 100 },
    { label: 'Financing Required', value: financing.financingRequirement, color: '#db0011', pct: (financing.financingRequirement / financing.projectCost) * 100 },
  ];

  const paybackPct = Math.min(100, (paybackMonths / 18) * 100);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Financing Planner"
        subtitle="Prototype financing case — not financial advice or approval"
        provenance="estimated"
      />

      <div
        className="rounded border p-3 text-xs"
        style={{ background: '#fff7ed', borderColor: '#fed7aa', color: '#7c2d12' }}
      >
        This prototype does not constitute finance approval or financial advice. All figures are estimated and simulated.
      </div>

      {/* Scenario toggle */}
      <div className="flex gap-2">
        {(['base', 'downside', 'upside'] as Scenario[]).map((s) => (
          <button
            key={s}
            onClick={() => setScenario(s)}
            className="px-4 py-2 text-sm rounded font-medium transition-all capitalize"
            style={{
              background: scenario === s ? (s === 'base' ? '#111' : s === 'downside' ? '#d97706' : '#00875a') : '#f4f4f4',
              color: scenario === s ? 'white' : '#555',
              border: '1px solid',
              borderColor: scenario === s ? 'transparent' : '#e2e2e2',
            }}
          >
            {s === 'base' ? 'Base Case' : s === 'downside' ? 'Downside' : 'Upside'}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Capital Stack */}
        <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: '#111' }}>
              Capital Stack
            </p>
            <ProvenanceBadge type="estimated" />
          </div>

          {/* Total */}
          <div className="text-center mb-4">
            <div className="text-3xl font-bold" style={{ color: '#111' }}>
              {formatCurrency(financing.projectCost)}
            </div>
            <div className="text-xs" style={{ color: '#888' }}>Total implementation cost</div>
          </div>

          {/* Animated stack bars */}
          <div className="space-y-3">
            {stackItems.map((item, i) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: '#555' }}>{item.label}</span>
                  <span className="font-medium" style={{ color: item.color }}>
                    {formatCurrency(item.value)}
                  </span>
                </div>
                <div className="h-8 rounded" style={{ background: '#f4f4f4' }}>
                  <motion.div
                    className="h-full rounded flex items-center justify-end pr-2"
                    style={{ background: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ delay: i * 0.15, duration: 0.7 }}
                  >
                    <span className="text-xs text-white font-medium">
                      {Math.round(item.pct)}%
                    </span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payback */}
        <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: '#111' }}>
              Payback Visualisation
            </p>
            <ProvenanceBadge type="estimated" />
          </div>

          <div className="flex items-end gap-2 mb-6">
            <div className="text-4xl font-bold" style={{ color: '#111' }}>
              {paybackMonths}
            </div>
            <div className="text-lg mb-1" style={{ color: '#888' }}>
              months
            </div>
            <div className="ml-2 text-sm" style={{ color: '#888' }}>
              {scenario === 'base' ? 'Base case' : scenario === 'downside' ? 'Downside scenario' : 'Upside scenario'}
            </div>
          </div>

          {/* Timeline bar */}
          <div className="relative mb-4">
            <div className="h-4 rounded-full" style={{ background: '#f0f0f0' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: scenario === 'upside' ? '#00875a' : scenario === 'downside' ? '#d97706' : '#db0011' }}
                initial={{ width: 0 }}
                animate={{ width: `${paybackPct}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1" style={{ color: '#bbb' }}>
              <span>0</span>
              <span>6mo</span>
              <span>12mo</span>
              <span>18mo</span>
            </div>
          </div>

          {/* Benefits breakdown */}
          <div className="space-y-3">
            {[
              { label: 'Annual Gross Benefit', value: formatCurrency(Math.round(financing.annualGrossBenefit * scenarioMultipliers[scenario])), color: '#00875a' },
              { label: 'Annual Operating Cost', value: formatCurrency(financing.annualOperatingCost), color: '#db0011' },
              { label: 'Annual Net Benefit', value: formatCurrency(adjustedNetBenefit), color: '#111', bold: true },
              { label: '3-Year Est. Net Benefit', value: formatCurrency(threeYear), color: '#1d4ed8', bold: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #f4f4f4' }}>
                <span className="text-sm" style={{ color: '#555' }}>{item.label}</span>
                <span className={`text-sm ${item.bold ? 'font-bold' : 'font-medium'}`} style={{ color: item.color }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scenario comparison */}
      <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#111' }}>
          Scenario Comparison
        </p>
        <div className="grid grid-cols-3 gap-4">
          {(['base', 'downside', 'upside'] as Scenario[]).map((s) => {
            const mult = scenarioMultipliers[s];
            const benefit = Math.round(financing.annualNetBenefit * mult);
            const pb = calcPaybackMonths(financing.financingRequirement, financing.projectCost, financing.annualNetBenefit, s);
            return (
              <div
                key={s}
                className="rounded border p-4 text-center"
                style={{
                  borderColor: scenario === s ? '#db0011' : '#e2e2e2',
                  background: scenario === s ? '#fff0f0' : 'white',
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#888' }}>
                  {s === 'base' ? 'Base' : s === 'downside' ? 'Downside' : 'Upside'}
                </p>
                <p className="text-2xl font-bold" style={{ color: '#111' }}>
                  {pb}mo
                </p>
                <p className="text-xs mt-1" style={{ color: '#888' }}>
                  Payback
                </p>
                <p className="text-sm font-medium mt-2" style={{ color: '#00875a' }}>
                  {formatCurrency(benefit)}/yr
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div
        className="rounded border p-5 flex items-center justify-between gap-4"
        style={{ background: '#111', borderColor: '#222' }}
      >
        <div>
          <p className="font-semibold text-white mb-1">
            Prepare for an HSBC implementation and financing discussion
          </p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            This prototype does not constitute finance approval or financial advice. An HSBC Relationship Manager
            can discuss your specific requirements.
          </p>
        </div>
        <button
          className="shrink-0 px-5 py-2.5 rounded text-sm font-semibold text-white"
          style={{ background: '#db0011' }}
          onClick={() => alert('In the live platform, this would connect to your HSBC Relationship Manager.')}
        >
          Start discussion
        </button>
      </div>
    </div>
  );
}
