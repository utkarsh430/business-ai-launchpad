'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, DollarSign, Users, Zap, FileText, TrendingUp,
  Leaf, MessageSquare, BookOpen, X, ChevronRight, Filter, Star
} from 'lucide-react';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';

interface UseCase {
  id: string;
  title: string;
  description: string;
  department: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  color: string;
  bg: string;
  implementationCost: string;
  timeToValue: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  expectedROI: string;
  complexity: 'Simple' | 'Moderate' | 'Complex';
  value: 'High' | 'Medium' | 'Low';
  dataRequired: string[];
  readinessRequirement: number;
  fundingEligibility: string;
  businessValue: string;
  successStories: string;
  keyBenefit: string;
  featured?: boolean;
}

const USE_CASES: UseCase[] = [
  {
    id: 'demand-forecasting',
    title: 'Demand Forecasting',
    description: 'Predict future product demand using historical sales data and seasonal patterns to optimise purchasing and reduce stockouts.',
    department: 'Operations',
    icon: TrendingUp,
    color: '#1d4ed8',
    bg: '#eff6ff',
    implementationCost: '£18–28k',
    timeToValue: '8–12 weeks',
    riskLevel: 'Low',
    expectedROI: '150–220%',
    complexity: 'Moderate',
    value: 'High',
    dataRequired: ['24-month sales history', 'Product catalogue', 'Seasonal events', 'Promotional calendar'],
    readinessRequirement: 60,
    fundingEligibility: 'Digital Productivity Support Programme (86% match)',
    businessValue: 'Reduce stockout rate by 2–4pp and release £30–50k in working capital',
    successStories: 'Online retailers achieving 15–25% inventory reduction in first 6 months of deployment',
    keyBenefit: 'Reduces stockouts by up to 35%',
    featured: true,
  },
  {
    id: 'inventory-optimisation',
    title: 'Inventory Optimisation',
    description: 'Dynamically set reorder points and safety stock levels based on lead times, demand variability, and service level targets.',
    department: 'Operations',
    icon: Package,
    color: '#00875a',
    bg: '#f0fdf4',
    implementationCost: '£12–20k',
    timeToValue: '6–10 weeks',
    riskLevel: 'Low',
    expectedROI: '180–280%',
    complexity: 'Moderate',
    value: 'High',
    dataRequired: ['Inventory levels', 'Supplier lead times', 'Holding cost data', 'Service level targets'],
    readinessRequirement: 55,
    fundingEligibility: 'Digital Productivity Support Programme (86% match)',
    businessValue: 'Reduce excess inventory value by 10–20% and improve inventory turnover',
    successStories: 'SME retailers reducing overstock by £40–80k within 3 months',
    keyBenefit: 'Frees up to £48k working capital',
    featured: true,
  },
  {
    id: 'cashflow-forecasting',
    title: 'Cash Flow Forecasting',
    description: 'Forecast 90-day cash position using AI analysis of payment patterns, seasonal trends, and business cycle data.',
    department: 'Finance',
    icon: DollarSign,
    color: '#6b21a8',
    bg: '#faf5ff',
    implementationCost: '£14–22k',
    timeToValue: '6–10 weeks',
    riskLevel: 'Low',
    expectedROI: '130–200%',
    complexity: 'Moderate',
    value: 'High',
    dataRequired: ['12-month cash transaction history', 'Accounts receivable/payable', 'Sales pipeline', 'Seasonal patterns'],
    readinessRequirement: 60,
    fundingEligibility: 'Digital Productivity Support Programme (86% match)',
    businessValue: 'Improve cash visibility, reduce short-term borrowing costs by 15–25%',
    successStories: 'SMEs reducing working capital facility usage by 20% through better cash visibility',
    keyBenefit: '£24–36k estimated annual value',
  },
  {
    id: 'returns-reduction',
    title: 'Returns Reduction',
    description: 'Use AI to improve product descriptions, size guides, and imagery to reduce avoidable customer returns.',
    department: 'Operations',
    icon: Package,
    color: '#db0011',
    bg: '#fef2f2',
    implementationCost: '£12–18k',
    timeToValue: '10–14 weeks',
    riskLevel: 'Low',
    expectedROI: '120–190%',
    complexity: 'Simple',
    value: 'High',
    dataRequired: ['Return reasons data', 'Product descriptions', 'Customer reviews', 'Return rate by SKU'],
    readinessRequirement: 55,
    fundingEligibility: 'Digital Productivity Support Programme (86% match)',
    businessValue: 'Reduce return rate by 2–3pp; save £20–30k in returns processing costs annually',
    successStories: 'Online fashion retailers reducing returns by 25% through AI-enhanced product content',
    keyBenefit: '£19–27k estimated annual saving',
  },
  {
    id: 'customer-segmentation',
    title: 'Customer Segmentation',
    description: 'Automatically segment customers by behaviour, value, and purchase patterns to enable personalised marketing.',
    department: 'Marketing',
    icon: Users,
    color: '#0891b2',
    bg: '#ecfeff',
    implementationCost: '£10–16k',
    timeToValue: '10–16 weeks',
    riskLevel: 'Medium',
    expectedROI: '100–160%',
    complexity: 'Moderate',
    value: 'Medium',
    dataRequired: ['CRM data', 'Purchase history', 'Browsing behaviour', 'Email engagement data'],
    readinessRequirement: 65,
    fundingEligibility: 'Digital Productivity Support Programme (partial)',
    businessValue: 'Increase marketing ROI by 20–35%; improve customer lifetime value by 15%',
    successStories: 'E-commerce businesses increasing repeat purchase rate by 18% within 4 months',
    keyBenefit: '£18–29k estimated annual value',
  },
  {
    id: 'customer-support',
    title: 'Customer Support Assistant',
    description: 'AI-powered chat and email assistant that handles common customer queries, freeing staff for complex issues.',
    department: 'Customer Service',
    icon: MessageSquare,
    color: '#0891b2',
    bg: '#ecfeff',
    implementationCost: '£18–24k',
    timeToValue: '12–20 weeks',
    riskLevel: 'Medium',
    expectedROI: '80–130%',
    complexity: 'Complex',
    value: 'Medium',
    dataRequired: ['FAQ database', 'Historical support tickets', 'Product catalogue', 'Returns policy'],
    readinessRequirement: 70,
    fundingEligibility: 'Workforce AI Skills Support (74% match)',
    businessValue: 'Handle 40–60% of queries automatically; reduce support cost by 25–35%',
    successStories: 'Online retailers automating 50% of routine queries, improving response times from 4 hours to minutes',
    keyBenefit: '£15–22k estimated annual saving',
  },
  {
    id: 'knowledge-assistant',
    title: 'Knowledge Assistant',
    description: 'Internal AI assistant that helps employees quickly find information from documents, policies, and procedures.',
    department: 'Operations',
    icon: BookOpen,
    color: '#d97706',
    bg: '#fff7ed',
    implementationCost: '£12–16k',
    timeToValue: '14–20 weeks',
    riskLevel: 'Medium',
    expectedROI: '80–120%',
    complexity: 'Complex',
    value: 'Medium',
    dataRequired: ['Internal documents', 'Policies and procedures', 'Product documentation', 'Training materials'],
    readinessRequirement: 72,
    fundingEligibility: 'Workforce AI Skills Support (74% match)',
    businessValue: 'Reduce time spent searching for information by 30–50%; improve onboarding speed',
    successStories: 'SMEs reducing employee query time by 2–3 hours per week per staff member',
    keyBenefit: '£12–18k estimated annual saving',
  },
  {
    id: 'energy-optimisation',
    title: 'Energy Optimisation',
    description: 'AI-driven scheduling and monitoring to reduce energy consumption in warehouse and office operations.',
    department: 'Operations',
    icon: Leaf,
    color: '#00875a',
    bg: '#f0fdf4',
    implementationCost: '£5–8k',
    timeToValue: '4–8 weeks',
    riskLevel: 'Low',
    expectedROI: '180–250%',
    complexity: 'Simple',
    value: 'Medium',
    dataRequired: ['Energy consumption data', 'Operational schedules', 'Equipment inventory', 'Energy tariff data'],
    readinessRequirement: 50,
    fundingEligibility: 'SME Energy Efficiency Programme (82% match)',
    businessValue: 'Reduce energy costs by 8–15%; typical saving £10–20k per year',
    successStories: 'Warehouse operators achieving 12% energy reduction within 3 months through smart scheduling',
    keyBenefit: '£13,400 estimated annual saving',
  },
  {
    id: 'document-automation',
    title: 'Document Automation',
    description: 'Automate creation and processing of standard business documents including purchase orders, reports, and contracts.',
    department: 'Finance',
    icon: FileText,
    color: '#374151',
    bg: '#f9fafb',
    implementationCost: '£8–14k',
    timeToValue: '8–14 weeks',
    riskLevel: 'Low',
    expectedROI: '100–160%',
    complexity: 'Simple',
    value: 'Medium',
    dataRequired: ['Document templates', 'Existing documents', 'Process workflows', 'Approval chains'],
    readinessRequirement: 55,
    fundingEligibility: 'Digital Productivity Support Programme (partial)',
    businessValue: 'Reduce document preparation time by 60–80%; eliminate manual errors',
    successStories: 'Finance teams saving 5–8 hours per week on routine document creation and processing',
    keyBenefit: '3–5 hours per week time saving per staff member',
  },
  {
    id: 'invoice-processing',
    title: 'Invoice Processing',
    description: 'Automated AI extraction and processing of supplier invoices, matching to purchase orders and flagging discrepancies.',
    department: 'Finance',
    icon: DollarSign,
    color: '#374151',
    bg: '#f9fafb',
    implementationCost: '£6–12k',
    timeToValue: '6–10 weeks',
    riskLevel: 'Low',
    expectedROI: '120–180%',
    complexity: 'Simple',
    value: 'Medium',
    dataRequired: ['Invoice samples', 'Purchase order data', 'Supplier master data', 'Approval workflows'],
    readinessRequirement: 50,
    fundingEligibility: 'Digital Productivity Support Programme (partial)',
    businessValue: 'Process invoices 5–10x faster; reduce processing errors by 85–95%',
    successStories: 'Accounts payable teams reducing invoice processing time from 2 days to 30 minutes',
    keyBenefit: '80–90% reduction in manual processing time',
  },
];

const DEPARTMENTS = ['All', 'Operations', 'Finance', 'Marketing', 'Customer Service'];
const COMPLEXITIES = ['All', 'Simple', 'Moderate', 'Complex'];
const VALUES = ['All', 'High', 'Medium'];
const RISKS = ['All', 'Low', 'Medium', 'High'];

function RiskBadge({ risk }: { risk: 'Low' | 'Medium' | 'High' }) {
  const colors = { Low: { bg: '#f0fdf4', color: '#00875a' }, Medium: { bg: '#fff7ed', color: '#d97706' }, High: { bg: '#fef2f2', color: '#db0011' } };
  const c = colors[risk];
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: c.bg, color: c.color }}>
      {risk}
    </span>
  );
}

export function UseCaseMarketplace() {
  const [department, setDepartment] = useState('All');
  const [complexity, setComplexity] = useState('All');
  const [valueFilter, setValueFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [selected, setSelected] = useState<UseCase | null>(null);

  const filtered = useMemo(() =>
    USE_CASES.filter((uc) => {
      if (department !== 'All' && uc.department !== department) return false;
      if (complexity !== 'All' && uc.complexity !== complexity) return false;
      if (valueFilter !== 'All' && uc.value !== valueFilter) return false;
      if (riskFilter !== 'All' && uc.riskLevel !== riskFilter) return false;
      return true;
    }),
    [department, complexity, valueFilter, riskFilter]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={18} style={{ color: '#db0011' }} />
            <h1 className="text-xl font-bold" style={{ color: '#111' }}>
              AI Use Case Marketplace
            </h1>
          </div>
          <p className="text-sm" style={{ color: '#555' }}>
            Discover AI solutions you could deploy in your business. {USE_CASES.length} use cases available.
          </p>
        </div>
        <ProvenanceBadge type="illustrative-benchmark" />
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded border p-4"
        style={{ borderColor: '#e2e2e2' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Filter size={13} style={{ color: '#888' }} />
          <span className="text-xs font-medium uppercase tracking-wide" style={{ color: '#888' }}>Filter</span>
          <span
            className="ml-auto text-xs font-medium px-2 py-0.5 rounded"
            style={{ background: '#fef2f2', color: '#db0011' }}
          >
            {filtered.length} results
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {([
            { label: 'Department', options: DEPARTMENTS, value: department, setter: setDepartment },
            { label: 'Complexity', options: COMPLEXITIES, value: complexity, setter: setComplexity },
            { label: 'Value', options: VALUES, value: valueFilter, setter: setValueFilter },
            { label: 'Risk', options: RISKS, value: riskFilter, setter: setRiskFilter },
          ] as const).map((f) => (
            <div key={f.label}>
              <label className="text-xs font-medium mb-1 block" style={{ color: '#555' }}>{f.label}</label>
              <select
                value={f.value}
                onChange={(e) => (f.setter as (v: string) => void)(e.target.value)}
                className="w-full text-xs rounded border px-2 py-1.5"
                style={{ borderColor: '#e2e2e2', color: '#111', background: 'white' }}
              >
                {f.options.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((uc, i) => {
            const Icon = uc.icon;
            return (
              <motion.button
                key={uc.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                onClick={() => setSelected(uc)}
                className="text-left bg-white rounded border p-4 hover:shadow-md transition-all group"
                style={{ borderColor: '#e2e2e2' }}
              >
                {/* Card header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center shrink-0"
                      style={{ background: uc.bg }}
                    >
                      <Icon size={16} style={{ color: uc.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="text-sm font-semibold" style={{ color: '#111' }}>{uc.title}</h3>
                        {uc.featured && (
                          <Star size={11} style={{ color: '#d97706' }} fill="#d97706" />
                        )}
                      </div>
                      <p className="text-xs" style={{ color: '#888' }}>{uc.department}</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#888' }} />
                </div>

                <p className="text-xs leading-relaxed mb-3" style={{ color: '#555' }}>
                  {uc.description}
                </p>

                {/* Key benefit */}
                <div className="rounded px-2 py-1.5 mb-3" style={{ background: uc.bg }}>
                  <p className="text-xs font-medium" style={{ color: uc.color }}>{uc.keyBenefit}</p>
                </div>

                {/* Metadata row */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs" style={{ color: '#888' }}>Cost</p>
                    <p className="text-xs font-semibold" style={{ color: '#111' }}>{uc.implementationCost}</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#888' }}>Time to value</p>
                    <p className="text-xs font-semibold" style={{ color: '#111' }}>{uc.timeToValue}</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#888' }}>Expected ROI</p>
                    <p className="text-xs font-semibold" style={{ color: '#00875a' }}>{uc.expectedROI}</p>
                  </div>
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: '#888' }}>Risk</p>
                    <RiskBadge risk={uc.riskLevel} />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: '#888' }}>No use cases match the current filters.</p>
        </div>
      )}

      {/* Detail Side Panel */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.3)' }}
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 h-full z-50 overflow-y-auto"
              style={{ width: 380, background: 'white', boxShadow: '-4px 0 24px rgba(0,0,0,0.12)' }}
            >
              <div className="p-5 space-y-5">
                {/* Panel header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: selected.bg }}
                    >
                      <selected.icon size={20} style={{ color: selected.color }} />
                    </div>
                    <div>
                      <h2 className="font-bold" style={{ color: '#111' }}>{selected.title}</h2>
                      <p className="text-xs" style={{ color: '#888' }}>{selected.department}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-1.5 rounded hover:bg-gray-100"
                  >
                    <X size={16} style={{ color: '#888' }} />
                  </button>
                </div>

                <p className="text-sm leading-relaxed" style={{ color: '#444' }}>
                  {selected.description}
                </p>

                {/* Business value */}
                <div className="rounded p-4" style={{ background: selected.bg, border: `1px solid ${selected.color}30` }}>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: selected.color }}>
                    Business Value
                  </p>
                  <p className="text-sm" style={{ color: '#444' }}>{selected.businessValue}</p>
                </div>

                {/* Key metrics */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Implementation Cost', value: selected.implementationCost },
                    { label: 'Time to Value', value: selected.timeToValue },
                    { label: 'Expected ROI', value: selected.expectedROI },
                    { label: 'Complexity', value: selected.complexity },
                  ].map((m) => (
                    <div key={m.label} className="rounded p-3" style={{ background: '#f9f9f9' }}>
                      <p className="text-xs" style={{ color: '#888' }}>{m.label}</p>
                      <p className="text-sm font-semibold mt-0.5" style={{ color: '#111' }}>{m.value}</p>
                    </div>
                  ))}
                </div>

                {/* Risk */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: '#555' }}>Risk Level</span>
                  <RiskBadge risk={selected.riskLevel} />
                </div>

                {/* Data required */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#888' }}>
                    Data Required
                  </p>
                  <ul className="space-y-1">
                    {selected.dataRequired.map((d) => (
                      <li key={d} className="text-xs flex items-center gap-2" style={{ color: '#444' }}>
                        <span style={{ color: selected.color }}>·</span> {d}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Readiness requirement */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-semibold" style={{ color: '#555' }}>Minimum Readiness Score</p>
                    <span className="text-xs font-bold" style={{ color: '#111' }}>{selected.readinessRequirement}/100</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: '#f0f0f0' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${selected.readinessRequirement}%`,
                        background: selected.color,
                      }}
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#888' }}>
                    BrightCart readiness: <strong style={{ color: 68 >= selected.readinessRequirement ? '#00875a' : '#d97706' }}>68/100</strong>
                    {68 >= selected.readinessRequirement
                      ? ' — Eligible to proceed'
                      : ' — Improve readiness first'}
                  </p>
                </div>

                {/* Funding */}
                <div className="rounded p-4" style={{ background: '#fff7ed', border: '1px solid #fde68a' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#d97706' }}>Funding Eligibility</p>
                  <p className="text-xs" style={{ color: '#555' }}>{selected.fundingEligibility}</p>
                </div>

                {/* Success stories */}
                <div className="rounded p-4" style={{ background: '#f9f9f9' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#888' }}>Illustrative Outcomes</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#555' }}>{selected.successStories}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
