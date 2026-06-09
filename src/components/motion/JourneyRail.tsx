'use client';

import { motion } from 'framer-motion';

const STAGES = [
  { id: 'assess', label: 'Assess', icon: '◈' },
  { id: 'benchmark', label: 'Benchmark', icon: '◉' },
  { id: 'prioritise', label: 'Prioritise', icon: '◆' },
  { id: 'pilot', label: 'Pilot', icon: '▶' },
  { id: 'govern', label: 'Govern', icon: '◼' },
  { id: 'fund', label: 'Fund', icon: '◎' },
  { id: 'measure', label: 'Measure', icon: '◐' },
];

interface JourneyRailProps {
  activeStage?: string;
  compact?: boolean;
}

export function JourneyRail({ activeStage = 'assess', compact = false }: JourneyRailProps) {
  const activeIndex = STAGES.findIndex((s) => s.id === activeStage);

  if (compact) {
    return (
      <div className="flex items-center gap-0 overflow-x-auto">
        {STAGES.map((stage, i) => {
          const isActive = stage.id === activeStage;
          const isPast = i < activeIndex;
          return (
            <div key={stage.id} className="flex items-center">
              <div
                className="flex flex-col items-center"
                style={{ minWidth: 60 }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
                  style={{
                    background: isActive ? '#db0011' : isPast ? '#db0011' : 'white',
                    borderColor: isActive || isPast ? '#db0011' : '#ddd',
                    color: isActive || isPast ? 'white' : '#bbb',
                  }}
                >
                  {i + 1}
                </div>
                <span
                  className="text-xs mt-1 text-center leading-tight"
                  style={{
                    color: isActive ? '#db0011' : isPast ? '#555' : '#bbb',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {stage.label}
                </span>
              </div>
              {i < STAGES.length - 1 && (
                <div
                  className="h-0.5 flex-1"
                  style={{
                    minWidth: 16,
                    background: i < activeIndex ? '#db0011' : '#e8e8e8',
                    marginBottom: 18,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0 w-full">
      {STAGES.map((stage, i) => {
        const isActive = stage.id === activeStage;
        const isPast = i < activeIndex;
        return (
          <div key={stage.id} className="flex items-center flex-1">
            <motion.div
              className="flex flex-col items-center flex-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2"
                style={{
                  background: isActive ? '#db0011' : isPast ? '#db0011' : 'white',
                  borderColor: isActive || isPast ? '#db0011' : '#ddd',
                  color: isActive || isPast ? 'white' : '#bbb',
                  boxShadow: isActive ? '0 0 0 4px rgba(219,0,17,0.15)' : 'none',
                }}
              >
                {i + 1}
              </div>
              <span
                className="text-xs mt-1.5 text-center font-medium"
                style={{ color: isActive ? '#db0011' : isPast ? '#555' : '#bbb' }}
              >
                {stage.label}
              </span>
            </motion.div>
            {i < STAGES.length - 1 && (
              <motion.div
                className="h-0.5 flex-1"
                style={{ background: '#e8e8e8', maxWidth: 32, marginBottom: 18 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.12 + 0.1, duration: 0.3 }}
              >
                <div
                  className="h-full"
                  style={{ background: i < activeIndex ? '#db0011' : '#e8e8e8' }}
                />
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}
