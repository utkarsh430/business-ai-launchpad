'use client';

import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  ReferenceLine,
} from 'recharts';
import { AlertTriangle } from 'lucide-react';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';
import { SectionHeader } from '../../shared/SectionHeader';
import { BRIGHTCART } from '@/src/data/brightcart';
import { calcCashPositions, calcFinancingRequirement } from '@/src/lib/calculations';
import { formatCurrency } from '@/src/lib/formatters';

const { cashflow, financing } = BRIGHTCART;

type Scenario = 'base' | 'downside' | 'upside';

const SCENARIO_CONFIG: Record<Scenario, { label: string; revenueAdj: number; costAdj: number; color: string }> = {
  base: { label: 'Base Case', revenueAdj: 0, costAdj: 0, color: '#db0011' },
  downside: { label: 'Downside', revenueAdj: -8, costAdj: 5, color: '#d97706' },
  upside: { label: 'Upside', revenueAdj: 8, costAdj: -3, color: '#00875a' },
};

export function CashFlow() {
  const [revenueChange, setRevenueChange] = useState(0);
  const [supplierCostIncrease, setSupplierCostIncrease] = useState(0);
  const [paymentDelay, setPaymentDelay] = useState(0);
  const [projectCost, setProjectCost] = useState(financing.projectCost);
  const [incentive, setIncentive] = useState(cashflow.potentialIncentive);
  const [smeContribution, setSmeContribution] = useState(cashflow.smeContribution);
  const [scenario, setScenario] = useState<Scenario>('base');

  const scenarioAdj = SCENARIO_CONFIG[scenario];

  const cashPositions = useMemo(
    () =>
      calcCashPositions(
        cashflow.openingCash,
        cashflow.inflows90,
        cashflow.outflows90,
        projectCost,
        incentive,
        smeContribution,
        revenueChange + scenarioAdj.revenueAdj,
        supplierCostIncrease + scenarioAdj.costAdj,
        paymentDelay,
      ),
    [revenueChange, supplierCostIncrease, paymentDelay, projectCost, incentive, smeContribution, scenarioAdj],
  );

  const financingReq = useMemo(
    () => calcFinancingRequirement(projectCost, incentive, smeContribution),
    [projectCost, incentive, smeContribution],
  );

  const waterfallData = [
    { name: 'Opening', value: cashflow.openingCash, fill: '#1d4ed8' },
    { name: 'Inflows', value: Math.round(cashflow.inflows90 * (1 + (revenueChange + scenarioAdj.revenueAdj) / 100)), fill: '#00875a' },
    { name: 'Outflows', value: -Math.round(cashflow.outflows90 * (1 + (supplierCostIncrease + scenarioAdj.costAdj) / 100)), fill: '#db0011' },
    { name: 'AI Cost', value: -(projectCost - incentive - smeContribution), fill: '#d97706' },
    { name: 'Closing', value: cashPositions.day90, fill: '#111' },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Cash-Flow Copilot"
        subtitle="90-day cash visibility with scenario modelling — estimated values"
        provenance="estimated"
      />

      {/* Scenario toggle */}
      <div className="flex gap-2">
        {(Object.entries(SCENARIO_CONFIG) as [Scenario, typeof SCENARIO_CONFIG[Scenario]][]).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setScenario(key)}
            className="px-4 py-2 text-sm rounded font-medium transition-all"
            style={{
              background: scenario === key ? cfg.color : '#f4f4f4',
              color: scenario === key ? 'white' : '#555',
              border: '1px solid',
              borderColor: scenario === key ? cfg.color : '#e2e2e2',
            }}
          >
            {cfg.label}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Opening Cash', value: formatCurrency(cashflow.openingCash), color: '#1d4ed8' },
          { label: 'Day-30 Balance', value: formatCurrency(cashPositions.day30), color: '#111' },
          { label: 'Day-60 Balance', value: formatCurrency(cashPositions.day60), color: '#111' },
          { label: 'Day-90 Balance', value: formatCurrency(cashPositions.day90), color: cashPositions.day90 > 0 ? '#00875a' : '#db0011' },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded border p-4" style={{ borderColor: '#e2e2e2' }}>
            <p className="text-xs uppercase tracking-wide font-medium mb-1" style={{ color: '#888' }}>
              {m.label}
            </p>
            <p className="text-2xl font-bold" style={{ color: m.color }}>
              {m.value}
            </p>
            <ProvenanceBadge type="estimated" className="mt-2" />
          </div>
        ))}
      </div>

      {/* Lowest balance warning */}
      {cashPositions.lowest < 60_000 && (
        <div
          className="flex items-center gap-3 p-4 rounded border"
          style={{ background: '#fff7ed', borderColor: '#fed7aa' }}
        >
          <AlertTriangle size={18} style={{ color: '#d97706' }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: '#92400e' }}>
              Low cash warning — projected minimum: {formatCurrency(cashPositions.lowest)}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#92400e', opacity: 0.8 }}>
              Consider adjusting project timing or increasing SME contribution to maintain a safe buffer.
            </p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: '#111' }}>
              90-Day Cash Position
            </p>
            <ProvenanceBadge type="estimated" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={cashPositions.curve} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: '#aaa' }}
                tickFormatter={(v) => `Day ${v}`}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#aaa' }}
                tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 4, border: '1px solid #e2e2e2' }}
                formatter={(v) => [formatCurrency(Number(v)), 'Balance']}
                labelFormatter={(l) => `Day ${l}`}
              />
              <ReferenceLine y={0} stroke="#db0011" strokeDasharray="4 4" />
              <Area
                type="monotone"
                dataKey="balance"
                stroke={SCENARIO_CONFIG[scenario].color}
                strokeWidth={2}
                fill={SCENARIO_CONFIG[scenario].color + '15'}
                name="Cash balance"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: '#111' }}>
              90-Day Cash Flow Waterfall
            </p>
            <ProvenanceBadge type="estimated" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={waterfallData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#aaa' }} />
              <YAxis
                tick={{ fontSize: 10, fill: '#aaa' }}
                tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 4, border: '1px solid #e2e2e2' }}
                formatter={(v) => [formatCurrency(Math.abs(Number(v))), '']}
              />
              <ReferenceLine y={0} stroke="#e2e2e2" />
              <Bar dataKey="value">
                {waterfallData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Financing indicator */}
      <div
        className="rounded border p-4 flex items-start gap-4"
        style={{ borderColor: '#bfdbfe', background: '#eff6ff' }}
      >
        <div className="flex-1">
          <p className="text-sm font-semibold mb-2" style={{ color: '#1e40af' }}>
            Financing Requirement
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-3xl font-bold" style={{ color: '#1d4ed8' }}>
              {formatCurrency(financingReq)}
            </span>
            <div className="text-xs" style={{ color: '#1e40af' }}>
              = Project cost {formatCurrency(projectCost)} − Incentive {formatCurrency(incentive)} − Contribution {formatCurrency(smeContribution)}
            </div>
          </div>
        </div>
        <ProvenanceBadge type="estimated" />
      </div>

      {/* Controls */}
      <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#111' }}>
          Scenario Controls
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Revenue change (%)', value: revenueChange, min: -15, max: 15, step: 1, set: setRevenueChange },
            { label: 'Supplier cost increase (%)', value: supplierCostIncrease, min: 0, max: 15, step: 1, set: setSupplierCostIncrease },
            { label: 'Payment delay (weeks)', value: paymentDelay, min: 0, max: 8, step: 1, set: setPaymentDelay },
            { label: 'Project cost (£)', value: projectCost, min: 20_000, max: 45_000, step: 1_000, set: setProjectCost },
            { label: 'Incentive support (£)', value: incentive, min: 0, max: 12_000, step: 500, set: setIncentive },
            { label: 'SME contribution (£)', value: smeContribution, min: 0, max: 15_000, step: 500, set: setSmeContribution },
          ].map((ctrl) => (
            <div key={ctrl.label}>
              <label className="text-xs font-medium block mb-1" style={{ color: '#555' }}>
                {ctrl.label}:{' '}
                <strong style={{ color: '#111' }}>
                  {ctrl.label.includes('£')
                    ? formatCurrency(ctrl.value)
                    : ctrl.value}
                </strong>
              </label>
              <input
                type="range"
                min={ctrl.min}
                max={ctrl.max}
                step={ctrl.step}
                value={ctrl.value}
                onChange={(e) => ctrl.set(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: '#db0011' }}
              />
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs" style={{ color: '#888' }}>
        This prototype does not constitute finance approval or financial advice. All projections are estimated and based on simulated data.
      </p>
    </div>
  );
}
