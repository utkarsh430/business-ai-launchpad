'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
} from 'recharts';
import {
  Landmark, ChevronDown, ChevronUp, ArrowRight, CheckCircle, AlertTriangle,
  TrendingUp, Wallet, Gauge, Target, RotateCcw, Info, ShieldCheck,
} from 'lucide-react';
import { SectionHeader } from '../../shared/SectionHeader';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';
import { formatCurrency, formatPercent } from '@/src/lib/formatters';
import {
  CAPITAL, DEPLOYMENT_OPTIONS, FUNDING_OBJECTIVES,
  CAPITAL_OBJECTIVES, CAPITAL_PROVENANCE, GROWTH_INTELLIGENCE_DISCLOSURE,
  type FundingObjective, type CapitalObjective,
} from '@/src/data/capital-intelligence';
import {
  scoreFundingOptions, recommendedFunding, idleCapital, opportunityCost,
  reserveState, liquidityCoverageMonths, validateAllocation, portfolioBenefit,
  weightedPortfolioReturn, weightedRiskLevel, recommendedAllocation,
  DEFAULT_ALLOCATION, CAPITAL_DERIVED,
} from '@/src/lib/capital-calculations';
import type { DataProvenance } from '@/src/types';

const RED = '#db0011';
const perPound = (v: number) => `£${v.toFixed(2)}`;

const ILLUSTRATIVE_TAG = (
  <span
    className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded border"
    style={{ background: '#fff7ed', color: '#9a3412', borderColor: '#fed7aa' }}
  >
    Illustrative prototype funding option
  </span>
);

function Badge({ children, color = '#555', bg = '#f4f4f4', border = '#e2e2e2' }: {
  children: React.ReactNode; color?: string; bg?: string; border?: string;
}) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border"
      style={{ color, background: bg, borderColor: border }}
    >
      {children}
    </span>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded border p-5 ${className}`} style={{ borderColor: '#e2e2e2' }}>
      {children}
    </div>
  );
}

function CrossLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors hover:bg-gray-50"
      style={{ borderColor: '#e2e2e2', color: RED }}
    >
      {label}
      <ArrowRight size={13} />
    </button>
  );
}

/* ================================================================== *
 * Capital-flow graphic
 * ================================================================== */
function CapitalFlow({ reduceMotion }: { reduceMotion: boolean | null }) {
  const nodes = [
    { label: 'Funding Sources', color: '#6b7280' },
    { label: 'Available Capital', color: '#1d4ed8' },
    { label: 'Operating Reserve', color: '#0f766e' },
    { label: 'Deployable Capital', color: '#d97706' },
    { label: 'Strategic Investments', color: RED },
    { label: 'Expected Business Return', color: '#00875a' },
  ];
  return (
    <div className="flex flex-wrap items-stretch gap-2">
      {nodes.map((n, i) => (
        <div key={n.label} className="flex items-center gap-2">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : i * 0.12, duration: 0.4 }}
            className="rounded px-3 py-2 text-center"
            style={{ background: '#fff', border: `1px solid ${n.color}33`, minWidth: 110 }}
          >
            <span className="block w-2 h-2 rounded-full mx-auto mb-1.5" style={{ background: n.color }} />
            <span className="text-xs font-medium leading-tight block" style={{ color: '#333' }}>
              {n.label}
            </span>
          </motion.div>
          {i < nodes.length - 1 && (
            <ArrowRight size={14} className="shrink-0" style={{ color: '#bbb' }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ================================================================== *
 * Growth Intelligence evidence panel
 * ================================================================== */
function GrowthIntelligencePanel({ title, insight }: { title: string; insight: string }) {
  return (
    <div className="rounded border mt-3" style={{ borderColor: '#e2e2e2', background: '#fafafa' }}>
      <div className="flex items-center justify-between gap-2 px-3 py-2" style={{ borderBottom: '1px solid #eee' }}>
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={13} style={{ color: '#1d4ed8' }} />
          <span className="text-xs font-semibold" style={{ color: '#111' }}>HSBC Growth Intelligence™</span>
        </div>
        <Badge color="#1e40af" bg="#eff6ff" border="#bfdbfe">Illustrative Peer Insight</Badge>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-xs font-semibold mb-1" style={{ color: '#555' }}>{title}</p>
        <p className="text-xs leading-relaxed" style={{ color: '#666' }}>{insight}</p>
      </div>
    </div>
  );
}

/* ================================================================== *
 * Main component
 * ================================================================== */
export function CapitalIntelligence({ onNavigate }: { onNavigate?: (section: string) => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="space-y-8">
      <Header />
      <ExecutiveSummary reduceMotion={reduceMotion} />
      <FundingNavigatorSection onNavigate={onNavigate} />
      <IdleCapitalSection onNavigate={onNavigate} reduceMotion={reduceMotion} />
      <EfficiencySection onNavigate={onNavigate} reduceMotion={reduceMotion} />
      <DeploymentSection onNavigate={onNavigate} />
      <FinalRecommendation onNavigate={onNavigate} />
      <MethodologyPanel />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Header + Executive summary
 * ------------------------------------------------------------------ */
function Header() {
  return (
    <div>
      <SectionHeader
        title="HSBC Capital Intelligence™"
        subtitle="Understand how to source, protect and deploy capital for sustainable business growth."
      />
      <div className="flex flex-wrap gap-2 -mt-3">
        <Badge color="#111" bg="#f4f4f4">Capital Advisory</Badge>
        <Badge color="#9a3412" bg="#fff7ed" border="#fed7aa">BrightCart Demo</Badge>
        <Badge color="#6b21a8" bg="#fdf4ff" border="#e9d5ff">Illustrative Scenario</Badge>
      </div>
      <div
        className="rounded border p-3 text-xs mt-4 flex items-start gap-2"
        style={{ background: '#fff7ed', borderColor: '#fed7aa', color: '#7c2d12' }}
      >
        <Info size={14} className="mt-0.5 shrink-0" />
        <span>
          Illustrative prototype analysis. It does not constitute financial advice, lending approval or a
          commitment by HSBC.
        </span>
      </div>
    </div>
  );
}

function ExecutiveSummary({ reduceMotion }: { reduceMotion: boolean | null }) {
  const rows = [
    { label: 'Recommended funding option', value: 'HSBC Growth Loan' },
    { label: 'Idle capital identified', value: formatCurrency(CAPITAL_DERIVED.idleCapital) },
    { label: 'Capital Efficiency Index', value: `${CAPITAL.capitalEfficiencyIndex}/100` },
    { label: 'Revenue per £1 of capital', value: perPound(CAPITAL_DERIVED.efficiency) },
    { label: 'Highest-return deployment', value: 'AI and process automation' },
  ];
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Landmark size={16} style={{ color: RED }} />
          <h3 className="text-base font-bold" style={{ color: '#111' }}>Capital Intelligence Summary</h3>
        </div>
        <ProvenanceBadge type="estimated" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        {rows.map((r) => (
          <div key={r.label} className="rounded border p-3" style={{ borderColor: '#eee', background: '#fafafa' }}>
            <p className="text-xs uppercase tracking-wide font-medium mb-1" style={{ color: '#888' }}>{r.label}</p>
            <p className="text-base font-bold" style={{ color: '#111' }}>{r.value}</p>
          </div>
        ))}
        <div className="rounded border p-3" style={{ borderColor: '#fecaca', background: '#fff0f0' }}>
          <p className="text-xs uppercase tracking-wide font-medium mb-1" style={{ color: RED }}>Recommended immediate action</p>
          <p className="text-xs font-medium leading-snug" style={{ color: '#7f1d1d' }}>
            Deploy a controlled portion of idle capital into automation while preserving BrightCart’s required operating reserve.
          </p>
        </div>
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#888' }}>Capital journey</p>
      <CapitalFlow reduceMotion={reduceMotion} />
    </Card>
  );
}

/* ------------------------------------------------------------------ *
 * Section wrapper with numbered step header
 * ------------------------------------------------------------------ */
function StepHeader({ step, title, subtitle, Icon }: {
  step: number; title: string; subtitle: string; Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div
        className="w-9 h-9 rounded flex items-center justify-center shrink-0 text-white"
        style={{ background: RED }}
      >
        <Icon size={18} style={{ color: 'white' }} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold" style={{ color: RED }}>STEP {step}</span>
        </div>
        <h3 className="text-lg font-bold leading-tight" style={{ color: '#111' }}>{title}</h3>
        <p className="text-sm" style={{ color: '#666' }}>{subtitle}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Section 1 — Funding Navigator
 * ------------------------------------------------------------------ */
function FundingNavigatorSection({ onNavigate }: { onNavigate?: (section: string) => void }) {
  const [amount, setAmount] = useState(CAPITAL.defaultFundingRequirement);
  const [term, setTerm] = useState(CAPITAL.defaultTerm);
  const [objective, setObjective] = useState<FundingObjective>('balanced-fit');
  const [selected, setSelected] = useState<string | null>('hsbc-growth-loan');
  const [whyOpen, setWhyOpen] = useState(false);
  const [ctaOpen, setCtaOpen] = useState(false);

  const results = useMemo(
    () => scoreFundingOptions(amount, term, objective),
    [amount, term, objective],
  );
  const recommended = useMemo(() => recommendedFunding(results), [results]);

  return (
    <section className="pt-2" style={{ borderTop: '1px solid #e2e2e2' }}>
      <StepHeader
        step={1}
        title="Funding Navigator™"
        subtitle="Compare lending options by cost, approval likelihood, flexibility and alignment with BrightCart’s growth plan."
        Icon={Landmark}
      />

      {/* Controls */}
      <Card className="mb-4">
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-2" style={{ color: '#888' }}>
              Funding requirement
            </label>
            <p className="text-2xl font-bold mb-2" style={{ color: '#111' }}>{formatCurrency(amount)}</p>
            <input
              type="range"
              min={CAPITAL.fundingMin}
              max={CAPITAL.fundingMax}
              step={5_000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              aria-label="Funding requirement"
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: RED, background: '#f0f0f0' }}
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: '#bbb' }}>
              <span>{formatCurrency(CAPITAL.fundingMin)}</span>
              <span>{formatCurrency(CAPITAL.fundingMax)}</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-2" style={{ color: '#888' }}>
              Preferred repayment term
            </label>
            <div className="flex flex-wrap gap-2">
              {CAPITAL.termOptions.map((t) => (
                <button
                  key={t}
                  onClick={() => setTerm(t)}
                  className="px-3 py-2 text-xs rounded font-medium border transition-all"
                  style={{
                    background: term === t ? RED : 'white',
                    color: term === t ? 'white' : '#555',
                    borderColor: term === t ? RED : '#e2e2e2',
                  }}
                >
                  {t} years
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-2" style={{ color: '#888' }}>
              Primary objective
            </label>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value as FundingObjective)}
              className="w-full px-3 py-2 text-sm rounded border bg-white"
              style={{ borderColor: '#e2e2e2', color: '#333' }}
            >
              {FUNDING_OBJECTIVES.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
            <p className="text-xs mt-2" style={{ color: '#888' }}>
              Strategic Fit Score weights adjust with your objective.
            </p>
          </div>
        </div>
      </Card>

      {/* Desktop comparison table */}
      <div className="hidden md:block bg-white rounded border overflow-hidden mb-4" style={{ borderColor: '#e2e2e2' }}>
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #e2e2e2' }}>
              {['Provider', 'Rate', 'Monthly', 'Total cost', 'Approval', 'Term', 'Fee', 'Flexibility', 'Speed', 'Fit score'].map((h) => (
                <th key={h} className="text-left font-semibold px-3 py-2.5" style={{ color: '#888' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((r) => {
              const isRec = r.id === recommended.id;
              const isSel = r.id === selected;
              return (
                <tr
                  key={r.id}
                  onClick={() => setSelected(r.id)}
                  className="cursor-pointer transition-colors"
                  style={{
                    borderBottom: '1px solid #f0f0f0',
                    background: isSel ? '#fff0f0' : isRec ? '#fafafa' : 'white',
                  }}
                >
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold" style={{ color: '#111' }}>{r.name}</span>
                      {isRec && <Badge color="white" bg={RED} border={RED}>Recommended</Badge>}
                    </div>
                    <span className="text-xs" style={{ color: '#aaa' }}>{r.provider}</span>
                  </td>
                  <td className="px-3 py-3" style={{ color: '#333' }}>{formatPercent(r.interestRate)}</td>
                  <td className="px-3 py-3" style={{ color: '#333' }}>{formatCurrency(Math.round(r.monthly))}</td>
                  <td className="px-3 py-3 font-medium" style={{ color: '#111' }}>{formatCurrency(Math.round(r.totalCost))}</td>
                  <td className="px-3 py-3" style={{ color: '#00875a' }}>{r.approvalLikelihood}%</td>
                  <td className="px-3 py-3" style={{ color: '#333' }}>{term}y</td>
                  <td className="px-3 py-3" style={{ color: '#333' }}>{formatPercent(r.arrangementFeePct)}</td>
                  <td className="px-3 py-3" style={{ color: '#333' }}>{r.flexibility}</td>
                  <td className="px-3 py-3" style={{ color: '#333' }}>{r.decisionSpeed}</td>
                  <td className="px-3 py-3">
                    <span className="font-bold" style={{ color: isRec ? RED : '#111' }}>{r.fitScore}</span>
                    <span style={{ color: '#bbb' }}>/100</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3 mb-4">
        {results.map((r) => {
          const isRec = r.id === recommended.id;
          return (
            <div
              key={r.id}
              onClick={() => setSelected(r.id)}
              className="bg-white rounded border p-4"
              style={{ borderColor: r.id === selected ? RED : '#e2e2e2' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm" style={{ color: '#111' }}>{r.name}</span>
                {isRec && <Badge color="white" bg={RED} border={RED}>Recommended</Badge>}
              </div>
              <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                <span style={{ color: '#888' }}>Rate</span><span style={{ color: '#333' }}>{formatPercent(r.interestRate)}</span>
                <span style={{ color: '#888' }}>Monthly</span><span style={{ color: '#333' }}>{formatCurrency(Math.round(r.monthly))}</span>
                <span style={{ color: '#888' }}>Total cost</span><span className="font-medium" style={{ color: '#111' }}>{formatCurrency(Math.round(r.totalCost))}</span>
                <span style={{ color: '#888' }}>Approval</span><span style={{ color: '#00875a' }}>{r.approvalLikelihood}%</span>
                <span style={{ color: '#888' }}>Flexibility</span><span style={{ color: '#333' }}>{r.flexibility}</span>
                <span style={{ color: '#888' }}>Speed</span><span style={{ color: '#333' }}>{r.decisionSpeed}</span>
                <span style={{ color: '#888' }}>Fit score</span><span className="font-bold" style={{ color: isRec ? RED : '#111' }}>{r.fitScore}/100</span>
              </div>
              <div className="mt-2">{ILLUSTRATIVE_TAG}</div>
            </div>
          );
        })}
      </div>

      <p className="text-xs mb-4" style={{ color: '#888' }}>
        All four options are illustrative prototype funding options. {ILLUSTRATIVE_TAG}
      </p>

      {/* Recommended option */}
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#888' }}>Recommended Option</p>
          <Badge color="#1e40af" bg="#eff6ff" border="#bfdbfe">Strategic Fit {recommended.fitScore}/100</Badge>
        </div>
        <p className="text-xl font-bold mb-2" style={{ color: '#111' }}>{recommended.name}</p>
        <p className="text-sm leading-relaxed mb-3" style={{ color: '#555' }}>
          HSBC Growth Loan provides the strongest balance of borrowing cost, approval likelihood, repayment
          flexibility and alignment with BrightCart’s staged AI and operational investment plan. The fastest
          lender has a higher approval probability, but its shorter term and higher cost place greater pressure
          on working capital.
        </p>

        <button
          onClick={() => setWhyOpen((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-medium"
          style={{ color: RED }}
          aria-expanded={whyOpen}
        >
          Why not simply select the lowest rate?
          {whyOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {whyOpen && (
          <ul className="mt-3 space-y-1.5">
            {[
              'Approval probability affects practical accessibility.',
              'Short repayment terms may increase liquidity pressure.',
              'Fees can materially change total cost.',
              'Flexibility matters when returns emerge gradually.',
              'The best option should match the investment’s cash-flow profile.',
            ].map((p) => (
              <li key={p} className="flex items-start gap-2 text-xs" style={{ color: '#555' }}>
                <CheckCircle size={12} className="mt-0.5 shrink-0" style={{ color: '#00875a' }} />
                {p}
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Strategic Fit weighting transparency */}
      <Card className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#888' }}>
          Strategic Fit Score weighting
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            ['Borrowing cost', '30%'], ['Approval likelihood', '25%'], ['Flexibility', '20%'],
            ['Term alignment', '15%'], ['Decision speed', '10%'],
          ].map(([l, w]) => (
            <div key={l} className="rounded border p-2 text-center" style={{ borderColor: '#eee' }}>
              <p className="text-sm font-bold" style={{ color: '#111' }}>{w}</p>
              <p className="text-xs" style={{ color: '#888' }}>{l}</p>
            </div>
          ))}
        </div>
        <p className="text-xs mt-2" style={{ color: '#aaa' }}>Weights adjust modestly with the selected primary objective.</p>
      </Card>

      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={() => setCtaOpen((v) => !v)}
          className="px-4 py-2 rounded text-sm font-semibold text-white"
          style={{ background: RED }}
        >
          Prepare Funding Discussion
        </button>
        {onNavigate && <CrossLink label="Open Financing Planner" onClick={() => onNavigate('financing')} />}
      </div>
      {ctaOpen && (
        <div className="rounded border p-4 mt-3 text-sm" style={{ borderColor: '#e2e2e2', background: '#fafafa', color: '#555' }}>
          A funding discussion would prepare an illustrative summary of BrightCart’s preferred option, term and
          objective for review with an HSBC Relationship Manager. This prototype does not submit an application,
          imply eligibility or confirm approval.
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Section 2 — Idle Capital Monitor
 * ------------------------------------------------------------------ */
function IdleCapitalSection({ onNavigate, reduceMotion }: {
  onNavigate?: (section: string) => void; reduceMotion: boolean | null;
}) {
  const [reserve, setReserve] = useState(CAPITAL.requiredOperatingReserve);
  const idle = idleCapital(CAPITAL.currentCashBalance, reserve);
  const oppCost = opportunityCost(idle, CAPITAL.alternativeReturnRate);
  const state = reserveState(reserve, CAPITAL.currentCashBalance);
  const monthlyOutflow = 1_278_000 / 3; // canonical 90-day outflow → monthly
  const coverage = liquidityCoverageMonths(reserve, monthlyOutflow);

  const stateCfg = {
    below: { label: 'Potential liquidity risk', color: '#db0011', bg: '#fef2f2', desc: 'Reserve is below the prudent band — liquidity may be exposed.' },
    recommended: { label: 'Balanced liquidity protection', color: '#00875a', bg: '#f0fdf4', desc: 'Reserve sits within the recommended prudent range.' },
    excess: { label: 'Capital may be underutilised', color: '#d97706', bg: '#fff7ed', desc: 'Reserve is above the prudent band — excess capital could be deployed.' },
  }[state];

  const donutData = [
    { name: 'Operating reserve', value: reserve, color: '#0f766e' },
    { name: 'Idle / deployable', value: Math.max(0, idle), color: RED },
  ];

  return (
    <section className="pt-2" style={{ borderTop: '1px solid #e2e2e2' }}>
      <StepHeader
        step={2}
        title="Idle Capital Monitor™"
        subtitle="Separate essential liquidity from deployable capital and estimate the cost of leaving excess funds unused."
        Icon={Wallet}
      />

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        {/* Donut + headline */}
        <Card>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold" style={{ color: '#111' }}>Reserve versus idle capital</p>
            <ProvenanceBadge type="derived" />
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={donutData} dataKey="value" innerRadius={42} outerRadius={64} paddingAngle={2} stroke="none"
                  isAnimationActive={!reduceMotion}>
                  {donutData.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              <div>
                <p className="text-xs" style={{ color: '#888' }}>Current cash balance</p>
                <p className="text-lg font-bold" style={{ color: '#111' }}>{formatCurrency(CAPITAL.currentCashBalance)}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: '#0f766e' }} />
                  <span className="text-xs" style={{ color: '#888' }}>Reserve</span>
                  <p className="text-sm font-semibold" style={{ color: '#0f766e' }}>{formatCurrency(reserve)}</p>
                </div>
                <div>
                  <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: RED }} />
                  <span className="text-xs" style={{ color: '#888' }}>Idle</span>
                  <motion.p
                    key={idle}
                    initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-semibold" style={{ color: RED }}
                  >
                    {formatCurrency(idle)}
                  </motion.p>
                </div>
              </div>
            </div>
          </div>

          {/* Cash allocation bar */}
          <div className="mt-4">
            <div className="h-7 rounded overflow-hidden flex" style={{ background: '#f0f0f0' }}>
              <motion.div
                className="h-full flex items-center justify-center"
                style={{ background: '#0f766e' }}
                initial={reduceMotion ? false : { width: 0 }}
                animate={{ width: `${(reserve / CAPITAL.currentCashBalance) * 100}%` }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-xs text-white font-medium px-1">Reserve</span>
              </motion.div>
              <motion.div
                className="h-full flex items-center justify-center"
                style={{ background: RED }}
                initial={reduceMotion ? false : { width: 0 }}
                animate={{ width: `${(Math.max(0, idle) / CAPITAL.currentCashBalance) * 100}%` }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-xs text-white font-medium px-1">Idle</span>
              </motion.div>
            </div>
            <p className="text-xs mt-2 font-mono" style={{ color: '#888' }}>
              {formatCurrency(CAPITAL.currentCashBalance)} − {formatCurrency(reserve)} = {formatCurrency(idle)}
            </p>
          </div>
        </Card>

        {/* Reserve breakdown + opportunity cost */}
        <Card>
          <p className="text-sm font-semibold mb-3" style={{ color: '#111' }}>Required reserve breakdown</p>
          <div className="space-y-2 mb-4">
            {CAPITAL.reserveBreakdown.map((b) => (
              <div key={b.label} className="flex justify-between text-sm">
                <span style={{ color: '#555' }}>{b.label}</span>
                <span className="font-medium" style={{ color: '#111' }}>{formatCurrency(b.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-2" style={{ borderTop: '1px solid #eee' }}>
              <span className="font-semibold" style={{ color: '#111' }}>Total required reserve</span>
              <span className="font-bold" style={{ color: '#0f766e' }}>{formatCurrency(74_000)}</span>
            </div>
          </div>

          <div className="rounded border p-3" style={{ borderColor: '#fed7aa', background: '#fff7ed' }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9a3412' }}>Estimated annual opportunity cost</p>
              <ProvenanceBadge type="estimated" />
            </div>
            <motion.p key={oppCost} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }}
              className="text-2xl font-bold mt-1" style={{ color: '#9a3412' }}>
              {formatCurrency(Math.round(oppCost))}
            </motion.p>
            <p className="text-xs mt-1 font-mono" style={{ color: '#9a3412' }}>
              {formatCurrency(idle)} × {formatPercent(CAPITAL.alternativeReturnRate, 2)} (illustrative hurdle rate)
            </p>
            <p className="text-xs mt-1" style={{ color: '#9a3412' }}>
              This is not guaranteed investment income — it estimates the value of leaving excess funds unused.
            </p>
          </div>
        </Card>
      </div>

      {/* 67-day timeline */}
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold" style={{ color: '#111' }}>Days above required reserve</p>
          <span className="text-lg font-bold" style={{ color: RED }}>{CAPITAL.daysAboveReserve} days</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: '#f0f0f0' }}>
          <motion.div className="h-full rounded-full" style={{ background: RED }}
            initial={reduceMotion ? false : { width: 0 }} animate={{ width: '74%' }} transition={{ duration: 0.8 }} />
        </div>
        <div className="flex justify-between text-xs mt-1" style={{ color: '#bbb' }}>
          <span>Day 0</span><span>Day 30</span><span>Day 67 (today)</span><span>Day 90</span>
        </div>
      </Card>

      {/* Reserve stress test */}
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold" style={{ color: '#111' }}>Interactive reserve stress test</p>
          <Badge color={stateCfg.color} bg={stateCfg.bg} border={stateCfg.color + '55'}>{stateCfg.label}</Badge>
        </div>
        <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: '#888' }}>
          Required operating reserve — {formatCurrency(reserve)}
        </label>
        <input
          type="range" min={50_000} max={120_000} step={2_000} value={reserve}
          onChange={(e) => setReserve(Number(e.target.value))}
          aria-label="Required operating reserve"
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: RED, background: '#f0f0f0' }}
        />
        <div className="flex justify-between text-xs mt-1 mb-4" style={{ color: '#bbb' }}>
          <span>{formatCurrency(50_000)}</span><span>{formatCurrency(120_000)}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { l: 'Idle capital', v: formatCurrency(idle), c: RED },
            { l: 'Liquidity coverage', v: `${coverage.toFixed(1)} mo`, c: '#111' },
            { l: 'Opportunity cost', v: formatCurrency(Math.round(oppCost)), c: '#9a3412' },
            { l: 'Deployment capacity', v: formatCurrency(Math.max(0, idle)), c: '#0f766e' },
          ].map((m) => (
            <div key={m.l} className="rounded border p-3" style={{ borderColor: '#eee' }}>
              <p className="text-xs" style={{ color: '#888' }}>{m.l}</p>
              <p className="text-base font-bold" style={{ color: m.c }}>{m.v}</p>
            </div>
          ))}
        </div>
        <div className="rounded p-3 mt-3 text-xs" style={{ background: stateCfg.bg, color: stateCfg.color }}>
          {stateCfg.desc} The prudent band is an illustrative 30%–55% of the current cash balance.
        </div>
      </Card>

      {/* Insight */}
      <div className="rounded border-l-4 p-4 mb-3" style={{ borderLeftColor: RED, background: '#fafafa' }}>
        <p className="text-sm leading-relaxed" style={{ color: '#444' }}>
          BrightCart can potentially redeploy up to {formatCurrency(CAPITAL_DERIVED.idleCapital)} without falling below
          its estimated operating reserve. Management should not deploy the full amount immediately; capital should be
          released in stages and reviewed against seasonal working-capital requirements.
        </p>
      </div>
      <p className="text-xs mb-4" style={{ color: '#888' }}>
        Idle capital is not automatically wasteful. A reserve protects payroll, suppliers, tax obligations and
        unexpected disruption. The purpose of this analysis is to distinguish prudent liquidity from structurally
        underused capital.
      </p>
      {onNavigate && <CrossLink label="Review Cash-Flow Scenario" onClick={() => onNavigate('cashflow')} />}
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Section 3 — Capital Efficiency Index
 * ------------------------------------------------------------------ */
function EfficiencySection({ onNavigate, reduceMotion }: {
  onNavigate?: (section: string) => void; reduceMotion: boolean | null;
}) {
  const eff = CAPITAL_DERIVED.efficiency;
  const gap = CAPITAL_DERIVED.utilisationGap;
  const scaleMax = 5.0;
  const pos = (v: number) => Math.min(100, (v / scaleMax) * 100);

  const driverData = CAPITAL.efficiencyDrivers.map((d) => ({ name: d.label, value: d.weight, fill: RED }));

  return (
    <section className="pt-2" style={{ borderTop: '1px solid #e2e2e2' }}>
      <StepHeader
        step={3}
        title="Capital Efficiency Index™"
        subtitle="Measure how much revenue BrightCart generates from each £1 of capital and identify the sources of underutilisation."
        Icon={Gauge}
      />

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: '#111' }}>Revenue per £1 of capital</p>
            <ProvenanceBadge type="illustrative-benchmark" />
          </div>
          <div className="flex items-end gap-6 mb-4">
            <div>
              <p className="text-4xl font-bold" style={{ color: RED }}>{perPound(eff)}</p>
              <p className="text-xs" style={{ color: '#888' }}>BrightCart</p>
            </div>
            <div>
              <p className="text-xl font-semibold" style={{ color: '#888' }}>{perPound(CAPITAL.industryAverageEfficiency)}</p>
              <p className="text-xs" style={{ color: '#888' }}>Industry average</p>
            </div>
            <div>
              <p className="text-xl font-semibold" style={{ color: '#00875a' }}>{perPound(CAPITAL.topQuartileEfficiency)}</p>
              <p className="text-xs" style={{ color: '#888' }}>Top quartile</p>
            </div>
          </div>

          {/* Efficiency scale */}
          <div className="relative mt-6 mb-2">
            <div className="h-3 rounded-full" style={{ background: 'linear-gradient(to right,#fecaca,#fde68a,#bbf7d0,#86efac)' }} />
            {[
              { v: eff, label: 'BrightCart', color: RED },
              { v: CAPITAL.industryAverageEfficiency, label: 'Peer avg', color: '#555' },
              { v: CAPITAL.topQuartileEfficiency, label: 'Top Q', color: '#00875a' },
            ].map((m) => (
              <motion.div key={m.label} className="absolute -top-1 flex flex-col items-center"
                style={{ left: `${pos(m.v)}%`, transform: 'translateX(-50%)' }}
                initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="w-1 h-5 rounded" style={{ background: m.color }} />
                <span className="text-xs mt-0.5 whitespace-nowrap" style={{ color: m.color }}>{m.label}</span>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between text-xs mt-6" style={{ color: '#bbb' }}>
            <span>Underutilised</span><span>Developing</span><span>Efficient</span><span>Top Quartile</span>
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold mb-3" style={{ color: '#111' }}>Index &amp; utilisation gap</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded border p-3 text-center" style={{ borderColor: '#eee' }}>
              <p className="text-3xl font-bold" style={{ color: RED }}>{CAPITAL.capitalEfficiencyIndex}</p>
              <p className="text-xs" style={{ color: '#888' }}>Capital Efficiency Index /100</p>
            </div>
            <div className="rounded border p-3 text-center" style={{ borderColor: '#eee' }}>
              <p className="text-3xl font-bold" style={{ color: '#d97706' }}>{Math.round(gap)}%</p>
              <p className="text-xs" style={{ color: '#888' }}>Below illustrative peer average</p>
            </div>
          </div>
          <p className="text-xs mt-3 font-mono" style={{ color: '#aaa' }}>
            ({perPound(CAPITAL.industryAverageEfficiency)} − {perPound(eff)}) ÷ {perPound(CAPITAL.industryAverageEfficiency)} × 100 ≈ {Math.round(gap)}%
          </p>
        </Card>
      </div>

      {/* Drivers */}
      <Card className="mb-4">
        <p className="text-sm font-semibold mb-3" style={{ color: '#111' }}>Capital-efficiency gap drivers</p>
        <div className="grid lg:grid-cols-2 gap-4">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={driverData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
              <XAxis type="number" hide domain={[0, 40]} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fill: '#666' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => `${v}% of gap`} cursor={{ fill: '#f8f8f8' }} />
              <Bar dataKey="value" fill={RED} fillOpacity={0.8} radius={[0, 3, 3, 0]} isAnimationActive={!reduceMotion} />
            </BarChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {CAPITAL.efficiencyDrivers.map((d) => (
              <div key={d.id} className="rounded border p-2.5" style={{ borderColor: '#eee' }}>
                <div className="flex justify-between">
                  <span className="text-sm font-medium" style={{ color: '#111' }}>{d.label}</span>
                  <span className="text-sm font-bold" style={{ color: RED }}>{d.value}</span>
                </div>
                <p className="text-xs" style={{ color: '#888' }}>{d.effect}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Insight + improvement scenario */}
      <div className="rounded border-l-4 p-4 mb-4" style={{ borderLeftColor: RED, background: '#fafafa' }}>
        <p className="text-sm leading-relaxed" style={{ color: '#444' }}>
          BrightCart’s strong revenue growth is not being matched by equally efficient use of working capital. The
          largest improvement opportunities are inventory optimisation, redeployment of excess cash and reduction of
          manual operating effort.
        </p>
      </div>

      <Card className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold" style={{ color: '#111' }}>Improvement scenario</p>
          <Badge color="#6b21a8" bg="#fdf4ff" border="#e9d5ff">Illustrative scenario target</Badge>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { l: 'Current', v: eff, c: RED },
            { l: 'After recommended initiatives', v: CAPITAL.improvementScenarioEfficiency, c: '#d97706' },
            { l: 'Long-term peer target', v: CAPITAL.industryAverageEfficiency, c: '#00875a' },
          ].map((s) => (
            <div key={s.l} className="rounded border p-3 text-center" style={{ borderColor: '#eee' }}>
              <p className="text-2xl font-bold" style={{ color: s.c }}>{perPound(s.v)}</p>
              <p className="text-xs mt-1" style={{ color: '#888' }}>{s.l}</p>
            </div>
          ))}
        </div>
        <p className="text-xs mt-2" style={{ color: '#aaa' }}>
          The {perPound(CAPITAL.improvementScenarioEfficiency)} figure is an illustrative scenario target, not a guaranteed outcome.
        </p>
      </Card>

      {onNavigate && <CrossLink label="View Competitive Gaps" onClick={() => onNavigate('competitiveness')} />}
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Section 4 — Smart Capital Deployment Engine
 * ------------------------------------------------------------------ */
function DeploymentSection({ onNavigate }: { onNavigate?: (section: string) => void }) {
  const available = CAPITAL_DERIVED.idleCapital; // £110,000
  const [objective, setObjective] = useState<CapitalObjective>('balanced-growth');
  const [allocations, setAllocations] = useState<number[]>(DEFAULT_ALLOCATION);

  const validation = validateAllocation(allocations, available);
  const benefit = portfolioBenefit(allocations);
  const blendedReturn = weightedPortfolioReturn(allocations);
  const risk = weightedRiskLevel(allocations);

  function setObjectiveAndAllocate(obj: CapitalObjective) {
    setObjective(obj);
    setAllocations(recommendedAllocation(obj, available));
  }

  function updateAllocation(index: number, value: number) {
    const next = [...allocations];
    next[index] = Math.max(0, value);
    setAllocations(next);
  }

  function restore() {
    setObjective('balanced-growth');
    setAllocations(DEFAULT_ALLOCATION);
  }

  const donutData = DEPLOYMENT_OPTIONS.map((o, i) => ({
    name: o.title, value: Math.max(0, allocations[i] ?? 0), color: o.color,
  }));

  const ranking = [...DEPLOYMENT_OPTIONS].sort((a, b) => b.roi - a.roi);

  return (
    <section className="pt-2" style={{ borderTop: '1px solid #e2e2e2' }}>
      <StepHeader
        step={4}
        title="Smart Capital Deployment Engine™"
        subtitle="Allocate available capital across growth, efficiency, sustainability and balance-sheet priorities."
        Icon={Target}
      />

      {/* Strategy selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CAPITAL_OBJECTIVES.map((o) => (
          <button
            key={o.id}
            onClick={() => setObjectiveAndAllocate(o.id)}
            className="px-3 py-2 text-xs rounded font-medium border transition-all"
            style={{
              background: objective === o.id ? RED : 'white',
              color: objective === o.id ? 'white' : '#555',
              borderColor: objective === o.id ? RED : '#e2e2e2',
            }}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        {/* Allocation controls */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: '#111' }}>Allocate {formatCurrency(available)} idle capital</p>
            <button onClick={restore} className="flex items-center gap-1 text-xs font-medium" style={{ color: RED }}>
              <RotateCcw size={12} /> Restore Recommended
            </button>
          </div>
          <div className="space-y-4">
            {DEPLOYMENT_OPTIONS.map((o, i) => (
              <div key={o.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium" style={{ color: '#333' }}>{o.title}</span>
                  <span className="font-semibold" style={{ color: o.color }}>{formatCurrency(allocations[i] ?? 0)}</span>
                </div>
                <input
                  type="range" min={0} max={available} step={1_000} value={allocations[i] ?? 0}
                  onChange={(e) => updateAllocation(i, Number(e.target.value))}
                  aria-label={`Allocation for ${o.title}`}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: o.color, background: '#f0f0f0' }}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid #eee' }}>
            <span className="text-xs" style={{ color: '#888' }}>Remaining unallocated</span>
            <span className="text-sm font-bold" style={{ color: validation.remaining < 0 ? RED : '#111' }}>
              {formatCurrency(validation.remaining)}
            </span>
          </div>
          {validation.overLimit && (
            <div className="rounded p-2.5 mt-2 text-xs flex items-center gap-2" style={{ background: '#fef2f2', color: RED }}>
              <AlertTriangle size={13} /> Allocation exceeds available idle capital of {formatCurrency(available)}. Reduce an allocation to proceed.
            </div>
          )}
        </Card>

        {/* Donut + portfolio summary */}
        <Card>
          <p className="text-sm font-semibold mb-3" style={{ color: '#111' }}>Allocation &amp; expected portfolio</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={130} height={130}>
              <PieChart>
                <Pie data={donutData} dataKey="value" innerRadius={38} outerRadius={60} paddingAngle={2} stroke="none">
                  {donutData.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              <div>
                <p className="text-xs" style={{ color: '#888' }}>Total estimated portfolio benefit</p>
                <p className="text-xl font-bold" style={{ color: '#00875a' }}>{formatCurrency(Math.round(benefit))}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-xs" style={{ color: '#888' }}>Blended return</p>
                  <p className="text-sm font-semibold" style={{ color: '#111' }}>{Math.round(blendedReturn)}%</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#888' }}>Weighted risk</p>
                  <p className="text-sm font-semibold" style={{ color: '#d97706' }}>{risk.label}</p>
                </div>
              </div>
            </div>
          </div>
          <ProvenanceBadge type="estimated" className="mt-3" />
        </Card>
      </div>

      {/* Expected return bars + risk-return + time to value */}
      <Card className="mb-4">
        <p className="text-sm font-semibold mb-3" style={{ color: '#111' }}>Illustrative risk-adjusted return scenarios</p>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            {DEPLOYMENT_OPTIONS.map((o) => (
              <div key={o.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: '#555' }}>{o.title}</span>
                  <span className="font-semibold" style={{ color: o.color }}>{o.roi}%</span>
                </div>
                <div className="h-5 rounded" style={{ background: '#f0f0f0' }}>
                  <motion.div className="h-full rounded" style={{ background: o.color }}
                    initial={{ width: 0 }} animate={{ width: `${(o.roi / 220) * 100}%` }} transition={{ duration: 0.7 }} />
                </div>
                <p className="text-xs mt-0.5" style={{ color: '#aaa' }}>Risk: {o.risk} · Time to value: {o.timeToValue}</p>
              </div>
            ))}
          </div>

          {/* Risk-return plot */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#888' }}>Risk vs return</p>
            <div className="relative rounded border" style={{ borderColor: '#eee', height: 200, background: '#fafafa' }}>
              {DEPLOYMENT_OPTIONS.map((o) => (
                <div key={o.id} className="absolute flex flex-col items-center"
                  style={{ left: `${o.riskWeight * 80 + 6}%`, bottom: `${(o.roi / 240) * 78 + 6}%`, transform: 'translate(-50%,50%)' }}>
                  <span className="w-3 h-3 rounded-full" style={{ background: o.color }} />
                  <span className="text-xs mt-1 whitespace-nowrap" style={{ color: '#666' }}>{o.roi}%</span>
                </div>
              ))}
              <span className="absolute bottom-1 left-2 text-xs" style={{ color: '#bbb' }}>Lower risk</span>
              <span className="absolute bottom-1 right-2 text-xs" style={{ color: '#bbb' }}>Higher risk</span>
              <span className="absolute top-1 left-2 text-xs" style={{ color: '#bbb' }}>Higher return ↑</span>
            </div>
          </div>
        </div>
        <div className="rounded p-3 mt-4 text-xs" style={{ background: '#fff7ed', color: '#7c2d12' }}>
          These are <strong>illustrative risk-adjusted return scenarios</strong>. Automation, marketing and
          sustainability values are estimated operating returns. Debt-reduction value includes avoided interest and
          improved resilience, not a one-year cash return. Outcomes depend on execution, adoption and market conditions.
        </div>
      </Card>

      {/* Ranking + Growth Intelligence */}
      <Card className="mb-4">
        <p className="text-sm font-semibold mb-3" style={{ color: '#111' }}>Deployment ranking</p>
        <div className="rounded border-l-4 p-3 mb-4" style={{ borderLeftColor: RED, background: '#fff0f0' }}>
          <p className="text-sm font-semibold" style={{ color: '#111' }}>Recommended first investment: AI and Process Automation</p>
          <p className="text-xs mt-1" style={{ color: '#555' }}>
            It addresses BrightCart’s largest competitive gap, is supported by available transaction data and has an
            existing 90-day pilot plan with measurable operational outcomes.
          </p>
        </div>
        <div className="space-y-4">
          {ranking.map((o, rank) => (
            <div key={o.id} className="rounded border p-4" style={{ borderColor: '#eee' }}>
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: o.color }}>{rank + 1}</span>
                  <span className="font-semibold text-sm" style={{ color: '#111' }}>{o.title}</span>
                </div>
                <span className="text-lg font-bold shrink-0" style={{ color: o.color }}>{o.roi}%</span>
              </div>
              <p className="text-xs mb-1" style={{ color: '#666' }}>{o.role}</p>
              {o.breakdown && (
                <ul className="text-xs mb-1" style={{ color: '#888' }}>
                  {o.breakdown.map((b) => <li key={b.label}>· {b.label}: {formatCurrency(b.amount)}</li>)}
                </ul>
              )}
              {o.roiNote && <p className="text-xs italic" style={{ color: '#aaa' }}>{o.roiNote}</p>}
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                <Badge>Recommended: {formatCurrency(o.recommended)}</Badge>
                <Badge>Risk: {o.risk}</Badge>
                <Badge>Time to value: {o.timeToValue}</Badge>
              </div>
              <GrowthIntelligencePanel title={o.intelligenceTitle} insight={o.intelligenceInsight} />
            </div>
          ))}
        </div>

        <div className="rounded border p-3 mt-4 text-xs" style={{ borderColor: '#bfdbfe', background: '#eff6ff', color: '#1e3a5f' }}>
          {GROWTH_INTELLIGENCE_DISCLOSURE}
        </div>
      </Card>

      {onNavigate && <CrossLink label="View Demand Automation Pilot" onClick={() => onNavigate('demand')} />}
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Final recommendation + methodology
 * ------------------------------------------------------------------ */
function FinalRecommendation({ onNavigate }: { onNavigate?: (section: string) => void }) {
  const actions = [
    { t: 'Fund the automation pilot', d: 'Allocate £40,000 to the demand-optimisation pilot, integration and workforce training.' },
    { t: 'Stage remaining investments', d: 'Release marketing and sustainability capital only after the first pilot reaches agreed governance and performance gates.' },
    { t: 'Preserve financial resilience', d: 'Maintain the required operating reserve and assign £20,000 to debt reduction or contingency protection.' },
    { t: 'Use borrowing selectively', d: 'Use the recommended HSBC Growth Loan where external capital enables a high-return initiative without weakening operational liquidity.' },
  ];
  const timeline = [
    { phase: 'Now — Weeks 1–2', text: 'Confirm liquidity reserve and approve automation pilot budget' },
    { phase: 'Next — Months 1–3', text: 'Deploy automation capital and monitor early operational outcomes' },
    { phase: 'Then — Months 3–6', text: 'Release marketing and sustainability allocations after pilot review' },
    { phase: 'Review — Month 6', text: 'Recalculate capital efficiency and decide whether additional borrowing is justified' },
  ];

  return (
    <section className="pt-2" style={{ borderTop: '1px solid #e2e2e2' }}>
      <div className="rounded border p-5" style={{ background: '#111', borderColor: '#222' }}>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={18} style={{ color: RED }} />
          <h3 className="text-lg font-bold text-white">Recommended Capital Strategy for BrightCart</h3>
        </div>
        <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Preserve the {formatCurrency(74_000)} operating reserve, deploy the {formatCurrency(CAPITAL_DERIVED.idleCapital)}
          {' '}idle-capital pool in controlled stages and use external finance only where the expected investment return
          exceeds the borrowing cost and preserves sufficient liquidity.
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mb-5">
          {actions.map((a, i) => (
            <div key={a.t} className="rounded p-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <p className="text-sm font-semibold text-white mb-1">{i + 1}. {a.t}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{a.d}</p>
            </div>
          ))}
        </div>

        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Phased capital deployment
        </p>
        <div className="grid sm:grid-cols-4 gap-3 mb-5">
          {timeline.map((t) => (
            <div key={t.phase} className="rounded p-3" style={{ background: 'rgba(255,255,255,0.06)', borderTop: `2px solid ${RED}` }}>
              <p className="text-xs font-semibold text-white mb-1">{t.phase}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{t.text}</p>
            </div>
          ))}
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('plan')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-semibold text-white"
            style={{ background: RED }}
          >
            Add Capital Actions to 90-Day Plan
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </section>
  );
}

function MethodologyPanel() {
  const provLabel: Record<string, DataProvenance> = {
    'illustrative-benchmark': 'illustrative-benchmark',
    simulated: 'simulated',
    estimated: 'estimated',
    derived: 'derived',
  };
  return (
    <section className="pt-2" style={{ borderTop: '1px solid #e2e2e2' }}>
      <Card>
        <p className="text-sm font-semibold mb-3" style={{ color: '#111' }}>Methodology &amp; data provenance</p>
        <div className="grid sm:grid-cols-2 gap-2 mb-4">
          {CAPITAL_PROVENANCE.map((p) => (
            <div key={p.item} className="flex items-center justify-between rounded border p-2.5" style={{ borderColor: '#eee' }}>
              <span className="text-xs" style={{ color: '#555' }}>{p.item}</span>
              <ProvenanceBadge type={provLabel[p.type] ?? 'estimated'} />
            </div>
          ))}
        </div>
        <div className="space-y-2 text-xs" style={{ color: '#7c2d12' }}>
          <div className="rounded border p-3" style={{ background: '#fff7ed', borderColor: '#fed7aa' }}>
            All funding products, interest rates, approval probabilities, peer benchmarks and investment returns shown
            are illustrative prototype scenarios. This feature does not constitute financial advice, an offer of credit,
            a lending decision or confirmation of funding eligibility. No proprietary HSBC customer data is used in this
            demonstration.
          </div>
        </div>
      </Card>
    </section>
  );
}
