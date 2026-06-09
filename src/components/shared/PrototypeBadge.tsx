'use client';

export function PrototypeBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border ${className}`}
      style={{
        background: '#fff7ed',
        color: '#9a3412',
        borderColor: '#fed7aa',
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: '#ea580c' }}
      />
      Concept Prototype
    </span>
  );
}

export function PrototypeDisclaimer() {
  return (
    <div
      className="text-xs px-4 py-3 rounded border"
      style={{
        background: '#fff7ed',
        borderColor: '#fed7aa',
        color: '#7c2d12',
      }}
    >
      <strong>Concept prototype — not an official HSBC product.</strong> All company data, benchmarks, funding
      programmes, and financial figures are simulated and created solely for this demonstration. No information
      relates to a real HSBC customer or a real funding award. This does not constitute financial advice or a
      financing commitment.
    </div>
  );
}
