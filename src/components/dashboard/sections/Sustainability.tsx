'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { ProvenanceBadge } from '../../shared/ProvenanceBadge';
import { SectionHeader } from '../../shared/SectionHeader';
import { BRIGHTCART } from '@/src/data/brightcart';
import { formatCurrency } from '@/src/lib/formatters';

const { sustainability } = BRIGHTCART;

export function Sustainability() {
  const [selectedId, setSelectedId] = useState('warehouse-schedule');
  const selected = sustainability.interventions.find((i) => i.id === selectedId)!;

  const interventionChartData = sustainability.interventions.map((iv) => ({
    name: iv.title.split(' ').slice(0, 2).join(' '),
    saving: iv.annualSaving,
    cost: iv.cost,
    carbon: iv.carbonReduction,
  }));

  const energyTrendData = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    kwh: Math.round(sustainability.monthlyElectricity * (0.8 + Math.sin(i * 0.5) * 0.15 + i * 0.005)),
    cost: Math.round((sustainability.annualEnergyCost / 12) * (0.8 + Math.sin(i * 0.5) * 0.15 + i * 0.005)),
  }));

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Sustainability Copilot"
        subtitle="Energy optimisation opportunities and estimated commercial and carbon savings"
        provenance="estimated"
      />

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Current Annual Energy Cost', value: formatCurrency(sustainability.annualEnergyCost), color: '#db0011', prov: 'simulated' as const },
          { label: 'Est. Annual Saving', value: formatCurrency(sustainability.annualSaving), color: '#00875a', prov: 'estimated' as const },
          { label: 'Payback Period', value: `${sustainability.paybackMonths} months`, color: '#111', prov: 'derived' as const },
          { label: 'Carbon Reduction', value: `${sustainability.carbonReductionTCO2e} tCO₂e`, color: '#1d4ed8', prov: 'estimated' as const },
        ].map((m) => (
          <motion.div
            key={m.label}
            className="bg-white rounded border p-4"
            style={{ borderColor: '#e2e2e2' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs uppercase tracking-wide font-medium mb-1" style={{ color: '#888' }}>
              {m.label}
            </p>
            <p className="text-2xl font-bold" style={{ color: m.color }}>
              {m.value}
            </p>
            <div className="flex items-center justify-between mt-2">
              <ProvenanceBadge type={m.prov} />
              {m.label === 'Est. Annual Saving' && (
                <span className="text-xs" style={{ color: '#00875a' }}>
                  {sustainability.energyReductionPct}% reduction
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Energy trend */}
        <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: '#111' }}>
              Monthly Energy Cost
            </p>
            <ProvenanceBadge type="simulated" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={energyTrendData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#aaa' }} />
              <YAxis
                tick={{ fontSize: 9, fill: '#aaa' }}
                tickFormatter={(v) => `£${(v / 1000).toFixed(1)}k`}
              />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 4, border: '1px solid #e2e2e2' }}
                formatter={(v) => [formatCurrency(Number(v)), 'Cost']}
              />
              <Bar dataKey="cost" fill="#db0011" fillOpacity={0.7} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Intervention comparison */}
        <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: '#111' }}>
              Cost vs Saving Comparison
            </p>
            <ProvenanceBadge type="estimated" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={interventionChartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                type="number"
                tick={{ fontSize: 9, fill: '#aaa' }}
                tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
              />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: '#aaa' }} width={60} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 4, border: '1px solid #e2e2e2' }}
                formatter={(v) => [formatCurrency(Number(v)), '']}
              />
              <Bar dataKey="saving" fill="#00875a" fillOpacity={0.8} name="Annual saving" radius={[0, 2, 2, 0]} />
              <Bar dataKey="cost" fill="#db0011" fillOpacity={0.6} name="Impl. cost" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interventions */}
      <div className="grid sm:grid-cols-2 gap-4">
        {sustainability.interventions.map((iv) => (
          <button
            key={iv.id}
            className="bg-white rounded border p-4 text-left transition-all"
            style={{
              borderColor: selectedId === iv.id ? '#db0011' : '#e2e2e2',
              borderWidth: selectedId === iv.id ? 2 : 1,
            }}
            onClick={() => setSelectedId(iv.id)}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-sm font-semibold" style={{ color: '#111' }}>
                {iv.title}
              </p>
              <span
                className="text-xs px-2 py-0.5 rounded shrink-0"
                style={{ background: '#f0fdf4', color: '#00875a' }}
              >
                Priority {iv.priority}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-base font-bold" style={{ color: '#00875a' }}>
                  {formatCurrency(iv.annualSaving)}
                </div>
                <div className="text-xs" style={{ color: '#888' }}>Annual saving</div>
              </div>
              <div>
                <div className="text-base font-bold" style={{ color: '#111' }}>
                  {iv.paybackMonths}mo
                </div>
                <div className="text-xs" style={{ color: '#888' }}>Payback</div>
              </div>
              <div>
                <div className="text-base font-bold" style={{ color: '#1d4ed8' }}>
                  {iv.carbonReduction}t
                </div>
                <div className="text-xs" style={{ color: '#888' }}>CO₂e/yr</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Selected detail */}
      <motion.div
        key={selectedId}
        className="bg-white rounded border p-5"
        style={{ borderColor: '#e2e2e2' }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm font-semibold mb-3" style={{ color: '#111' }}>
          {selected.title} — Detail
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            {[
              { label: 'Implementation Cost', value: formatCurrency(selected.cost), color: '#111' },
              { label: 'Annual Saving', value: formatCurrency(selected.annualSaving), color: '#00875a' },
              { label: 'Payback Period', value: `${selected.paybackMonths} months`, color: '#111' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #f0f0f0' }}>
                <span className="text-sm" style={{ color: '#555' }}>{item.label}</span>
                <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[
              { label: 'Carbon Reduction', value: `${selected.carbonReduction} tCO₂e/yr`, color: '#1d4ed8' },
              { label: 'Confidence', value: sustainability.confidence, color: '#111' },
              { label: 'Operational Risk', value: sustainability.operationalRisk, color: '#00875a' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #f0f0f0' }}>
                <span className="text-sm" style={{ color: '#555' }}>{item.label}</span>
                <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
