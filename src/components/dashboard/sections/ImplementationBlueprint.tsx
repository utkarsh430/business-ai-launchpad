'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Database, Cpu, Users, Shield, Target, CheckCircle,
  ArrowRight, Clock, DollarSign, BarChart2
} from 'lucide-react';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';


const PHASES = [
  {
    id: 1,
    label: 'Phase 1',
    title: 'Data Preparation',
    duration: 'Weeks 1–3',
    color: '#1d4ed8',
    bg: '#eff6ff',
    steps: [
      'Validate and clean supplier lead-time data (target: ≥90% SKU coverage)',
      'Confirm 24-month sales history integrity across all channels',
      'Establish inventory data pipeline from warehouse system',
      'Create product hierarchy and SKU classification taxonomy',
      'Define data governance standards and access controls',
    ],
    deliverable: 'Validated data inventory with quality scorecard',
    gate: false,
  },
  {
    id: 2,
    label: 'Phase 2',
    title: 'Pilot Configuration',
    duration: 'Weeks 3–6',
    color: '#d97706',
    bg: '#fff7ed',
    steps: [
      'Configure demand forecasting model for top 20 pilot SKUs',
      'Set reorder point and safety stock parameters',
      'Define and document human-approval workflow',
      'Draft AI acceptable-use policy and obtain sign-off',
      'Deliver AI awareness training to operations team',
    ],
    deliverable: 'Configured system with signed AI policy',
    gate: true,
  },
  {
    id: 3,
    label: 'Phase 3',
    title: 'Human Validation',
    duration: 'Weeks 6–10',
    color: '#00875a',
    bg: '#f0fdf4',
    steps: [
      'Run daily demand recommendations for 20 pilot SKUs',
      'Operations Manager reviews and approves/overrides each recommendation',
      'Log all override decisions with reason codes',
      'Track forecast accuracy against actuals weekly',
      'Collect employee feedback on workflow and tool usability',
    ],
    deliverable: 'Pilot performance log with override rate analysis',
    gate: true,
  },
  {
    id: 4,
    label: 'Phase 4',
    title: 'Production Rollout',
    duration: 'Weeks 10–14',
    color: '#db0011',
    bg: '#fef2f2',
    steps: [
      'Expand to full SKU catalogue based on pilot results',
      'Integrate recommendations into existing inventory management system',
      'Establish automated monitoring and alerting',
      'Communicate changes to wider operations and finance teams',
      'Activate supplier delay risk detection module',
    ],
    deliverable: 'Live production system with integration confirmation',
    gate: false,
  },
  {
    id: 5,
    label: 'Phase 5',
    title: 'Measurement & Optimisation',
    duration: 'Weeks 14–24',
    color: '#6b21a8',
    bg: '#faf5ff',
    steps: [
      'Measure stockout rate reduction vs 7.8% baseline (target: ≤5.1%)',
      'Quantify inventory value released (target: ≥£48k reduction)',
      'Track annual net benefit accrual against £42k target',
      'Conduct monthly AI governance review with senior management',
      'Evaluate expansion to Cash-Flow Forecasting use case',
    ],
    deliverable: 'Business value report and scale decision',
    gate: true,
  },
];

const ARCHITECTURE_BLOCKS = [
  {
    category: 'Data Sources',
    icon: Database,
    color: '#1d4ed8',
    items: ['E-commerce platform (Shopify/WooCommerce)', 'Inventory management system', 'Supplier order portal', 'Accounting software (Xero/QuickBooks)'],
  },
  {
    category: 'AI Models',
    icon: Cpu,
    color: '#db0011',
    items: ['Time-series demand forecasting (ARIMA / Prophet)', 'Inventory optimisation (stochastic model)', 'Supplier risk scoring (classification)', 'Anomaly detection for demand spikes'],
  },
  {
    category: 'Human Controls',
    icon: Users,
    color: '#00875a',
    items: ['Approval workflow for reorder recommendations', 'Override logging with reason codes', 'Forecast accuracy review (weekly)', 'Model performance dashboard (monthly)'],
  },
  {
    category: 'Governance',
    icon: Shield,
    color: '#d97706',
    items: ['AI acceptable-use policy', 'Data classification framework', 'Model monitoring and drift detection', 'Quarterly responsible-AI review'],
  },
];

const KPIS = [
  { label: 'Stockout Rate', baseline: '7.8%', target: '≤5.1%', unit: 'reduction of 2.7pp', color: '#db0011' },
  { label: 'Inventory Turnover', baseline: '4.2x', target: '≥5.0x', unit: '+0.8x improvement', color: '#d97706' },
  { label: 'Forecast Accuracy', baseline: '69%', target: '≥78%', unit: '+9pp improvement', color: '#1d4ed8' },
  { label: 'Excess Inventory', baseline: '£286k', target: '£238k', unit: '£48k released', color: '#00875a' },
  { label: 'Annual Net Benefit', baseline: '—', target: '£42,000', unit: 'Base case estimate', color: '#6b21a8' },
  { label: 'Employee Adoption', baseline: '0%', target: '≥80%', unit: 'AI tool usage', color: '#00875a' },
];

export function ImplementationBlueprint() {
  const [openPhase, setOpenPhase] = useState<number | null>(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText size={18} style={{ color: '#db0011' }} />
            <h1 className="text-xl font-bold" style={{ color: '#111' }}>
              Implementation Blueprint
            </h1>
          </div>
          <p className="text-sm" style={{ color: '#555' }}>
            Executable plan for deploying Demand & Inventory Optimisation at BrightCart
          </p>
        </div>
        <ProvenanceBadge type="estimated" />
      </div>

      {/* Business Objective */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded border p-5"
        style={{ background: 'white', borderColor: '#e2e2e2', borderLeft: '4px solid #db0011' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#db0011' }}>
          Business Objective
        </p>
        <h2 className="text-lg font-bold mb-2" style={{ color: '#111' }}>
          Reduce stockout rate from 7.8% to ≤5.1% and release ≥£48,000 in working capital
          through AI-driven demand forecasting and inventory optimisation.
        </h2>
        <p className="text-sm" style={{ color: '#555' }}>
          Achieve £42,000 annual net benefit within 12 months. Implementation cost £28,000.
          Payback in 8 months (base case).
        </p>
      </motion.div>

      {/* Architecture Overview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="bg-white rounded border p-6"
        style={{ borderColor: '#e2e2e2' }}
      >
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#111' }}>
          <Cpu size={16} style={{ color: '#db0011' }} />
          System Architecture
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ARCHITECTURE_BLOCKS.map((block, i) => {
            const Icon = block.icon;
            return (
              <motion.div
                key={block.category}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="rounded p-4"
                style={{ background: '#f9f9f9', border: `1px solid ${block.color}20` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-7 h-7 rounded flex items-center justify-center"
                    style={{ background: `${block.color}15` }}
                  >
                    <Icon size={14} style={{ color: block.color }} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: block.color }}>
                    {block.category}
                  </span>
                </div>
                <ul className="space-y-1">
                  {block.items.map((item) => (
                    <li key={item} className="text-xs flex items-start gap-1" style={{ color: '#555' }}>
                      <span style={{ color: block.color, marginTop: 2 }}>·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Phased Implementation */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12 }}
        className="bg-white rounded border p-6"
        style={{ borderColor: '#e2e2e2' }}
      >
        <h2 className="font-semibold mb-5 flex items-center gap-2" style={{ color: '#111' }}>
          <Clock size={16} style={{ color: '#db0011' }} />
          Phased Implementation Plan
        </h2>

        {/* Phase timeline bar */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {PHASES.map((p, i) => (
            <div key={p.id} className="flex items-center gap-1 flex-1 min-w-0">
              <button
                onClick={() => setOpenPhase(openPhase === p.id ? null : p.id)}
                className="flex-1 rounded px-2 py-2 text-center transition-all"
                style={{
                  background: openPhase === p.id ? p.color : p.bg,
                  color: openPhase === p.id ? 'white' : p.color,
                  border: `1px solid ${p.color}40`,
                }}
              >
                <p className="text-xs font-semibold">{p.label}</p>
                <p className="text-xs opacity-80">{p.duration}</p>
              </button>
              {i < PHASES.length - 1 && (
                <ArrowRight size={12} style={{ color: '#ccc', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>

        {/* Phase detail */}
        <AnimatePresence mode="wait">
          {openPhase !== null && (() => {
            const phase = PHASES.find((p) => p.id === openPhase);
            if (!phase) return null;
            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="rounded p-5"
                style={{ background: phase.bg, border: `1px solid ${phase.color}30` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold" style={{ color: phase.color }}>{phase.title}</h3>
                    <p className="text-xs" style={{ color: '#555' }}>{phase.duration}</p>
                  </div>
                  {phase.gate && (
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded"
                      style={{ background: '#fef9c3', color: '#713f12', border: '1px solid #fde68a' }}
                    >
                      Governance Gate
                    </span>
                  )}
                </div>
                <ul className="space-y-2 mb-4">
                  {phase.steps.map((step, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2"
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                        style={{ background: phase.color, color: 'white' }}
                      >
                        {i + 1}
                      </div>
                      <span className="text-sm" style={{ color: '#444' }}>{step}</span>
                    </motion.li>
                  ))}
                </ul>
                <div
                  className="rounded px-3 py-2 flex items-center gap-2"
                  style={{ background: 'white', border: `1px solid ${phase.color}40` }}
                >
                  <CheckCircle size={13} style={{ color: phase.color }} />
                  <span className="text-xs font-medium" style={{ color: '#555' }}>
                    Deliverable: {phase.deliverable}
                  </span>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </motion.div>

      {/* KPIs & Success Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16 }}
        className="bg-white rounded border p-6"
        style={{ borderColor: '#e2e2e2' }}
      >
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#111' }}>
          <Target size={16} style={{ color: '#db0011' }} />
          KPIs & Success Metrics
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {KPIS.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded p-4"
              style={{ background: '#f9f9f9', borderLeft: `3px solid ${kpi.color}` }}
            >
              <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: '#888' }}>
                {kpi.label}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-xs" style={{ color: '#888' }}>Baseline: </span>
                <span className="text-sm font-semibold" style={{ color: '#555' }}>{kpi.baseline}</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xs" style={{ color: '#888' }}>Target: </span>
                <span className="text-lg font-bold" style={{ color: kpi.color }}>{kpi.target}</span>
              </div>
              <p className="text-xs mt-1" style={{ color: kpi.color }}>{kpi.unit}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Cost & Benefit Summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded border p-5"
        style={{ background: 'white', borderColor: '#e2e2e2' }}
      >
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#111' }}>
          <DollarSign size={16} style={{ color: '#db0011' }} />
          Cost & Benefit Summary
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {[
            { label: 'Project Cost', value: '£28,000', color: '#111' },
            { label: 'Funding Support', value: '£8,000', color: '#00875a' },
            { label: 'Financing Required', value: '£15,000', color: '#db0011' },
            { label: 'Annual Net Benefit', value: '£42,000', color: '#00875a' },
          ].map((c) => (
            <div key={c.label} className="text-center rounded p-3" style={{ background: '#f9f9f9' }}>
              <p className="text-xs" style={{ color: '#888' }}>{c.label}</p>
              <p className="text-xl font-bold mt-1" style={{ color: c.color }}>{c.value}</p>
            </div>
          ))}
        </div>
        <div className="rounded p-3 flex items-center gap-3" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <BarChart2 size={16} style={{ color: '#00875a' }} />
          <p className="text-sm" style={{ color: '#166534' }}>
            Base-case payback{' '}
            <strong>8 months</strong> · 3-year estimated net benefit{' '}
            <strong>£98,000</strong> · Risk classification: <strong>Low</strong>
          </p>
        </div>
      </motion.div>

      {/* Consulting Footer */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.24 }}
        className="rounded border p-4"
        style={{ background: '#fafafa', borderColor: '#e2e2e2' }}
      >
        <p className="text-xs" style={{ color: '#888' }}>
          <span className="font-semibold" style={{ color: '#111' }}>Blueprint confidence:</span>{' '}
          This implementation plan is based on BrightCart&apos;s assessed readiness score of 68/100 and the
          illustrative peer benchmarks provided. All financial figures are estimates. Actual results will
          depend on data quality, employee adoption, and external market conditions.
          A governance gate review is required before each critical phase transition.
        </p>
      </motion.div>
    </div>
  );
}
