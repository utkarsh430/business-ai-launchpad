'use client';

import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { ProvenanceBadge } from '../../shared/ProvenanceBadge';
import { SectionHeader } from '../../shared/SectionHeader';
import { BRIGHTCART, DEMAND_HISTORY } from '@/src/data/brightcart';
import {
  calcReorderPoint,
  calcStockoutRisk,
} from '@/src/lib/calculations';
import { formatCurrency } from '@/src/lib/formatters';

const { demand } = BRIGHTCART;

const FORECAST_MONTHS = [
  { month: 'Jan-25', demand: 1010, low: 880, high: 1140 },
  { month: 'Feb-25', demand: 960, low: 840, high: 1080 },
  { month: 'Mar-25', demand: 1080, low: 940, high: 1220 },
  { month: 'Apr-25', demand: 1120, low: 980, high: 1260 },
  { month: 'May-25', demand: 1150, low: 1000, high: 1300 },
  { month: 'Jun-25', demand: 1190, low: 1040, high: 1340 },
];

export function DemandInventory() {
  const [demandGrowth, setDemandGrowth] = useState(0);
  const [supplierDelay, setSupplierDelay] = useState(0);
  const [safetyStock, setSafetyStock] = useState(demand.safetyStock);
  const [currentInv, setCurrentInv] = useState(demand.currentInventory);
  const [incomingInv, setIncomingInv] = useState(demand.incomingStock);

  const adjustedDailyDemand = useMemo(
    () => demand.avgDailyDemand * (1 + demandGrowth / 100),
    [demandGrowth],
  );
  const adjustedLeadTime = useMemo(
    () => demand.supplierLeadTime + supplierDelay,
    [supplierDelay],
  );

  const reorderPoint = useMemo(
    () => calcReorderPoint(adjustedDailyDemand, adjustedLeadTime, safetyStock),
    [adjustedDailyDemand, adjustedLeadTime, safetyStock],
  );

  const stockoutRisk = useMemo(
    () => calcStockoutRisk(currentInv, incomingInv, adjustedDailyDemand, adjustedLeadTime, safetyStock),
    [currentInv, incomingInv, adjustedDailyDemand, adjustedLeadTime, safetyStock],
  );

  const daysOfStock = useMemo(
    () => Math.round((currentInv + incomingInv) / adjustedDailyDemand),
    [currentInv, incomingInv, adjustedDailyDemand],
  );

  const suggestedReorder = useMemo(() => {
    const target = adjustedDailyDemand * (adjustedLeadTime * 2 + 14);
    const net = currentInv + incomingInv;
    return Math.max(0, Math.round(target - net));
  }, [adjustedDailyDemand, adjustedLeadTime, currentInv, incomingInv]);

  const workingCapitalImplication = useMemo(
    () => suggestedReorder * 8.4,
    [suggestedReorder],
  );

  const riskColor =
    stockoutRisk === 'High' ? '#db0011' : stockoutRisk === 'Medium' ? '#d97706' : '#00875a';

  const chartData = DEMAND_HISTORY.map((d, i) => ({
    name: `${d.month} ${d.year}`,
    demand: d.demand,
    returns: d.returns,
    shortName: i % 3 === 0 ? `${d.month} ${String(d.year).slice(2)}` : '',
  }));

  const forecastData = FORECAST_MONTHS.map((f) => ({
    name: f.month,
    demand: Math.round(f.demand * (1 + demandGrowth / 100)),
    low: Math.round(f.low * (1 + demandGrowth / 100)),
    high: Math.round(f.high * (1 + demandGrowth / 100)),
    shortName: f.month,
  }));

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Demand & Inventory Optimiser"
        subtitle="Baseline Demand Outlook — not a trained ML forecast. Simulated data."
        provenance="simulated"
      />

      {/* Product & KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded border p-4 col-span-full lg:col-span-1" style={{ borderColor: '#e2e2e2' }}>
          <p className="text-xs uppercase tracking-wide font-medium mb-1" style={{ color: '#888' }}>
            Selected Product
          </p>
          <p className="text-base font-bold" style={{ color: '#111' }}>
            {demand.selectedProduct}
          </p>
          <ProvenanceBadge type="simulated" className="mt-2" />
        </div>
        {[
          { label: 'Current Inventory', value: `${currentInv} units` },
          { label: 'Days of Stock', value: `${daysOfStock} days` },
          { label: 'Avg Daily Demand', value: `${Math.round(adjustedDailyDemand)} units/day` },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded border p-4" style={{ borderColor: '#e2e2e2' }}>
            <p className="text-xs uppercase tracking-wide font-medium mb-1" style={{ color: '#888' }}>
              {m.label}
            </p>
            <p className="text-2xl font-bold" style={{ color: '#111' }}>
              {m.value}
            </p>
            <ProvenanceBadge type="simulated" className="mt-2" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: '#111' }}>
              Historical Demand (24 months)
            </p>
            <ProvenanceBadge type="simulated" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="shortName" tick={{ fontSize: 10, fill: '#aaa' }} />
              <YAxis tick={{ fontSize: 10, fill: '#aaa' }} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 4, border: '1px solid #e2e2e2' }}
              />
              <Line
                type="monotone"
                dataKey="demand"
                stroke="#db0011"
                strokeWidth={2}
                dot={false}
                name="Demand"
              />
              <Line
                type="monotone"
                dataKey="returns"
                stroke="#d97706"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                name="Returns"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: '#111' }}>
              Baseline Demand Outlook (6 months)
            </p>
            <ProvenanceBadge type="estimated" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={forecastData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="shortName" tick={{ fontSize: 10, fill: '#aaa' }} />
              <YAxis tick={{ fontSize: 10, fill: '#aaa' }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 4, border: '1px solid #e2e2e2' }} />
              <Area
                type="monotone"
                dataKey="high"
                stroke="transparent"
                fill="rgba(219,0,17,0.08)"
                name="Upper range"
              />
              <Area
                type="monotone"
                dataKey="low"
                stroke="transparent"
                fill="rgba(255,255,255,0.9)"
                name="Lower range"
              />
              <Line
                type="monotone"
                dataKey="demand"
                stroke="#db0011"
                strokeWidth={2}
                dot={{ fill: '#db0011', r: 3 }}
                name="Baseline outlook"
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs mt-2" style={{ color: '#888' }}>
            <TrendingUp size={11} className="inline mr-1" />
            {demand.demandOutlook}
          </p>
        </div>
      </div>

      {/* Reorder Analysis */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          className="bg-white rounded border p-4"
          style={{ borderColor: stockoutRisk === 'High' ? '#fca5a5' : '#e2e2e2' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={15} style={{ color: riskColor }} />
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#888' }}>
              Stockout Risk
            </p>
          </div>
          <p className="text-2xl font-bold" style={{ color: riskColor }}>
            {stockoutRisk}
          </p>
          <p className="text-xs mt-1" style={{ color: '#888' }}>
            Net stock: {currentInv + incomingInv} units · Lead time: {adjustedLeadTime} days
          </p>
        </div>
        <div className="bg-white rounded border p-4" style={{ borderColor: '#e2e2e2' }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#888' }}>
            Reorder Point
          </p>
          <p className="text-2xl font-bold" style={{ color: '#111' }}>
            {reorderPoint} units
          </p>
          <p className="text-xs mt-1" style={{ color: '#888' }}>
            Current stock is {currentInv + incomingInv < reorderPoint ? 'below' : 'above'} reorder point
          </p>
          <ProvenanceBadge type="derived" className="mt-2" />
        </div>
        <div className="bg-white rounded border p-4" style={{ borderColor: '#e2e2e2' }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#888' }}>
            Suggested Reorder
          </p>
          <p className="text-2xl font-bold" style={{ color: '#111' }}>
            {suggestedReorder} units
          </p>
          <p className="text-xs mt-1" style={{ color: '#888' }}>
            Est. working-capital implication: {formatCurrency(workingCapitalImplication)}
          </p>
          <ProvenanceBadge type="derived" className="mt-2" />
        </div>
      </div>

      {/* Scenario Controls */}
      <div className="bg-white rounded border p-5" style={{ borderColor: '#e2e2e2' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#111' }}>
          Scenario Controls
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              label: 'Demand growth (%)',
              value: demandGrowth,
              min: -20,
              max: 30,
              step: 5,
              set: setDemandGrowth,
            },
            {
              label: 'Supplier delay (days)',
              value: supplierDelay,
              min: 0,
              max: 14,
              step: 2,
              set: setSupplierDelay,
            },
            {
              label: 'Safety stock (units)',
              value: safetyStock,
              min: 60,
              max: 250,
              step: 10,
              set: setSafetyStock,
            },
            {
              label: 'Current inventory',
              value: currentInv,
              min: 50,
              max: 600,
              step: 10,
              set: setCurrentInv,
            },
            {
              label: 'Incoming inventory',
              value: incomingInv,
              min: 0,
              max: 400,
              step: 10,
              set: setIncomingInv,
            },
          ].map((ctrl) => (
            <div key={ctrl.label}>
              <label className="text-xs font-medium block mb-1" style={{ color: '#555' }}>
                {ctrl.label}:{' '}
                <strong style={{ color: '#111' }}>{ctrl.value}</strong>
              </label>
              <input
                type="range"
                min={ctrl.min}
                max={ctrl.max}
                step={ctrl.step}
                value={ctrl.value}
                onChange={(e) => ctrl.set(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: '#db0011' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div
        className="rounded border p-4 text-xs leading-relaxed"
        style={{ borderColor: '#e2e2e2', background: '#fafafa', color: '#555' }}
      >
        <strong style={{ color: '#111' }}>Methodology:</strong> The Baseline Demand Outlook uses
        deterministic seasonal indices applied to 24 months of simulated transaction history. The
        reorder point is calculated as average daily demand × lead time + safety stock. Known
        limitations include: promotional uplifts may not be fully reflected; new-product SKUs have
        limited history; extreme disruption events may fall outside the baseline range. All values
        are simulated and should not be used for actual purchasing decisions.
      </div>
    </div>
  );
}
