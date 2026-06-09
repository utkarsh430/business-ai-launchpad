'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Shield, Users, Settings, TrendingUp } from 'lucide-react';
import { SectionHeader } from '../../shared/SectionHeader';
import { BRIGHTCART } from '@/src/data/brightcart';

const { plan } = BRIGHTCART;

const PHASE_CONFIG = [
  { phase: 1, label: 'Prepare', days: '1–15', color: '#1d4ed8', Icon: CheckCircle },
  { phase: 2, label: 'Configure', days: '16–35', color: '#d97706', Icon: Settings },
  { phase: 3, label: 'Pilot', days: '36–65', color: '#db0011', Icon: TrendingUp },
  { phase: 4, label: 'Measure & Scale', days: '66–90', color: '#00875a', Icon: TrendingUp },
];

export function Plan90Day() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="90-Day Implementation Plan"
        subtitle="Demand & Inventory Optimisation pilot roadmap"
        provenance="pilot-target"
      />

      {/* Phase timeline */}
      <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
        <div className="relative">
          {/* Connecting line */}
          <div
            className="absolute top-7 left-7 right-7 h-0.5"
            style={{ background: '#e2e2e2' }}
          />
          <motion.div
            className="absolute top-7 left-7 h-0.5"
            style={{ background: '#db0011' }}
            initial={{ width: 0 }}
            animate={{ width: '50%' }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />

          <div className="grid grid-cols-4 gap-4 relative">
            {PHASE_CONFIG.map((ph, i) => (
              <motion.div
                key={ph.phase}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 z-10"
                  style={{ background: ph.color, border: '3px solid white', boxShadow: '0 0 0 2px ' + ph.color + '40' }}
                >
                  {ph.phase}
                </div>
                <p className="text-sm font-semibold" style={{ color: '#111' }}>
                  {ph.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#888' }}>
                  Days {ph.days}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks by phase */}
      {PHASE_CONFIG.map((ph) => {
        const phaseTasks = plan.filter((t) => t.phase === ph.phase);
        return (
          <div key={ph.phase} className="bg-white rounded border overflow-hidden" style={{ borderColor: '#e2e2e2' }}>
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ background: ph.color, color: 'white' }}
            >
              <div className="flex items-center gap-2">
                <ph.Icon size={16} />
                <span className="font-semibold text-sm">
                  Phase {ph.phase}: {ph.label}
                </span>
              </div>
              <span className="text-xs opacity-80">Days {ph.days}</span>
            </div>
            <div className="divide-y divide-gray-100">
              {phaseTasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  className="flex items-start gap-3 p-4"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: task.status === 'Complete' ? '#00875a' : '#ddd',
                        background: task.status === 'Complete' ? '#00875a' : 'white',
                      }}
                    >
                      {task.status === 'Complete' && (
                        <CheckCircle size={12} color="white" />
                      )}
                    </div>
                    {task.governanceGate && (
                      <Shield size={12} style={{ color: '#d97706' }} aria-label="Governance gate" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium" style={{ color: '#111' }}>
                        {task.title}
                      </p>
                      <span
                        className="text-xs px-2 py-0.5 rounded shrink-0"
                        style={{
                          background:
                            task.status === 'Complete'
                              ? '#f0fdf4'
                              : task.status === 'In Progress'
                              ? '#eff6ff'
                              : '#f4f4f4',
                          color:
                            task.status === 'Complete'
                              ? '#00875a'
                              : task.status === 'In Progress'
                              ? '#1d4ed8'
                              : '#888',
                        }}
                      >
                        {task.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      <span className="text-xs" style={{ color: '#888' }}>
                        <Users size={10} className="inline mr-1" />
                        {task.owner}
                      </span>
                      <span className="text-xs" style={{ color: '#888' }}>
                        Days {task.dayStart}–{task.dayEnd}
                      </span>
                      {task.governanceGate && (
                        <span className="text-xs flex items-center gap-1" style={{ color: '#d97706' }}>
                          <Shield size={10} /> Governance gate
                        </span>
                      )}
                    </div>
                    <div
                      className="text-xs mt-1 px-2 py-1 rounded"
                      style={{ background: '#f9f9f9', color: '#666' }}
                    >
                      ✓ Success: {task.successMetric}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
