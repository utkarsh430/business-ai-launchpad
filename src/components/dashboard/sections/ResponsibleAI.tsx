'use client';

import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, RotateCcw, Eye, Shield } from 'lucide-react';
import { SectionHeader } from '../../shared/SectionHeader';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';

const WHEEL_SEGMENTS = [
  { label: 'Purpose', angle: 0, status: 'Operational decision support', color: '#db0011' },
  { label: 'Data', angle: 51.4, status: 'Low-to-moderate sensitivity', color: '#d97706' },
  { label: 'Human Oversight', angle: 102.8, status: 'Required — approval workflow', color: '#00875a' },
  { label: 'Explainability', angle: 154.2, status: 'Plain-language reasons', color: '#1d4ed8' },
  { label: 'Monitoring', angle: 205.7, status: 'Monthly forecast review', color: '#7c3aed' },
  { label: 'Incident Response', angle: 257.1, status: 'Escalation path defined', color: '#0891b2' },
  { label: 'Rollback', angle: 308.5, status: 'Return to fixed-reorder', color: '#059669' },
];

const LIMITATIONS = [
  'Promotional uplifts may not be fully represented in the baseline',
  'Supplier disruption may invalidate demand assumptions',
  'New product SKUs have limited demand history',
  'Extreme events may fall outside the baseline range',
];

const MONITORS = [
  { label: 'Forecast Error Rate', target: '<25%', frequency: 'Monthly' },
  { label: 'Human Override Rate', target: '<30%', frequency: 'Weekly' },
  { label: 'Stockout Rate Change', target: '−2.7pp', frequency: 'Monthly' },
  { label: 'Inventory Level Change', target: '−16%', frequency: 'Quarterly' },
];

export function ResponsibleAI() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Responsible AI Passport"
        subtitle="Governance controls for Demand & Inventory Optimisation"
        provenance="simulated"
      />

      {/* Classification banner */}
      <div
        className="rounded border p-5 flex items-start gap-4"
        style={{ borderColor: '#bbf7d0', background: '#f0fdf4' }}
      >
        <CheckCircle size={24} className="shrink-0" style={{ color: '#00875a' }} />
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <p className="font-bold" style={{ color: '#166534' }}>
              Conditional Prototype Approval
            </p>
            <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: '#bbf7d0', color: '#166534' }}>
              Low Operational Risk
            </span>
          </div>
          <p className="text-sm" style={{ color: '#166534', opacity: 0.8 }}>
            Demand & Inventory Optimisation is classified as operational decision support with required
            human approval. Subject to governance controls below.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Control Wheel (SVG) */}
        <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#111' }}>
            Responsible AI Control Wheel
          </p>
          <div className="flex justify-center">
            <svg viewBox="0 0 300 300" width="280" height="280" role="img" aria-label="Responsible AI control wheel">
              {WHEEL_SEGMENTS.map((seg, i) => {
                const totalSegments = WHEEL_SEGMENTS.length;
                const segAngle = 360 / totalSegments;
                const startAngle = (i * segAngle - 90) * (Math.PI / 180);
                const endAngle = ((i + 1) * segAngle - 90) * (Math.PI / 180);
                const outerR = 110;
                const innerR = 55;
                const cx = 150;
                const cy = 150;

                const x1 = cx + innerR * Math.cos(startAngle);
                const y1 = cy + innerR * Math.sin(startAngle);
                const x2 = cx + outerR * Math.cos(startAngle);
                const y2 = cy + outerR * Math.sin(startAngle);
                const x3 = cx + outerR * Math.cos(endAngle);
                const y3 = cy + outerR * Math.sin(endAngle);
                const x4 = cx + innerR * Math.cos(endAngle);
                const y4 = cy + innerR * Math.sin(endAngle);

                const midAngle = ((i + 0.5) * segAngle - 90) * (Math.PI / 180);
                const labelR = (outerR + innerR) / 2;
                const lx = cx + labelR * Math.cos(midAngle);
                const ly = cy + labelR * Math.sin(midAngle);

                return (
                  <motion.g
                    key={seg.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <path
                      d={`M ${x1} ${y1} L ${x2} ${y2} A ${outerR} ${outerR} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerR} ${innerR} 0 0 0 ${x1} ${y1}`}
                      fill={seg.color}
                      fillOpacity={0.15}
                      stroke={seg.color}
                      strokeWidth={1.5}
                    />
                    <text
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={8.5}
                      fill={seg.color}
                      fontFamily="system-ui"
                      fontWeight="600"
                    >
                      {seg.label}
                    </text>
                  </motion.g>
                );
              })}
              {/* Centre */}
              <circle cx={150} cy={150} r={52} fill="#111" />
              <text x={150} y={144} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.7)" fontFamily="system-ui">
                Responsible
              </text>
              <text x={150} y={156} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.7)" fontFamily="system-ui">
                AI Controls
              </text>
            </svg>
          </div>
        </div>

        {/* Control details */}
        <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#111' }}>
            Control Status
          </p>
          <div className="space-y-2.5">
            {[
              { label: 'Classification', value: 'Operational decision support', icon: Shield },
              { label: 'Data Sensitivity', value: 'Low to moderate', icon: Eye },
              { label: 'Human Approval', value: 'Required before any reorder action', icon: CheckCircle },
              { label: 'Autonomous Purchasing', value: 'Prohibited', icon: AlertTriangle },
              { label: 'Review Frequency', value: 'Monthly', icon: CheckCircle },
              { label: 'Rollback Plan', value: 'Return to fixed-reorder process', icon: RotateCcw },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 py-2.5"
                style={{ borderBottom: '1px solid #f4f4f4' }}
              >
                <item.icon
                  size={14}
                  className="mt-0.5 shrink-0"
                  style={{ color: item.label === 'Autonomous Purchasing' ? '#db0011' : '#00875a' }}
                />
                <div className="flex-1">
                  <span className="text-xs font-medium" style={{ color: '#888' }}>
                    {item.label}:
                  </span>{' '}
                  <span
                    className="text-xs"
                    style={{ color: item.label === 'Autonomous Purchasing' ? '#db0011' : '#333', fontWeight: item.label === 'Autonomous Purchasing' ? 600 : 400 }}
                  >
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monitoring */}
      <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold" style={{ color: '#111' }}>
            Monitoring Framework
          </p>
          <ProvenanceBadge type="pilot-target" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MONITORS.map((m) => (
            <div key={m.label} className="rounded p-3" style={{ background: '#f9f9f9', border: '1px solid #e8e8e8' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: '#111' }}>
                {m.label}
              </p>
              <p className="text-lg font-bold" style={{ color: '#db0011' }}>
                {m.target}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#888' }}>
                {m.frequency} review
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Limitations */}
      <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
        <p className="text-sm font-semibold mb-3" style={{ color: '#111' }}>
          Known Limitations
        </p>
        <ul className="space-y-2">
          {LIMITATIONS.map((l) => (
            <li key={l} className="flex items-start gap-2">
              <AlertTriangle size={13} className="mt-0.5 shrink-0" style={{ color: '#d97706' }} />
              <span className="text-sm" style={{ color: '#555' }}>
                {l}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
