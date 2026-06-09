'use client';

import { motion } from 'framer-motion';

interface RadarPoint {
  label: string;
  value: number;
  max?: number;
}

interface RadarChartProps {
  data: RadarPoint[];
  size?: number;
  color?: string;
}

export function RadarChart({ data, size = 280, color = '#db0011' }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size / 2) * 0.7;
  const n = data.length;

  function getPoint(index: number, value: number, max = 100) {
    const angle = (index / n) * 2 * Math.PI - Math.PI / 2;
    const r = (value / max) * radius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  }

  function getLabelPoint(index: number) {
    const angle = (index / n) * 2 * Math.PI - Math.PI / 2;
    const r = radius * 1.22;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  }

  const gridLevels = [25, 50, 75, 100];

  function gridPolygon(level: number) {
    return data
      .map((_, i) => {
        const pt = getPoint(i, level);
        return `${pt.x},${pt.y}`;
      })
      .join(' ');
  }

  const dataPolygon = data
    .map((d, i) => {
      const pt = getPoint(i, d.value, d.max ?? 100);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  return (
    <svg width={size} height={size} role="img" aria-label="Readiness radar chart">
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={gridPolygon(level)}
          fill="none"
          stroke="#e8e8e8"
          strokeWidth={1}
        />
      ))}
      {data.map((_, i) => {
        const pt = getPoint(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke="#e8e8e8" strokeWidth={1} />;
      })}
      <motion.polygon
        points={dataPolygon}
        fill={color}
        fillOpacity={0.12}
        stroke={color}
        strokeWidth={2}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      {data.map((d, i) => {
        const pt = getPoint(i, d.value, d.max ?? 100);
        return (
          <motion.circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={4}
            fill={color}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.08, duration: 0.3 }}
          />
        );
      })}
      {data.map((d, i) => {
        const lp = getLabelPoint(i);
        const textAnchor = lp.x < cx - 4 ? 'end' : lp.x > cx + 4 ? 'start' : 'middle';
        return (
          <text
            key={i}
            x={lp.x}
            y={lp.y}
            textAnchor={textAnchor}
            dominantBaseline="middle"
            fontSize={10}
            fill="#555"
            fontFamily="system-ui, sans-serif"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}
