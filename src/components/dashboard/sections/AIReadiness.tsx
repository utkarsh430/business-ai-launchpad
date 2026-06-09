'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  CheckCircle, AlertTriangle, Info, MapPin, Clock,
  FileSpreadsheet, Upload, X, RefreshCw, Cpu, RotateCcw,
} from 'lucide-react';
import { ReadinessRing } from '../../charts/ReadinessRing';
import { RadarChart } from '../../charts/RadarChart';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';
import { SectionHeader } from '../../shared/SectionHeader';
import { BRIGHTCART } from '@/src/data/brightcart';

const { readiness } = BRIGHTCART;

// ── Types ────────────────────────────────────────────────────────────────────

interface AttachedFile {
  id: string;
  name: string;
  category: string;
  size: string;
}

// ── Default attached files ───────────────────────────────────────────────────

const DEFAULT_FILES: AttachedFile[] = [
  { id: 'f1', name: 'sales_transactions_2025.csv',  category: 'Sales data',      size: '4.8 MB'  },
  { id: 'f2', name: 'inventory_snapshot.xlsx',       category: 'Inventory data',   size: '1.6 MB'  },
  { id: 'f3', name: 'supplier_lead_times.csv',       category: 'Supplier data',    size: '420 KB'  },
  { id: 'f4', name: 'customer_returns_2025.csv',     category: 'Returns data',     size: '860 KB'  },
  { id: 'f5', name: 'monthly_energy_usage.xlsx',     category: 'Energy data',      size: '310 KB'  },
];

function fmtBytes(bytes: number): string {
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  if (bytes >= 1_024)     return `${Math.round(bytes / 1_024)} KB`;
  return `${bytes} B`;
}

// ── Select helper ────────────────────────────────────────────────────────────

function CompactSelect({
  label, value, options, onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs mb-1" style={{ color: '#555' }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-xs rounded border px-2 py-1.5 outline-none focus:border-red-400"
        style={{ borderColor: '#e2e2e2', color: '#111', background: 'white' }}
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ── Text / number input helper ────────────────────────────────────────────────

function CompactInput({
  label, value, onChange, type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs mb-1" style={{ color: '#555' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-xs rounded border px-2 py-1.5 outline-none focus:border-red-400"
        style={{ borderColor: '#e2e2e2', color: '#111', background: 'white' }}
      />
    </div>
  );
}

// ── File row ─────────────────────────────────────────────────────────────────

function FileRow({
  file,
  onReplace,
  onRemove,
}: {
  file: AttachedFile;
  onReplace: (id: string, newFile: File) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      className="flex items-center gap-3 py-2 px-3 rounded"
      style={{ background: '#fafafa', border: '1px solid #e2e2e2' }}
    >
      <FileSpreadsheet size={15} style={{ color: '#1d4ed8', flexShrink: 0 }} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate" style={{ color: '#111' }}>{file.name}</p>
        <p className="text-xs" style={{ color: '#888' }}>{file.category} · {file.size}</p>
      </div>
      <span
        className="text-xs font-medium px-2 py-0.5 rounded shrink-0"
        style={{ background: '#f0fdf4', color: '#00875a' }}
      >
        Uploaded
      </span>
      <button
        onClick={() => inputRef.current?.click()}
        className="text-xs shrink-0"
        style={{ color: '#555' }}
        title="Replace file"
      >
        Replace
      </button>
      <button
        onClick={() => onRemove(file.id)}
        className="shrink-0"
        title="Remove file"
      >
        <X size={13} style={{ color: '#888' }} />
      </button>
      <input
        ref={inputRef}
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

// ── Main component ────────────────────────────────────────────────────────────

export function AIReadiness() {
  const prefersReducedMotion = useReducedMotion();

  // ── Form state ──────────────────────────────────────────────────────────────
  const [company, setCompany] = useState({
    name: 'BrightCart Ltd',
    sector: 'Online home and lifestyle retail',
    region: 'Greater London, UK',
    employees: '42',
    revenue: '5800000',
    years: '7',
  });

  const [ops, setOps] = useState({
    inventoryTurnover: '4.2',
    stockoutRate: '7.8',
    returnRate: '11.2',
    supplierLeadTime: '16',
    monthlyElectricity: '42500',
  });

  const [dataTech, setDataTech] = useState({
    salesData: 'Available',
    customerData: 'Available',
    inventoryData: 'Partially available',
    supplierDataQuality: 'Inconsistent',
    accountingData: 'Available',
    energyData: 'Monthly only',
    ecommercePlatform: 'Available',
    crm: 'Available',
    inventorySystem: 'Basic',
  });

  const [gov, setGov] = useState({
    usesAITools: 'Yes',
    formalAIPolicy: 'No',
    humanReview: 'Usually',
    cybersecOwner: 'Yes',
    aiTraining: 'Limited',
    dataClassification: 'Partial',
    modelMonitoring: 'No',
  });

  // ── File state ──────────────────────────────────────────────────────────────
  const [files, setFiles] = useState<AttachedFile[]>(DEFAULT_FILES);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleReplace = useCallback((id: string, newFile: File) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, name: newFile.name, size: fmtBytes(newFile.size) }
          : f,
      ),
    );
  }, []);

  const handleRemove = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleAddFiles = useCallback((rawFiles: FileList | null) => {
    if (!rawFiles) return;
    const added: AttachedFile[] = Array.from(rawFiles).map((f) => ({
      id: `u-${Date.now()}-${Math.random()}`,
      name: f.name,
      category: 'Additional business data',
      size: fmtBytes(f.size),
    }));
    setFiles((prev) => [...prev, ...added]);
  }, []);

  const restoreFiles = useCallback(() => setFiles(DEFAULT_FILES), []);

  // ── Generation flow ─────────────────────────────────────────────────────────
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);

  const LOADING_MESSAGES = [
    'Evaluating 7 readiness dimensions…',
    'Scoring data & technology readiness…',
    'Assessing governance maturity…',
    'Benchmarking against peers…',
    'Generating personalised roadmap…',
  ];

  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const interval = setInterval(() => {
      setLoadingMsg(LOADING_MESSAGES[i % LOADING_MESSAGES.length]!);
      i += 1;
    }, 280);
    return () => clearInterval(interval);
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
        resultsRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      }, 120);
    }
  }, [generated, prefersReducedMotion]);

  const availabilityOpts = ['Available', 'Partially available', 'Inconsistent', 'Not available'];
  const yesNoOpts        = ['Yes', 'No'];
  const yesNoPartialOpts = ['Yes', 'No', 'Partial'];
  const reviewOpts       = ['Always', 'Usually', 'Sometimes', 'Rarely', 'Never'];
  const trainingOpts     = ['Comprehensive', 'Moderate', 'Limited', 'None'];

  return (
    <div className="space-y-6">

      {/* ── Company Readiness Inputs ─────────────────────────────────────── */}
      <div className="bg-white rounded border p-6" style={{ borderColor: '#e2e2e2' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Cpu size={16} style={{ color: '#db0011' }} />
            <h2 className="font-semibold" style={{ color: '#111' }}>Company Readiness Inputs</h2>
          </div>
          <ProvenanceBadge type="simulated" />
        </div>

        <div className="space-y-6">

          {/* 1. Company Profile */}
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1 w-full" style={{ color: '#888', borderBottom: '1px solid #f0f0f0' }}>
              1 · Company Profile
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
              <CompactInput label="Company name"   value={company.name}      onChange={(v) => setCompany((p) => ({ ...p, name: v }))} />
              <CompactInput label="Sector"          value={company.sector}    onChange={(v) => setCompany((p) => ({ ...p, sector: v }))} />
              <CompactInput label="Region"          value={company.region}    onChange={(v) => setCompany((p) => ({ ...p, region: v }))} />
              <CompactInput label="Employees"       value={company.employees} onChange={(v) => setCompany((p) => ({ ...p, employees: v }))} type="number" />
              <CompactInput label="Annual revenue (£)" value={company.revenue} onChange={(v) => setCompany((p) => ({ ...p, revenue: v }))} type="number" />
              <CompactInput label="Years operating" value={company.years}    onChange={(v) => setCompany((p) => ({ ...p, years: v }))} type="number" />
            </div>
          </fieldset>

          {/* 2. Operational Metrics */}
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1 w-full" style={{ color: '#888', borderBottom: '1px solid #f0f0f0' }}>
              2 · Operational Metrics
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
              <CompactInput label="Inventory turnover (x)"       value={ops.inventoryTurnover}    onChange={(v) => setOps((p) => ({ ...p, inventoryTurnover: v }))}    type="number" />
              <CompactInput label="Stockout rate (%)"            value={ops.stockoutRate}         onChange={(v) => setOps((p) => ({ ...p, stockoutRate: v }))}         type="number" />
              <CompactInput label="Return rate (%)"              value={ops.returnRate}           onChange={(v) => setOps((p) => ({ ...p, returnRate: v }))}           type="number" />
              <CompactInput label="Avg supplier lead time (days)" value={ops.supplierLeadTime}    onChange={(v) => setOps((p) => ({ ...p, supplierLeadTime: v }))}    type="number" />
              <CompactInput label="Monthly electricity (kWh)"    value={ops.monthlyElectricity}   onChange={(v) => setOps((p) => ({ ...p, monthlyElectricity: v }))}   type="number" />
            </div>
          </fieldset>

          {/* 3. Data & Technology */}
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1 w-full" style={{ color: '#888', borderBottom: '1px solid #f0f0f0' }}>
              3 · Data &amp; Technology
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
              <CompactSelect label="Sales data"           value={dataTech.salesData}           options={availabilityOpts} onChange={(v) => setDataTech((p) => ({ ...p, salesData: v }))} />
              <CompactSelect label="Customer data"        value={dataTech.customerData}        options={availabilityOpts} onChange={(v) => setDataTech((p) => ({ ...p, customerData: v }))} />
              <CompactSelect label="Inventory data"       value={dataTech.inventoryData}       options={availabilityOpts} onChange={(v) => setDataTech((p) => ({ ...p, inventoryData: v }))} />
              <CompactSelect label="Supplier data quality" value={dataTech.supplierDataQuality} options={availabilityOpts} onChange={(v) => setDataTech((p) => ({ ...p, supplierDataQuality: v }))} />
              <CompactSelect label="Accounting data"      value={dataTech.accountingData}      options={availabilityOpts} onChange={(v) => setDataTech((p) => ({ ...p, accountingData: v }))} />
              <CompactSelect label="Energy data"          value={dataTech.energyData}          options={['Available', 'Monthly only', 'Partially available', 'Not available']} onChange={(v) => setDataTech((p) => ({ ...p, energyData: v }))} />
              <CompactSelect label="E-commerce platform"  value={dataTech.ecommercePlatform}   options={availabilityOpts} onChange={(v) => setDataTech((p) => ({ ...p, ecommercePlatform: v }))} />
              <CompactSelect label="CRM"                  value={dataTech.crm}                 options={availabilityOpts} onChange={(v) => setDataTech((p) => ({ ...p, crm: v }))} />
              <CompactSelect label="Inventory system"     value={dataTech.inventorySystem}     options={['Advanced', 'Moderate', 'Basic', 'None']} onChange={(v) => setDataTech((p) => ({ ...p, inventorySystem: v }))} />
            </div>
          </fieldset>

          {/* 4. AI Governance & Workforce */}
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wide mb-3 pb-1 w-full" style={{ color: '#888', borderBottom: '1px solid #f0f0f0' }}>
              4 · AI Governance &amp; Workforce
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
              <CompactSelect label="Employees use AI tools"      value={gov.usesAITools}        options={yesNoOpts}        onChange={(v) => setGov((p) => ({ ...p, usesAITools: v }))} />
              <CompactSelect label="Formal AI policy"            value={gov.formalAIPolicy}     options={yesNoOpts}        onChange={(v) => setGov((p) => ({ ...p, formalAIPolicy: v }))} />
              <CompactSelect label="Human review of AI outputs"  value={gov.humanReview}        options={reviewOpts}       onChange={(v) => setGov((p) => ({ ...p, humanReview: v }))} />
              <CompactSelect label="Cybersecurity owner"         value={gov.cybersecOwner}      options={yesNoOpts}        onChange={(v) => setGov((p) => ({ ...p, cybersecOwner: v }))} />
              <CompactSelect label="Employee AI training"        value={gov.aiTraining}         options={trainingOpts}     onChange={(v) => setGov((p) => ({ ...p, aiTraining: v }))} />
              <CompactSelect label="Sensitive-data classification" value={gov.dataClassification} options={['Complete', 'Partial', 'Not started']} onChange={(v) => setGov((p) => ({ ...p, dataClassification: v }))} />
              <CompactSelect label="Model-monitoring process"    value={gov.modelMonitoring}    options={yesNoPartialOpts} onChange={(v) => setGov((p) => ({ ...p, modelMonitoring: v }))} />
            </div>
          </fieldset>

          {/* Business Data Files */}
          <div>
            <div className="flex items-center justify-between mb-3 pb-1" style={{ borderBottom: '1px solid #f0f0f0' }}>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#888' }}>
                  Business Data Files
                </span>
                <span
                  className="ml-2 text-xs font-medium px-1.5 py-0.5 rounded"
                  style={{ background: '#eff6ff', color: '#1d4ed8' }}
                >
                  {files.length} {files.length === 1 ? 'file' : 'files'} attached
                </span>
              </div>
              {files.length !== DEFAULT_FILES.length && (
                <button
                  onClick={restoreFiles}
                  className="flex items-center gap-1 text-xs"
                  style={{ color: '#888' }}
                >
                  <RotateCcw size={11} />
                  Restore Files
                </button>
              )}
            </div>

            {files.length === 0 ? (
              <p className="text-xs py-2" style={{ color: '#aaa' }}>No files attached.</p>
            ) : (
              <div className="space-y-1.5 mb-3">
                {files.map((f) => (
                  <FileRow key={f.id} file={f} onReplace={handleReplace} onRemove={handleRemove} />
                ))}
              </div>
            )}

            {/* Upload area */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleAddFiles(e.dataTransfer.files);
              }}
              className="rounded border-2 border-dashed p-4 text-center transition-colors"
              style={{
                borderColor: dragging ? '#db0011' : '#d1d5db',
                background: dragging ? '#fef2f2' : '#fafafa',
              }}
            >
              <Upload size={16} className="mx-auto mb-1.5" style={{ color: dragging ? '#db0011' : '#aaa' }} />
              <p className="text-xs font-medium mb-0.5" style={{ color: '#555' }}>
                Upload Additional File
              </p>
              <p className="text-xs mb-2" style={{ color: '#aaa' }}>
                CSV, XLSX, or PDF up to 10 MB
              </p>
              <button
                onClick={() => uploadInputRef.current?.click()}
                className="text-xs px-3 py-1.5 rounded border font-medium transition-colors hover:bg-gray-100"
                style={{ borderColor: '#e2e2e2', color: '#555' }}
              >
                Choose File
              </button>
              <input
                ref={uploadInputRef}
                type="file"
                accept=".csv,.xlsx,.pdf"
                multiple
                className="hidden"
                onChange={(e) => {
                  handleAddFiles(e.target.files);
                  e.target.value = '';
                }}
              />
            </div>
          </div>

        </div>{/* /space-y-6 */}

        {/* Generate button */}
        <div className="mt-6 pt-5" style={{ borderTop: '1px solid #f0f0f0' }}>
          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded font-semibold text-sm text-white transition-opacity disabled:opacity-70"
            style={{ background: '#db0011' }}
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                {loadingMsg}
              </>
            ) : generated ? (
              <>
                <RefreshCw size={14} />
                Regenerate Assessment
              </>
            ) : (
              <>
                <Cpu size={14} />
                Generate AI Readiness Assessment
              </>
            )}
          </button>
          {!generated && !loading && (
            <p className="text-xs mt-2" style={{ color: '#aaa' }}>
              Assessment uses the inputs above. Score is illustrative.
            </p>
          )}
        </div>
      </div>

      {/* ── AI Readiness Passport results (revealed after generation) ───────── */}
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
                  <p className="text-sm font-semibold" style={{ color: '#111' }}>
                    {readiness.label}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#888' }}>
                    Sufficient data quality and commercial alignment to begin a controlled pilot,
                    subject to governance improvements.
                  </p>
                </div>
              </div>

              {/* Radar */}
              <div className="bg-white rounded border p-6" style={{ borderColor: '#e2e2e2' }}>
                <p className="text-sm font-semibold mb-4" style={{ color: '#111' }}>
                  Readiness Dimensions
                </p>
                <RadarChart
                  data={readiness.dimensions.map((d) => ({ label: d.label.split(' ')[0]!, value: d.score }))}
                  size={260}
                />
              </div>

              {/* Key findings */}
              <div className="bg-white rounded border p-6 space-y-4" style={{ borderColor: '#e2e2e2' }}>
                <p className="text-sm font-semibold" style={{ color: '#111' }}>
                  Main Conclusion
                </p>
                <div
                  className="rounded p-3 text-xs leading-relaxed"
                  style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }}
                >
                  BrightCart has sufficient commercial and transaction data to begin a controlled
                  operational pilot, but supplier-data quality and AI governance controls require
                  improvement.
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#888' }}>
                    Pilot Blockers
                  </p>
                  <ul className="space-y-2">
                    {readiness.blockers.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <AlertTriangle size={13} className="mt-0.5 shrink-0" style={{ color: '#d97706' }} />
                        <span className="text-xs" style={{ color: '#555' }}>
                          {b}
                        </span>
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
                        <span className="text-xs" style={{ color: '#555' }}>
                          {a}
                        </span>
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
                      <p className="text-xs font-semibold" style={{ color: '#111' }}>
                        {d.label}
                      </p>
                      <span className="text-lg font-bold" style={{ color }}>
                        {d.score}
                      </span>
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
                    <p className="text-xs mb-3" style={{ color: '#888' }}>
                      {d.description}
                    </p>
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
                Personalised roadmap based on readiness score 68/100, governance maturity, and selected opportunity: Demand &amp; Inventory Optimisation.
              </p>
              <div className="relative">
                <div
                  className="absolute left-4 top-0 bottom-0 w-0.5"
                  style={{ background: 'linear-gradient(to bottom, #db0011, #d97706, #1d4ed8, #00875a, #6b21a8)' }}
                />
                <div className="space-y-5 pl-12">
                  {[
                    {
                      period: 'Month 1',
                      color: '#db0011',
                      bg: '#fef2f2',
                      dot: '#db0011',
                      tasks: ['Improve supplier data quality (target: ≥90% SKU coverage)', 'Draft and sign AI acceptable-use policy', 'Assign AI project owner', 'Confirm baseline KPIs (stockout rate, inventory turnover)'],
                    },
                    {
                      period: 'Month 2',
                      color: '#d97706',
                      bg: '#fff7ed',
                      dot: '#d97706',
                      tasks: ['Launch demand forecasting pilot on 20 priority SKUs', 'Deliver AI awareness training to operations team', 'Define human-approval workflow for reorder decisions', 'Set up forecast accuracy tracking dashboard'],
                    },
                    {
                      period: 'Month 3',
                      color: '#1d4ed8',
                      bg: '#eff6ff',
                      dot: '#1d4ed8',
                      tasks: ['Launch AI-assisted reorder recommendation workflow', 'Begin logging all override decisions with reason codes', 'Complete first monthly model accuracy review', 'Submit Digital Productivity Support Programme application'],
                    },
                    {
                      period: 'Months 4–6',
                      color: '#00875a',
                      bg: '#f0fdf4',
                      dot: '#00875a',
                      tasks: ['Expand pilot from 20 SKUs to full catalogue', 'Integrate recommendations into inventory management system', 'Review pilot results vs baseline (target: stockout ≤5.1%)', 'Begin cash-flow forecasting scoping'],
                    },
                    {
                      period: 'Months 6–12',
                      color: '#6b21a8',
                      bg: '#faf5ff',
                      dot: '#6b21a8',
                      tasks: ['Scale successful use cases across all product categories', 'Launch cash-flow forecasting as second AI project', 'Conduct governance maturity review (target: ≥65/100)', 'Plan returns reduction AI project'],
                    },
                  ].map((milestone, i) => (
                    <motion.div
                      key={milestone.period}
                      initial={prefersReducedMotion ? false : { opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      className="relative"
                    >
                      <div
                        className="absolute -left-8 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center"
                        style={{ background: milestone.dot, boxShadow: `0 0 0 2px ${milestone.dot}40`, top: 4 }}
                      />
                      <div className="rounded p-4" style={{ background: milestone.bg }}>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={12} style={{ color: milestone.color }} />
                          <span className="text-xs font-bold uppercase tracking-wide" style={{ color: milestone.color }}>
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
                <p className="text-sm font-semibold" style={{ color: '#111' }}>
                  Methodology
                </p>
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
