'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, CheckCircle, AlertTriangle, Shield, TrendingUp, Users, Zap } from 'lucide-react';
import { HeroNetwork } from '../motion/HeroNetwork';
import { PrototypeDisclaimer } from '../shared/PrototypeBadge';

const JOURNEY_STAGES = [
  { label: 'Assess', desc: 'AI readiness passport across 7 dimensions' },
  { label: 'Benchmark', desc: 'Competitive position against sector peers' },
  { label: 'Prioritise', desc: 'High-value AI opportunity identification' },
  { label: 'Pilot', desc: 'Functional AI pilot concepts with controls' },
  { label: 'Govern', desc: 'Responsible AI controls and oversight' },
  { label: 'Fund', desc: 'Grant matching and incentive identification' },
  { label: 'Measure', desc: 'Business and sustainability impact tracking' },
];

const CAPABILITIES = [
  {
    icon: TrendingUp,
    title: 'Demand & Inventory Optimisation',
    desc: 'Reduce stockouts and excess inventory with data-driven reorder intelligence.',
  },
  {
    icon: Zap,
    title: 'Cash-Flow Forecasting',
    desc: 'Scenario-based 90-day cash visibility with financing-gap identification.',
  },
  {
    icon: Shield,
    title: 'Responsible AI Controls',
    desc: 'Purpose, data, oversight, and rollback controls for every AI application.',
  },
  {
    icon: Users,
    title: 'HSBC RM Portfolio Intelligence',
    desc: 'Portfolio readiness signals, intervention queues, and financing pipeline.',
  },
];

const SME_CHALLENGES = [
  'Seasonal demand volatility and stockouts',
  'Excess working capital tied in slow inventory',
  'Irregular cash flow from mixed payment terms',
  'Rising energy costs reducing operating margin',
  'No clear path from AI interest to responsible implementation',
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55 },
};

export function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#fafafa' }}>
      {/* Hero */}
      <section
        className="relative overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(135deg, #111 0%, #1e1e1e 60%, #2a0a0a 100%)',
          minHeight: '92vh',
        }}
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 flex flex-col flex-1 max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-16">
          {/* Header bar */}
          <div className="flex items-center justify-between mb-16">
            <div>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-sm"
                  style={{ background: '#db0011' }}
                >
                  H
                </div>
                <span className="text-white font-semibold tracking-wide text-sm opacity-90">
                  HSBC AI Launchpad
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="text-xs px-3 py-1 rounded border"
                style={{ borderColor: 'rgba(219,0,17,0.4)', color: 'rgba(219,0,17,0.9)', background: 'rgba(219,0,17,0.08)' }}
              >
                Concept Prototype
              </span>
              <Link
                href="/demo"
                className="text-xs text-white opacity-70 hover:opacity-100 transition-opacity"
              >
                Open Demo →
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center flex-1">
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: '#db0011' }}
                >
                  SME AI Adoption Platform
                </p>
                <h1
                  className="font-bold leading-tight mb-6"
                  style={{
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    color: 'white',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  Turn AI ambition into measurable business growth.
                </h1>
                <p className="text-lg mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Benchmark performance, identify high-value AI opportunities, build a responsible
                  implementation case, and explore funding through one connected platform.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/demo"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded font-semibold text-white transition-all hover:opacity-90 active:scale-98"
                    style={{ background: '#db0011' }}
                  >
                    Explore BrightCart Demo
                    <ArrowRight size={16} />
                  </Link>
                  <a
                    href="#journey"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded font-semibold transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.85)',
                      border: '1px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    See How It Works
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Right — network animation */}
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div style={{ height: 380 }}>
                <HeroNetwork width={560} height={380} />
              </div>
            </motion.div>
          </div>

          {/* Metric snippets */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            {[
              { label: 'AI Readiness Score', value: '68/100', note: 'BrightCart' },
              { label: 'Est. Annual Value', value: '£42,000', note: 'Demand optimisation' },
              { label: 'Payback Period', value: '8 months', note: 'Base case' },
              { label: 'Funding Identified', value: '£8,000', note: 'Prototype match' },
            ].map((m) => (
              <div key={m.label}>
                <div className="text-2xl font-bold" style={{ color: 'white' }}>
                  {m.value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {m.label}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#db0011', opacity: 0.8 }}>
                  {m.note}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SME Challenge */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#db0011' }}>
              The Challenge
            </p>
            <h2
              className="text-4xl font-bold mb-6 leading-tight"
              style={{ fontFamily: 'Georgia, serif', color: '#111' }}
            >
              SMEs do not need another list of AI tools.
            </h2>
            <p className="text-lg leading-relaxed mb-8" style={{ color: '#555' }}>
              They need a connected path from business problem to responsible implementation, funding, and
              measurable value. Most SMEs face the same operational challenges that AI can help solve — but lack
              the structured pathway to get there responsibly.
            </p>
            <ul className="space-y-3">
              {SME_CHALLENGES.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" style={{ color: '#d97706' }} />
                  <span className="text-sm" style={{ color: '#444' }}>
                    {c}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Inventory Gap vs Peers', value: '38%', unit: 'below median turnover', color: '#db0011' },
              { label: 'Stockout Rate', value: '7.8%', unit: 'vs 4.6% peer median', color: '#d97706' },
              { label: 'Energy Overspend', value: '17%', unit: 'above peer intensity', color: '#d97706' },
              { label: 'Digital Maturity', value: '78/100', unit: 'above median — strong foundation', color: '#00875a' },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded border p-5"
                style={{ borderColor: '#e2e2e2', background: 'white' }}
              >
                <div className="text-3xl font-bold mb-1" style={{ color: m.color }}>
                  {m.value}
                </div>
                <div className="text-xs font-medium mb-1" style={{ color: '#111' }}>
                  {m.label}
                </div>
                <div className="text-xs" style={{ color: '#888' }}>
                  {m.unit}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Journey */}
      <section
        id="journey"
        className="py-24 px-6 lg:px-12"
        style={{ background: '#111' }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#db0011' }}>
              The Connected Journey
            </p>
            <h2
              className="text-4xl font-bold text-white"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Assess → Benchmark → Prioritise → Pilot → Govern → Fund → Measure
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-7 gap-px" style={{ background: 'rgba(255,255,255,0.08)' }}>
            {JOURNEY_STAGES.map((stage, i) => (
              <motion.div
                key={stage.label}
                className="p-6"
                style={{ background: '#111' }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <div
                  className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold mb-4"
                  style={{ background: 'rgba(219,0,17,0.15)', color: '#db0011', border: '1px solid rgba(219,0,17,0.3)' }}
                >
                  {i + 1}
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{stage.label}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {stage.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#db0011' }}>
            Platform Capabilities
          </p>
          <h2 className="text-4xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#111' }}>
            Intelligence for every stage of the AI journey
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.title}
              className="rounded border p-6"
              style={{ borderColor: '#e2e2e2', background: 'white' }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div
                className="w-10 h-10 rounded flex items-center justify-center mb-4"
                style={{ background: '#fff0f0' }}
              >
                <cap.icon size={20} style={{ color: '#db0011' }} />
              </div>
              <h3 className="font-semibold mb-2 text-sm" style={{ color: '#111' }}>
                {cap.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: '#666' }}>
                {cap.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Value Flow */}
      <section className="py-24 px-6 lg:px-12" style={{ background: '#f4f4f4' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#db0011' }}>
              Connected Value
            </p>
            <h2 className="text-4xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#111' }}>
              From data to demonstrable impact
            </h2>
          </motion.div>
          <motion.div {...fadeUp} className="flex flex-wrap items-center justify-center gap-0">
            {[
              { label: 'Business Data', sub: 'Sales, inventory, finance' },
              { label: 'AI Readiness', sub: '7-dimension assessment' },
              { label: 'Opportunity', sub: 'Ranked by value & feasibility' },
              { label: 'Responsible Pilot', sub: 'Controls & oversight' },
              { label: 'Funding & Finance', sub: 'Grant match + financing' },
              { label: 'Measured Value', sub: '£42k estimated annual benefit' },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center">
                <div
                  className="rounded border px-4 py-3 text-center"
                  style={{ background: 'white', borderColor: '#e2e2e2', minWidth: 110 }}
                >
                  <div className="text-xs font-semibold" style={{ color: '#111' }}>
                    {step.label}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#888' }}>
                    {step.sub}
                  </div>
                </div>
                {i < 5 && (
                  <div className="text-lg font-light mx-1" style={{ color: '#db0011' }}>
                    →
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Responsible AI */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#db0011' }}>
              Responsible AI
            </p>
            <h2 className="text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Georgia, serif', color: '#111' }}>
              Every AI application governed from the start.
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#555' }}>
              The platform applies responsible AI controls to every opportunity: purpose classification, data
              sensitivity review, human-oversight requirements, explainability standards, monitoring frameworks,
              and rollback plans.
            </p>
            <ul className="space-y-3">
              {[
                'Classification and risk rating for every AI use case',
                'Human approval requirements defined before deployment',
                'Monthly monitoring and override tracking',
                'Plain-language limitation disclosure',
                'Rollback process for every pilot',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle size={15} className="mt-0.5 shrink-0" style={{ color: '#00875a' }} />
                  <span className="text-sm" style={{ color: '#444' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="rounded border p-8"
            style={{ background: '#111', borderColor: '#222' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#db0011' }}>
              Responsible AI Control Wheel
            </p>
            {[
              { label: 'Purpose', status: 'Operational decision support' },
              { label: 'Data', status: 'Low-to-moderate sensitivity' },
              { label: 'Human Oversight', status: 'Required — approval workflow' },
              { label: 'Explainability', status: 'Plain-language reasons provided' },
              { label: 'Monitoring', status: 'Monthly forecast error review' },
              { label: 'Incident Response', status: 'Escalation path defined' },
              { label: 'Rollback', status: 'Return to fixed-reorder process' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {item.label}
                </span>
                <span className="text-xs" style={{ color: '#00875a' }}>
                  ✓ {item.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Sustainability */}
      <section className="py-24 px-6 lg:px-12" style={{ background: '#f4f4f4' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Annual Energy Saving', value: '£13,400', note: 'Estimated — warehouse schedule optimisation', color: '#00875a' },
                { label: 'Carbon Reduction', value: '9.6 tCO₂e', note: 'Estimated annual reduction', color: '#1d4ed8' },
                { label: 'Payback Period', value: '5.8 months', note: 'Implementation cost £6,500', color: '#111' },
                { label: 'Energy Reduction', value: '10.5%', note: 'Target — pilot programme', color: '#d97706' },
              ].map((m) => (
                <div key={m.label} className="rounded border p-5" style={{ borderColor: '#e2e2e2', background: 'white' }}>
                  <div className="text-2xl font-bold mb-1" style={{ color: m.color }}>
                    {m.value}
                  </div>
                  <div className="text-xs font-medium mb-1" style={{ color: '#111' }}>
                    {m.label}
                  </div>
                  <div className="text-xs" style={{ color: '#888' }}>
                    {m.note}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#db0011' }}>
                Sustainability
              </p>
              <h2 className="text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Georgia, serif', color: '#111' }}>
                AI that pays back twice — commercially and environmentally.
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#555' }}>
                Warehouse schedule and lighting optimisation is the highest-returning sustainability intervention
                for BrightCart, with an estimated payback of under 6 months and meaningful carbon reduction
                alongside the commercial saving.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* RM Value */}
      <section
        className="py-24 px-6 lg:px-12"
        style={{ background: '#111' }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#db0011' }}>
                HSBC Relationship Manager
              </p>
              <h2
                className="text-4xl font-bold mb-6 leading-tight text-white"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Portfolio intelligence for every SME client.
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
                The RM view provides a portfolio readiness heatmap, intervention queue, opportunity distribution,
                and financing pipeline across all SME clients — so Relationship Managers can identify the highest-value
                next conversations.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'SMEs Onboarded', value: '5' },
                  { label: 'Avg Readiness', value: '64/100' },
                  { label: 'Financing Pipeline', value: '£170,000' },
                  { label: 'Est. Annual Value', value: '£286,000' },
                ].map((m) => (
                  <div key={m.label} className="p-4 rounded" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="text-2xl font-bold text-white">{m.value}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 rounded" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#db0011' }}>
                Portfolio Intervention Queue
              </p>
              {[
                { name: 'BrightCart Ltd', action: 'Arrange implementation discussion', score: 68, priority: 'High' },
                { name: 'Nova Legal Partners', action: 'Start responsible-AI review', score: 71, priority: 'High' },
                { name: 'FieldWorks Services', action: 'Review working-capital requirement', score: 61, priority: 'Medium' },
              ].map((client) => (
                <div key={client.name} className="flex items-start justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <p className="text-sm font-medium text-white">{client.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{client.action}</p>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      background: client.priority === 'High' ? 'rgba(219,0,17,0.2)' : 'rgba(255,255,255,0.08)',
                      color: client.priority === 'High' ? '#ff6b7a' : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {client.priority}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 lg:px-12 text-center" style={{ background: '#db0011' }}>
        <motion.div {...fadeUp}>
          <h2
            className="text-4xl font-bold text-white mb-6"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            See the complete BrightCart journey.
          </h2>
          <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 520, margin: '0 auto 2.5rem' }}>
            Walk through all 13 modules — from readiness assessment to 90-day roadmap — in the fully interactive prototype.
          </p>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 px-8 py-4 rounded bg-white font-semibold hover:bg-gray-100 transition-colors"
            style={{ color: '#db0011' }}
          >
            Explore BrightCart Demo
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer / Disclaimer */}
      <section className="py-12 px-6 lg:px-12" style={{ background: '#111' }}>
        <div className="max-w-4xl mx-auto">
          <PrototypeDisclaimer />
          <div className="mt-6 text-center text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            HSBC AI Launchpad — Concept Prototype · All data simulated · Not an official HSBC product
          </div>
        </div>
      </section>
    </div>
  );
}
