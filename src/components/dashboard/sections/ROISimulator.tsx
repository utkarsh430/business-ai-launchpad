'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator, TrendingUp, BarChart2, AlertTriangle, CheckCircle
} from 'lucide-react';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function formatK(v: number) {
  if (Math.abs(v) >= 1_000_000) return `£${(v / 1_000_000).toFixed(1)}m`;
  if (Math.abs(v) >= 1_000) return `£${Math.round(v / 1_000)}k`;
  return `£${Math.round(v)}`;
}

interface Scenario {
  name: string;
  accuracyMult: number;
  adoptionMult: number;
  riskAdj: number;
  color: string;
  bg: string;
}

const SCENARIOS: Scenario[] = [
  { name: 'Best Case', accuracyMult: 1.3, adoptionMult: 1.2, riskAdj: 0.0, color: '#00875a', bg: '#f0fdf4' },
  { name: 'Expected', accuracyMult: 1.0, adoptionMult: 1.0, riskAdj: 0.1, color: '#1d4ed8', bg: '#eff6ff' },
  { name: 'Downside', accuracyMult: 0.65, adoptionMult: 0.7, riskAdj: 0.25, color: '#db0011', bg: '#fef2f2' },
];

function ROIGauge({ roi }: { roi: number }) {
  const clamped = clamp(roi, 0, 600);
  const pct = clamped / 600;
  const radius = 70;
  const cx = 90;
  const cy = 90;
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  const sweepAngle = (endAngle - startAngle) * pct;
  const endX = cx + radius * Math.cos(startAngle + sweepAngle);
  const endY = cy + radius * Math.sin(startAngle + sweepAngle);
  const largeArc = sweepAngle > Math.PI ? 1 : 0;

  const arcPath = `M ${cx + radius * Math.cos(startAngle)} ${cy + radius * Math.sin(startAngle)}
    A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`;

  const color = roi >= 200 ? '#00875a' : roi >= 100 ? '#d97706' : '#db0011';

  return (
    <svg viewBox="0 0 180 100" className="w-full" style={{ maxWidth: 220 }}>
      {/* Background arc */}
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
        fill="none"
        stroke="#f0f0f0"
        strokeWidth={14}
        strokeLinecap="round"
      />
      {/* Value arc */}
      {pct > 0 && (
        <motion.path
          d={arcPath}
          fill="none"
          stroke={color}
          strokeWidth={14}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      )}
      {/* Labels */}
      <text x={cx - radius - 4} y={cy + 16} fontSize={9} fill="#aaa" textAnchor="middle">0%</text>
      <text x={cx + radius + 4} y={cy + 16} fontSize={9} fill="#aaa" textAnchor="middle">600%</text>
      {/* Center value */}
      <text x={cx} y={cy - 8} fontSize={24} fontWeight="700" fill={color} textAnchor="middle">
        {Math.round(roi)}%
      </text>
      <text x={cx} y={cy + 10} fontSize={9} fill="#888" textAnchor="middle">ROI</text>
    </svg>
  );
}

function WaterfallBar({ label, value, color, maxVal, delay }: {
  label: string;
  value: number;
  color: string;
  maxVal: number;
  delay: number;
}) {
  const pct = Math.abs(value) / maxVal;
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 text-right">
        <p className="text-xs" style={{ color: '#555' }}>{label}</p>
      </div>
      <div className="flex-1 h-7 rounded flex items-center" style={{ background: '#f4f4f4' }}>
        <motion.div
          className="h-full rounded flex items-center px-2"
          style={{ background: color, minWidth: 2 }}
          initial={{ width: 0 }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 0.7, delay, ease: 'easeOut' }}
        >
          <span className="text-xs font-semibold text-white whitespace-nowrap overflow-hidden">
            {formatK(value)}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

export function ROISimulator() {
  const [implCost, setImplCost] = useState(28);
  const [accuracyImp, setAccuracyImp] = useState(9);
  const [adoptionRate, setAdoptionRate] = useState(80);
  const [fundingSupport, setFundingSupport] = useState(8);
  const [annualRevenue, setAnnualRevenue] = useState(5800);
  const [riskAdj, setRiskAdj] = useState(10);

  const calc = useMemo(() => {
    const revK = annualRevenue * 1_000;
    const costK = implCost * 1_000;
    const fundK = fundingSupport * 1_000;

    const stockoutSavings = revK * 0.078 * (accuracyImp / 100) * (adoptionRate / 100) * 0.35;
    const inventorySavings = 286_000 * (accuracyImp / 100) * (adoptionRate / 100) * 0.17 * 0.12;
    const processSavings = revK * 0.002 * (adoptionRate / 100);
    const grossBenefit = stockoutSavings + inventorySavings + processSavings;
    const riskFactor = 1 - riskAdj / 100;
    const adjBenefit = grossBenefit * riskFactor;
    const annualOpCost = costK * 0.12;
    const netBenefit = adjBenefit - annualOpCost;
    const netCost = costK - fundK;
    const paybackMonths = netCost > 0 ? (netCost / (netBenefit / 12)) : 0;
    const roi = netCost > 0 ? ((netBenefit * 1 - netCost) / netCost) * 100 : 0;
    const threeYearValue = netBenefit * 3 - netCost;
    const npv = netBenefit / 1.08 + netBenefit / (1.08 * 1.08) + netBenefit / (1.08 * 1.08 * 1.08) - netCost;
    const finNeed = Math.max(0, netCost - 5_000);

    return {
      grossBenefit,
      adjBenefit,
      annualOpCost,
      netBenefit,
      netCost,
      paybackMonths: clamp(paybackMonths, 1, 36),
      roi: clamp(roi, -100, 600),
      threeYearValue,
      npv,
      finNeed,
    };
  }, [implCost, accuracyImp, adoptionRate, fundingSupport, annualRevenue, riskAdj]);

  const scenarioCalcs = useMemo(() =>
    SCENARIOS.map((s) => {
      const revK = annualRevenue * 1_000;
      const costK = implCost * 1_000;
      const fundK = fundingSupport * 1_000;
      const adj = accuracyImp * s.accuracyMult;
      const adp = adoptionRate * s.adoptionMult;
      const stockSav = revK * 0.078 * (adj / 100) * (adp / 100) * 0.35;
      const invSav = 286_000 * (adj / 100) * (adp / 100) * 0.17 * 0.12;
      const procSav = revK * 0.002 * (adp / 100);
      const gross = stockSav + invSav + procSav;
      const rf = 1 - (riskAdj + s.riskAdj * 100) / 100;
      const adj2 = gross * rf;
      const opCost = costK * 0.12;
      const net = adj2 - opCost;
      const netCost = costK - fundK;
      const r = netCost > 0 ? ((net - netCost) / netCost) * 100 : 0;
      const pb = netCost > 0 ? (netCost / (net / 12)) : 0;
      return { ...s, netBenefit: net, roi: clamp(r, -100, 600), payback: clamp(pb, 1, 36) };
    }),
    [implCost, accuracyImp, adoptionRate, fundingSupport, annualRevenue, riskAdj]
  );

  const maxWaterfallVal = Math.max(calc.grossBenefit, calc.annualOpCost, calc.netBenefit, 10_000);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calculator size={18} style={{ color: '#db0011' }} />
            <h1 className="text-xl font-bold" style={{ color: '#111' }}>
              AI ROI Simulator
            </h1>
          </div>
          <p className="text-sm" style={{ color: '#555' }}>
            Model AI project economics interactively. Adjust assumptions and see results update in real time.
          </p>
        </div>
        <ProvenanceBadge type="estimated" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-1 bg-white rounded border p-5 space-y-5"
          style={{ borderColor: '#e2e2e2' }}
        >
          <h2 className="font-semibold flex items-center gap-2" style={{ color: '#111' }}>
            <Calculator size={15} style={{ color: '#db0011' }} />
            Assumptions
          </h2>

          {[
            {
              label: 'Implementation Cost', value: implCost, min: 10, max: 100, step: 2,
              unit: '£k', setter: setImplCost,
              note: `£${implCost}k total project cost`
            },
            {
              label: 'Forecast Accuracy Improvement', value: accuracyImp, min: 2, max: 25, step: 1,
              unit: 'pp', setter: setAccuracyImp,
              note: `+${accuracyImp}pp vs current 69% accuracy`
            },
            {
              label: 'Employee Adoption Rate', value: adoptionRate, min: 20, max: 100, step: 5,
              unit: '%', setter: setAdoptionRate,
              note: `${adoptionRate}% of operations staff actively using AI`
            },
            {
              label: 'Funding Support', value: fundingSupport, min: 0, max: 20, step: 1,
              unit: '£k', setter: setFundingSupport,
              note: `£${fundingSupport}k grant / incentive`
            },
            {
              label: 'Annual Revenue', value: annualRevenue, min: 1000, max: 20000, step: 200,
              unit: '£k', setter: setAnnualRevenue,
              note: `£${(annualRevenue / 1000).toFixed(1)}m annual revenue`
            },
            {
              label: 'Risk Adjustment', value: riskAdj, min: 0, max: 40, step: 5,
              unit: '%', setter: setRiskAdj,
              note: `${riskAdj}% benefit haircut for execution risk`
            },
          ].map((ctrl) => (
            <div key={ctrl.label}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium" style={{ color: '#444' }}>{ctrl.label}</label>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ background: '#fef2f2', color: '#db0011' }}
                >
                  {ctrl.value}{ctrl.unit}
                </span>
              </div>
              <input
                type="range"
                min={ctrl.min}
                max={ctrl.max}
                step={ctrl.step}
                value={ctrl.value}
                onChange={(e) => ctrl.setter(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#db0011', background: '#f0f0f0' }}
              />
              <p className="text-xs mt-1" style={{ color: '#888' }}>{ctrl.note}</p>
            </div>
          ))}
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06 }}
          className="lg:col-span-2 space-y-4"
        >
          {/* Gauge + KPIs */}
          <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
            <div className="grid sm:grid-cols-2 gap-4 items-center">
              <div className="flex flex-col items-center">
                <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: '#888' }}>
                  Year-1 ROI
                </p>
                <ROIGauge roi={calc.roi} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Annual Benefit', value: formatK(calc.adjBenefit), color: '#00875a', bg: '#f0fdf4' },
                  { label: 'Net Benefit', value: formatK(calc.netBenefit), color: '#1d4ed8', bg: '#eff6ff' },
                  { label: 'Payback Period', value: `${Math.round(calc.paybackMonths)} mo`, color: '#d97706', bg: '#fff7ed' },
                  { label: '3-Year Value', value: formatK(calc.threeYearValue), color: '#6b21a8', bg: '#faf5ff' },
                ].map((k) => (
                  <div key={k.label} className="rounded p-3" style={{ background: k.bg }}>
                    <p className="text-xs" style={{ color: '#888' }}>{k.label}</p>
                    <p className="text-lg font-bold mt-0.5" style={{ color: k.color }}>{k.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Value Waterfall */}
          <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#111' }}>
              Value Waterfall
            </h3>
            <div className="space-y-2">
              <WaterfallBar label="Gross Benefit" value={calc.grossBenefit} color="#1d4ed8" maxVal={maxWaterfallVal} delay={0.1} />
              <WaterfallBar label="Risk Haircut" value={calc.grossBenefit - calc.adjBenefit} color="#db0011" maxVal={maxWaterfallVal} delay={0.2} />
              <WaterfallBar label="Operating Cost" value={calc.annualOpCost} color="#d97706" maxVal={maxWaterfallVal} delay={0.3} />
              <div style={{ borderTop: '1px solid #e2e2e2', paddingTop: 6 }}>
                <WaterfallBar label="Net Annual Benefit" value={calc.netBenefit} color="#00875a" maxVal={maxWaterfallVal} delay={0.4} />
              </div>
            </div>
          </div>

          {/* Sensitivity — Financing */}
          <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: '#111' }}>
              Financing Need
            </h3>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-3xl font-bold" style={{ color: '#db0011' }}>
                  {formatK(calc.finNeed)}
                </p>
                <p className="text-xs mt-1" style={{ color: '#888' }}>
                  After £{fundingSupport}k grant and £5k SME contribution
                </p>
              </div>
              <div className="flex-1">
                <p className="text-xs mb-1" style={{ color: '#888' }}>Net project cost coverage</p>
                <div className="h-3 rounded-full" style={{ background: '#f0f0f0' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: '#db0011' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (calc.finNeed / (implCost * 1000)) * 100)}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scenario Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="bg-white rounded border p-5"
        style={{ borderColor: '#e2e2e2' }}
      >
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#111' }}>
          <BarChart2 size={15} style={{ color: '#db0011' }} />
          Scenario Comparison
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {scenarioCalcs.map((sc) => (
            <div
              key={sc.name}
              className="rounded p-4"
              style={{ background: sc.bg, border: `1px solid ${sc.color}30` }}
            >
              <div className="flex items-center gap-2 mb-3">
                {sc.name === 'Best Case' ? (
                  <CheckCircle size={14} style={{ color: sc.color }} />
                ) : sc.name === 'Downside' ? (
                  <AlertTriangle size={14} style={{ color: sc.color }} />
                ) : (
                  <TrendingUp size={14} style={{ color: sc.color }} />
                )}
                <span className="text-sm font-semibold" style={{ color: '#111' }}>{sc.name}</span>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs" style={{ color: '#888' }}>Annual Net Benefit</p>
                  <p className="text-xl font-bold" style={{ color: sc.color }}>{formatK(sc.netBenefit)}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs" style={{ color: '#888' }}>ROI</p>
                    <p className="text-base font-bold" style={{ color: sc.color }}>{Math.round(sc.roi)}%</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#888' }}>Payback</p>
                    <p className="text-base font-bold" style={{ color: sc.color }}>{Math.round(sc.payback)} mo</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: '#888' }}>
          Scenarios apply multipliers to your current assumptions. Adjust controls above to change the baseline.
        </p>
      </motion.div>

      {/* NPV Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded border p-5"
        style={{
          background: calc.npv > 0 ? '#f0fdf4' : '#fef2f2',
          borderColor: calc.npv > 0 ? '#bbf7d0' : '#fecaca',
        }}
      >
        <div className="flex items-center gap-3">
          {calc.npv > 0 ? (
            <CheckCircle size={20} style={{ color: '#00875a' }} />
          ) : (
            <AlertTriangle size={20} style={{ color: '#db0011' }} />
          )}
          <div>
            <p className="font-semibold" style={{ color: calc.npv > 0 ? '#166534' : '#991b1b' }}>
              3-Year NPV (8% discount rate):{' '}
              <span className="text-xl">{formatK(calc.npv)}</span>
            </p>
            <p className="text-xs mt-0.5" style={{ color: calc.npv > 0 ? '#166534' : '#991b1b', opacity: 0.8 }}>
              {calc.npv > 0
                ? 'Positive NPV indicates this project creates value at the current cost of capital.'
                : 'Negative NPV — consider increasing funding support or reducing implementation cost.'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
