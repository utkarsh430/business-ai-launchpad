'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertTriangle } from 'lucide-react';
import { SectionHeader } from '../../shared/SectionHeader';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';
import { RM_PORTFOLIO, RM_PORTFOLIO_SUMMARY } from '@/src/data/rm-portfolio';
import { formatCurrency } from '@/src/lib/formatters';

interface RMPortfolioProps {
  onSelectClient?: (id: string) => void;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  'Pilot Ready': { color: '#00875a', bg: '#f0fdf4' },
  'Data Preparation Required': { color: '#d97706', bg: '#fff7ed' },
  'Assessment Complete': { color: '#1d4ed8', bg: '#eff6ff' },
  'Governance Review Required': { color: '#7c3aed', bg: '#fdf4ff' },
  'Opportunity Validation': { color: '#0891b2', bg: '#ecfeff' },
};

function ReadinessHeatDot({ score }: { score: number }) {
  const color =
    score >= 70
      ? '#00875a'
      : score >= 60
      ? '#d97706'
      : '#db0011';
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
      style={{ background: color }}
    >
      {score}
    </div>
  );
}

export function RMPortfolio({ onSelectClient }: RMPortfolioProps) {
  const [search, setSearch] = useState('');

  const filtered = RM_PORTFOLIO.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.sector.toLowerCase().includes(search.toLowerCase()),
  );

  const alerts = RM_PORTFOLIO.filter((c) =>
    ['Governance Review Required', 'Data Preparation Required'].includes(c.status),
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="RM Portfolio Overview"
        subtitle="Simulated portfolio — not real HSBC client data"
        provenance="simulated"
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'SMEs Onboarded', value: String(RM_PORTFOLIO_SUMMARY.smeCount), color: '#111' },
          { label: 'Avg Readiness', value: `${RM_PORTFOLIO_SUMMARY.avgReadiness}/100`, color: '#db0011' },
          { label: 'Pilot Ready', value: String(RM_PORTFOLIO_SUMMARY.pilotReady), color: '#00875a' },
          { label: 'Financing Pipeline', value: formatCurrency(RM_PORTFOLIO_SUMMARY.financingPipeline, true), color: '#1d4ed8' },
          { label: 'Est. Annual Value', value: formatCurrency(RM_PORTFOLIO_SUMMARY.estimatedAnnualValue, true), color: '#00875a' },
          { label: 'RA Alerts', value: String(RM_PORTFOLIO_SUMMARY.responsibleAiAlerts), color: '#d97706' },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded border p-3" style={{ borderColor: '#e2e2e2' }}>
            <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: '#888' }}>
              {m.label}
            </p>
            <p className="text-xl font-bold" style={{ color: m.color }}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div
          className="rounded border p-4"
          style={{ background: '#fffbeb', borderColor: '#fcd34d' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={15} style={{ color: '#d97706' }} />
            <p className="text-sm font-semibold" style={{ color: '#92400e' }}>
              Responsible AI Alerts ({alerts.length})
            </p>
          </div>
          {alerts.map((c) => (
            <p key={c.id} className="text-sm" style={{ color: '#92400e' }}>
              {c.name}: {c.status} — {c.nextAction}
            </p>
          ))}
        </div>
      )}

      {/* Portfolio Signal Map */}
      <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#111' }}>
          Portfolio Signal Map
        </p>
        <div className="relative" style={{ height: 220 }}>
          <svg viewBox="0 0 600 220" className="w-full h-full" role="img" aria-label="Portfolio readiness vs financing scatter">
            <line x1="40" y1="10" x2="40" y2="180" stroke="#e2e2e2" strokeWidth="1" />
            <line x1="40" y1="180" x2="580" y2="180" stroke="#e2e2e2" strokeWidth="1" />
            <text x="20" y="100" fontSize="10" fill="#bbb" textAnchor="middle" transform="rotate(-90,20,100)">Readiness</text>
            <text x="310" y="200" fontSize="10" fill="#bbb" textAnchor="middle">Financing Need →</text>

            {RM_PORTFOLIO.map((client, i) => {
              const x = 60 + (client.financingNeed / 70_000) * 480;
              const y = 170 - ((client.readiness - 40) / 40) * 140;
              const isBrightCart = client.id === 'brightcart';
              const readinessColor = client.readiness >= 70 ? '#00875a' : client.readiness >= 60 ? '#d97706' : '#db0011';

              return (
                <motion.g
                  key={client.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  style={{ cursor: 'pointer' }}
                  onClick={() => client.id === 'brightcart' && onSelectClient?.('brightcart')}
                >
                  {isBrightCart && (
                    <motion.circle
                      cx={x}
                      cy={y}
                      r={28}
                      fill="none"
                      stroke="#db0011"
                      strokeWidth={1.5}
                      opacity={0.3}
                      animate={{ r: [22, 30, 22] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={20}
                    fill={readinessColor}
                    fillOpacity={isBrightCart ? 1 : 0.6}
                    stroke={isBrightCart ? '#111' : 'white'}
                    strokeWidth={isBrightCart ? 2 : 1}
                  />
                  <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="700" fill="white" fontFamily="system-ui">
                    {client.readiness}
                  </text>
                  <text x={x} y={y + 25} textAnchor="middle" fontSize="8.5" fill="#555" fontFamily="system-ui">
                    {client.name.split(' ')[0]}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#bbb' }} />
        <input
          type="text"
          placeholder="Search by name or sector…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded border text-sm"
          style={{ borderColor: '#e2e2e2', background: 'white', color: '#111' }}
        />
      </div>

      {/* Portfolio table */}
      <div className="bg-white rounded border overflow-hidden" style={{ borderColor: '#e2e2e2' }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #e2e2e2' }}>
                {['Company', 'Readiness', 'Top Opportunity', 'Status', 'Financing Need', 'Next Action'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#888' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((client, i) => {
                const sc = STATUS_CONFIG[client.status] ?? { color: '#888', bg: '#f4f4f4' };
                return (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    style={{ borderBottom: '1px solid #f4f4f4' }}
                    onClick={() => client.id === 'brightcart' && onSelectClient?.('rm-brightcart')}
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium" style={{ color: '#111' }}>
                        {client.name}
                        {client.id === 'brightcart' && (
                          <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ background: '#fff0f0', color: '#db0011' }}>
                            Click for profile
                          </span>
                        )}
                      </p>
                      <p className="text-xs" style={{ color: '#888' }}>{client.sector}</p>
                    </td>
                    <td className="px-4 py-3">
                      <ReadinessHeatDot score={client.readiness} />
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#444' }}>
                      {client.opportunity}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-1 rounded font-medium"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: '#111' }}>
                      {formatCurrency(client.financingNeed)}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#555' }}>
                      {client.nextAction}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ProvenanceBadge type="simulated" />
      <p className="text-xs" style={{ color: '#888' }}>
        Do not imply access to real HSBC systems or client information. All portfolio data is simulated.
      </p>
    </div>
  );
}
