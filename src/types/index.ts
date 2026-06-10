export type DataProvenance =
  | 'simulated'
  | 'derived'
  | 'illustrative-benchmark'
  | 'estimated'
  | 'pilot-target';

export interface ProvenanceBadge {
  type: DataProvenance;
  label: string;
  description: string;
}

export interface ReadinessDimension {
  id: string;
  label: string;
  score: number;
  description: string;
  strengths: string[];
  weaknesses: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  score: number;
  valueMin: number;
  valueMax: number;
  implementationCost: number;
  timeToValue: string;
  risk: 'Low' | 'Medium' | 'High';
  feasibility: number;
  impact: number;
  reason: string;
  status: 'Recommended' | 'Deferred';
  deferralReason?: string;
  carbonReduction?: number;
}

export interface FundingProgramme {
  id: string;
  name: string;
  matchPercent: number;
  potentialAmount: number;
  matchedConditions: string[];
  missingConditions: string[];
  requiredDocuments: string[];
  stage: string;
  verified: boolean;
}

export interface RMClient {
  id: string;
  name: string;
  sector: string;
  readiness: number;
  opportunity: string;
  financingNeed: number;
  status: string;
  nextAction: string;
  employees: number;
  revenue: number;
}

export interface PlanTask {
  id: string;
  phase: number;
  phaseLabel: string;
  dayStart: number;
  dayEnd: number;
  title: string;
  owner: string;
  status: 'Not Started' | 'In Progress' | 'Complete';
  dependency?: string;
  governanceGate: boolean;
  successMetric: string;
}

export type ActiveSection =
  | 'overview'
  | 'readiness'
  | 'competitiveness'
  | 'opportunity-map'
  | 'solution-studio'
  | 'implementation-blueprint'
  | 'workforce-impact'
  | 'demand'
  | 'cashflow'
  | 'sustainability'
  | 'responsible-ai'
  | 'financing'
  | 'capital-intelligence'
  | 'roi-simulator'
  | 'use-case-marketplace'
  | 'ai-copilot'
  | 'plan'
  | 'impact'
  | 'report'
  | 'rm-portfolio'
  | 'rm-brightcart';

export type UserRole = 'sme' | 'rm';
