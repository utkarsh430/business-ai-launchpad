'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { Smile, TrendingUp, TrendingDown, MessageCircle, ArrowRight } from 'lucide-react';
import { SectionHeader } from '../../shared/SectionHeader';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';
import { CONSUMER } from '@/src/data/strategy-modules';

const RED = '#db0011';

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded border p-5 ${className}`} style={{ borderColor: '#e2e2e2' }}>
      {children}
    </div>
  );
}

export function ConsumerInsightHub() {
  const [selected, setSelected] = useState(CONSUMER.complaints[0]!.id);
  const active = CONSUMER.complaints.find((c) => c.id === selected) ?? CONSUMER.complaints[0]!;
  const maxGrowth = Math.max(...CONSUMER.trends.map((t) => t.growth));

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Consumer Insight Hub™"
        subtitle="Turn customer reviews, complaints and feedback into prioritised, commercial business actions."
        provenance="simulated"
      />

      <p className="text-xs" style={{ color: '#888' }}>
        Illustrative prototype using simulated BrightCart customer feedback.
      </p>

      {/* 1. Sentiment snapshot */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Sentiment', value: `${CONSUMER.sentiment.overall}%`, color: RED, accent: true },
          { label: 'Positive', value: `${CONSUMER.sentiment.positive}%`, color: '#00875a' },
          { label: 'Neutral', value: `${CONSUMER.sentiment.neutral}%`, color: '#d97706' },
          { label: 'Negative', value: `${CONSUMER.sentiment.negative}%`, color: '#db0011' },
        ].map((m) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded border p-4"
            style={{ borderColor: '#e2e2e2', borderLeft: m.accent ? `3px solid ${RED}` : '1px solid #e2e2e2' }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              {m.accent && <Smile size={14} style={{ color: RED }} />}
              <p className="text-xs uppercase tracking-wide font-medium" style={{ color: '#888' }}>{m.label}</p>
            </div>
            <p className="text-2xl font-bold" style={{ color: m.color }}>{m.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Sentiment trend */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold" style={{ color: '#111' }}>Sentiment trend — last 6 months</p>
          <ProvenanceBadge type="simulated" />
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={CONSUMER.sentimentTrend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00875a" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#00875a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip />
            <Area type="monotone" dataKey="sentiment" name="Sentiment %" stroke="#00875a" strokeWidth={2} fill="url(#sentGrad)" />
            <Area type="monotone" dataKey="deliveryNeg" name="Delivery negatives %" stroke={RED} strokeWidth={2} fill="none" />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-xs mt-2" style={{ color: '#888' }}>
          Overall sentiment is improving slightly, but delivery-related negative feedback is rising.
        </p>
      </Card>

      {/* 2. Complaint breakdown */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <p className="text-sm font-semibold mb-3" style={{ color: '#111' }}>Complaint breakdown</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie
                  data={CONSUMER.complaints}
                  dataKey="pct"
                  nameKey="label"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  stroke="none"
                  onClick={(_, idx) => setSelected(CONSUMER.complaints[idx]!.id)}
                >
                  {CONSUMER.complaints.map((c) => (
                    <Cell key={c.id} fill={c.color} opacity={c.id === selected ? 1 : 0.45} cursor="pointer" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1">
              {CONSUMER.complaints.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className="w-full flex items-center justify-between gap-2 px-2 py-1 rounded text-left transition-colors"
                  style={{ background: c.id === selected ? '#f4f4f4' : 'transparent' }}
                >
                  <span className="flex items-center gap-2 text-xs" style={{ color: '#444' }}>
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: c.color }} />
                    {c.label}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: '#111' }}>{c.pct}%</span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold" style={{ color: active.color }}>{active.label}</p>
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#f4f4f4', color: '#555' }}>{active.pct}%</span>
          </div>
          <p className="text-sm mb-3" style={{ color: '#444' }}>
            {active.label} {active.change}.
          </p>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#888' }}>Example comments</p>
          <ul className="space-y-2">
            {active.comments.map((c) => (
              <li key={c} className="flex items-start gap-2 text-xs rounded p-2" style={{ background: '#fafafa', color: '#555' }}>
                <MessageCircle size={13} className="mt-0.5 shrink-0" style={{ color: active.color }} />
                <span>&ldquo;{c}&rdquo;</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* 3. Emerging trends radar */}
      <Card>
        <p className="text-sm font-semibold mb-4" style={{ color: '#111' }}>Emerging trends radar</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CONSUMER.trends.map((t, i) => {
            const size = 60 + (t.growth / maxGrowth) * 60;
            return (
              <div key={t.label} className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 120 }}
                  className="rounded-full flex items-center justify-center text-white font-bold"
                  style={{ width: size, height: size, background: RED, opacity: 0.85 + (t.growth / maxGrowth) * 0.15 }}
                >
                  +{t.growth}%
                </motion.div>
                <p className="text-xs mt-2 font-medium" style={{ color: '#444' }}>{t.label}</p>
              </div>
            );
          })}
        </div>
        <p className="text-xs mt-3" style={{ color: '#888' }}>Larger bubbles indicate faster-growing customer topics.</p>
      </Card>

      {/* 4. Word cloud */}
      

      {/* 5. Action priority panel */}
      <Card>
        <p className="text-sm font-semibold mb-4" style={{ color: '#111' }}>Action priorities</p>
        <div className="space-y-3">
          {CONSUMER.actionPriorities.map((a) => (
            <div key={a.rank} className="rounded border p-4" style={{ borderColor: '#eee' }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: RED }}>{a.rank}</span>
                  <span className="font-semibold text-sm" style={{ color: '#111' }}>{a.title}</span>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded shrink-0" style={{ background: '#f0fdf4', color: '#00875a' }}>{a.impact}</span>
              </div>
              <div className="grid sm:grid-cols-3 gap-2 text-xs">
                <div><span className="block font-medium" style={{ color: '#888' }}>Business issue</span><span style={{ color: '#555' }}>{a.issue}</span></div>
                <div><span className="block font-medium" style={{ color: '#888' }}>Customer signal</span><span style={{ color: '#555' }}>{a.signal}</span></div>
                <div><span className="block font-medium" style={{ color: '#888' }}>Suggested action</span><span style={{ color: '#555' }}>{a.action}</span></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 6. Benchmark comparison */}
      <Card>
        <p className="text-sm font-semibold mb-4" style={{ color: '#111' }}>Industry benchmark comparison</p>
        <div className="space-y-4">
          {CONSUMER.benchmarks.map((b) => (
            <div key={b.metric}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium" style={{ color: '#444' }}>{b.metric}</span>
                <span className="flex items-center gap-1" style={{ color: b.youBetter ? '#00875a' : '#d97706' }}>
                  {b.youBetter ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  You {b.you} · Industry {b.industry}
                </span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="h-6 rounded flex items-center px-2" style={{ background: b.youBetter ? '#00875a' : '#d97706' }}>
                    <span className="text-xs text-white font-medium">You {b.you}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="h-6 rounded flex items-center px-2" style={{ background: '#e2e2e2' }}>
                    <span className="text-xs font-medium" style={{ color: '#555' }}>Industry {b.industry}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs mt-4 rounded p-3" style={{ background: '#fafafa', color: '#555' }}>{CONSUMER.benchmarkInsight}</p>
      </Card>

      {/* 7. HSBC Insight Layer */}
      <div className="rounded border p-5" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
        <h3 className="text-sm font-bold mb-2" style={{ color: '#1e3a5f' }}>HSBC Insight Layer™</h3>
        <p className="text-sm leading-relaxed" style={{ color: '#1e40af' }}>{CONSUMER.hsbcInsight}</p>
        <p className="text-xs mt-2" style={{ color: '#6b7280' }}>Illustrative peer insight — not real HSBC proprietary data.</p>
      </div>

      <div className="rounded border-l-4 p-4 flex items-start gap-2" style={{ borderLeftColor: RED, background: '#fafafa' }}>
        <ArrowRight size={15} className="mt-0.5 shrink-0" style={{ color: RED }} />
        <p className="text-sm leading-relaxed" style={{ color: '#444' }}>{CONSUMER.outcome}</p>
      </div>
    </div>
  );
}
