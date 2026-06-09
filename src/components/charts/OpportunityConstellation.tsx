'use client';

import { motion } from 'framer-motion';
import type { Opportunity } from '@/src/types';

interface Props {
  opportunities: Opportunity[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function OpportunityConstellation({ opportunities, selectedId, onSelect }: Props) {
  const width = 480;
  const height = 320;
  const padX = 48;
  const padY = 40;

  function toX(feasibility: number) {
    return padX + (feasibility / 100) * (width - padX * 2);
  }
  function toY(impact: number) {
    return height - padY - (impact / 100) * (height - padY * 2);
  }

  const scoreColor = (score: number) =>
    score >= 80 ? '#00875a' : score >= 65 ? '#d97706' : '#888';

  return (
    <div className="relative" style={{ width: '100%', maxWidth: width }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label="Opportunity impact vs feasibility chart"
      >
        {/* Grid */}
        <line x1={padX} y1={padY} x2={padX} y2={height - padY} stroke="#e8e8e8" />
        <line x1={padX} y1={height - padY} x2={width - padX} y2={height - padY} stroke="#e8e8e8" />
        {[25, 50, 75].map((v) => (
          <g key={v}>
            <line
              x1={padX}
              y1={toY(v)}
              x2={width - padX}
              y2={toY(v)}
              stroke="#f0f0f0"
              strokeDasharray="4,4"
            />
            <line
              x1={toX(v)}
              y1={padY}
              x2={toX(v)}
              y2={height - padY}
              stroke="#f0f0f0"
              strokeDasharray="4,4"
            />
          </g>
        ))}

        {/* Axis labels */}
        <text x={width / 2} y={height - 6} textAnchor="middle" fontSize={10} fill="#888" fontFamily="system-ui">
          Feasibility →
        </text>
        <text
          x={12}
          y={height / 2}
          textAnchor="middle"
          fontSize={10}
          fill="#888"
          fontFamily="system-ui"
          transform={`rotate(-90, 12, ${height / 2})`}
        >
          Impact →
        </text>

        {/* Quadrant label */}
        <text x={width - padX - 4} y={padY + 14} textAnchor="end" fontSize={9} fill="#ccc" fontFamily="system-ui">
          High Value
        </text>

        {opportunities.map((opp, i) => {
          const x = toX(opp.feasibility);
          const y = toY(opp.impact);
          const isSelected = opp.id === selectedId;
          const isDeferred = opp.status === 'Deferred';
          const r = 20 + (opp.score / 100) * 14;
          const fill = isDeferred ? '#ccc' : scoreColor(opp.score);

          return (
            <motion.g
              key={opp.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              style={{ cursor: 'pointer' }}
              onClick={() => onSelect(opp.id)}
              role="button"
              tabIndex={0}
              aria-label={`Select ${opp.title}`}
              onKeyDown={(e) => e.key === 'Enter' && onSelect(opp.id)}
            >
              {isSelected && (
                <motion.circle
                  cx={x}
                  cy={y}
                  r={r + 10}
                  fill="none"
                  stroke={fill}
                  strokeWidth={2}
                  opacity={0.3}
                  animate={{ r: [r + 6, r + 14, r + 6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <circle
                cx={x}
                cy={y}
                r={r}
                fill={fill}
                fillOpacity={isSelected ? 1 : 0.7}
                stroke={isSelected ? '#111' : 'transparent'}
                strokeWidth={2}
              />
              <text
                x={x}
                y={y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={11}
                fontWeight="bold"
                fill="white"
                fontFamily="system-ui"
              >
                {opp.score}
              </text>
              <text
                x={x}
                y={y + r + 12}
                textAnchor="middle"
                fontSize={9}
                fill={isDeferred ? '#bbb' : '#555'}
                fontFamily="system-ui"
                fontWeight={isSelected ? '600' : '400'}
              >
                {opp.title.length > 20 ? opp.title.substring(0, 18) + '…' : opp.title}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
