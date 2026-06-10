'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import {
  Users, TrendingUp, Target, Clock, AlertTriangle,
  CheckCircle, ChevronRight, BarChart2, Zap, ArrowRight,
} from 'lucide-react';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';
import {
  CAPABILITIES,
  CAPABILITY_OPTIONS,
  COMPARISON_MATRIX,
  WORKFORCE_ACTIONS,
  WORKFORCE_PHASES,
  computeFitScore,
  type CapabilityId,
  type PriorityLevel,
  type AcquisitionRoute,
  type AcquisitionOption,
  type CapabilityConfig,
} from '../../../data/workforce-impact';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmt(n: number): string {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `£${Math.round(n / 1_000)}k`;
  return `£${Math.round(n)}`;
}

function fmtNum(n: number, decimals = 0): string {
  return n.toFixed(decimals);
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function capabilityColor(score: number): string {
  if (score >= 70) return '#00875a';
  if (score >= 40) return '#d97706';
  return '#db0011';
}

function capabilityLabel(score: number): string {
  if (score >= 70) return 'Strong';
  if (score >= 40) return 'Developing';
  return 'Critical Gap';
}

function matrixValueColor(val: string): string {
  const v = val.toLowerCase();
  if (v === 'high' || v === 'very high') return '#00875a';
  if (v === 'medium' || v.includes('medium')) return '#d97706';
  if (v === 'low' || v.includes('low')) return '#db0011';
  return '#555';
}

// For "Cost" and "Risk" rows lower is better — invert colour logic
function matrixValueColorInverted(val: string): string {
  const v = val.toLowerCase();
  if (v === 'high' || v === 'very high') return '#db0011';
  if (v === 'medium' || v.includes('medium')) return '#d97706';
  if (v === 'low' || v === 'very low' || v.includes('low')) return '#00875a';
  return '#555';
}

const INVERTED_ROWS = new Set([
  'Cost',
  'Implementation Risk',
  'Dependency Risk',
]);

// ---------------------------------------------------------------------------
// Dual radar SVG (current + target overlay)
// ---------------------------------------------------------------------------

interface DualRadarProps {
  capabilities: CapabilityConfig[];
  targets: Record<CapabilityId, number>;
  selected: CapabilityId;
  onSelect: (id: CapabilityId) => void;
  size?: number;
}

function DualRadarChart({ capabilities, targets, selected, onSelect, size = 280 }: DualRadarProps) {
  const shouldReduce = useReducedMotion();
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size / 2) * 0.62;
  const n = capabilities.length;

  function pt(idx: number, value: number) {
    const angle = (idx / n) * 2 * Math.PI - Math.PI / 2;
    const r = (value / 100) * radius;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }
  function labelPt(idx: number) {
    const angle = (idx / n) * 2 * Math.PI - Math.PI / 2;
    const r = radius * 1.25;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }
  function clickPt(idx: number) {
    const angle = (idx / n) * 2 * Math.PI - Math.PI / 2;
    const r = radius * 1.18;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  const gridLevels = [25, 50, 75, 100];
  function gridPoly(level: number) {
    return capabilities
      .map((_, i) => { const p = pt(i, level); return `${p.x},${p.y}`; })
      .join(' ');
  }

  const currentPoly = capabilities
    .map((c, i) => { const p = pt(i, c.current); return `${p.x},${p.y}`; })
    .join(' ');
  const targetPoly = capabilities
    .map((c, i) => { const p = pt(i, targets[c.id] ?? c.defaultTarget); return `${p.x},${p.y}`; })
    .join(' ');

  return (
    <svg
      width={size}
      height={size}
      role="img"
      aria-label="Capability map showing current and target strengths"
      className="w-full max-w-xs mx-auto"
      style={{ maxWidth: size }}
    >
      {/* Grid */}
      {gridLevels.map((level) => (
        <polygon key={level} points={gridPoly(level)} fill="none" stroke="#e8e8e8" strokeWidth={1} />
      ))}
      {capabilities.map((_, i) => {
        const p = pt(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e8e8e8" strokeWidth={1} />;
      })}

      {/* Target polygon */}
      <motion.polygon
        points={targetPoly}
        fill="#1d4ed8"
        fillOpacity={0.1}
        stroke="#1d4ed8"
        strokeWidth={1.5}
        strokeDasharray="4 3"
        initial={shouldReduce ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Current polygon */}
      <motion.polygon
        points={currentPoly}
        fill="#db0011"
        fillOpacity={0.13}
        stroke="#db0011"
        strokeWidth={2}
        initial={shouldReduce ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Dots + click targets */}
      {capabilities.map((c, i) => {
        const curr = pt(i, c.current);
        const targ = pt(i, targets[c.id] ?? c.defaultTarget);
        const lp = labelPt(i);
        const cp = clickPt(i);
        const isSel = c.id === selected;
        const anchor = lp.x < cx - 4 ? 'end' : lp.x > cx + 4 ? 'start' : 'middle';
        return (
          <g key={c.id}>
            <circle cx={curr.x} cy={curr.y} r={4} fill="#db0011" />
            <circle cx={targ.x} cy={targ.y} r={4} fill="#1d4ed8" />
            {/* Invisible click target */}
            <circle
              cx={cp.x}
              cy={cp.y}
              r={18}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onClick={() => onSelect(c.id)}
              role="button"
              aria-label={`Select ${c.label}`}
            />
            <text
              x={lp.x}
              y={lp.y}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize={10}
              fontWeight={isSel ? '700' : '400'}
              fill={isSel ? '#111' : '#555'}
              fontFamily="system-ui, sans-serif"
              style={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => onSelect(c.id)}
            >
              {c.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Animated metric
// ---------------------------------------------------------------------------

function AnimMetric({ value, label, sub, color = '#111', prefix = '', suffix = '' }: {
  value: string | number;
  label: string;
  sub?: string;
  color?: string;
  prefix?: string;
  suffix?: string;
}) {
  const shouldReduce = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-0.5"
    >
      <p className="text-xs" style={{ color: '#888' }}>{label}</p>
      <p className="text-xl font-bold" style={{ color }}>
        {prefix}{value}{suffix}
      </p>
      {sub && <p className="text-xs" style={{ color: '#aaa' }}>{sub}</p>}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Priority toggle
// ---------------------------------------------------------------------------

function PriorityToggle({ label, value, onChange }: {
  label: string;
  value: PriorityLevel;
  onChange: (v: PriorityLevel) => void;
}) {
  const levels: PriorityLevel[] = ['Low', 'Medium', 'High'];
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-medium" style={{ color: '#555' }}>{label}</p>
      <div className="flex rounded overflow-hidden border" style={{ borderColor: '#e2e2e2' }}>
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => onChange(l)}
            className="flex-1 py-1.5 text-xs font-medium transition-all"
            style={{
              background: value === l ? '#111' : '#fafafa',
              color: value === l ? 'white' : '#555',
              borderRight: l !== 'High' ? '1px solid #e2e2e2' : undefined,
            }}
            aria-pressed={value === l}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Acquisition card
// ---------------------------------------------------------------------------

function AcquisitionCard({
  option,
  fitScore,
  isHighlighted,
  onSelect,
}: {
  option: AcquisitionOption;
  fitScore: number;
  isHighlighted: boolean;
  onSelect: () => void;
}) {
  const shouldReduce = useReducedMotion();
  const routeColor: Record<AcquisitionRoute, string> = {
    hire: '#1d4ed8',
    train: '#00875a',
    outsource: '#db0011',
  };
  const color = routeColor[option.route];
  const borderStyle = option.isRecommended
    ? { border: '2px solid #db0011', boxShadow: '0 0 0 3px rgba(219,0,17,0.08)' }
    : { border: '1px solid #e2e2e2' };

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-lg p-5 flex flex-col gap-4 relative"
      style={{ background: 'white', ...borderStyle }}
    >
      {option.isRecommended && (
        <div
          className="absolute -top-3 left-4 px-2 py-0.5 rounded text-xs font-bold text-white"
          style={{ background: '#db0011' }}
        >
          {option.recommendationLabel}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color }}>
            {option.route.charAt(0).toUpperCase() + option.route.slice(1)}
          </p>
          <p className="text-sm font-bold leading-snug" style={{ color: '#111' }}>
            {option.title}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs" style={{ color: '#888' }}>Strategic Fit</p>
          <p className="text-xl font-bold" style={{ color }}>{fitScore}/100</p>
          <p className="text-xs" style={{ color: '#aaa' }}>Score</p>
        </div>
      </div>

      {/* Key economics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded p-2.5" style={{ background: '#f9f9f9' }}>
          <p className="text-xs" style={{ color: '#888' }}>Cost</p>
          <p className="text-sm font-bold" style={{ color: '#111' }}>{option.costLabel}</p>
        </div>
        <div className="rounded p-2.5" style={{ background: '#f9f9f9' }}>
          <p className="text-xs" style={{ color: '#888' }}>Time to Capability</p>
          <p className="text-sm font-bold" style={{ color: '#111' }}>{option.timeToCapability}</p>
        </div>
        <div className="rounded p-2.5" style={{ background: '#f9f9f9' }}>
          <p className="text-xs" style={{ color: '#888' }}>Expected Annual Benefit</p>
          <p className="text-sm font-bold" style={{ color: '#00875a' }}>{fmt(option.expectedBenefit)}</p>
        </div>
        <div className="rounded p-2.5" style={{ background: '#f9f9f9' }}>
          <p className="text-xs" style={{ color: '#888' }}>Net Annual Value</p>
          <p className="text-sm font-bold" style={{ color: '#00875a' }}>{fmt(option.netValue)}</p>
        </div>
      </div>

      {/* ROI bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs" style={{ color: '#888' }}>ROI</p>
          <p className="text-sm font-bold" style={{ color: '#1d4ed8' }}>~{option.roi}%</p>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: '#f0f0f0' }}>
          <motion.div
            className="h-1.5 rounded-full"
            style={{ background: color }}
            initial={shouldReduce ? false : { width: 0 }}
            animate={{ width: `${clamp(option.roi / 12, 0, 100)}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Attributes */}
      <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-xs">
        {[
          ['Control', option.control],
          ['Speed', option.speed],
          ['Capability Retention', option.retention],
          ['Risk', option.risk],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span style={{ color: '#888' }}>{k}</span>
            <span className="font-medium" style={{ color: '#333' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Best for / limitation */}
      <div className="space-y-1.5 text-xs pt-1" style={{ borderTop: '1px solid #f0f0f0' }}>
        <div className="flex gap-1.5">
          <CheckCircle size={12} style={{ color: '#00875a', marginTop: 1, flexShrink: 0 }} />
          <span style={{ color: '#444' }}>{option.bestFor}</span>
        </div>
        <div className="flex gap-1.5">
          <AlertTriangle size={12} style={{ color: '#d97706', marginTop: 1, flexShrink: 0 }} />
          <span style={{ color: '#444' }}>{option.limitation}</span>
        </div>
      </div>

      {/* Recommendation */}
      {option.isRecommended && option.recommendationReason && (
        <div className="rounded p-3 text-xs leading-relaxed" style={{ background: '#fef2f2', color: '#7f1d1d' }}>
          {option.recommendationReason}
        </div>
      )}

      {/* Select button */}
      <button
        onClick={onSelect}
        className="w-full py-2 rounded text-xs font-semibold transition-all"
        style={{
          background: isHighlighted ? color : '#f9f9f9',
          color: isHighlighted ? 'white' : '#333',
          border: `1px solid ${isHighlighted ? color : '#e2e2e2'}`,
        }}
        aria-pressed={isHighlighted}
      >
        {isHighlighted ? 'Selected' : 'Select this route'}
      </button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface Priorities {
  speed: PriorityLevel;
  budget: PriorityLevel;
  control: PriorityLevel;
  retention: PriorityLevel;
}

export function WorkforceImpact({ onNavigate }: { onNavigate?: (section: string) => void }) {
  const shouldReduce = useReducedMotion();

  // State
  const [selectedCapability, setSelectedCapability] = useState<CapabilityId>('ai-automation');
  const [targets, setTargets] = useState<Record<CapabilityId, number>>(() =>
    Object.fromEntries(CAPABILITIES.map((c) => [c.id, c.defaultTarget])) as Record<CapabilityId, number>
  );
  const [priorities, setPriorities] = useState<Priorities>({
    speed: 'High',
    budget: 'Medium',
    control: 'Medium',
    retention: 'High',
  });
  const [selectedRoute, setSelectedRoute] = useState<AcquisitionRoute>('outsource');

  const cap = CAPABILITIES.find((c) => c.id === selectedCapability)!;
  const capOptions = CAPABILITY_OPTIONS[selectedCapability];
  const target = targets[selectedCapability] ?? cap.defaultTarget;
  const increase = Math.max(0, target - cap.current);

  // Simulator metrics
  const metrics = useMemo(() => {
    const revenue = increase * cap.revenuePerPoint;
    const costSaving = increase * cap.costSavingPerPoint;
    const productivity = increase * cap.productivityPerPoint;
    const hoursSaved = increase * cap.hoursPerPoint;
    const grossBenefit = revenue + costSaving;
    const recommendedOption = capOptions.options.find((o) => o.route === capOptions.defaultRecommended)!;
    const roi = grossBenefit > 0
      ? Math.round(((grossBenefit - recommendedOption.cost) / recommendedOption.cost) * 100)
      : 0;
    return { revenue, costSaving, productivity, hoursSaved, grossBenefit, roi };
  }, [increase, cap, capOptions]);

  // Fit scores
  const fitScores = useMemo(() => {
    return Object.fromEntries(
      capOptions.options.map((o) => [o.route, computeFitScore(o, priorities)])
    ) as Record<AcquisitionRoute, number>;
  }, [capOptions, priorities]);

  const matrix = COMPARISON_MATRIX[selectedCapability];

  function setTarget(id: CapabilityId, val: number) {
    const c = CAPABILITIES.find((x) => x.id === id)!;
    setTargets((prev) => ({ ...prev, [id]: clamp(val, c.current, 100) }));
  }

  // When selected capability changes, set default route
  function handleCapabilitySelect(id: CapabilityId) {
    setSelectedCapability(id);
    setSelectedRoute(CAPABILITY_OPTIONS[id].defaultRecommended);
  }

  const overallCapabilityIndex = Math.round(
    CAPABILITIES.reduce((sum, c) => sum + c.current, 0) / CAPABILITIES.length
  );

  const largestGapCap = CAPABILITIES.reduce((worst, c) => {
    const gap = c.defaultTarget - c.current;
    const worstGap = worst.defaultTarget - worst.current;
    return gap > worstGap ? c : worst;
  });

  return (
    <div className="space-y-8">
      {/* ── Page header ── */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium"
            style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }}
          >
            <Users size={11} />
            Strategic Workforce Planning
          </span>
          <ProvenanceBadge type="estimated" />
          <span
            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
            style={{ background: '#fff7ed', color: '#9a3412', border: '1px solid #fed7aa' }}
          >
            BrightCart Demo
          </span>
        </div>

        <h2 className="text-2xl font-bold mb-1" style={{ color: '#111' }}>
          AI Workforce Impact Simulator
        </h2>
        <p className="text-sm mb-4" style={{ color: '#666' }}>
          Model the capabilities BrightCart needs to implement AI successfully and compare whether to hire, train or outsource.
        </p>

        <div className="rounded-lg p-4 text-sm leading-relaxed" style={{ background: '#f9f9f9', borderLeft: '3px solid #db0011', color: '#333' }}>
          BrightCart&rsquo;s largest capability constraints are AI automation, data analysis and digital marketing. Closing these gaps could unlock operational value, but the best sourcing decision depends on cost, speed, control and long-term capability retention.
        </div>
      </div>

      {/* ── Section 1: Executive Capability Summary ── */}
      <div className="rounded-lg p-5 space-y-4" style={{ background: 'white', border: '1px solid #e2e2e2' }}>
        <div className="flex items-center gap-2 mb-2">
          <BarChart2 size={16} style={{ color: '#db0011' }} />
          <h3 className="text-base font-bold" style={{ color: '#111' }}>Executive Capability Summary</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {([
            { label: 'Workforce Capability Index', value: `${overallCapabilityIndex}/100`, color: '#d97706', sub: 'Overall' },
            { label: 'Largest Capability Gap', value: largestGapCap.label, color: '#db0011', sub: 'Critical focus' },
            { label: 'Current AI Automation', value: '15/100', color: '#db0011', sub: 'Baseline score' },
            { label: 'Recommended Target', value: '60/100', color: '#1d4ed8', sub: 'AI Automation' },
            { label: 'Recommended Route', value: 'Outsource', color: '#db0011', sub: 'With knowledge transfer' },
            { label: 'Estimated Annual Value', value: '£165,000', color: '#00875a', sub: 'Gross benefit at target' },
          ] as const).map(({ label, value, color, sub }) => (
            <AnimMetric key={label} label={label} value={value} color={color} sub={sub} />
          ))}
        </div>

        <div className="flex items-start gap-2 pt-2 text-xs" style={{ borderTop: '1px solid #f0f0f0', color: '#888' }}>
          <AlertTriangle size={11} style={{ marginTop: 1, flexShrink: 0 }} />
          Scenario estimates are illustrative and do not represent guaranteed financial outcomes. Time to capability: 6–8 weeks (outsource route).
        </div>
      </div>

      {/* ── Section 2: Capability Map ── */}
      <div className="rounded-lg p-5" style={{ background: 'white', border: '1px solid #e2e2e2' }}>
        <div className="flex items-center gap-2 mb-4">
          <Target size={16} style={{ color: '#db0011' }} />
          <h3 className="text-base font-bold" style={{ color: '#111' }}>Company Capability Map</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Radar */}
          <div className="flex flex-col items-center gap-3">
            <DualRadarChart
              capabilities={CAPABILITIES}
              targets={targets}
              selected={selectedCapability}
              onSelect={handleCapabilitySelect}
              size={260}
            />
            {/* Legend */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded" style={{ background: '#db0011', display: 'inline-block' }} />
                <span style={{ color: '#555' }}>Current</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded border-dashed border" style={{ background: '#fff', borderColor: '#1d4ed8', display: 'inline-block' }} />
                <span style={{ color: '#555' }}>Target</span>
              </div>
            </div>
          </div>

          {/* Capability bars */}
          <div className="space-y-3">
            {CAPABILITIES.map((c, i) => {
              const t = targets[c.id] ?? c.defaultTarget;
              const gap = Math.max(0, t - c.current);
              const isSelected = c.id === selectedCapability;
              return (
                <motion.button
                  key={c.id}
                  onClick={() => handleCapabilitySelect(c.id)}
                  className="w-full text-left rounded-lg p-3 transition-all"
                  style={{
                    background: isSelected ? '#fef2f2' : '#f9f9f9',
                    border: isSelected ? '1px solid #fca5a5' : '1px solid transparent',
                  }}
                  initial={shouldReduce ? false : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold" style={{ color: '#111' }}>{c.label}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ background: capabilityColor(c.current) + '18', color: capabilityColor(c.current) }}
                      >
                        {capabilityLabel(c.current)}
                      </span>
                      <span className="text-xs font-bold" style={{ color: '#111' }}>{c.current}/100</span>
                    </div>
                  </div>
                  <div className="relative h-2 rounded-full" style={{ background: '#e8e8e8' }}>
                    <div
                      className="absolute h-2 rounded-full"
                      style={{ width: `${t}%`, background: '#dbeafe', left: 0 }}
                    />
                    <motion.div
                      className="absolute h-2 rounded-full"
                      style={{ background: capabilityColor(c.current) }}
                      initial={shouldReduce ? false : { width: 0 }}
                      animate={{ width: `${c.current}%` }}
                      transition={{ delay: i * 0.06 + 0.3, duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs" style={{ color: '#888' }}>
                    <span>Gap: <span className="font-medium" style={{ color: gap > 20 ? '#db0011' : '#d97706' }}>{gap} pts</span></span>
                    <span>Target: {t}/100</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Insight */}
        <div className="mt-4 rounded p-3 text-xs leading-relaxed" style={{ background: '#f9f9f9', color: '#555' }}>
          <span className="font-semibold" style={{ color: '#111' }}>Insight: </span>
          BrightCart has strong commercial and operational knowledge, but limited AI automation and analytical capability may restrict implementation, monitoring and scaling.
          <span className="ml-2 font-medium" style={{ color: '#888' }}>
            Strong: 70–100 · Developing: 40–69 · Critical Gap: 0–39
          </span>
        </div>
      </div>

      {/* ── Section 3: Interactive Capability Simulator ── */}
      <div className="rounded-lg p-5 space-y-5" style={{ background: 'white', border: '1px solid #e2e2e2' }}>
        <div className="flex items-center gap-2">
          <Zap size={16} style={{ color: '#db0011' }} />
          <h3 className="text-base font-bold" style={{ color: '#111' }}>Interactive Capability Simulator</h3>
          <ProvenanceBadge type="estimated" />
        </div>

        <p className="text-xs" style={{ color: '#666' }}>
          Adjust target strengths to model the estimated business impact. Select a capability to see detailed impact analysis.
        </p>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CAPABILITIES.map((c) => {
            const t = targets[c.id] ?? c.defaultTarget;
            const isSelected = c.id === selectedCapability;
            return (
              <div
                key={c.id}
                className="rounded-lg p-3 cursor-pointer transition-all"
                style={{
                  background: isSelected ? '#fef2f2' : '#f9f9f9',
                  border: isSelected ? '1px solid #fca5a5' : '1px solid #e2e2e2',
                }}
                onClick={() => handleCapabilitySelect(c.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor={`slider-${c.id}`}
                    className="text-xs font-semibold"
                    style={{ color: '#111' }}
                  >
                    {c.label}
                  </label>
                  <div className="flex items-center gap-2 text-xs">
                    <span style={{ color: '#888' }}>{c.current}</span>
                    <ArrowRight size={10} style={{ color: '#aaa' }} />
                    <span className="font-bold" style={{ color: '#1d4ed8' }}>{t}</span>
                    {t > c.current && (
                      <span className="font-medium" style={{ color: '#00875a' }}>+{t - c.current}</span>
                    )}
                  </div>
                </div>
                <input
                  id={`slider-${c.id}`}
                  type="range"
                  min={c.current}
                  max={100}
                  value={t}
                  onChange={(e) => {
                    setTarget(c.id, Number(e.target.value));
                    handleCapabilitySelect(c.id);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full accent-red-600"
                  aria-label={`Target strength for ${c.label}: ${t}/100`}
                />
                {t > c.current && (
                  <p className="text-xs mt-1" style={{ color: '#888' }}>
                    Est. annual impact: {fmt((t - c.current) * (c.revenuePerPoint + c.costSavingPerPoint))}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Impact strip for selected capability */}
        {increase > 0 && (
          <div
            className="rounded-lg p-4"
            style={{ background: '#111', border: '1px solid #222' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-white">{cap.label} — Impact Analysis</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Capability increase: {cap.current} → {target} (+{increase} points) · Illustrative Scenario Estimate
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Revenue Uplift', value: fmt(metrics.revenue), color: '#4ade80' },
                { label: 'Cost Reduction', value: fmt(metrics.costSaving), color: '#60a5fa' },
                { label: 'Productivity Gain', value: `+${fmtNum(metrics.productivity, 1)}%`, color: '#fbbf24' },
                { label: 'Time Saved', value: `${Math.round(metrics.hoursSaved)} hrs/yr`, color: '#a78bfa' },
                { label: 'Gross Annual Benefit', value: fmt(metrics.grossBenefit), color: '#34d399' },
                { label: 'Est. ROI', value: `${metrics.roi}%`, color: '#f87171' },
              ].map(({ label, value, color }) => (
                <motion.div
                  key={label}
                  initial={shouldReduce ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-0.5"
                >
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</p>
                  <p className="text-base font-bold" style={{ color }}>{value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {increase === 0 && (
          <div className="rounded p-3 text-xs text-center" style={{ background: '#f9f9f9', color: '#888' }}>
            Move the <strong>{cap.label}</strong> slider above the current baseline to model impact.
          </div>
        )}
      </div>

      {/* ── Section 4: Decision Priorities ── */}
      <div className="rounded-lg p-5 space-y-4" style={{ background: 'white', border: '1px solid #e2e2e2' }}>
        <div className="flex items-center gap-2">
          <Target size={16} style={{ color: '#db0011' }} />
          <h3 className="text-base font-bold" style={{ color: '#111' }}>Management Priorities</h3>
        </div>
        <p className="text-xs" style={{ color: '#666' }}>
          Define BrightCart&rsquo;s strategic priorities to weight the acquisition-route recommendation.
          Scores update automatically.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <PriorityToggle
            label="Speed to Impact"
            value={priorities.speed}
            onChange={(v) => setPriorities((p) => ({ ...p, speed: v }))}
          />
          <PriorityToggle
            label="Budget Efficiency"
            value={priorities.budget}
            onChange={(v) => setPriorities((p) => ({ ...p, budget: v }))}
          />
          <PriorityToggle
            label="Internal Control"
            value={priorities.control}
            onChange={(v) => setPriorities((p) => ({ ...p, control: v }))}
          />
          <PriorityToggle
            label="Capability Retention"
            value={priorities.retention}
            onChange={(v) => setPriorities((p) => ({ ...p, retention: v }))}
          />
        </div>
        <p className="text-xs" style={{ color: '#aaa' }}>
          Logic: prioritise <strong>Hire</strong> when control and long-term ownership are highest ·
          <strong> Train</strong> when budget efficiency and retention are highest ·
          <strong> Outsource</strong> when speed and specialist expertise are highest.
        </p>
      </div>

      {/* ── Section 5: Hire vs Train vs Outsource ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users size={16} style={{ color: '#db0011' }} />
          <h3 className="text-base font-bold" style={{ color: '#111' }}>
            Hire vs Train vs Outsource — {cap.label}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {capOptions.options.map((opt) => (
            <AcquisitionCard
              key={opt.route}
              option={opt}
              fitScore={fitScores[opt.route] ?? 0}
              isHighlighted={selectedRoute === opt.route}
              onSelect={() => setSelectedRoute(opt.route)}
            />
          ))}
        </div>
      </div>

      {/* ── Section 6: Strategic Option Comparison ── */}
      <div className="rounded-lg p-5 space-y-4" style={{ background: 'white', border: '1px solid #e2e2e2' }}>
        <div className="flex items-center gap-2">
          <BarChart2 size={16} style={{ color: '#db0011' }} />
          <h3 className="text-base font-bold" style={{ color: '#111' }}>Strategic Option Comparison</h3>
        </div>

        {/* Fit score bar */}
        <div className="grid grid-cols-3 gap-3">
          {capOptions.options.map((opt) => {
            const score = fitScores[opt.route] ?? 0;
            const isWinner = score === Math.max(...Object.values(fitScores));
            const color = { hire: '#1d4ed8', train: '#00875a', outsource: '#db0011' }[opt.route];
            return (
              <div key={opt.route} className="text-center">
                <p className="text-xs font-medium capitalize mb-2" style={{ color: '#555' }}>{opt.route}</p>
                <div
                  className="rounded-lg p-3 mx-auto"
                  style={{
                    background: isWinner ? color + '12' : '#f9f9f9',
                    border: isWinner ? `1px solid ${color}` : '1px solid #e2e2e2',
                  }}
                >
                  <p className="text-2xl font-bold" style={{ color }}>{score}</p>
                  <p className="text-xs" style={{ color: '#888' }}>/ 100</p>
                  {isWinner && (
                    <p className="text-xs font-semibold mt-1" style={{ color }}>Best Fit</p>
                  )}
                </div>
                <p className="text-xs mt-1" style={{ color: '#aaa' }}>Strategic Fit Score</p>
              </div>
            );
          })}
        </div>

        <p className="text-xs" style={{ color: '#aaa' }}>
          Strategic Fit Scores are deterministic calculations based on management priorities and capability attributes. They do not use a trained AI model.
        </p>

        {/* Matrix table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9f9f9' }}>
                <th className="text-left px-3 py-2 font-semibold" style={{ color: '#555', width: '30%', borderBottom: '1px solid #e2e2e2' }}>Criteria</th>
                <th className="text-center px-3 py-2 font-semibold" style={{ color: '#1d4ed8', borderBottom: '1px solid #e2e2e2' }}>Hire</th>
                <th className="text-center px-3 py-2 font-semibold" style={{ color: '#00875a', borderBottom: '1px solid #e2e2e2' }}>Train</th>
                <th className="text-center px-3 py-2 font-semibold" style={{ color: '#db0011', borderBottom: '1px solid #e2e2e2' }}>Outsource</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => {
                const inv = INVERTED_ROWS.has(row.label);
                return (
                  <tr key={row.label} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td className="px-3 py-2 font-medium" style={{ color: '#333', borderBottom: '1px solid #f0f0f0' }}>{row.label}</td>
                    {[row.hire, row.train, row.outsource].map((val, j) => (
                      <td key={j} className="text-center px-3 py-2" style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <span
                          className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            background: (inv ? matrixValueColorInverted(val) : matrixValueColor(val)) + '18',
                            color: inv ? matrixValueColorInverted(val) : matrixValueColor(val),
                          }}
                        >
                          {val}
                        </span>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 7: Recommended Workforce Strategy ── */}
      <div className="rounded-lg p-5 space-y-4" style={{ background: 'white', border: '1px solid #e2e2e2' }}>
        <div className="flex items-center gap-2">
          <CheckCircle size={16} style={{ color: '#00875a' }} />
          <h3 className="text-base font-bold" style={{ color: '#111' }}>Recommended Workforce Strategy</h3>
        </div>

        {/* Headline */}
        <div className="rounded-lg p-4" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <p className="text-sm font-bold mb-1" style={{ color: '#166534' }}>
            {capOptions.recommendationHeadline}
          </p>
          {selectedCapability === 'ai-automation' && (
            <ul className="space-y-1 mt-2">
              {[
                'Fastest time to impact',
                'Access to specialist implementation skills',
                'Lower execution risk during the pilot',
                'Avoids immediate permanent headcount commitment',
                'Enables BrightCart employees to develop capability during delivery',
                'Provides evidence before making a long-term hiring decision',
              ].map((point) => (
                <li key={point} className="flex gap-2 text-xs" style={{ color: '#166534' }}>
                  <CheckCircle size={11} style={{ marginTop: 1, flexShrink: 0 }} />
                  {point}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Phased workforce model */}
        <div>
          <p className="text-xs font-semibold mb-3" style={{ color: '#555' }}>PHASED WORKFORCE MODEL</p>
          <div className="space-y-2">
            {WORKFORCE_PHASES.map((phase, i) => (
              <motion.div
                key={phase.phase}
                className="flex gap-3 items-start"
                initial={shouldReduce ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: '#db0011' }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 rounded p-3" style={{ background: '#f9f9f9' }}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold" style={{ color: '#111' }}>{phase.phase}</span>
                    <span className="text-xs" style={{ color: '#888' }}>— {phase.period}</span>
                  </div>
                  <p className="text-xs" style={{ color: '#555' }}>{phase.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 8: Workforce Action Plan ── */}
      <div className="rounded-lg p-5 space-y-4" style={{ background: 'white', border: '1px solid #e2e2e2' }}>
        <div className="flex items-center gap-2">
          <Clock size={16} style={{ color: '#db0011' }} />
          <h3 className="text-base font-bold" style={{ color: '#111' }}>Workforce Action Plan</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9f9f9' }}>
                {['Action', 'Owner', 'Timing', 'Cost', 'Success Metric'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 font-semibold"
                    style={{ color: '#555', borderBottom: '2px solid #e2e2e2', whiteSpace: 'nowrap' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WORKFORCE_ACTIONS.map((a, i) => (
                <motion.tr
                  key={a.id}
                  style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}
                  initial={shouldReduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.07, duration: 0.3 }}
                >
                  <td className="px-3 py-2.5 font-medium" style={{ color: '#111', borderBottom: '1px solid #f0f0f0' }}>
                    {a.action}
                  </td>
                  <td className="px-3 py-2.5" style={{ color: '#555', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' }}>
                    {a.owner}
                  </td>
                  <td className="px-3 py-2.5" style={{ color: '#1d4ed8', borderBottom: '1px solid #f0f0f0', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {a.timing}
                  </td>
                  <td className="px-3 py-2.5" style={{ color: '#555', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' }}>
                    {a.cost}
                  </td>
                  <td className="px-3 py-2.5" style={{ color: '#555', borderBottom: '1px solid #f0f0f0' }}>
                    {a.successMetric}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 9: Success Metrics ── */}
      <div className="rounded-lg p-5 space-y-4" style={{ background: 'white', border: '1px solid #e2e2e2' }}>
        <div className="flex items-center gap-2">
          <TrendingUp size={16} style={{ color: '#db0011' }} />
          <h3 className="text-base font-bold" style={{ color: '#111' }}>Success Metrics Scorecard</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Capability Strength', current: '15/100', target: '60/100', status: 'target', color: '#1d4ed8' },
            { label: 'Employees Trained', current: '0', target: '8', status: 'target', color: '#1d4ed8' },
            { label: 'Pilot Adoption', current: '—', target: '80%', status: 'not-realised', color: '#d97706' },
            { label: 'Annual Time Saved', current: '—', target: '420 hrs', status: 'scenario', color: '#00875a' },
            { label: 'Productivity Improvement', current: '—', target: '18% est.', status: 'scenario', color: '#00875a' },
            { label: 'Gross Annual Benefit', current: '—', target: '£165,000 est.', status: 'scenario', color: '#00875a' },
            { label: 'Knowledge Transfer', current: '0%', target: '100%', status: 'target', color: '#1d4ed8' },
            { label: 'Vendor Dependency', current: 'High', target: 'Medium by M4', status: 'target', color: '#d97706' },
          ].map(({ label, current, target: targ, status, color }) => (
            <div key={label} className="rounded p-3" style={{ background: '#f9f9f9', border: '1px solid #e2e2e2' }}>
              <p className="text-xs font-medium mb-2" style={{ color: '#333' }}>{label}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ color: '#aaa' }}>Current</p>
                  <p className="text-sm font-bold" style={{ color: '#555' }}>{current}</p>
                </div>
                <ChevronRight size={14} style={{ color: '#ccc' }} />
                <div className="text-right">
                  <p className="text-xs" style={{ color: '#aaa' }}>
                    {status === 'scenario' ? 'Scenario Est.' : status === 'not-realised' ? 'Not Yet Realised' : 'Target'}
                  </p>
                  <p className="text-sm font-bold" style={{ color }}>{targ}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Navigation cross-links ── */}
      <div className="flex flex-wrap gap-3">
        {onNavigate && (
          <button
            onClick={() => onNavigate('plan')}
            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium text-white transition-all"
            style={{ background: '#db0011' }}
          >
            <ChevronRight size={14} />
            Add Recommended Workforce Actions to Implementation Plan
          </button>
        )}
      </div>

      {/* ── Disclaimer ── */}
      <div
        className="rounded p-4 text-xs leading-relaxed space-y-1.5"
        style={{ background: '#f9f9f9', border: '1px solid #e2e2e2', color: '#888' }}
      >
        <p>
          <strong style={{ color: '#555' }}>Disclaimer:</strong> Workforce and financial impacts shown are illustrative scenario estimates based on the BrightCart demo. They do not represent guaranteed outcomes, recruitment advice or a commitment to reduce or increase headcount.
        </p>
        <p>
          The simulator evaluates business capabilities, not individual employee performance.
        </p>
      </div>
    </div>
  );
}
