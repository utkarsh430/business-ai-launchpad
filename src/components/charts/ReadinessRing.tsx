'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ReadinessRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export function ReadinessRing({
  score,
  size = 180,
  strokeWidth = 14,
  label,
  sublabel,
}: ReadinessRingProps) {
  const [animated, setAnimated] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 150);
    return () => clearTimeout(timer);
  }, [score]);

  const progress = animated / 100;
  const dashoffset = circumference * (1 - progress);

  const color =
    score >= 70 ? '#00875a' : score >= 50 ? '#d97706' : '#db0011';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#e8e8e8"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashoffset }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span
          className="font-bold leading-none"
          style={{ fontSize: size > 140 ? '2.5rem' : '1.75rem', color: '#111' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {Math.round(animated)}
        </motion.span>
        <span className="text-xs mt-0.5" style={{ color: '#888' }}>
          {label ?? '/100'}
        </span>
        {sublabel && (
          <span className="text-xs mt-1 font-medium" style={{ color }}>
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
