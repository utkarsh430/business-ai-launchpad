'use client';

import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, MapPin, Clock } from 'lucide-react';
import { ReadinessRing } from '../../charts/ReadinessRing';
import { RadarChart } from '../../charts/RadarChart';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';
import { SectionHeader } from '../../shared/SectionHeader';
import { BRIGHTCART } from '@/src/data/brightcart';

const { readiness } = BRIGHTCART;

export function AIReadiness() {
  return (
    <div className="space-y-6">
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
              initial={{ opacity: 0, y: 12 }}
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
          {/* Timeline line */}
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
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="relative"
              >
                {/* Dot */}
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
    </div>
  );
}
