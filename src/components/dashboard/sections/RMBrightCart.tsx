'use client';

import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { ReadinessRing } from '../../charts/ReadinessRing';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';
import { SectionHeader } from '../../shared/SectionHeader';
import { BRIGHTCART } from '@/src/data/brightcart';
import { formatCurrency } from '@/src/lib/formatters';

const { company, readiness, opportunities, financing, impact } = BRIGHTCART;

export function RMBrightCart() {
  const topOpp = opportunities[0]!;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="BrightCart — RM Client Profile"
        subtitle="Simulated client view — not real HSBC client data"
        provenance="simulated"
      />

      {/* Company header */}
      <div
        className="rounded border p-5 flex items-center gap-5"
        style={{ background: '#111', borderColor: '#222' }}
      >
        <div
          className="w-14 h-14 rounded flex items-center justify-center text-2xl font-bold text-white shrink-0"
          style={{ background: '#db0011' }}
        >
          B
        </div>
        <div className="flex-1">
          <p className="text-xl font-bold text-white">{company.name}</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {company.sector} · {company.region} · {company.employees} employees
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-bold text-white">{formatCurrency(company.revenue)}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Annual revenue</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Readiness */}
        <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: '#111' }}>AI Readiness</p>
          <div className="flex justify-center mb-3">
            <ReadinessRing score={readiness.overall} size={140} sublabel={readiness.label} />
          </div>
          <div className="space-y-1.5">
            {readiness.dimensions.slice(0, 4).map((d) => (
              <div key={d.id} className="flex items-center gap-2">
                <span className="text-xs w-24 truncate" style={{ color: '#888' }}>{d.label.split(' ')[0]}</span>
                <div className="flex-1 h-1.5 rounded-full" style={{ background: '#f0f0f0' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${d.score}%`,
                      background: d.score >= 70 ? '#00875a' : d.score >= 55 ? '#d97706' : '#db0011',
                    }}
                  />
                </div>
                <span className="text-xs w-5 text-right font-medium" style={{ color: '#111' }}>{d.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top opportunity */}
        <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: '#111' }}>Top Opportunity</p>
          <div className="rounded p-3 mb-3" style={{ background: '#fff0f0', borderLeft: '3px solid #db0011' }}>
            <p className="text-xs font-semibold" style={{ color: '#db0011' }}>Score {topOpp.score}/100</p>
            <p className="font-bold mt-0.5" style={{ color: '#111' }}>{topOpp.title}</p>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Est. Annual Value', value: `${formatCurrency(topOpp.valueMin, true)}–${formatCurrency(topOpp.valueMax, true)}` },
              { label: 'Implementation Cost', value: formatCurrency(topOpp.implementationCost) },
              { label: 'Time to Value', value: topOpp.timeToValue },
              { label: 'Risk Rating', value: topOpp.risk },
            ].map((f) => (
              <div key={f.label} className="flex justify-between text-sm" style={{ borderBottom: '1px solid #f4f4f4', paddingBottom: 6 }}>
                <span style={{ color: '#888' }}>{f.label}</span>
                <span style={{ color: '#111', fontWeight: 500 }}>{f.value}</span>
              </div>
            ))}
          </div>
          <ProvenanceBadge type="estimated" className="mt-3" />
        </div>

        {/* RM actions */}
        <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: '#111' }}>RM Recommended Actions</p>
          <div
            className="rounded p-3 mb-3"
            style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
          >
            <p className="text-xs font-semibold" style={{ color: '#1e40af' }}>Priority Action</p>
            <p className="text-sm mt-0.5" style={{ color: '#1e40af' }}>
              Arrange implementation and financing discussion
            </p>
          </div>
          <ul className="space-y-2">
            {[
              'Review financing requirement of £15,000',
              'Confirm Digital Productivity funding match',
              'Discuss responsible-AI policy requirements',
              'Agree 90-day pilot governance gates',
            ].map((a) => (
              <li key={a} className="flex items-start gap-2">
                <ArrowRight size={12} className="mt-0.5 shrink-0" style={{ color: '#db0011' }} />
                <span className="text-xs" style={{ color: '#444' }}>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Financing summary */}
      <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold" style={{ color: '#111' }}>Financing Case</p>
          <ProvenanceBadge type="estimated" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Project Cost', value: formatCurrency(financing.projectCost), color: '#111' },
            { label: 'Funding Match', value: formatCurrency(financing.potentialIncentive), color: '#00875a' },
            { label: 'Financing Required', value: formatCurrency(financing.financingRequirement), color: '#db0011' },
            { label: 'Payback (base)', value: `${financing.baseCasePaybackMonths} months`, color: '#111' },
          ].map((f) => (
            <div key={f.label} className="text-center p-3 rounded" style={{ background: '#f9f9f9' }}>
              <p className="text-2xl font-bold" style={{ color: f.color }}>{f.value}</p>
              <p className="text-xs mt-1" style={{ color: '#888' }}>{f.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: '#888' }}>
          This prototype does not constitute finance approval or financial advice.
        </p>
      </div>

      {/* Governance & blockers */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded border p-4" style={{ borderColor: '#e2e2e2' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: '#111' }}>Governance Requirements</p>
          <ul className="space-y-2">
            {readiness.blockers.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <AlertTriangle size={13} className="mt-0.5 shrink-0" style={{ color: '#d97706' }} />
                <span className="text-xs" style={{ color: '#555' }}>{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded border p-4" style={{ borderColor: '#e2e2e2' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: '#111' }}>Expected Impact</p>
          <ul className="space-y-2">
            {[
              `Stockout rate: ${impact.baseline.stockoutRate}% → ${impact.target.stockoutRate}%`,
              `Inventory turnover: ${impact.baseline.inventoryTurnover}x → ${impact.target.inventoryTurnover}x`,
              `Annual net benefit: ${formatCurrency(impact.target.annualNetBenefit)}`,
              `Carbon reduction: ${BRIGHTCART.sustainability.carbonReductionTCO2e} tCO₂e/yr`,
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle size={13} className="mt-0.5 shrink-0" style={{ color: '#00875a' }} />
                <span className="text-xs" style={{ color: '#555' }}>{item}</span>
              </li>
            ))}
          </ul>
          <ProvenanceBadge type="pilot-target" className="mt-2" />
        </div>
      </div>

      {/* Funding matches */}
      <div className="bg-white rounded border p-4" style={{ borderColor: '#e2e2e2' }}>
        <p className="text-sm font-semibold mb-3" style={{ color: '#111' }}>Funding Matches</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {BRIGHTCART.funding.map((f) => (
            <div key={f.id} className="rounded p-3" style={{ background: '#f9f9f9', border: '1px solid #e2e2e2' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold" style={{ color: '#00875a' }}>{f.matchPercent}%</span>
                <span className="text-xs" style={{ color: '#888' }}>match</span>
              </div>
              <p className="text-xs font-medium" style={{ color: '#111' }}>{f.name}</p>
              <p className="text-xs mt-0.5" style={{ color: '#00875a' }}>Up to {formatCurrency(f.potentialAmount)}</p>
            </div>
          ))}
        </div>
        <p className="text-xs mt-2" style={{ color: '#888' }}>
          Illustrative prototype programme matches only. Not real funding awards.
        </p>
      </div>
    </div>
  );
}
