import {
  CAPITAL,
  FUNDING_PROVIDERS,
  DEPLOYMENT_OPTIONS,
  OBJECTIVE_ALLOCATIONS,
  type FundingProvider,
  type FlexibilityLevel,
  type FundingObjective,
  type CapitalObjective,
} from '@/src/data/capital-intelligence';

/* ------------------------------------------------------------------ *
 * Funding calculations
 * ------------------------------------------------------------------ */

/** Standard amortising-loan monthly repayment. */
export function monthlyRepayment(principal: number, annualRatePct: number, termYears: number): number {
  const n = termYears * 12;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

/** Total cost of borrowing = total interest + arrangement fee. */
export function totalBorrowingCost(
  principal: number,
  annualRatePct: number,
  termYears: number,
  arrangementFeePct: number,
): { monthly: number; totalInterest: number; arrangementFee: number; total: number } {
  const monthly = monthlyRepayment(principal, annualRatePct, termYears);
  const totalInterest = monthly * termYears * 12 - principal;
  const arrangementFee = (principal * arrangementFeePct) / 100;
  return {
    monthly,
    totalInterest,
    arrangementFee,
    total: totalInterest + arrangementFee,
  };
}

const FLEX_SCORE: Record<FlexibilityLevel, number> = {
  Low: 0.3,
  Medium: 0.6,
  'Medium-high': 0.8,
  High: 1.0,
};

interface FitWeights {
  cost: number;
  approval: number;
  flexibility: number;
  term: number;
  speed: number;
}

const BASE_WEIGHTS: FitWeights = {
  cost: 0.3,
  approval: 0.25,
  flexibility: 0.2,
  term: 0.15,
  speed: 0.1,
};

/** Adjust weights modestly when the primary objective changes. Always re-normalised to sum 1. */
export function fitWeights(objective: FundingObjective): FitWeights {
  const w = { ...BASE_WEIGHTS };
  if (objective === 'lowest-cost') w.cost += 0.2;
  else if (objective === 'highest-approval') w.approval += 0.2;
  else if (objective === 'maximum-flexibility') w.flexibility += 0.2;
  const sum = w.cost + w.approval + w.flexibility + w.term + w.speed;
  return {
    cost: w.cost / sum,
    approval: w.approval / sum,
    flexibility: w.flexibility / sum,
    term: w.term / sum,
    speed: w.speed / sum,
  };
}

export interface FundingResult extends FundingProvider {
  monthly: number;
  totalCost: number;
  totalInterest: number;
  arrangementFee: number;
  fitScore: number; // 0..100
}

/**
 * Transparent weighted Strategic Fit Score across all options.
 * Borrowing cost is normalised relative to the cheapest/most expensive option
 * so the recommendation reflects strategic fit rather than headline rate alone.
 */
export function scoreFundingOptions(
  amount: number,
  preferredTermYears: number,
  objective: FundingObjective,
): FundingResult[] {
  const weights = fitWeights(objective);

  const costs = FUNDING_PROVIDERS.map((p) =>
    totalBorrowingCost(amount, p.interestRate, preferredTermYears, p.arrangementFeePct),
  );
  const totals = costs.map((c) => c.total);
  const minCost = Math.min(...totals);
  const maxCost = Math.max(...totals);
  const costRange = maxCost - minCost || 1;

  const maxTermDiff = 4; // illustrative span between shortest/longest preferred terms
  const slowestDays = Math.max(...FUNDING_PROVIDERS.map((p) => p.decisionSpeedDays));

  return FUNDING_PROVIDERS.map((p, i) => {
    const cost = costs[i]!;
    const costScore = (maxCost - cost.total) / costRange; // cheaper -> higher
    const approvalScore = p.approvalLikelihood / 100;
    const flexScore = FLEX_SCORE[p.flexibility];
    const termScore = Math.max(0, 1 - Math.abs(p.defaultTermYears - preferredTermYears) / maxTermDiff);
    const speedScore = Math.max(0, 1 - (p.decisionSpeedDays - 1) / (slowestDays - 1));

    const fit =
      weights.cost * costScore +
      weights.approval * approvalScore +
      weights.flexibility * flexScore +
      weights.term * termScore +
      weights.speed * speedScore;

    return {
      ...p,
      monthly: cost.monthly,
      totalCost: cost.total,
      totalInterest: cost.totalInterest,
      arrangementFee: cost.arrangementFee,
      fitScore: Math.round(fit * 100),
    };
  });
}

export function recommendedFunding(results: FundingResult[]): FundingResult {
  return [...results].sort((a, b) => b.fitScore - a.fitScore)[0]!;
}

/* ------------------------------------------------------------------ *
 * Idle capital calculations
 * ------------------------------------------------------------------ */

export function idleCapital(currentCashBalance: number, requiredReserve: number): number {
  return currentCashBalance - requiredReserve;
}

export function opportunityCost(idle: number, alternativeReturnRatePct: number): number {
  return idle * (alternativeReturnRatePct / 100);
}

export type ReserveState = 'below' | 'recommended' | 'excess';

/** Classify a chosen reserve against an illustrative prudent band. */
export function reserveState(reserve: number, currentCashBalance: number): ReserveState {
  // Prudent band: ~30%–55% of the current cash balance held as reserve.
  const lower = currentCashBalance * 0.3; // ~£55k
  const upper = currentCashBalance * 0.55; // ~£101k
  if (reserve < lower) return 'below';
  if (reserve > upper) return 'excess';
  return 'recommended';
}

export function liquidityCoverageMonths(reserve: number, monthlyOutflow: number): number {
  return reserve / monthlyOutflow;
}

/* ------------------------------------------------------------------ *
 * Capital efficiency calculations
 * ------------------------------------------------------------------ */

export function capitalEfficiency(annualRevenue: number, capitalEmployed: number): number {
  return annualRevenue / capitalEmployed;
}

export function utilisationGap(businessEfficiency: number, industryAverage: number): number {
  return ((industryAverage - businessEfficiency) / industryAverage) * 100;
}

/* ------------------------------------------------------------------ *
 * Capital deployment calculations
 * ------------------------------------------------------------------ */

export interface AllocationValidation {
  total: number;
  remaining: number;
  overLimit: boolean;
  valid: boolean;
}

export function validateAllocation(allocations: number[], available: number): AllocationValidation {
  const total = allocations.reduce((s, a) => s + Math.max(0, a), 0);
  return {
    total,
    remaining: available - total,
    overLimit: total > available,
    valid: total <= available && allocations.every((a) => a >= 0),
  };
}

/** Total estimated portfolio benefit = sum(allocation × ROI). */
export function portfolioBenefit(allocations: number[]): number {
  return allocations.reduce((sum, a, i) => {
    const roi = DEPLOYMENT_OPTIONS[i]?.roi ?? 0;
    return sum + Math.max(0, a) * (roi / 100);
  }, 0);
}

/** Capital-weighted blended return (%). */
export function weightedPortfolioReturn(allocations: number[]): number {
  const total = allocations.reduce((s, a) => s + Math.max(0, a), 0);
  if (total === 0) return 0;
  const weighted = allocations.reduce((sum, a, i) => {
    const roi = DEPLOYMENT_OPTIONS[i]?.roi ?? 0;
    return sum + Math.max(0, a) * roi;
  }, 0);
  return weighted / total;
}

/** Capital-weighted risk level (0..1) mapped to a label. */
export function weightedRiskLevel(allocations: number[]): { score: number; label: string } {
  const total = allocations.reduce((s, a) => s + Math.max(0, a), 0);
  if (total === 0) return { score: 0, label: '—' };
  const weighted = allocations.reduce((sum, a, i) => {
    const rw = DEPLOYMENT_OPTIONS[i]?.riskWeight ?? 0;
    return sum + Math.max(0, a) * rw;
  }, 0);
  const score = weighted / total;
  const label = score < 0.35 ? 'Low' : score < 0.55 ? 'Low-medium' : score < 0.7 ? 'Medium' : 'Medium-high';
  return { score, label };
}

/** Recommended allocation for a given strategic objective, scaled to available capital. */
export function recommendedAllocation(objective: CapitalObjective, available: number): number[] {
  const weights = OBJECTIVE_ALLOCATIONS[objective];
  const raw = weights.map((w) => Math.round((w * available) / 1000) * 1000);
  // Correct rounding drift onto the largest bucket so the total matches exactly.
  const drift = available - raw.reduce((s, v) => s + v, 0);
  const maxIdx = raw.indexOf(Math.max(...raw));
  raw[maxIdx] = (raw[maxIdx] ?? 0) + drift;
  return raw;
}

export const DEFAULT_ALLOCATION = DEPLOYMENT_OPTIONS.map((o) => o.recommended);

/* ------------------------------------------------------------------ *
 * Derived canonical values (computed once, reused across the page)
 * ------------------------------------------------------------------ */

export const CAPITAL_DERIVED = {
  idleCapital: idleCapital(CAPITAL.currentCashBalance, CAPITAL.requiredOperatingReserve),
  opportunityCost: opportunityCost(
    idleCapital(CAPITAL.currentCashBalance, CAPITAL.requiredOperatingReserve),
    CAPITAL.alternativeReturnRate,
  ),
  efficiency: capitalEfficiency(CAPITAL.annualRevenue, CAPITAL.capitalEmployed),
  utilisationGap: utilisationGap(
    capitalEfficiency(CAPITAL.annualRevenue, CAPITAL.capitalEmployed),
    CAPITAL.industryAverageEfficiency,
  ),
};
