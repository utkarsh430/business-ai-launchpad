'use client';

import { Printer } from 'lucide-react';
import { PrototypeDisclaimer } from '../../shared/PrototypeBadge';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';
import { BRIGHTCART } from '@/src/data/brightcart';
import { formatCurrency } from '@/src/lib/formatters';

const { company, readiness, competitiveness, opportunities, financing, sustainability } = BRIGHTCART;

export function ImplementationReport() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 no-print">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#111' }}>
            Implementation Report
          </h2>
          <p className="text-sm" style={{ color: '#888' }}>
            Full BrightCart AI Launchpad report — print or save as PDF
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium text-white"
          style={{ background: '#db0011' }}
        >
          <Printer size={15} />
          Print / Save as PDF
        </button>
      </div>

      <div className="space-y-8 bg-white rounded border p-8" style={{ borderColor: '#e2e2e2' }} id="print-report">
        {/* Cover */}
        <div className="border-b pb-6" style={{ borderColor: '#e2e2e2' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-sm" style={{ background: '#db0011' }}>
              H
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#111' }}>HSBC AI Launchpad</p>
              <p className="text-xs" style={{ color: '#888' }}>Concept Prototype</p>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif', color: '#111' }}>
            AI Implementation Report
          </h1>
          <p className="text-xl mb-4" style={{ color: '#555' }}>
            {company.name}
          </p>
          <PrototypeDisclaimer />
        </div>

        {/* Company Profile */}
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ color: '#111' }}>1. Company Profile</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Company', value: company.name },
              { label: 'Sector', value: company.sector },
              { label: 'Region', value: company.region },
              { label: 'Employees', value: String(company.employees) },
              { label: 'Annual Revenue', value: formatCurrency(company.revenue) },
              { label: 'AI Maturity', value: company.aiMaturity },
            ].map((f) => (
              <div key={f.label} className="p-3 rounded" style={{ background: '#f9f9f9' }}>
                <p className="text-xs" style={{ color: '#888' }}>{f.label}</p>
                <p className="text-sm font-medium" style={{ color: '#111' }}>{f.value}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <ProvenanceBadge type="simulated" />
          </div>
        </section>

        {/* Executive Summary */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: '#111' }}>2. Executive Summary</h2>
          <div
            className="p-4 rounded border text-sm leading-relaxed"
            style={{ background: '#f9f9f9', borderColor: '#e2e2e2', color: '#444' }}
          >
            BrightCart Ltd has an AI readiness score of {readiness.overall}/100 ({readiness.label}),
            placing it at the {competitiveness.overallPercentile}th competitive percentile among illustrative
            sector peers. The primary AI opportunity is Demand &amp; Inventory Optimisation, with an estimated
            annual net value of {formatCurrency(financing.annualNetBenefit)}, a {financing.baseCasePaybackMonths}-month
            base-case payback, and a total implementation cost of {formatCurrency(financing.projectCost)}. A
            potential {formatCurrency(financing.potentialIncentive)} funding match has been identified via the
            Digital Productivity Support Programme prototype. The recommended 90-day pilot roadmap begins with
            supplier-data validation and responsible-AI control approval.
          </div>
        </section>

        {/* Readiness */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: '#111' }}>3. AI Readiness Passport</h2>
          <div className="grid sm:grid-cols-4 gap-3">
            {readiness.dimensions.map((d) => (
              <div key={d.id} className="p-3 rounded" style={{ background: '#f9f9f9' }}>
                <p className="text-xs" style={{ color: '#888' }}>{d.label}</p>
                <p className="text-xl font-bold" style={{ color: d.score >= 70 ? '#00875a' : d.score >= 55 ? '#d97706' : '#db0011' }}>
                  {d.score}
                </p>
              </div>
            ))}
            <div className="p-3 rounded" style={{ background: '#111' }}>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Overall</p>
              <p className="text-xl font-bold text-white">{readiness.overall}</p>
            </div>
          </div>
          <ProvenanceBadge type="simulated" className="mt-2" />
        </section>

        {/* Competitive gaps */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: '#111' }}>4. Competitive Gaps</h2>
          <div className="space-y-2">
            {competitiveness.metrics.filter((m) => m.status !== 'Above median').map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded" style={{ background: '#f9f9f9' }}>
                <span className="text-sm" style={{ color: '#444' }}>{m.label}</span>
                <span className="text-sm font-medium" style={{ color: '#db0011' }}>{m.status}</span>
              </div>
            ))}
          </div>
          <ProvenanceBadge type="illustrative-benchmark" className="mt-2" />
        </section>

        {/* Opportunities */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: '#111' }}>5. Prioritised Opportunities</h2>
          <div className="space-y-2">
            {opportunities.slice(0, 5).map((opp, i) => (
              <div key={opp.id} className="flex items-start gap-3 p-3 rounded" style={{ background: '#f9f9f9' }}>
                <span className="font-bold w-6 shrink-0" style={{ color: '#db0011' }}>{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: '#111' }}>{opp.title}</p>
                  <p className="text-xs" style={{ color: '#888' }}>
                    Score {opp.score} · Est. {formatCurrency(opp.valueMin, true)}–{formatCurrency(opp.valueMax, true)}/yr · {opp.timeToValue}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <ProvenanceBadge type="estimated" className="mt-2" />
        </section>

        {/* Responsible AI */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: '#111' }}>6. Responsible AI Controls</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: 'Classification', value: 'Operational decision support' },
              { label: 'Risk Rating', value: 'Low' },
              { label: 'Human Approval', value: 'Required' },
              { label: 'Autonomous Action', value: 'Prohibited' },
              { label: 'Review Frequency', value: 'Monthly' },
              { label: 'Rollback', value: 'Return to fixed-reorder process' },
            ].map((c) => (
              <div key={c.label} className="flex justify-between p-2 text-sm" style={{ borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ color: '#888' }}>{c.label}</span>
                <span style={{ color: '#111', fontWeight: 500 }}>{c.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Sustainability */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: '#111' }}>7. Sustainability Case</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Annual Energy Saving', value: formatCurrency(sustainability.annualSaving) },
              { label: 'Payback', value: `${sustainability.paybackMonths} months` },
              { label: 'Carbon Reduction', value: `${sustainability.carbonReductionTCO2e} tCO₂e` },
            ].map((m) => (
              <div key={m.label} className="p-3 rounded text-center" style={{ background: '#f0fdf4' }}>
                <p className="text-xl font-bold" style={{ color: '#00875a' }}>{m.value}</p>
                <p className="text-xs" style={{ color: '#166534' }}>{m.label}</p>
              </div>
            ))}
          </div>
          <ProvenanceBadge type="estimated" className="mt-2" />
        </section>

        {/* Financing */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: '#111' }}>8. Financing Case</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Project Cost', value: formatCurrency(financing.projectCost) },
              { label: 'Funding Match', value: formatCurrency(financing.potentialIncentive) },
              { label: 'Financing Required', value: formatCurrency(financing.financingRequirement) },
              { label: 'Base Payback', value: `${financing.baseCasePaybackMonths} months` },
            ].map((m) => (
              <div key={m.label} className="p-3 rounded" style={{ background: '#f9f9f9' }}>
                <p className="text-xs" style={{ color: '#888' }}>{m.label}</p>
                <p className="text-lg font-bold" style={{ color: '#111' }}>{m.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs mt-2" style={{ color: '#888' }}>
            This prototype does not constitute finance approval or financial advice.
          </p>
          <ProvenanceBadge type="estimated" className="mt-2" />
        </section>

        {/* 90-day roadmap summary */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: '#111' }}>9. 90-Day Roadmap Summary</h2>
          <div className="grid sm:grid-cols-4 gap-3">
            {[
              { phase: 'Phase 1', label: 'Prepare', days: 'Days 1–15', tasks: 4 },
              { phase: 'Phase 2', label: 'Configure', days: 'Days 16–35', tasks: 4 },
              { phase: 'Phase 3', label: 'Pilot', days: 'Days 36–65', tasks: 4 },
              { phase: 'Phase 4', label: 'Measure & Scale', days: 'Days 66–90', tasks: 4 },
            ].map((ph) => (
              <div key={ph.phase} className="p-3 rounded text-center" style={{ background: '#f9f9f9' }}>
                <p className="text-xs font-semibold" style={{ color: '#db0011' }}>{ph.phase}</p>
                <p className="text-sm font-bold" style={{ color: '#111' }}>{ph.label}</p>
                <p className="text-xs" style={{ color: '#888' }}>{ph.days}</p>
                <p className="text-xs mt-1" style={{ color: '#888' }}>{ph.tasks} tasks</p>
              </div>
            ))}
          </div>
          <ProvenanceBadge type="pilot-target" className="mt-2" />
        </section>

        {/* Impact targets */}
        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: '#111' }}>10. Impact Targets</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: 'Stockout Rate', baseline: '7.8%', target: '5.1%' },
              { label: 'Inventory Turnover', baseline: '4.2x', target: '5.0x' },
              { label: 'Annual Net Benefit', baseline: '—', target: formatCurrency(financing.annualNetBenefit) },
              { label: 'Energy Reduction', baseline: '—', target: `${sustainability.energyReductionPct}%` },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between p-3 rounded" style={{ background: '#f9f9f9' }}>
                <span className="text-sm" style={{ color: '#555' }}>{m.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: '#bbb', textDecoration: 'line-through' }}>{m.baseline}</span>
                  <span className="text-sm font-bold" style={{ color: '#00875a' }}>→ {m.target}</span>
                </div>
              </div>
            ))}
          </div>
          <ProvenanceBadge type="pilot-target" className="mt-2" />
        </section>

        {/* Provenance */}
        <section style={{ borderTop: '1px solid #e2e2e2', paddingTop: 24 }}>
          <h2 className="text-lg font-bold mb-3" style={{ color: '#111' }}>11. Data Provenance</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            <ProvenanceBadge type="simulated" />
            <ProvenanceBadge type="derived" />
            <ProvenanceBadge type="illustrative-benchmark" />
            <ProvenanceBadge type="estimated" />
            <ProvenanceBadge type="pilot-target" />
          </div>
          <p className="text-xs" style={{ color: '#888' }}>
            All information in this report is simulated, derived from simulated values, or illustrative.
            No data belongs to a real company or HSBC customer. Peer benchmarks are created for prototype
            demonstration only. Financial projections are estimates based on simplifying assumptions.
          </p>
        </section>

        {/* Disclaimer */}
        <section style={{ paddingTop: 8 }}>
          <PrototypeDisclaimer />
        </section>
      </div>
    </div>
  );
}
