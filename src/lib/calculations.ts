import { BRIGHTCART } from '@/src/data/brightcart';

export function calcReorderPoint(
  avgDailyDemand: number,
  leadTime: number,
  safetyStock: number,
): number {
  return Math.round(avgDailyDemand * leadTime + safetyStock);
}

export function calcSuggestedReorderQty(
  avgDailyDemand: number,
  leadTime: number,
  currentInventory: number,
  incomingStock: number,
  reorderPoint: number,
): number {
  const coverageTarget = avgDailyDemand * (leadTime * 2 + 14);
  const netStock = currentInventory + incomingStock;
  return Math.max(0, Math.round(coverageTarget - netStock + (reorderPoint - netStock)));
}

export function calcStockoutRisk(
  currentInventory: number,
  incomingStock: number,
  avgDailyDemand: number,
  leadTime: number,
  safetyStock: number,
): 'High' | 'Medium' | 'Low' {
  const netCoverage = (currentInventory + incomingStock) / avgDailyDemand;
  const reorderPoint = calcReorderPoint(avgDailyDemand, leadTime, safetyStock);
  if (currentInventory + incomingStock < reorderPoint * 0.6) return 'High';
  if (netCoverage < leadTime + 7) return 'Medium';
  return 'Low';
}

export function calcFinancingRequirement(
  projectCost: number,
  incentive: number,
  smeContribution: number,
): number {
  return Math.max(0, projectCost - incentive - smeContribution);
}

export function calcPaybackMonths(
  financingRequirement: number,
  projectCost: number,
  annualNetBenefit: number,
  scenario: 'base' | 'downside' | 'upside' = 'base',
): number {
  const multipliers = { base: 1.0, downside: 0.65, upside: 1.25 };
  const adjustedBenefit = annualNetBenefit * multipliers[scenario];
  const totalCost = projectCost;
  return parseFloat(((totalCost / (adjustedBenefit / 12))).toFixed(1));
}

export function calcCashPositions(
  openingCash: number,
  inflows90: number,
  outflows90: number,
  implementationCost: number,
  incentive: number,
  smeContribution: number,
  revenueChange = 0,
  supplierCostIncrease = 0,
  paymentDelay = 0,
): { day30: number; day60: number; day90: number; lowest: number; curve: Array<{ day: number; balance: number }> } {
  const adjustedInflows = inflows90 * (1 + revenueChange / 100) * (1 - paymentDelay * 0.005);
  const adjustedOutflows = outflows90 * (1 + supplierCostIncrease / 100);
  const netCash = adjustedInflows - adjustedOutflows;
  const netImplementation = implementationCost - incentive - smeContribution;

  const curve: Array<{ day: number; balance: number }> = [];
  let balance = openingCash;

  for (let day = 0; day <= 90; day += 5) {
    const progress = day / 90;
    const inflowSoFar = adjustedInflows * progress;
    const outflowSoFar = adjustedOutflows * progress;
    const implCostSoFar = day < 30 ? netImplementation * (day / 30) : netImplementation;
    balance = openingCash + inflowSoFar - outflowSoFar - implCostSoFar;
    curve.push({ day, balance: Math.round(balance) });
  }

  const lowest = Math.min(...curve.map((p) => p.balance));
  const day30 = curve.find((p) => p.day === 30)?.balance ?? 0;
  const day60 = curve.find((p) => p.day === 60)?.balance ?? 0;
  const day90 = openingCash + netCash - netImplementation;

  return {
    day30: Math.round(day30),
    day60: Math.round(day60),
    day90: Math.round(day90),
    lowest: Math.round(lowest),
    curve,
  };
}

export function calcThreeYearBenefit(
  annualNetBenefit: number,
  annualOperatingCost: number,
  projectCost: number,
): number {
  return annualNetBenefit * 3 - annualOperatingCost * 3 - projectCost + BRIGHTCART.financing.potentialIncentive;
}

export const PROVENANCE_LABELS: Record<string, string> = {
  simulated: 'Simulated',
  derived: 'Derived',
  'illustrative-benchmark': 'Illustrative Benchmark',
  estimated: 'Estimated',
  'pilot-target': 'Pilot Target',
};
