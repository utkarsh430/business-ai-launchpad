'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ChevronDown, CheckCircle, AlertTriangle, Info, MapPin, Clock,
  FileSpreadsheet, Upload, X, RefreshCw, Cpu, RotateCcw,
  AlertCircle, Building, TrendingUp, Database, Shield, Users, Leaf,
  BarChart2, FileText,
} from 'lucide-react';
import { ReadinessRing } from '../../charts/ReadinessRing';
import { RadarChart } from '../../charts/RadarChart';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';
import { SectionHeader } from '../../shared/SectionHeader';
import { BRIGHTCART } from '@/src/data/brightcart';

const { readiness } = BRIGHTCART;

// ─── Types ────────────────────────────────────────────────────────────────────

interface AttachedFile {
  id: string;
  name: string;
  category: string;
  size: string;
  qid: string;
  group: string;
}

// ─── Default files ────────────────────────────────────────────────────────────

const DEFAULT_FILES: AttachedFile[] = [
  { id: 'f01', name: 'sales_transactions_2025.csv',         category: 'Sales data',            size: '4.8 MB', qid: 'q4',  group: 'Data and operations' },
  { id: 'f02', name: 'supplier_lead_times.csv',             category: 'Supplier data',          size: '420 KB', qid: 'q5',  group: 'Data and operations' },
  { id: 'f03', name: 'inventory_snapshot.xlsx',             category: 'Inventory data',         size: '1.6 MB', qid: 'q5',  group: 'Data and operations' },
  { id: 'f04', name: 'privacy_policy.pdf',                  category: 'Data governance',        size: '380 KB', qid: 'q7',  group: 'Governance' },
  { id: 'f05', name: 'inventory_reorder_process_guide.pdf', category: 'Process documentation',  size: '540 KB', qid: 'q10', group: 'Data and operations' },
  { id: 'f06', name: 'aged_debtors_report.xlsx',            category: 'Finance',                size: '720 KB', qid: 'q11', group: 'Business performance' },
  { id: 'f07', name: 'quarterly_profit_and_loss.xlsx',      category: 'Finance',                size: '940 KB', qid: 'q11', group: 'Business performance' },
  { id: 'f08', name: 'microsoft_365_invoice.pdf',           category: 'Cloud platform',         size: '220 KB', qid: 'q12', group: 'Technology' },
  { id: 'f09', name: 'ecommerce_platform_invoice.pdf',      category: 'E-commerce platform',    size: '290 KB', qid: 'q12', group: 'Technology' },
  { id: 'f10', name: 'daily_software_application_list.csv', category: 'Technology',             size: '85 KB',  qid: 'q15', group: 'Technology' },
  { id: 'f11', name: 'standard_customer_terms.pdf',         category: 'Customer terms',         size: '460 KB', qid: 'q16', group: 'Governance' },
  { id: 'f12', name: 'privacy_policy_terms.pdf',            category: 'Privacy',                size: '380 KB', qid: 'q16', group: 'Governance' },
  { id: 'f13', name: 'employee_handbook.pdf',               category: 'Workplace policy',       size: '610 KB', qid: 'q19', group: 'Governance' },
  { id: 'f14', name: 'staff_roles_and_departments.xlsx',    category: 'Workforce',              size: '190 KB', qid: 'q22', group: 'Workforce' },
  { id: 'f15', name: 'monthly_energy_usage.xlsx',           category: 'Energy',                 size: '310 KB', qid: 'q23', group: 'Sustainability' },
];

const S9_GROUPS = [
  'Business performance',
  'Data and operations',
  'Technology',
  'Governance',
  'Workforce',
  'Sustainability',
];

const QID_GROUP: Record<string, string> = {
  q4: 'Data and operations', q5: 'Data and operations',
  q6: 'Data and operations', q7: 'Governance',
  q10: 'Data and operations', q11: 'Business performance',
  q12: 'Technology', q13: 'Technology', q14: 'Technology', q15: 'Technology',
  q16: 'Governance', q17: 'Governance', q18: 'Governance', q19: 'Governance',
  q22: 'Workforce',
  q23: 'Sustainability', q24: 'Sustainability', q25: 'Sustainability',
};

function fmtBytes(bytes: number): string {
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  if (bytes >= 1_024) return `${Math.round(bytes / 1_024)} KB`;
  return `${bytes} B`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CompactInput({
  label, value, onChange, type = 'text', suffix,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; suffix?: string;
}) {
  return (
    <div>
      <label className="block text-xs mb-1" style={{ color: '#555' }}>{label}</label>
      <div className="flex">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-xs border px-2 py-1.5 outline-none focus:border-red-400"
          style={{
            borderColor: '#e2e2e2', color: '#111', background: 'white',
            borderRadius: suffix ? '4px 0 0 4px' : 4,
          }}
        />
        {suffix && (
          <span
            className="text-xs px-2 py-1.5 border-y border-r"
            style={{ borderColor: '#e2e2e2', background: '#f9f9f9', color: '#888',
                     borderRadius: '0 4px 4px 0' }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function OptionSelector({
  options, selected, onChange,
}: {
  options: [string, string, string, string];
  selected: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {options.map((opt, i) => {
        const val = i + 1;
        const active = selected === val;
        return (
          <button
            key={val}
            onClick={() => onChange(val)}
            className="text-left rounded border p-2.5 transition-all"
            style={{
              borderColor: active ? '#db0011' : '#e2e2e2',
              background: active ? '#fef2f2' : 'white',
              borderWidth: active ? 2 : 1,
            }}
          >
            <div className="flex items-start gap-1.5">
              <span
                className="shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full font-bold"
                style={{
                  background: active ? '#db0011' : '#f0f0f0',
                  color: active ? 'white' : '#888',
                  fontSize: 9, marginTop: 1,
                }}
              >
                {val}
              </span>
              <span className="text-xs leading-snug" style={{ color: active ? '#111' : '#555' }}>
                {opt}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function DetailNote({ text }: { text: string }) {
  return (
    <p
      className="text-xs px-3 py-1.5 rounded mt-1.5"
      style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }}
    >
      {text}
    </p>
  );
}

function FileRow({
  file, onReplace, onRemove,
}: {
  file: AttachedFile;
  onReplace: (id: string, f: File) => void;
  onRemove: (id: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded"
      style={{ background: '#fafafa', border: '1px solid #e2e2e2' }}
    >
      <FileSpreadsheet size={13} style={{ color: '#1d4ed8', flexShrink: 0 }} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate" style={{ color: '#111' }}>{file.name}</p>
        <p className="text-xs" style={{ color: '#888' }}>{file.category} · {file.size}</p>
      </div>
      <span
        className="text-xs px-1.5 py-0.5 rounded shrink-0"
        style={{ background: '#f0fdf4', color: '#00875a' }}
      >
        Attached
      </span>
      <button
        onClick={() => ref.current?.click()}
        className="text-xs shrink-0"
        style={{ color: '#888' }}
      >
        Replace
      </button>
      <button onClick={() => onRemove(file.id)} className="shrink-0">
        <X size={12} style={{ color: '#aaa' }} />
      </button>
      <input
        ref={ref}
        type="file"
        accept=".csv,.xlsx,.pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onReplace(file.id, f);
          e.target.value = '';
        }}
      />
    </div>
  );
}

function MissingCard({
  label, onUpload,
}: {
  label: string; onUpload: (fl: FileList) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded border-dashed border"
      style={{ borderColor: '#fca5a5', background: '#fef2f2' }}
    >
      <AlertCircle size={13} style={{ color: '#db0011', flexShrink: 0 }} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium" style={{ color: '#db0011' }}>{label}</p>
        <p className="text-xs" style={{ color: '#888' }}>Missing</p>
      </div>
      <button
        onClick={() => ref.current?.click()}
        className="text-xs px-2 py-1 rounded shrink-0 font-medium"
        style={{ background: '#db0011', color: 'white' }}
      >
        Upload
      </button>
      <input
        ref={ref}
        type="file"
        accept=".csv,.xlsx,.pdf"
        className="hidden"
        onChange={(e) => { if (e.target.files) { onUpload(e.target.files); e.target.value = ''; } }}
      />
    </div>
  );
}

function InlineFiles({
  qid, files, onReplace, onRemove, onAdd,
  showMissing, missingLabel,
}: {
  qid: string;
  files: AttachedFile[];
  onReplace: (id: string, f: File) => void;
  onRemove: (id: string) => void;
  onAdd: (qid: string, fl: FileList) => void;
  showMissing?: boolean;
  missingLabel?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const qFiles = files.filter((f) => f.qid === qid);
  const showMissingCard = showMissing && qFiles.length === 0;
  return (
    <div className="mt-2.5 space-y-1.5">
      {qFiles.map((f) => (
        <FileRow key={f.id} file={f} onReplace={onReplace} onRemove={onRemove} />
      ))}
      {showMissingCard && missingLabel && (
        <MissingCard
          label={missingLabel}
          onUpload={(fl) => onAdd(qid, fl)}
        />
      )}
      <button
        onClick={() => ref.current?.click()}
        className="flex items-center gap-1 text-xs"
        style={{ color: '#888' }}
      >
        <Upload size={10} /> Upload Another
      </button>
      <input
        ref={ref}
        type="file"
        accept=".csv,.xlsx,.pdf"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) { onAdd(qid, e.target.files); e.target.value = ''; }
        }}
      />
    </div>
  );
}

function AccordionSection({
  sectionId, icon: Icon, title, openId, onToggle, children,
}: {
  sectionId: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  title: string;
  openId: string | null;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  const isOpen = openId === sectionId;
  return (
    <div className="rounded border overflow-hidden" style={{ borderColor: '#e2e2e2' }}>
      <button
        onClick={() => onToggle(sectionId)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        style={{ background: isOpen ? '#fafafa' : 'white' }}
      >
        <div className="flex items-center gap-2">
          <Icon size={13} style={{ color: '#db0011' }} />
          <span className="text-sm font-semibold" style={{ color: '#111' }}>{title}</span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronDown size={14} style={{ color: '#888' }} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="px-4 pb-5 pt-3 space-y-5"
              style={{ borderTop: '1px solid #f0f0f0', background: 'white' }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QBlock({ n, q, children }: { n: number; q: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium flex items-start gap-2" style={{ color: '#111' }}>
        <span
          className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full font-bold mt-0.5"
          style={{ background: '#fef2f2', color: '#db0011', fontSize: 9 }}
        >
          {n}
        </span>
        {q}
      </p>
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AIReadiness() {
  const prefersReducedMotion = useReducedMotion();

  // Accordion
  const [openSection, setOpenSection] = useState<string | null>('s1');
  const toggleSection = useCallback((id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  }, []);

  // Strategic priorities
  const ALL_PRIORITY_OPTIONS = [
    'Improve inventory efficiency', 'Reduce stockouts', 'Improve cash-flow visibility',
    'Reduce operating costs', 'Reduce energy consumption', 'Adopt AI responsibly',
    'Expand into new markets', 'Improve customer experience', 'Reduce return rate',
  ];
  const [priorities, setPriorities] = useState([
    'Improve inventory efficiency', 'Reduce stockouts', 'Improve cash-flow visibility',
    'Reduce operating costs', 'Reduce energy consumption', 'Adopt AI responsibly',
  ]);
  const togglePriority = useCallback((p: string) => {
    setPriorities((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  }, []);

  // Section 1: Company profile
  const [profile, setProfile] = useState({
    name: 'BrightCart Ltd',
    sector: 'Online home and lifestyle retail',
    region: 'Greater London, UK',
    employees: '42',
    revenue: '5800000',
    years: '7',
    model: 'Primarily B2C with a smaller wholesale channel',
    channels: 'Website, online marketplaces and wholesale',
  });

  // Section 2: Performance metrics
  const [perf, setPerf] = useState({
    revenueGrowth: '8.4', grossMargin: '34.2', inventoryTurnover: '4.2',
    stockoutRate: '7.8', returnRate: '11.2', supplierLeadTime: '16',
    orderProcessingTime: '3.1', wholesalePaymentDelay: '28',
    monthlyElectricity: '42500', annualEnergy: '128000',
  });

  // Questions 1-25 (1-4 scale)
  const [qv, setQv] = useState<Record<string, number>>({
    q1: 3, q2: 3, q3: 4,
    q4: 4, q5: 3, q6: 3, q7: 3,
    q8: 3, q9: 3, q10: 3, q11: 3,
    q12: 3, q13: 3, q14: 3, q15: 3,
    q16: 3, q17: 2, q18: 3, q19: 3,
    q20: 2, q21: 3, q22: 3,
    q23: 3, q24: 3, q25: 3,
  });
  const setQ = useCallback((key: string, val: number) => {
    setQv((prev) => ({ ...prev, [key]: val }));
  }, []);

  // Files
  const [files, setFiles] = useState<AttachedFile[]>(DEFAULT_FILES);

  const handleReplace = useCallback((id: string, f: File) => {
    setFiles((prev) => prev.map((x) => x.id === id ? { ...x, name: f.name, size: fmtBytes(f.size) } : x));
  }, []);

  const handleRemove = useCallback((id: string) => {
    setFiles((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const handleAdd = useCallback((qid: string, fl: FileList) => {
    const group = QID_GROUP[qid] ?? 'Data and operations';
    const added: AttachedFile[] = Array.from(fl).map((f) => ({
      id: `u-${Date.now()}-${Math.random()}`,
      name: f.name,
      category: 'Additional supporting evidence',
      size: fmtBytes(f.size),
      qid,
      group,
    }));
    setFiles((prev) => [...prev, ...added]);
  }, []);

  const restoreFiles = useCallback(() => setFiles(DEFAULT_FILES), []);

  // Section 9 upload
  const s9UploadRef = useRef<HTMLInputElement>(null);
  const [s9Dragging, setS9Dragging] = useState(false);

  // Generation flow
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);

  const MSGS = [
    'Evaluating 7 readiness dimensions…',
    'Scoring data readiness…',
    'Assessing governance maturity…',
    'Benchmarking against peers…',
    'Generating personalised roadmap…',
  ];

  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const iv = setInterval(() => {
      setLoadingMsg(MSGS[i % MSGS.length]!);
      i += 1;
    }, 280);
    return () => clearInterval(iv);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const generate = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setGenerated(true);
  }, [loading]);

  useEffect(() => {
    if (generated && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [generated, prefersReducedMotion]);

  // Q19 control summary
  const GOV_CONTROLS: [string, string, boolean | null][] = [
    ['Cybersecurity owner', 'Yes', true],
    ['Formal AI policy', 'No', false],
    ['Sensitive-data classification', 'Partial', null],
    ['AI incident-escalation process', 'No', false],
    ['Model-monitoring process', 'No', false],
  ];

  return (
    <div className="space-y-5">

      {/* ── Company Readiness Inputs ───────────────────────────────────────── */}
      <div className="bg-white rounded border overflow-hidden" style={{ borderColor: '#e2e2e2' }}>

        {/* Card header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid #f0f0f0' }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <Cpu size={16} style={{ color: '#db0011' }} />
            <h2 className="font-semibold" style={{ color: '#111' }}>Company Readiness Inputs</h2>
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: '#fef2f2', color: '#db0011' }}
            >
              25 questions · {files.length} files attached
            </span>
          </div>
          <ProvenanceBadge type="simulated" />
        </div>

        <div className="p-4 space-y-2">

          {/* ── 1 · Company & Strategy ──────────────────────────────────── */}
          <AccordionSection
            sectionId="s1" icon={Building} title="1 · Company & Strategy"
            openId={openSection} onToggle={toggleSection}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
              <CompactInput label="Company name"      value={profile.name}     onChange={(v) => setProfile((p) => ({ ...p, name: v }))} />
              <CompactInput label="Sector"             value={profile.sector}   onChange={(v) => setProfile((p) => ({ ...p, sector: v }))} />
              <CompactInput label="Region"             value={profile.region}   onChange={(v) => setProfile((p) => ({ ...p, region: v }))} />
              <CompactInput label="Employees"          value={profile.employees} onChange={(v) => setProfile((p) => ({ ...p, employees: v }))} type="number" />
              <CompactInput label="Annual revenue (£)" value={profile.revenue}  onChange={(v) => setProfile((p) => ({ ...p, revenue: v }))} type="number" />
              <CompactInput label="Years operating"    value={profile.years}    onChange={(v) => setProfile((p) => ({ ...p, years: v }))} type="number" />
              <div className="col-span-2">
                <CompactInput label="Business model" value={profile.model} onChange={(v) => setProfile((p) => ({ ...p, model: v }))} />
              </div>
              <CompactInput label="Sales channels" value={profile.channels} onChange={(v) => setProfile((p) => ({ ...p, channels: v }))} />
            </div>

            <div>
              <p className="text-xs font-medium mb-2" style={{ color: '#555' }}>Strategic priorities</p>
              <div className="flex flex-wrap gap-1.5">
                {ALL_PRIORITY_OPTIONS.map((opt) => {
                  const active = priorities.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => togglePriority(opt)}
                      className="text-xs px-2.5 py-1 rounded-full border transition-all"
                      style={{
                        borderColor: active ? '#db0011' : '#e2e2e2',
                        background: active ? '#fef2f2' : 'white',
                        color: active ? '#db0011' : '#555',
                      }}
                    >
                      {active && <CheckCircle size={9} className="inline mr-1" style={{ color: '#db0011' }} />}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <QBlock n={1} q="Is there a clearly defined business problem that management wants AI to address?">
              <OptionSelector
                options={[
                  'No clear business problem',
                  'Several general ideas, but no agreed priority',
                  'One priority problem has been identified',
                  'A clearly defined problem, owner, KPIs and expected value exist',
                ]}
                selected={qv['q1'] ?? 3} onChange={(v) => setQ('q1', v)}
              />
              {(qv['q1'] ?? 3) === 3 && <DetailNote text="Inventory inefficiency, stockouts and cash-flow visibility." />}
            </QBlock>

            <QBlock n={2} q="Is there a senior leader who owns the AI initiative and can approve budget and process changes?">
              <OptionSelector
                options={[
                  'No owner has been identified',
                  'An informal employee is exploring the idea',
                  'A manager has been assigned',
                  'An executive sponsor, budget owner and delivery team are confirmed',
                ]}
                selected={qv['q2'] ?? 3} onChange={(v) => setQ('q2', v)}
              />
              {(qv['q2'] ?? 3) === 3 && <DetailNote text="Operations Director." />}
            </QBlock>

            <QBlock n={3} q="If automation saved 10–15 employee hours per week, how would that time be used?">
              <OptionSelector
                options={[
                  'No planned use',
                  'General administrative work',
                  'Customer service and operational improvement',
                  'Supplier negotiation, merchandising, customer retention and growth',
                ]}
                selected={qv['q3'] ?? 4} onChange={(v) => setQ('q3', v)}
              />
            </QBlock>
          </AccordionSection>

          {/* ── 2 · Business Performance ────────────────────────────────── */}
          <AccordionSection
            sectionId="s2" icon={TrendingUp} title="2 · Business Performance"
            openId={openSection} onToggle={toggleSection}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
              <CompactInput label="Revenue growth"          value={perf.revenueGrowth}       onChange={(v) => setPerf((p) => ({ ...p, revenueGrowth: v }))}       type="number" suffix="%" />
              <CompactInput label="Gross margin"            value={perf.grossMargin}         onChange={(v) => setPerf((p) => ({ ...p, grossMargin: v }))}         type="number" suffix="%" />
              <CompactInput label="Inventory turnover"      value={perf.inventoryTurnover}   onChange={(v) => setPerf((p) => ({ ...p, inventoryTurnover: v }))}   type="number" suffix="x" />
              <CompactInput label="Stockout rate"           value={perf.stockoutRate}        onChange={(v) => setPerf((p) => ({ ...p, stockoutRate: v }))}        type="number" suffix="%" />
              <CompactInput label="Product return rate"     value={perf.returnRate}          onChange={(v) => setPerf((p) => ({ ...p, returnRate: v }))}          type="number" suffix="%" />
              <CompactInput label="Avg supplier lead time"  value={perf.supplierLeadTime}    onChange={(v) => setPerf((p) => ({ ...p, supplierLeadTime: v }))}    type="number" suffix="days" />
              <CompactInput label="Order processing time"   value={perf.orderProcessingTime} onChange={(v) => setPerf((p) => ({ ...p, orderProcessingTime: v }))} type="number" suffix="days" />
              <CompactInput label="Wholesale payment delay" value={perf.wholesalePaymentDelay} onChange={(v) => setPerf((p) => ({ ...p, wholesalePaymentDelay: v }))} type="number" suffix="days" />
              <CompactInput label="Monthly electricity"     value={perf.monthlyElectricity}  onChange={(v) => setPerf((p) => ({ ...p, monthlyElectricity: v }))}  type="number" suffix="kWh" />
              <CompactInput label="Annual energy (£)"       value={perf.annualEnergy}        onChange={(v) => setPerf((p) => ({ ...p, annualEnergy: v }))}        type="number" />
            </div>
          </AccordionSection>

          {/* ── 3 · Data Readiness ──────────────────────────────────────── */}
          <AccordionSection
            sectionId="s3" icon={Database} title="3 · Data Readiness"
            openId={openSection} onToggle={toggleSection}
          >
            <QBlock n={4} q="How much usable historical sales or operational data is available?">
              <OptionSelector
                options={[
                  'Less than 3 months or mainly paper records',
                  '3–12 months of partial digital data',
                  '12–24 months of mostly usable digital data',
                  'More than 24 months of complete, validated and regularly updated data',
                ]}
                selected={qv['q4'] ?? 4} onChange={(v) => setQ('q4', v)}
              />
              <InlineFiles qid="q4" files={files} onReplace={handleReplace} onRemove={handleRemove} onAdd={handleAdd} />
            </QBlock>

            <QBlock n={5} q="How complete and consistent are product, customer and supplier records?">
              <OptionSelector
                options={[
                  'Mostly incomplete or duplicated',
                  'Significant gaps across several systems',
                  'Product and customer data are strong, but supplier data needs improvement',
                  'Records are complete, standardised and continuously validated',
                ]}
                selected={qv['q5'] ?? 3} onChange={(v) => setQ('q5', v)}
              />
              <InlineFiles qid="q5" files={files} onReplace={handleReplace} onRemove={handleRemove} onAdd={handleAdd} />
            </QBlock>

            <QBlock n={6} q="How easily can business data be exported and analysed?">
              <OptionSelector
                options={[
                  'Data cannot be exported reliably',
                  'Most exports require extensive manual work',
                  'Sales and accounting data export easily, but some cleaning is required',
                  'Data is integrated, standardised and analysis-ready',
                ]}
                selected={qv['q6'] ?? 3} onChange={(v) => setQ('q6', v)}
              />
            </QBlock>

            <QBlock n={7} q="If a customer requests deletion, how easily can their information be located and removed?">
              <OptionSelector
                options={[
                  'The business cannot reliably locate all records',
                  'Records can be found only through a lengthy manual search',
                  'Deletion is possible but is manual and not centrally managed',
                  'Records can be identified, reviewed and deleted through a controlled workflow',
                ]}
                selected={qv['q7'] ?? 3} onChange={(v) => setQ('q7', v)}
              />
              <InlineFiles qid="q7" files={files} onReplace={handleReplace} onRemove={handleRemove} onAdd={handleAdd} />
            </QBlock>
          </AccordionSection>

          {/* ── 4 · Process Maturity ────────────────────────────────────── */}
          <AccordionSection
            sectionId="s4" icon={BarChart2} title="4 · Process Maturity"
            openId={openSection} onToggle={toggleSection}
          >
            <QBlock n={8} q="Which repetitive process currently consumes the most employee time?">
              <OptionSelector
                options={[
                  'Customer-service responses',
                  'Invoice and payment reconciliation',
                  'Inventory replenishment and supplier checks',
                  'Employee scheduling and reporting',
                ]}
                selected={qv['q8'] ?? 3} onChange={(v) => setQ('q8', v)}
              />
            </QBlock>

            <QBlock n={9} q="How many manual handoffs or approvals are normally required in this process?">
              <OptionSelector
                options={['More than 7', '5–7', '3–4', '0–2']}
                selected={qv['q9'] ?? 3} onChange={(v) => setQ('q9', v)}
              />
              {(qv['q9'] ?? 3) === 3 && <DetailNote text="Approximately four manual touchpoints." />}
            </QBlock>

            <QBlock n={10} q="How consistently is the process documented and followed?">
              <OptionSelector
                options={[
                  'No documented process exists',
                  'Different employees use different methods',
                  'The normal process is understood, but exceptions depend on judgement',
                  'The process, exceptions, owners and controls are formally documented',
                ]}
                selected={qv['q10'] ?? 3} onChange={(v) => setQ('q10', v)}
              />
              <InlineFiles qid="q10" files={files} onReplace={handleReplace} onRemove={handleRemove} onAdd={handleAdd} />
            </QBlock>

            <QBlock n={11} q="How much delay normally occurs between invoicing and receiving payment?">
              <OptionSelector
                options={['More than 60 days', '31–60 days', '16–30 days', '0–15 days']}
                selected={qv['q11'] ?? 3} onChange={(v) => setQ('q11', v)}
              />
              {(qv['q11'] ?? 3) === 3 && <DetailNote text="Approximately 28 days for wholesale customers." />}
              <InlineFiles qid="q11" files={files} onReplace={handleReplace} onRemove={handleRemove} onAdd={handleAdd} />
            </QBlock>
          </AccordionSection>

          {/* ── 5 · Technology & Platform ───────────────────────────────── */}
          <AccordionSection
            sectionId="s5" icon={Cpu} title="5 · Technology & Platform"
            openId={openSection} onToggle={toggleSection}
          >
            <QBlock n={12} q="Where are the company's primary business systems hosted?">
              <OptionSelector
                options={[
                  'Mostly paper or offline records',
                  'Primarily local office computers or physical servers',
                  'Mostly cloud-based with one or two older local systems',
                  'Fully cloud-based, managed and scalable',
                ]}
                selected={qv['q12'] ?? 3} onChange={(v) => setQ('q12', v)}
              />
              <InlineFiles qid="q12" files={files} onReplace={handleReplace} onRemove={handleRemove} onAdd={handleAdd} />
            </QBlock>

            <QBlock n={13} q="How well do the company's systems exchange information?">
              <OptionSelector
                options={[
                  'Systems are isolated',
                  'Employees manually copy and paste most information',
                  'Some integrations exist, but spreadsheets and manual transfers remain',
                  'Core systems exchange validated data automatically',
                ]}
                selected={qv['q13'] ?? 3} onChange={(v) => setQ('q13', v)}
              />
            </QBlock>

            <QBlock n={14} q="How much important information is trapped in paper, PDFs, scans or email threads?">
              <OptionSelector
                options={['More than 60%', '40–60%', '20–40%', 'Less than 20%']}
                selected={qv['q14'] ?? 3} onChange={(v) => setQ('q14', v)}
              />
            </QBlock>

            <QBlock n={15} q="What best describes the company's main software tools?">
              <OptionSelector
                options={[
                  'Unsupported legacy or custom systems',
                  'Several older systems with limited support',
                  'Mostly mainstream tools with one basic legacy inventory system',
                  'Modern, supported and well-integrated cloud applications',
                ]}
                selected={qv['q15'] ?? 3} onChange={(v) => setQ('q15', v)}
              />
              <InlineFiles qid="q15" files={files} onReplace={handleReplace} onRemove={handleRemove} onAdd={handleAdd} />
            </QBlock>
          </AccordionSection>

          {/* ── 6 · Governance & Responsible AI ─────────────────────────── */}
          <AccordionSection
            sectionId="s6" icon={Shield} title="6 · Governance & Responsible AI"
            openId={openSection} onToggle={toggleSection}
          >
            <QBlock n={16} q="Do customers clearly permit their information to be processed using cloud or automated tools?">
              <OptionSelector
                options={[
                  'No permission or privacy information exists',
                  'Existing documents do not clearly address external processing',
                  'Permission mostly exists, but wording requires review',
                  'Clear consent, contracts and third-party processing terms are maintained',
                ]}
                selected={qv['q16'] ?? 3} onChange={(v) => setQ('q16', v)}
              />
              <InlineFiles qid="q16" files={files} onReplace={handleReplace} onRemove={handleRemove} onAdd={handleAdd} />
            </QBlock>

            <QBlock n={17} q="How are employees currently using public AI tools with company information?">
              <OptionSelector
                options={[
                  'Use is widespread and uncontrolled',
                  'Informal usage occurs without clear management rules',
                  'Usage is allowed only for selected low-risk tasks',
                  'Usage is governed by an approved policy, training and monitoring',
                ]}
                selected={qv['q17'] ?? 2} onChange={(v) => setQ('q17', v)}
              />
              <InlineFiles
                qid="q17" files={files} onReplace={handleReplace} onRemove={handleRemove} onAdd={handleAdd}
                showMissing missingLabel="AI acceptable-use policy"
              />
            </QBlock>

            <QBlock n={18} q="Before an automated recommendation triggers a payment, order or customer action, what level of human approval exists?">
              <OptionSelector
                options={[
                  'No human review is required',
                  'Review occurs only for unusual transactions',
                  'A person usually reviews the action, but the process is informal',
                  'Formal approval, thresholds, audit records and escalation rules exist',
                ]}
                selected={qv['q18'] ?? 3} onChange={(v) => setQ('q18', v)}
              />
            </QBlock>

            <QBlock n={19} q="Which statement best describes the company's wider AI governance controls?">
              <OptionSelector
                options={[
                  'No defined controls or ownership',
                  'Cybersecurity ownership exists, but AI-specific controls do not',
                  'Partial data classification and human review exist, but policy and monitoring are missing',
                  'Formal AI policy, monitoring, incident response and governance committees exist',
                ]}
                selected={qv['q19'] ?? 3} onChange={(v) => setQ('q19', v)}
              />
              {(qv['q19'] ?? 3) === 3 && (
                <div className="mt-2 rounded p-3" style={{ background: '#f9f9f9', border: '1px solid #f0f0f0' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#888' }}>Current controls summary</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {GOV_CONTROLS.map(([label, val, ok]) => (
                      <div key={label} className="flex items-center gap-2">
                        {ok === true
                          ? <CheckCircle size={10} style={{ color: '#00875a', flexShrink: 0 }} />
                          : ok === false
                            ? <X size={10} style={{ color: '#db0011', flexShrink: 0 }} />
                            : <AlertTriangle size={10} style={{ color: '#d97706', flexShrink: 0 }} />
                        }
                        <span className="text-xs" style={{ color: '#555' }}>{label}:</span>
                        <span
                          className="text-xs font-medium"
                          style={{ color: ok === true ? '#00875a' : ok === false ? '#db0011' : '#d97706' }}
                        >
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <InlineFiles qid="q19" files={files} onReplace={handleReplace} onRemove={handleRemove} onAdd={handleAdd} />
            </QBlock>
          </AccordionSection>

          {/* ── 7 · Workforce & Change ──────────────────────────────────── */}
          <AccordionSection
            sectionId="s7" icon={Users} title="7 · Workforce & Change"
            openId={openSection} onToggle={toggleSection}
          >
            <QBlock n={20} q="How much formal AI training have employees received?">
              <OptionSelector
                options={[
                  'No awareness or training',
                  'Informal self-learning only',
                  'Limited role-specific training',
                  'Structured training, certification and ongoing support',
                ]}
                selected={qv['q20'] ?? 2} onChange={(v) => setQ('q20', v)}
              />
            </QBlock>

            <QBlock n={21} q="How willing are affected employees to use AI recommendations?">
              <OptionSelector
                options={[
                  'Strong resistance is expected',
                  'Employees are uncertain and concerned',
                  'Employees are moderately willing if people retain final approval',
                  'Employees actively support adoption and understand the benefits',
                ]}
                selected={qv['q21'] ?? 3} onChange={(v) => setQ('q21', v)}
              />
            </QBlock>

            <QBlock n={22} q="Who will coordinate data, users, technology and performance measurement?">
              <OptionSelector
                options={[
                  'No project owner',
                  'An informal employee volunteer',
                  'Operations Director supported by Finance and IT',
                  'A dedicated cross-functional AI programme team',
                ]}
                selected={qv['q22'] ?? 3} onChange={(v) => setQ('q22', v)}
              />
              <InlineFiles qid="q22" files={files} onReplace={handleReplace} onRemove={handleRemove} onAdd={handleAdd} />
            </QBlock>
          </AccordionSection>

          {/* ── 8 · Sustainability ──────────────────────────────────────── */}
          <AccordionSection
            sectionId="s8" icon={Leaf} title="8 · Sustainability"
            openId={openSection} onToggle={toggleSection}
          >
            <QBlock n={23} q="What sustainability information does the company regularly track?">
              <OptionSelector
                options={[
                  'No energy, fuel, waste or logistics information',
                  'Only utility expenditure',
                  'Monthly electricity data, with limited waste and logistics data',
                  'Detailed energy, fuel, waste, logistics and supplier-emissions data',
                ]}
                selected={qv['q23'] ?? 3} onChange={(v) => setQ('q23', v)}
              />
              <InlineFiles qid="q23" files={files} onReplace={handleReplace} onRemove={handleRemove} onAdd={handleAdd} />
            </QBlock>

            <QBlock n={24} q="Has management defined measurable cost or emissions-reduction targets?">
              <OptionSelector
                options={[
                  'No targets',
                  'General intention with no numerical target',
                  'Cost-reduction targets exist, but formal emissions targets do not',
                  'Approved cost, energy and emissions targets are monitored regularly',
                ]}
                selected={qv['q24'] ?? 3} onChange={(v) => setQ('q24', v)}
              />
            </QBlock>

            <QBlock n={25} q="How likely is management to prioritise an intervention that improves both cost and environmental performance?">
              <OptionSelector
                options={[
                  'Unlikely',
                  'Only if no investment is required',
                  'Likely where payback is below 12 months',
                  'High priority even where payback exceeds 12 months',
                ]}
                selected={qv['q25'] ?? 3} onChange={(v) => setQ('q25', v)}
              />
            </QBlock>
          </AccordionSection>

          {/* ── 9 · Supporting Files ────────────────────────────────────── */}
          <AccordionSection
            sectionId="s9" icon={FileText} title="9 · Supporting Files"
            openId={openSection} onToggle={toggleSection}
          >
            {/* Grouped file list */}
            <div className="space-y-4">
              {S9_GROUPS.map((group) => {
                const gFiles = files.filter((f) => f.group === group);
                if (gFiles.length === 0) return null;
                return (
                  <div key={group}>
                    <p
                      className="text-xs font-semibold uppercase tracking-wide mb-2"
                      style={{ color: '#888' }}
                    >
                      {group}
                    </p>
                    <div className="space-y-1.5">
                      {gFiles.map((f) => (
                        <FileRow key={f.id} file={f} onReplace={handleReplace} onRemove={handleRemove} />
                      ))}
                    </div>
                  </div>
                );
              })}
              {(() => {
                const extra = files.filter((f) => !S9_GROUPS.includes(f.group));
                if (extra.length === 0) return null;
                return (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#888' }}>
                      Additional
                    </p>
                    <div className="space-y-1.5">
                      {extra.map((f) => (
                        <FileRow key={f.id} file={f} onReplace={handleReplace} onRemove={handleRemove} />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={restoreFiles}
                className="flex items-center gap-1.5 text-xs"
                style={{ color: '#888' }}
              >
                <RotateCcw size={11} /> Restore Demo Files
              </button>
              <span className="text-xs" style={{ color: '#aaa' }}>{files.length} files total</span>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setS9Dragging(true); }}
              onDragLeave={() => setS9Dragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setS9Dragging(false);
                handleAdd('s9', e.dataTransfer.files);
              }}
              className="rounded border-2 border-dashed p-4 text-center transition-colors"
              style={{
                borderColor: s9Dragging ? '#db0011' : '#d1d5db',
                background: s9Dragging ? '#fef2f2' : '#fafafa',
              }}
            >
              <Upload size={15} className="mx-auto mb-1" style={{ color: s9Dragging ? '#db0011' : '#aaa' }} />
              <p className="text-xs font-medium mb-0.5" style={{ color: '#555' }}>
                Upload Additional Supporting File
              </p>
              <p className="text-xs mb-2" style={{ color: '#aaa' }}>CSV, XLSX or PDF up to 10 MB</p>
              <button
                onClick={() => s9UploadRef.current?.click()}
                className="text-xs px-3 py-1.5 rounded border font-medium hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#e2e2e2', color: '#555' }}
              >
                Choose File
              </button>
              <input
                ref={s9UploadRef}
                type="file"
                accept=".csv,.xlsx,.pdf"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) { handleAdd('s9', e.target.files); e.target.value = ''; }
                }}
              />
            </div>

            <p className="text-xs" style={{ color: '#aaa' }}>
              Demo mode: Attached files are representative sample records. They are not uploaded to a server or analysed in this prototype.
            </p>
          </AccordionSection>

        </div>{/* /accordion list */}

        {/* Generate button */}
        <div className="px-4 pb-5 pt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded font-semibold text-sm text-white transition-opacity disabled:opacity-70"
            style={{ background: '#db0011' }}
          >
            {loading ? (
              <><RefreshCw size={14} className="animate-spin" />{loadingMsg}</>
            ) : generated ? (
              <><RefreshCw size={14} />Regenerate Assessment</>
            ) : (
              <><Cpu size={14} />Generate AI Readiness Assessment</>
            )}
          </button>
        </div>

      </div>{/* /Company Readiness Inputs */}

      {/* ── AI Readiness Passport (revealed after generation) ─────────────── */}
      <AnimatePresence>
        {generated && (
          <motion.div
            ref={resultsRef}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="space-y-6"
          >
            <SectionHeader
              title="AI Readiness Passport"
              subtitle="7-dimension assessment of BrightCart's readiness to adopt AI responsibly"
              provenance="simulated"
            />

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Ring */}
              <div className="bg-white rounded border p-6 flex flex-col items-center" style={{ borderColor: '#e2e2e2' }}>
                <ReadinessRing score={readiness.overall} size={200} sublabel={readiness.label} />
                <div className="mt-4 text-center">
                  <p className="text-sm font-semibold" style={{ color: '#111' }}>{readiness.label}</p>
                  <p className="text-xs mt-1" style={{ color: '#888' }}>
                    Sufficient data quality and commercial alignment to begin a controlled pilot,
                    subject to governance improvements.
                  </p>
                </div>
              </div>

              {/* Radar */}
              <div className="bg-white rounded border p-6" style={{ borderColor: '#e2e2e2' }}>
                <p className="text-sm font-semibold mb-4" style={{ color: '#111' }}>Readiness Dimensions</p>
                <RadarChart
                  data={readiness.dimensions.map((d) => ({ label: d.label.split(' ')[0]!, value: d.score }))}
                  size={260}
                />
              </div>

              {/* Key findings */}
              <div className="bg-white rounded border p-6 space-y-4" style={{ borderColor: '#e2e2e2' }}>
                <p className="text-sm font-semibold" style={{ color: '#111' }}>Main Conclusion</p>
                <div
                  className="rounded p-3 text-xs leading-relaxed"
                  style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }}
                >
                  BrightCart has sufficient commercial and transaction data to begin a controlled
                  operational pilot, but supplier-data quality and AI governance controls require improvement.
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#888' }}>
                    Pilot Blockers
                  </p>
                  <ul className="space-y-2">
                    {readiness.blockers.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <AlertTriangle size={13} className="mt-0.5 shrink-0" style={{ color: '#d97706' }} />
                        <span className="text-xs" style={{ color: '#555' }}>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#888' }}>
                    Immediate Actions
                  </p>
                  <ul className="space-y-2">
                    {readiness.immediateActions.map((a) => (
                      <li key={a} className="flex items-start gap-2">
                        <CheckCircle size={13} className="mt-0.5 shrink-0" style={{ color: '#00875a' }} />
                        <span className="text-xs" style={{ color: '#555' }}>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Dimension Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {readiness.dimensions.map((d, i) => {
                const color = d.score >= 70 ? '#00875a' : d.score >= 55 ? '#d97706' : '#db0011';
                return (
                  <motion.div
                    key={d.id}
                    className="bg-white rounded border p-4"
                    style={{ borderColor: '#e2e2e2', borderTopWidth: 3, borderTopColor: color }}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold" style={{ color: '#111' }}>{d.label}</p>
                      <span className="text-lg font-bold" style={{ color }}>{d.score}</span>
                    </div>
                    <div className="h-1.5 rounded-full mb-3" style={{ background: '#f0f0f0' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${d.score}%` }}
                        transition={{ duration: 0.9, delay: i * 0.08 + 0.2 }}
                      />
                    </div>
                    <p className="text-xs mb-3" style={{ color: '#888' }}>{d.description}</p>
                    <div className="space-y-1">
                      {d.strengths.slice(0, 2).map((s) => (
                        <div key={s} className="flex items-start gap-1.5">
                          <CheckCircle size={10} className="mt-0.5 shrink-0" style={{ color: '#00875a' }} />
                          <span className="text-xs" style={{ color: '#555' }}>{s}</span>
                        </div>
                      ))}
                      {d.weaknesses.slice(0, 1).map((w) => (
                        <div key={w} className="flex items-start gap-1.5">
                          <AlertTriangle size={10} className="mt-0.5 shrink-0" style={{ color: '#d97706' }} />
                          <span className="text-xs" style={{ color: '#555' }}>{w}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* AI Transformation Journey */}
            <div className="bg-white rounded border p-6" style={{ borderColor: '#e2e2e2' }}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <MapPin size={16} style={{ color: '#db0011' }} />
                  <h3 className="font-semibold" style={{ color: '#111' }}>Your AI Transformation Journey</h3>
                </div>
                <ProvenanceBadge type="pilot-target" />
              </div>
              <p className="text-xs mb-5" style={{ color: '#888' }}>
                Personalised roadmap based on readiness score 68/100, governance maturity, and selected
                opportunity: Demand &amp; Inventory Optimisation.
              </p>
              <div className="relative">
                <div
                  className="absolute left-4 top-0 bottom-0 w-0.5"
                  style={{ background: 'linear-gradient(to bottom, #db0011, #d97706, #1d4ed8, #00875a, #6b21a8)' }}
                />
                <div className="space-y-5 pl-12">
                  {[
                    {
                      period: 'Month 1', color: '#db0011', bg: '#fef2f2', dot: '#db0011',
                      tasks: [
                        'Improve supplier data quality (target: ≥90% SKU coverage)',
                        'Draft and sign AI acceptable-use policy',
                        'Assign AI project owner',
                        'Confirm baseline KPIs (stockout rate, inventory turnover)',
                      ],
                    },
                    {
                      period: 'Month 2', color: '#d97706', bg: '#fff7ed', dot: '#d97706',
                      tasks: [
                        'Launch demand forecasting pilot on 20 priority SKUs',
                        'Deliver AI awareness training to operations team',
                        'Define human-approval workflow for reorder decisions',
                        'Set up forecast accuracy tracking dashboard',
                      ],
                    },
                    {
                      period: 'Month 3', color: '#1d4ed8', bg: '#eff6ff', dot: '#1d4ed8',
                      tasks: [
                        'Launch AI-assisted reorder recommendation workflow',
                        'Begin logging all override decisions with reason codes',
                        'Complete first monthly model accuracy review',
                        'Submit Digital Productivity Support Programme application',
                      ],
                    },
                    {
                      period: 'Months 4–6', color: '#00875a', bg: '#f0fdf4', dot: '#00875a',
                      tasks: [
                        'Expand pilot from 20 SKUs to full catalogue',
                        'Integrate recommendations into inventory management system',
                        'Review pilot results vs baseline (target: stockout ≤5.1%)',
                        'Begin cash-flow forecasting scoping',
                      ],
                    },
                    {
                      period: 'Months 6–12', color: '#6b21a8', bg: '#faf5ff', dot: '#6b21a8',
                      tasks: [
                        'Scale successful use cases across all product categories',
                        'Launch cash-flow forecasting as second AI project',
                        'Conduct governance maturity review (target: ≥65/100)',
                        'Plan returns reduction AI project',
                      ],
                    },
                  ].map((milestone, i) => (
                    <motion.div
                      key={milestone.period}
                      className="relative"
                      initial={prefersReducedMotion ? false : { opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                    >
                      <div
                        className="absolute -left-8 w-4 h-4 rounded-full border-2 border-white"
                        style={{ background: milestone.dot, boxShadow: `0 0 0 2px ${milestone.dot}40`, top: 4 }}
                      />
                      <div className="rounded p-4" style={{ background: milestone.bg }}>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={12} style={{ color: milestone.color }} />
                          <span
                            className="text-xs font-bold uppercase tracking-wide"
                            style={{ color: milestone.color }}
                          >
                            {milestone.period}
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {milestone.tasks.map((task) => (
                            <li key={task} className="flex items-start gap-2">
                              <span className="text-xs mt-0.5" style={{ color: milestone.color }}>›</span>
                              <span className="text-xs" style={{ color: '#444' }}>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Methodology */}
            <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
              <div className="flex items-center gap-2 mb-3">
                <Info size={15} style={{ color: '#888' }} />
                <p className="text-sm font-semibold" style={{ color: '#111' }}>Methodology</p>
                <ProvenanceBadge type="simulated" />
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#666' }}>
                The AI Readiness Passport assesses seven dimensions: Data Readiness (availability, quality,
                coverage), Process Maturity (documentation, consistency), Technology Readiness (platform
                capability, integration), Strategic Alignment (leadership commitment, investment appetite),
                Governance &amp; Security (policy, controls, oversight), Workforce Readiness (capability,
                training, willingness), and Sustainability Readiness (data availability, KPI definition).
                Each dimension is scored 0–100 based on simulated company profile inputs. Overall score is
                a weighted average. All scores are simulated for this prototype demonstration.
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
