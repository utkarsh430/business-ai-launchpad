'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { SectionHeader } from '../../shared/SectionHeader';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';
import { BRIGHTCART } from '@/src/data/brightcart';
import { formatCurrency } from '@/src/lib/formatters';

const { funding } = BRIGHTCART;

export function FundingNavigator() {
  const [expanded, setExpanded] = useState<string | null>('digital-productivity');

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Funding Navigator"
        subtitle="Illustrative prototype programme matches — not real funding awards"
        provenance="estimated"
      />

      <div
        className="rounded border p-4 text-sm"
        style={{ background: '#fff7ed', borderColor: '#fed7aa', color: '#7c2d12' }}
      >
        <strong>Prototype disclaimer.</strong> All funding programmes shown are fictional and created
        solely to demonstrate the grant-matching concept. Final eligibility requires verification
        with actual programme providers. No funding has been awarded or guaranteed.
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Programmes Matched', value: '3', color: '#111' },
          { label: 'Total Potential Support', value: formatCurrency(22_000), color: '#00875a' },
          { label: 'Primary Match', value: '86%', color: '#db0011' },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded border p-4" style={{ borderColor: '#e2e2e2' }}>
            <p className="text-xs uppercase tracking-wide font-medium mb-1" style={{ color: '#888' }}>
              {m.label}
            </p>
            <p className="text-2xl font-bold" style={{ color: m.color }}>
              {m.value}
            </p>
            <ProvenanceBadge type="estimated" className="mt-2" />
          </div>
        ))}
      </div>

      {/* Programme cards */}
      <div className="space-y-4">
        {funding.map((prog, i) => {
          const isOpen = expanded === prog.id;
          return (
            <motion.div
              key={prog.id}
              className="bg-white rounded border overflow-hidden"
              style={{ borderColor: '#e2e2e2' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(isOpen ? null : prog.id)}
                aria-expanded={isOpen}
              >
                <div className="flex items-start gap-4">
                  {/* Match meter */}
                  <div className="shrink-0 text-center">
                    <div className="relative w-14 h-14">
                      <svg viewBox="0 0 56 56" width="56" height="56">
                        <circle cx="28" cy="28" r="22" fill="none" stroke="#f0f0f0" strokeWidth="5" />
                        <motion.circle
                          cx="28"
                          cy="28"
                          r="22"
                          fill="none"
                          stroke="#00875a"
                          strokeWidth="5"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 22}
                          initial={{ strokeDashoffset: 2 * Math.PI * 22 }}
                          animate={{
                            strokeDashoffset: 2 * Math.PI * 22 * (1 - prog.matchPercent / 100),
                          }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          style={{ transform: 'rotate(-90deg)', transformOrigin: '28px 28px' }}
                        />
                        <text x="28" y="32" textAnchor="middle" fontSize="11" fontWeight="700" fill="#111" fontFamily="system-ui">
                          {prog.matchPercent}%
                        </text>
                      </svg>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: '#888' }}>
                      Match
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#111' }}>
                      {prog.name}
                    </p>
                    <p className="text-sm mt-0.5" style={{ color: '#888' }}>
                      Potential support: up to{' '}
                      <strong style={{ color: '#00875a' }}>{formatCurrency(prog.potentialAmount)}</strong>
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#888' }}>
                      {prog.stage}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <ProvenanceBadge type="estimated" />
                  {isOpen ? (
                    <ChevronUp size={16} style={{ color: '#888' }} />
                  ) : (
                    <ChevronDown size={16} style={{ color: '#888' }} />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      className="px-5 pb-5 grid sm:grid-cols-2 gap-4"
                      style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#888' }}>
                          Matched Conditions
                        </p>
                        <ul className="space-y-1.5">
                          {prog.matchedConditions.map((c) => (
                            <li key={c} className="flex items-start gap-2">
                              <CheckCircle size={12} className="mt-0.5 shrink-0" style={{ color: '#00875a' }} />
                              <span className="text-xs" style={{ color: '#444' }}>
                                {c}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <p className="text-xs font-semibold uppercase tracking-wide mt-4 mb-2" style={{ color: '#888' }}>
                          Missing Conditions
                        </p>
                        <ul className="space-y-1.5">
                          {prog.missingConditions.map((c) => (
                            <li key={c} className="flex items-start gap-2">
                              <AlertTriangle size={12} className="mt-0.5 shrink-0" style={{ color: '#d97706' }} />
                              <span className="text-xs" style={{ color: '#444' }}>
                                {c}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#888' }}>
                          Required Documents
                        </p>
                        <ul className="space-y-1.5">
                          {prog.requiredDocuments.map((d) => (
                            <li key={d} className="flex items-start gap-2">
                              <span className="text-xs" style={{ color: '#bbb' }}>—</span>
                              <span className="text-xs" style={{ color: '#444' }}>
                                {d}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div
                          className="mt-4 p-3 rounded text-xs"
                          style={{ background: '#f9f9f9', border: '1px solid #e2e2e2', color: '#555' }}
                        >
                          <strong style={{ color: '#111' }}>Application stage:</strong> {prog.stage}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
