'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu, Database, CheckCircle, AlertTriangle, TrendingUp,
  Users, Shield, BarChart2, ArrowRight, Zap, DollarSign
} from 'lucide-react';
import { BRIGHTCART } from '@/src/data/brightcart';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';

const { opportunities } = BRIGHTCART;
const selectedOpp = opportunities[0]!;

const CAPABILITIES = [
  {
    id: 'demand-forecasting',
    title: 'Demand Forecasting',
    icon: TrendingUp,
    purpose: 'Predict future product demand using historical sales, seasonality, and external signals',
    inputs: ['24 months sales history', 'Seasonal calendars', 'Promotional data', 'Product attributes'],
    outputs: ['Daily demand forecast per SKU', 'Confidence intervals', 'Trend indicators'],
    value: 'Reduces overstock by ~17% and stockouts by ~35%',
    color: '#1d4ed8',
    bg: '#eff6ff',
  },
  {
    id: 'inventory-optimisation',
    title: 'Inventory Optimisation',
    icon: BarChart2,
    purpose: 'Dynamically calculate reorder points, safety stock levels, and optimal order quantities',
    inputs: ['Demand forecasts', 'Supplier lead times', 'Holding cost data', 'Service level targets'],
    outputs: ['Reorder recommendations', 'Safety stock adjustments', 'Order quantity suggestions'],
    value: 'Frees ~£48,000 in working capital tied up in excess stock',
    color: '#00875a',
    bg: '#f0fdf4',
  },
  {
    id: 'supplier-risk',
    title: 'Supplier Delay Risk Detection',
    icon: AlertTriangle,
    purpose: 'Identify and flag potential supplier delivery delays before they cause stockouts',
    inputs: ['Supplier lead-time history', 'Order status data', 'Seasonal patterns', 'Supplier risk scores'],
    outputs: ['Delay probability scores', 'Early-warning alerts', 'Alternative sourcing flags'],
    value: 'Reduces supply disruption impact by an estimated 40–60%',
    color: '#d97706',
    bg: '#fff7ed',
  },
];

const DATA_REQUIREMENTS = [
  { id: 'sales', label: 'Sales Data', status: 'ready', description: '24-month transaction history available', readiness: 92 },
  { id: 'inventory', label: 'Inventory Data', status: 'partial', description: 'Stock levels available; lead-time data inconsistent', readiness: 68 },
  { id: 'supplier', label: 'Supplier Data', status: 'partial', description: 'Basic supplier info available; reliability scores missing', readiness: 55 },
  { id: 'returns', label: 'Returns Data', status: 'ready', description: 'Returns history captured in order management system', readiness: 84 },
];

const DIFFICULTY_DIMS = [
  { id: 'data', label: 'Data', score: 68, note: 'Mostly ready; supplier data needs enrichment' },
  { id: 'technology', label: 'Technology', score: 72, note: 'Cloud & e-commerce platform in place' },
  { id: 'people', label: 'People', score: 58, note: 'Training required; ops team engaged' },
  { id: 'governance', label: 'Governance', score: 49, note: 'AI policy and monitoring process needed' },
];

function ArchitectureDiagram() {
  const [step, setStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setStep((s) => (s + 1) % 5);
    }, 1200);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const nodes = [
    { id: 0, label: 'Business Data', sublabel: 'Sales · Inventory · Suppliers', x: 60, y: 110, color: '#1d4ed8' },
    { id: 1, label: 'AI Models', sublabel: 'Forecasting · Optimisation', x: 200, y: 110, color: '#db0011' },
    { id: 2, label: 'Recommendations', sublabel: 'Ranked reorder actions', x: 340, y: 110, color: '#d97706' },
    { id: 3, label: 'Human Approval', sublabel: 'Operations manager', x: 480, y: 110, color: '#00875a' },
    { id: 4, label: 'Business System', sublabel: 'ERP · Inventory platform', x: 620, y: 110, color: '#6b21a8' },
  ];

  const edges = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 700 220" className="w-full" style={{ minWidth: 500, height: 180 }}>
        {/* Edges */}
        {edges.map((e, i) => {
          const from = nodes[e.from]!;
          const to = nodes[e.to]!;
          const active = step > i;
          return (
            <g key={i}>
              <line
                x1={from.x + 50}
                y1={from.y}
                x2={to.x - 10}
                y2={to.y}
                stroke={active ? '#db0011' : '#e2e2e2'}
                strokeWidth={active ? 2 : 1.5}
                strokeDasharray={active ? 'none' : '4 3'}
                style={{ transition: 'stroke 0.4s, stroke-width 0.4s' }}
              />
              {active && (
                <motion.circle
                  r={4}
                  fill="#db0011"
                  initial={{ cx: from.x + 50, cy: from.y }}
                  animate={{ cx: to.x - 10, cy: to.y }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                />
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((n) => {
          const isActive = step >= n.id;
          return (
            <g key={n.id}>
              <rect
                x={n.x - 50}
                y={n.y - 28}
                width={100}
                height={56}
                rx={8}
                fill={isActive ? n.color : '#f4f4f4'}
                stroke={isActive ? n.color : '#e2e2e2'}
                strokeWidth={1.5}
                style={{ transition: 'fill 0.4s, stroke 0.4s' }}
              />
              <text
                x={n.x}
                y={n.y - 8}
                textAnchor="middle"
                fontSize={9}
                fontWeight="600"
                fill={isActive ? 'white' : '#888'}
                style={{ transition: 'fill 0.4s' }}
              >
                {n.label}
              </text>
              <text
                x={n.x}
                y={n.y + 8}
                textAnchor="middle"
                fontSize={7.5}
                fill={isActive ? 'rgba(255,255,255,0.8)' : '#aaa'}
                style={{ transition: 'fill 0.4s' }}
              >
                {n.sublabel}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function AISolutionStudio() {
  const [selectedCap, setSelectedCap] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu size={18} style={{ color: '#db0011' }} />
            <h1 className="text-xl font-bold" style={{ color: '#111' }}>
              AI Solution Studio
            </h1>
          </div>
          <p className="text-sm" style={{ color: '#555' }}>
            Recommended solution blueprint for{' '}
            <span className="font-semibold" style={{ color: '#db0011' }}>
              {selectedOpp.title}
            </span>
          </p>
        </div>
        <ProvenanceBadge type="estimated" />
      </div>

      {/* Business Problem */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded border p-6"
        style={{ borderColor: '#e2e2e2' }}
      >
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#111' }}>
          <AlertTriangle size={16} style={{ color: '#d97706' }} />
          Business Problem
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Stockout Rate',
              value: '7.8%',
              peer: 'Peer Median: 4.6%',
              impact: '3.2pp above peers',
              color: '#db0011',
              bg: '#fef2f2',
            },
            {
              label: 'Inventory Turnover',
              value: '4.2x',
              peer: 'Peer Median: 5.8x',
              impact: '£48k capital gap',
              color: '#d97706',
              bg: '#fff7ed',
            },
            {
              label: 'Annual Commercial Impact',
              value: '£42,000',
              peer: 'Est. annual net benefit',
              impact: 'Base case at 8 months payback',
              color: '#00875a',
              bg: '#f0fdf4',
            },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded p-4" style={{ background: kpi.bg }}>
              <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: '#888' }}>
                {kpi.label}
              </p>
              <p className="text-2xl font-bold mb-1" style={{ color: kpi.color }}>
                {kpi.value}
              </p>
              <p className="text-xs" style={{ color: '#555' }}>{kpi.peer}</p>
              <p className="text-xs font-medium mt-1" style={{ color: kpi.color }}>{kpi.impact}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Capabilities */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="bg-white rounded border p-6"
        style={{ borderColor: '#e2e2e2' }}
      >
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#111' }}>
          <Zap size={16} style={{ color: '#db0011' }} />
          Recommended AI Capabilities
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            const isSelected = selectedCap === cap.id;
            return (
              <button
                key={cap.id}
                onClick={() => setSelectedCap(isSelected ? null : cap.id)}
                className="text-left rounded border p-4 transition-all"
                style={{
                  borderColor: isSelected ? cap.color : '#e2e2e2',
                  background: isSelected ? cap.bg : 'white',
                  borderWidth: isSelected ? 2 : 1,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: cap.bg }}>
                    <Icon size={14} style={{ color: cap.color }} />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: '#111' }}>{cap.title}</span>
                </div>
                <p className="text-xs leading-relaxed mb-2" style={{ color: '#555' }}>{cap.purpose}</p>
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 mt-2" style={{ borderTop: '1px solid #f0f0f0' }}>
                        <p className="text-xs font-medium mb-1" style={{ color: '#888' }}>Inputs</p>
                        <ul className="space-y-0.5 mb-2">
                          {cap.inputs.map((inp) => (
                            <li key={inp} className="text-xs flex items-center gap-1" style={{ color: '#444' }}>
                              <span style={{ color: cap.color }}>·</span> {inp}
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs font-medium mb-1" style={{ color: '#888' }}>Outputs</p>
                        <ul className="space-y-0.5 mb-2">
                          {cap.outputs.map((out) => (
                            <li key={out} className="text-xs flex items-center gap-1" style={{ color: '#444' }}>
                              <ArrowRight size={10} style={{ color: cap.color }} /> {out}
                            </li>
                          ))}
                        </ul>
                        <div className="rounded px-2 py-1" style={{ background: cap.bg }}>
                          <p className="text-xs font-medium" style={{ color: cap.color }}>{cap.value}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
        <p className="text-xs mt-3" style={{ color: '#888' }}>Click a capability to see details</p>
      </motion.div>

      {/* Data Requirements */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12 }}
        className="bg-white rounded border p-6"
        style={{ borderColor: '#e2e2e2' }}
      >
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#111' }}>
          <Database size={16} style={{ color: '#db0011' }} />
          Data Requirements
        </h2>
        <div className="space-y-3">
          {DATA_REQUIREMENTS.map((d) => (
            <div key={d.id} className="flex items-center gap-4">
              <div className="w-32 shrink-0">
                <p className="text-sm font-medium" style={{ color: '#111' }}>{d.label}</p>
                <p className="text-xs" style={{ color: '#888' }}>{d.description}</p>
              </div>
              <div className="flex-1 h-2 rounded-full" style={{ background: '#f0f0f0' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: d.readiness >= 80 ? '#00875a' : d.readiness >= 60 ? '#d97706' : '#db0011',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${d.readiness}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </div>
              <div className="w-12 text-right">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded"
                  style={{
                    background: d.readiness >= 80 ? '#f0fdf4' : '#fff7ed',
                    color: d.readiness >= 80 ? '#00875a' : '#d97706',
                  }}
                >
                  {d.readiness}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Architecture */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16 }}
        className="bg-white rounded border p-6"
        style={{ borderColor: '#e2e2e2' }}
      >
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#111' }}>
          <Cpu size={16} style={{ color: '#db0011' }} />
          Suggested Architecture
        </h2>
        <ArchitectureDiagram />
        <p className="text-xs text-center mt-2" style={{ color: '#888' }}>
          Animated flow: Business Data → AI Models → Recommendations → Human Approval → Business System
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Implementation Difficulty */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded border p-6"
          style={{ borderColor: '#e2e2e2' }}
        >
          <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#111' }}>
            <Users size={16} style={{ color: '#db0011' }} />
            Implementation Readiness
          </h2>
          <div className="space-y-3">
            {DIFFICULTY_DIMS.map((dim) => (
              <div key={dim.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: '#111' }}>{dim.label}</span>
                  <span className="text-xs" style={{ color: dim.score >= 70 ? '#00875a' : dim.score >= 55 ? '#d97706' : '#db0011' }}>
                    {dim.score}/100
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ background: '#f0f0f0' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: dim.score >= 70 ? '#00875a' : dim.score >= 55 ? '#d97706' : '#db0011' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.score}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + dim.score * 0.002 }}
                  />
                </div>
                <p className="text-xs mt-0.5" style={{ color: '#888' }}>{dim.note}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Business Value */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24 }}
          className="bg-white rounded border p-6"
          style={{ borderColor: '#e2e2e2' }}
        >
          <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#111' }}>
            <DollarSign size={16} style={{ color: '#db0011' }} />
            Expected Business Value
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Annual Net Benefit', value: '£42,000', color: '#00875a', bg: '#f0fdf4' },
              { label: 'Payback Period', value: '8 months', color: '#1d4ed8', bg: '#eff6ff' },
              { label: 'Risk Level', value: 'Low', color: '#00875a', bg: '#f0fdf4' },
              { label: 'Time to Value', value: '8–12 weeks', color: '#d97706', bg: '#fff7ed' },
            ].map((v) => (
              <div key={v.label} className="rounded p-3" style={{ background: v.bg }}>
                <p className="text-xs" style={{ color: '#888' }}>{v.label}</p>
                <p className="text-lg font-bold mt-1" style={{ color: v.color }}>{v.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
            <p className="text-xs" style={{ color: '#888' }}>
              3-year estimated net benefit:{' '}
              <span className="font-semibold" style={{ color: '#111' }}>£98,000</span>
              {' '}· Project cost:{' '}
              <span className="font-semibold" style={{ color: '#111' }}>£28,000</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Responsible AI Controls */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.28 }}
        className="bg-white rounded border p-6"
        style={{ borderColor: '#e2e2e2' }}
      >
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#111' }}>
          <Shield size={16} style={{ color: '#db0011' }} />
          Responsible AI Controls
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Human Approval Required',
              detail: 'All AI reorder recommendations must be reviewed and approved by the Operations Manager before execution.',
              icon: CheckCircle,
              color: '#00875a',
              bg: '#f0fdf4',
            },
            {
              title: 'Monthly Model Monitoring',
              detail: 'Forecast accuracy and override rates reviewed monthly. Model re-validation triggered if accuracy drops below threshold.',
              icon: BarChart2,
              color: '#1d4ed8',
              bg: '#eff6ff',
            },
            {
              title: 'AI Acceptable-Use Policy',
              detail: 'Lightweight AI policy must be signed off before go-live. Governance gate required at end of Prepare phase.',
              icon: Shield,
              color: '#d97706',
              bg: '#fff7ed',
            },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="rounded p-4" style={{ background: c.bg }}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} style={{ color: c.color }} />
                  <span className="text-sm font-semibold" style={{ color: '#111' }}>{c.title}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#555' }}>{c.detail}</p>
              </div>
            );
          })}
        </div>
        <div
          className="mt-4 rounded px-4 py-3 flex items-center gap-3"
          style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
        >
          <CheckCircle size={16} style={{ color: '#00875a' }} />
          <p className="text-sm" style={{ color: '#166534' }}>
            <span className="font-semibold">Responsible AI Classification:</span>{' '}
            Operational decision support · Low risk · Conditional approval granted
          </p>
        </div>
      </motion.div>
    </div>
  );
}
