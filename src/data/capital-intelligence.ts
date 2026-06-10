import { BRIGHTCART } from '@/src/data/brightcart';

/**
 * Canonical capital assumptions for the HSBC Capital Intelligence™ feature.
 *
 * Reuses BrightCart's canonical revenue and opening cash reserve from the
 * shared data layer. All other values are illustrative prototype assumptions
 * created solely for this demonstration — no proprietary HSBC data is used.
 */

export type FlexibilityLevel = 'Low' | 'Medium' | 'Medium-high' | 'High';
export type RiskLevel = 'Low' | 'Low-medium' | 'Medium' | 'Medium-high' | 'High';
export type CapitalObjective =
  | 'maximise-growth'
  | 'maximise-efficiency'
  | 'strengthen-resilience'
  | 'balanced-growth';
export type FundingObjective =
  | 'lowest-cost'
  | 'highest-approval'
  | 'maximum-flexibility'
  | 'balanced-fit';

export interface FundingProvider {
  id: string;
  name: string;
  provider: string;
  interestRate: number; // annual %
  approvalLikelihood: number; // %
  arrangementFeePct: number; // % of principal
  defaultTermYears: number;
  flexibility: FlexibilityLevel;
  earlyRepayment: string;
  decisionSpeed: string;
  decisionSpeedDays: number; // midpoint, for scoring
  security: string;
  strengths: string[];
  mainAdvantage?: string;
  mainLimitation?: string;
  recommendedDefault: boolean;
}

export interface DeploymentOption {
  id: string;
  title: string;
  recommended: number;
  breakdown?: { label: string; amount: number }[];
  roi: number; // illustrative risk-adjusted return %
  roiNote?: string;
  role: string;
  risk: RiskLevel;
  riskWeight: number; // 0..1, higher = riskier (for weighted portfolio risk)
  timeToValue: string;
  color: string;
  intelligenceTitle: string;
  intelligenceInsight: string;
  crossLink?: { label: string; section: string };
}

export const CAPITAL = {
  // --- Canonical capital assumptions ---
  currentCashBalance: BRIGHTCART.financials.openingCashReserve, // £184,000 (canonical)
  requiredOperatingReserve: 74_000,
  reserveBreakdown: [
    { label: 'Core operating reserve', amount: 50_000 },
    { label: 'Payroll and tax buffer', amount: 14_000 },
    { label: 'Seasonal contingency', amount: 10_000 },
  ],
  daysAboveReserve: 67,
  alternativeReturnRate: 4.73, // % illustrative hurdle / alternative-return rate

  // --- Capital efficiency ---
  annualRevenue: BRIGHTCART.financials.annualRevenue, // £5,800,000 (canonical)
  capitalEmployed: 2_416_667,
  industryAverageEfficiency: 3.8,
  topQuartileEfficiency: 4.6,
  capitalEfficiencyIndex: 63, // /100, illustrative composite index
  improvementScenarioEfficiency: 3.05, // illustrative scenario target

  // --- Efficiency drivers ---
  efficiencyDrivers: [
    {
      id: 'inventory',
      label: 'Excess inventory',
      value: '£286,000',
      effect: 'Capital tied up in slow-moving stock',
      weight: 38,
    },
    {
      id: 'idle-cash',
      label: 'Idle cash',
      value: '£110,000',
      effect: 'Capital currently generating limited operating return',
      weight: 27,
    },
    {
      id: 'receivables',
      label: 'Long wholesale payment cycle',
      value: '28 days',
      effect: 'Revenue remains locked in receivables',
      weight: 20,
    },
    {
      id: 'automation',
      label: 'Low automation capability',
      value: '15/100',
      effect: 'Manual workflows limit throughput and productivity',
      weight: 15,
    },
  ],

  // --- Funding requirement controls (defaults) ---
  defaultFundingRequirement: 150_000,
  fundingMin: 25_000,
  fundingMax: 500_000,
  termOptions: [3, 5, 6, 7],
  defaultTerm: 5,
};

export const FUNDING_PROVIDERS: FundingProvider[] = [
  {
    id: 'hsbc-growth-loan',
    name: 'HSBC Growth Loan',
    provider: 'HSBC',
    interestRate: 4.8,
    approvalLikelihood: 91,
    arrangementFeePct: 1.0,
    defaultTermYears: 5,
    flexibility: 'High',
    earlyRepayment: 'Permitted with limited conditions',
    decisionSpeed: '5–7 business days',
    decisionSpeedDays: 6,
    security: 'Limited or profile-dependent',
    strengths: [
      'Competitive borrowing cost',
      'Strong approval probability',
      'Flexible repayment',
      'Suitable for staged technology investment',
      'Relationship-manager support',
    ],
    recommendedDefault: true,
  },
  {
    id: 'bank-a',
    name: 'Business Bank A Growth Facility',
    provider: 'Business Bank A',
    interestRate: 5.2,
    approvalLikelihood: 87,
    arrangementFeePct: 0.8,
    defaultTermYears: 5,
    flexibility: 'Medium',
    earlyRepayment: 'Permitted with standard conditions',
    decisionSpeed: '7–10 business days',
    decisionSpeedDays: 8.5,
    security: 'Potential business security',
    strengths: ['Competitive arrangement fee', 'Established growth facility'],
    recommendedDefault: false,
  },
  {
    id: 'digital-b',
    name: 'Digital Lender B Fast Capital',
    provider: 'Digital Lender B',
    interestRate: 6.4,
    approvalLikelihood: 93,
    arrangementFeePct: 2.0,
    defaultTermYears: 3,
    flexibility: 'Low',
    earlyRepayment: 'Limited',
    decisionSpeed: '1–2 business days',
    decisionSpeedDays: 1.5,
    security: 'Light documentation',
    strengths: ['Fast access to capital', 'Light documentation'],
    mainAdvantage: 'Fast access to capital',
    mainLimitation: 'Higher monthly repayment and weaker flexibility',
    recommendedDefault: false,
  },
  {
    id: 'gov-scheme',
    name: 'Illustrative Government-Backed Growth Scheme',
    provider: 'Illustrative Scheme',
    interestRate: 5.0,
    approvalLikelihood: 78,
    arrangementFeePct: 0.5,
    defaultTermYears: 6,
    flexibility: 'Medium-high',
    earlyRepayment: 'Permitted with scheme conditions',
    decisionSpeed: '15–20 business days',
    decisionSpeedDays: 17.5,
    security: 'Scheme-dependent',
    strengths: ['Longer repayment period', 'Potential guarantee support'],
    mainAdvantage: 'Longer repayment period and potential guarantee support',
    mainLimitation: 'More eligibility checks and slower approval',
    recommendedDefault: false,
  },
];

export const DEPLOYMENT_OPTIONS: DeploymentOption[] = [
  {
    id: 'automation',
    title: 'AI and Process Automation',
    recommended: 40_000,
    breakdown: [
      { label: 'Demand-optimisation pilot', amount: 28_000 },
      { label: 'Integration, training and workflow support', amount: 12_000 },
    ],
    roi: 220,
    role: 'Reduce stockouts, improve inventory decisions and free employee capacity',
    risk: 'Medium',
    riskWeight: 0.5,
    timeToValue: '8–12 weeks',
    color: '#db0011',
    intelligenceTitle: 'Automation insight',
    intelligenceInsight:
      'In the illustrative peer scenario used for this prototype, comparable SMEs that implemented targeted operational automation achieved an average productivity improvement of approximately 18%.',
    crossLink: { label: 'View Demand Automation Pilot', section: 'demand' },
  },
  {
    id: 'marketing',
    title: 'Marketing and Customer Growth',
    recommended: 30_000,
    roi: 180,
    role: 'Improve customer acquisition, retention and campaign effectiveness',
    risk: 'Medium-high',
    riskWeight: 0.7,
    timeToValue: '3–6 months',
    color: '#d97706',
    intelligenceTitle: 'Marketing insight',
    intelligenceInsight:
      'Illustrative peer patterns suggest that businesses with strong digital sales infrastructure may generate higher returns from targeted customer-retention and campaign optimisation than from broad untargeted spending.',
  },
  {
    id: 'sustainability',
    title: 'Sustainability Upgrade',
    recommended: 20_000,
    roi: 150,
    role: 'Reduce energy and operating costs while improving environmental performance',
    risk: 'Low-medium',
    riskWeight: 0.35,
    timeToValue: '6–12 months',
    color: '#00875a',
    intelligenceTitle: 'Sustainability insight',
    intelligenceInsight:
      'Illustrative peer scenarios indicate that energy-efficiency initiatives with payback below 12 months are more likely to receive management approval and sustain employee adoption.',
  },
  {
    id: 'debt',
    title: 'Debt Reduction and Balance-Sheet Resilience',
    recommended: 20_000,
    roi: 45,
    roiNote:
      'Illustrative strategic benefit score reflecting avoided interest and improved resilience over multiple periods — not a one-year cash return.',
    role: 'Reduce financial risk, interest burden and future liquidity pressure',
    risk: 'Low',
    riskWeight: 0.2,
    timeToValue: 'Immediate to 12 months',
    color: '#1d4ed8',
    intelligenceTitle: 'Debt-reduction insight',
    intelligenceInsight:
      'Illustrative financial patterns suggest that reducing leverage can create greater strategic value when cash-flow volatility or borrowing costs are elevated.',
  },
];

export const CAPITAL_OBJECTIVES: { id: CapitalObjective; label: string }[] = [
  { id: 'maximise-growth', label: 'Maximise Growth' },
  { id: 'maximise-efficiency', label: 'Maximise Efficiency' },
  { id: 'strengthen-resilience', label: 'Strengthen Resilience' },
  { id: 'balanced-growth', label: 'Balanced Growth' },
];

export const FUNDING_OBJECTIVES: { id: FundingObjective; label: string }[] = [
  { id: 'lowest-cost', label: 'Lowest total cost' },
  { id: 'highest-approval', label: 'Highest approval likelihood' },
  { id: 'maximum-flexibility', label: 'Maximum repayment flexibility' },
  { id: 'balanced-fit', label: 'Balanced strategic fit' },
];

/** Allocation weighting per capital objective (must sum to 1, ordered to match DEPLOYMENT_OPTIONS). */
export const OBJECTIVE_ALLOCATIONS: Record<CapitalObjective, [number, number, number, number]> = {
  // automation, marketing, sustainability, debt
  'maximise-growth': [0.45, 0.4, 0.1, 0.05],
  'maximise-efficiency': [0.55, 0.15, 0.25, 0.05],
  'strengthen-resilience': [0.25, 0.1, 0.2, 0.45],
  'balanced-growth': [40 / 110, 30 / 110, 20 / 110, 20 / 110],
};

/** Provenance/source register surfaced in the page methodology panel and the Data Trust drawer. */
export const CAPITAL_PROVENANCE: { item: string; source: string; type: string }[] = [
  { item: 'Funding rates', source: 'Illustrative', type: 'illustrative-benchmark' },
  { item: 'Approval likelihood', source: 'Simulated', type: 'simulated' },
  { item: 'Industry capital-efficiency benchmark', source: 'Illustrative benchmark', type: 'illustrative-benchmark' },
  { item: 'Capital deployment ROI', source: 'Estimated scenario', type: 'estimated' },
  { item: 'Growth Intelligence', source: 'Illustrative peer insight', type: 'illustrative-benchmark' },
  { item: 'Idle capital', source: 'Derived from BrightCart demo assumptions', type: 'derived' },
  { item: 'Opportunity cost', source: 'Estimated', type: 'estimated' },
  { item: 'Recommended allocation', source: 'Strategic scenario', type: 'estimated' },
];

export const GROWTH_INTELLIGENCE_DISCLOSURE =
  'Prototype note: No proprietary HSBC customer or transaction data is used in this demonstration. In a production environment, this layer could potentially use appropriately governed, aggregated, anonymised and consented portfolio intelligence, subject to legal, privacy, risk and model-governance approval.';
