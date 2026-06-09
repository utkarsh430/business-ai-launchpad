'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, AlertCircle, CheckCircle, PauseCircle } from 'lucide-react';
import { OpportunityConstellation } from '../../charts/OpportunityConstellation';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';
import { SectionHeader } from '../../shared/SectionHeader';
import { BRIGHTCART } from '@/src/data/brightcart';
import { formatCurrency } from '@/src/lib/formatters';

const { opportunities } = BRIGHTCART;

const riskColor: Record<string, string> = {
  Low: '#00875a',
  Medium: '#d97706',
  High: '#db0011',
};

export function OpportunityMap() {
  const [selectedId, setSelectedId] = useState('demand');
  const selected = opportunities.find((o) => o.id === selectedId) ?? opportunities[0]!;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Opportunity Map"
        subtitle="AI opportunities ranked by estimated impact and implementation feasibility"
        provenance="estimated"
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Constellation */}
        <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: '#888' }}>
            Impact vs Feasibility
          </p>
          <OpportunityConstellation
            opportunities={opportunities}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <div className="flex items-center gap-6 mt-3 text-xs" style={{ color: '#888' }}>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#00875a' }} /> High score
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#d97706' }} /> Medium
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#ccc' }} /> Deferred
            </span>
          </div>
        </div>

        {/* Detail Panel */}
        <motion.div
          key={selectedId}
          className="bg-white rounded border p-5 space-y-4"
          style={{ borderColor: '#e2e2e2' }}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded flex items-center justify-center text-lg font-bold shrink-0"
              style={{
                background: selected.status === 'Deferred' ? '#f4f4f4' : '#fff0f0',
                color: selected.status === 'Deferred' ? '#bbb' : '#db0011',
              }}
            >
              {selected.score}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold" style={{ color: '#111' }}>
                  {selected.title}
                </h3>
                {selected.status === 'Deferred' ? (
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded" style={{ background: '#f4f4f4', color: '#888' }}>
                    <PauseCircle size={11} /> Deferred
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded" style={{ background: '#f0fdf4', color: '#00875a' }}>
                    <CheckCircle size={11} /> Recommended
                  </span>
                )}
              </div>
              <ProvenanceBadge type="estimated" className="mt-1" />
            </div>
          </div>

          {selected.deferralReason && (
            <div
              className="rounded p-3 text-xs"
              style={{ background: '#f9f9f9', border: '1px solid #e2e2e2', color: '#555' }}
            >
              <AlertCircle size={12} className="inline mr-1.5" style={{ color: '#d97706' }} />
              {selected.deferralReason}
            </div>
          )}

          <p className="text-sm" style={{ color: '#555' }}>
            {selected.reason}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded" style={{ background: '#f9f9f9' }}>
              <div className="text-xs" style={{ color: '#888' }}>
                Estimated Annual Value
              </div>
              <div className="text-lg font-bold mt-0.5" style={{ color: '#111' }}>
                {selected.valueMin === selected.valueMax
                  ? formatCurrency(selected.valueMin)
                  : `${formatCurrency(selected.valueMin, true)}–${formatCurrency(selected.valueMax, true)}`}
              </div>
            </div>
            <div className="p-3 rounded" style={{ background: '#f9f9f9' }}>
              <div className="text-xs" style={{ color: '#888' }}>
                Implementation Cost
              </div>
              <div className="text-lg font-bold mt-0.5" style={{ color: '#111' }}>
                {formatCurrency(selected.implementationCost)}
              </div>
            </div>
            <div className="p-3 rounded" style={{ background: '#f9f9f9' }}>
              <div className="flex items-center gap-1 text-xs" style={{ color: '#888' }}>
                <Clock size={11} /> Time to Value
              </div>
              <div className="text-base font-bold mt-0.5" style={{ color: '#111' }}>
                {selected.timeToValue}
              </div>
            </div>
            <div className="p-3 rounded" style={{ background: '#f9f9f9' }}>
              <div className="flex items-center gap-1 text-xs" style={{ color: '#888' }}>
                <TrendingUp size={11} /> Risk
              </div>
              <div className="text-base font-bold mt-0.5" style={{ color: riskColor[selected.risk] }}>
                {selected.risk}
              </div>
            </div>
          </div>

          {selected.carbonReduction && (
            <div
              className="flex items-center gap-2 p-3 rounded text-sm"
              style={{ background: '#eff6ff', color: '#1e40af' }}
            >
              <span className="text-base">🌿</span>
              <span>
                Estimated carbon reduction: <strong>{selected.carbonReduction} tCO₂e</strong> per year
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Ranked list */}
      <div className="bg-white rounded border" style={{ borderColor: '#e2e2e2' }}>
        <div className="p-4 border-b" style={{ borderColor: '#f0f0f0' }}>
          <p className="text-sm font-semibold" style={{ color: '#111' }}>
            All Opportunities
          </p>
        </div>
        <div className="divide-y" style={{ borderColor: '#f0f0f0' }}>
          {opportunities.map((opp, i) => (
            <button
              key={opp.id}
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
              onClick={() => setSelectedId(opp.id)}
              style={{ background: selectedId === opp.id ? '#fafafa' : 'white' }}
            >
              <div
                className="w-10 h-10 rounded flex items-center justify-center text-sm font-bold shrink-0"
                style={{
                  background: opp.status === 'Deferred' ? '#f4f4f4' : '#fff0f0',
                  color: opp.status === 'Deferred' ? '#bbb' : '#db0011',
                }}
              >
                {opp.score}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: '#111' }}>
                  {i + 1}. {opp.title}
                </p>
                <p className="text-xs truncate" style={{ color: '#888' }}>
                  {opp.status === 'Deferred'
                    ? 'Deferred — governance improvement required'
                    : `${formatCurrency(opp.valueMin, true)}–${formatCurrency(opp.valueMax, true)} est. · ${opp.timeToValue}`}
                </p>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded shrink-0"
                style={{
                  background: opp.status === 'Deferred' ? '#f4f4f4' : riskColor[opp.risk] + '20',
                  color: opp.status === 'Deferred' ? '#888' : riskColor[opp.risk],
                }}
              >
                {opp.status === 'Deferred' ? 'Deferred' : opp.risk + ' risk'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
