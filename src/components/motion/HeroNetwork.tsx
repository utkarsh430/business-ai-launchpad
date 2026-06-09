'use client';

import { useEffect, useRef } from 'react';

const NODES = [
  { id: 'sales', label: 'Sales', x: 0.18, y: 0.25 },
  { id: 'inventory', label: 'Inventory', x: 0.35, y: 0.55 },
  { id: 'cashflow', label: 'Cash Flow', x: 0.65, y: 0.55 },
  { id: 'energy', label: 'Energy', x: 0.82, y: 0.25 },
  { id: 'governance', label: 'Governance', x: 0.5, y: 0.15 },
  { id: 'funding', label: 'Funding', x: 0.5, y: 0.85 },
  { id: 'core', label: 'AI Launchpad', x: 0.5, y: 0.45 },
];

const EDGES = [
  ['sales', 'core'],
  ['inventory', 'core'],
  ['cashflow', 'core'],
  ['energy', 'core'],
  ['governance', 'core'],
  ['funding', 'core'],
  ['sales', 'inventory'],
  ['cashflow', 'funding'],
];

export function HeroNetwork({ width = 600, height = 400 }: { width?: number; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function getNodePos(id: string) {
      const node = NODES.find((n) => n.id === id);
      if (!node) return { x: 0, y: 0 };
      return { x: node.x * width, y: node.y * height };
    }

    function draw(t: number) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      // Draw edges
      EDGES.forEach(([a, b]) => {
        const pa = getNodePos(a!);
        const pb = getNodePos(b!);
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Pulse along edge
        const progress = ((t * 0.0004) % 1);
        const px = pa.x + (pb.x - pa.x) * progress;
        const py = pa.y + (pb.y - pa.y) * progress;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(219,0,17,0.6)';
        ctx.fill();
      });

      // Draw nodes
      NODES.forEach((node) => {
        const x = node.x * width;
        const y = node.y * height;
        const isCore = node.id === 'core';
        const r = isCore ? 32 : 20;

        const pulse = isCore ? Math.sin(t * 0.002) * 4 : 0;

        ctx.beginPath();
        ctx.arc(x, y, r + pulse, 0, Math.PI * 2);
        ctx.fillStyle = isCore ? 'rgba(219,0,17,0.15)' : 'rgba(255,255,255,0.05)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, r - 2 + pulse, 0, Math.PI * 2);
        ctx.strokeStyle = isCore ? 'rgba(219,0,17,0.5)' : 'rgba(255,255,255,0.2)';
        ctx.lineWidth = isCore ? 2 : 1;
        ctx.stroke();

        ctx.fillStyle = isCore ? '#db0011' : 'rgba(255,255,255,0.8)';
        ctx.font = `${isCore ? 600 : 400} ${isCore ? 11 : 9}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, x, y);
      });
    }

    function loop(t: number) {
      timeRef.current = t;
      draw(t);
      animRef.current = requestAnimationFrame(loop);
    }

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full"
      aria-hidden="true"
    />
  );
}
