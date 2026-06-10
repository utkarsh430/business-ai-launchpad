'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Database, Calculator, BarChart2, Sliders, Target } from 'lucide-react';

interface DataTrustDrawerProps {
  open: boolean;
  onClose: () => void;
}

const PROVENANCE_TYPES = [
  {
    icon: Database,
    type: 'Simulated',
    color: '#3730a3',
    bg: '#eef2ff',
    desc: 'Created specifically for the fictional BrightCart demonstration. Not derived from any real company or HSBC customer data.',
    examples: ['Company financials', 'Sales transaction history', 'Inventory values', 'Employee count', 'Funding approval likelihood'],
  },
  {
    icon: Calculator,
    type: 'Derived',
    color: '#166534',
    bg: '#f0fdf4',
    desc: 'Calculated arithmetically from the canonical simulated values. Will update consistently when inputs change.',
    examples: ['Revenue per employee', 'Gross margin', 'Reorder point', 'Payback period', 'Idle capital', 'Capital efficiency'],
  },
  {
    icon: BarChart2,
    type: 'Illustrative Benchmark',
    color: '#9a3412',
    bg: '#fff7ed',
    desc: 'Created to demonstrate peer-comparison functionality. Not sourced from a real market dataset.',
    examples: ['Peer median inventory turnover', 'Sector stockout rate', 'Digital maturity score', 'Funding rates', 'Capital-efficiency benchmark', 'Growth Intelligence peer insight'],
  },
  {
    icon: Sliders,
    type: 'Estimated',
    color: '#6b21a8',
    bg: '#fdf4ff',
    desc: 'Output of a scenario or financial model applied to the simulated inputs. Depends on assumptions stated in each module.',
    examples: ['Cash flow projections', 'AI value estimates', 'Energy savings', 'Financing requirement', 'Capital deployment ROI', 'Opportunity cost', 'Recommended allocation'],
  },
  {
    icon: Target,
    type: 'Pilot Target',
    color: '#1e40af',
    bg: '#eff6ff',
    desc: 'A desired future outcome, not an actual or realised result. Presented to illustrate what a successful pilot might achieve.',
    examples: ['Stockout rate target', 'Inventory turnover target', 'Employee adoption goal'],
  },
];

export function DataTrustDrawer({ open, onClose }: DataTrustDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.3)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 overflow-y-auto"
            style={{ width: '100%', maxWidth: 480, background: 'white', boxShadow: '-4px 0 24px rgba(0,0,0,0.12)' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold" style={{ color: '#111' }}>
                    Data Trust
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: '#888' }}>
                    Data provenance and methodology
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded hover:bg-gray-100 transition-colors"
                  aria-label="Close data trust drawer"
                >
                  <X size={18} />
                </button>
              </div>

              <div
                className="rounded p-4 mb-6 text-sm leading-relaxed"
                style={{ background: '#fff7ed', borderLeft: '3px solid #d97706', color: '#7c2d12' }}
              >
                <strong>Prototype disclaimer.</strong> All information displayed in this application is
                simulated, derived from simulated values, or illustrative. No data belongs to a real
                HSBC customer. This is a concept prototype created for demonstration purposes only.
              </div>

              <div className="space-y-4">
                {PROVENANCE_TYPES.map((p) => (
                  <div
                    key={p.type}
                    className="rounded border p-4"
                    style={{ borderColor: '#e2e2e2' }}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div
                        className="w-7 h-7 rounded flex items-center justify-center"
                        style={{ background: p.bg }}
                      >
                        <p.icon size={14} style={{ color: p.color }} />
                      </div>
                      <span
                        className="text-sm font-semibold px-2 py-0.5 rounded"
                        style={{ background: p.bg, color: p.color }}
                      >
                        {p.type}
                      </span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: '#555' }}>
                      {p.desc}
                    </p>
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: '#888' }}>
                        Examples:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.examples.map((ex) => (
                          <span
                            key={ex}
                            className="text-xs px-2 py-0.5 rounded"
                            style={{ background: '#f4f4f4', color: '#555' }}
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6" style={{ borderTop: '1px solid #e2e2e2' }}>
                <p className="text-xs font-semibold mb-3" style={{ color: '#888' }}>
                  ASSUMPTIONS
                </p>
                <ul className="space-y-2">
                  {[
                    'All financial values denominated in GBP',
                    'Peer benchmarks represent illustrative UK SME online retail sector',
                    'Energy saving estimates assume stable usage pattern',
                    'Cash-flow model assumes 30-day payment cycles',
                    'Benefit estimates use base-case scenario assumptions',
                    'Responsible AI risk classification follows illustrative framework',
                    'Idle capital = current cash balance minus required operating reserve',
                    'Capital opportunity cost uses an illustrative ~4.73% alternative-return rate',
                    'No proprietary HSBC customer or transaction data is used in this prototype',
                  ].map((a) => (
                    <li key={a} className="text-xs flex items-start gap-2" style={{ color: '#666' }}>
                      <span style={{ color: '#bbb' }}>—</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
