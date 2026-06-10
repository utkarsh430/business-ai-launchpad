export type CapabilityId =
  | 'sales'
  | 'marketing'
  | 'data-analysis'
  | 'ai-automation'
  | 'sustainability'
  | 'operations';

export type PriorityLevel = 'Low' | 'Medium' | 'High';
export type AcquisitionRoute = 'hire' | 'train' | 'outsource';

export interface CapabilityConfig {
  id: CapabilityId;
  label: string;
  current: number;
  defaultTarget: number;
  businessRelevance: number;
  // Impact per capability point increase (used in simulator)
  revenuePerPoint: number;
  costSavingPerPoint: number;
  productivityPerPoint: number; // percentage points
  hoursPerPoint: number;
}

export interface AcquisitionOption {
  route: AcquisitionRoute;
  title: string;
  cost: number;
  costLabel: string;
  timeToCapability: string;
  expectedBenefit: number;
  netValue: number;
  roi: number; // pre-computed: (benefit - cost) / cost * 100
  control: string;
  speed: string;
  retention: string;
  risk: string;
  scalability: string;
  dependencyRisk: string;
  bestFor: string;
  limitation: string;
  isRecommended: boolean;
  recommendationLabel: string;
  recommendationReason: string;
  // Strategic fit score attributes (used in priority-weighted scoring)
  speedAttr: number;     // 1–3
  budgetAttr: number;    // 1–3
  controlAttr: number;   // 1–3
  retentionAttr: number; // 1–3
  baseScore: number;     // at default priorities
}

export interface CapabilityOptions {
  capabilityId: CapabilityId;
  defaultRecommended: AcquisitionRoute;
  recommendationHeadline: string;
  options: [AcquisitionOption, AcquisitionOption, AcquisitionOption];
}

// ---------------------------------------------------------------------------
// Capabilities
// ---------------------------------------------------------------------------

export const CAPABILITIES: CapabilityConfig[] = [
  {
    id: 'sales',
    label: 'Sales',
    current: 85,
    defaultTarget: 85,
    businessRelevance: 95,
    revenuePerPoint: 1800,
    costSavingPerPoint: 400,
    productivityPerPoint: 0.25,
    hoursPerPoint: 5,
  },
  {
    id: 'marketing',
    label: 'Marketing',
    current: 40,
    defaultTarget: 65,
    businessRelevance: 85,
    revenuePerPoint: 3200,
    costSavingPerPoint: 300,
    productivityPerPoint: 0.2,
    hoursPerPoint: 4,
  },
  {
    id: 'data-analysis',
    label: 'Data Analysis',
    current: 20,
    defaultTarget: 55,
    businessRelevance: 80,
    revenuePerPoint: 1500,
    costSavingPerPoint: 1200,
    productivityPerPoint: 0.35,
    hoursPerPoint: 8,
  },
  {
    id: 'ai-automation',
    label: 'AI Automation',
    current: 15,
    defaultTarget: 60,
    businessRelevance: 90,
    revenuePerPoint: 2666.67,
    costSavingPerPoint: 1000,
    productivityPerPoint: 0.4,
    hoursPerPoint: 9.333,
  },
  {
    id: 'sustainability',
    label: 'Sustainability',
    current: 30,
    defaultTarget: 55,
    businessRelevance: 60,
    revenuePerPoint: 600,
    costSavingPerPoint: 1400,
    productivityPerPoint: 0.15,
    hoursPerPoint: 3,
  },
  {
    id: 'operations',
    label: 'Operations',
    current: 70,
    defaultTarget: 80,
    businessRelevance: 85,
    revenuePerPoint: 1200,
    costSavingPerPoint: 2200,
    productivityPerPoint: 0.45,
    hoursPerPoint: 11,
  },
];

// ---------------------------------------------------------------------------
// Acquisition options per capability
// ---------------------------------------------------------------------------

export const CAPABILITY_OPTIONS: Record<CapabilityId, CapabilityOptions> = {
  'ai-automation': {
    capabilityId: 'ai-automation',
    defaultRecommended: 'outsource',
    recommendationHeadline:
      'Outsource the initial AI automation pilot with mandatory internal capability transfer.',
    options: [
      {
        route: 'hire',
        title: 'Hire an AI Automation Lead',
        cost: 58000,
        costLabel: '£58,000/year',
        timeToCapability: '4–6 months',
        expectedBenefit: 165000,
        netValue: 107000,
        roi: 184,
        control: 'High',
        speed: 'Low–Medium',
        retention: 'High',
        risk: 'Medium',
        scalability: 'High',
        dependencyRisk: 'Low',
        bestFor: 'A long-term internal AI programme',
        limitation: 'Higher fixed cost and slower recruitment',
        isRecommended: false,
        recommendationLabel: '',
        recommendationReason: '',
        speedAttr: 1.5,
        budgetAttr: 1,
        controlAttr: 3,
        retentionAttr: 3,
        baseScore: 72,
      },
      {
        route: 'train',
        title: 'Train the Existing Operations and Data Team',
        cost: 12000,
        costLabel: '£12,000',
        timeToCapability: '3–4 months',
        expectedBenefit: 82000,
        netValue: 70000,
        roi: 583,
        control: 'High',
        speed: 'Medium',
        retention: 'Very High',
        risk: 'Medium–High',
        scalability: 'Medium',
        dependencyRisk: 'Low',
        bestFor: 'Businesses with strong internal talent and limited budget',
        limitation: 'Lower initial impact and risk of overloading employees',
        isRecommended: false,
        recommendationLabel: '',
        recommendationReason: '',
        speedAttr: 2,
        budgetAttr: 3,
        controlAttr: 3,
        retentionAttr: 3,
        baseScore: 76,
      },
      {
        route: 'outsource',
        title: 'Engage an AI Automation Specialist Partner',
        cost: 37500,
        costLabel: '£37,500',
        timeToCapability: '6–8 weeks',
        expectedBenefit: 165000,
        netValue: 127500,
        roi: 340,
        control: 'Medium',
        speed: 'High',
        retention: 'Medium',
        risk: 'Low–Medium',
        scalability: 'Medium',
        dependencyRisk: 'Medium–High',
        bestFor: 'A rapid controlled pilot requiring specialist expertise',
        limitation: 'Potential vendor dependence',
        isRecommended: true,
        recommendationLabel: 'Recommended for BrightCart',
        recommendationReason:
          'Outsourcing provides the fastest route to pilot value while BrightCart develops internal capability. The contract should include employee training, documentation and knowledge-transfer milestones to reduce long-term vendor dependence.',
        speedAttr: 3,
        budgetAttr: 2,
        controlAttr: 2,
        retentionAttr: 2,
        baseScore: 88,
      },
    ],
  },

  marketing: {
    capabilityId: 'marketing',
    defaultRecommended: 'train',
    recommendationHeadline:
      'Train an existing employee for core capability, supported by limited external specialist assistance.',
    options: [
      {
        route: 'hire',
        title: 'Hire a Marketing Specialist',
        cost: 45000,
        costLabel: '£45,000/year',
        timeToCapability: '3–5 months',
        expectedBenefit: 130000,
        netValue: 85000,
        roi: 189,
        control: 'High',
        speed: 'Low–Medium',
        retention: 'High',
        risk: 'Medium',
        scalability: 'High',
        dependencyRisk: 'Low',
        bestFor: 'Building a long-term in-house marketing capability',
        limitation: 'Slower to impact and carries ongoing salary cost',
        isRecommended: false,
        recommendationLabel: '',
        recommendationReason: '',
        speedAttr: 1.5,
        budgetAttr: 1,
        controlAttr: 3,
        retentionAttr: 3,
        baseScore: 68,
      },
      {
        route: 'train',
        title: 'Train an Existing Employee',
        cost: 5000,
        costLabel: '£5,000',
        timeToCapability: '6–8 weeks',
        expectedBenefit: 60000,
        netValue: 55000,
        roi: 1100,
        control: 'High',
        speed: 'Medium',
        retention: 'Very High',
        risk: 'Low–Medium',
        scalability: 'Medium',
        dependencyRisk: 'Low',
        bestFor: 'Businesses with a capable internal candidate and limited budget',
        limitation: 'Lower initial campaign reach than specialist hire or agency',
        isRecommended: true,
        recommendationLabel: 'Recommended for BrightCart',
        recommendationReason:
          'The training option provides the strongest financial return and improves long-term internal capability, while targeted external support can accelerate campaign execution.',
        speedAttr: 2,
        budgetAttr: 3,
        controlAttr: 3,
        retentionAttr: 3,
        baseScore: 82,
      },
      {
        route: 'outsource',
        title: 'Outsource to a Specialist Agency',
        cost: 18000,
        costLabel: '£18,000/year',
        timeToCapability: '4–6 weeks',
        expectedBenefit: 90000,
        netValue: 72000,
        roi: 400,
        control: 'Medium',
        speed: 'High',
        retention: 'Low–Medium',
        risk: 'Low',
        scalability: 'Medium',
        dependencyRisk: 'High',
        bestFor: 'Businesses needing rapid campaign execution without internal expertise',
        limitation: 'Agency dependence and limited internal knowledge transfer',
        isRecommended: false,
        recommendationLabel: '',
        recommendationReason: '',
        speedAttr: 3,
        budgetAttr: 2,
        controlAttr: 2,
        retentionAttr: 1.5,
        baseScore: 74,
      },
    ],
  },

  'data-analysis': {
    capabilityId: 'data-analysis',
    defaultRecommended: 'train',
    recommendationHeadline:
      'Train internal staff in data analysis fundamentals, supported by an initial specialist consultant engagement.',
    options: [
      {
        route: 'hire',
        title: 'Hire a Data Analyst',
        cost: 42000,
        costLabel: '£42,000/year',
        timeToCapability: '3–5 months',
        expectedBenefit: 110000,
        netValue: 68000,
        roi: 162,
        control: 'High',
        speed: 'Low–Medium',
        retention: 'High',
        risk: 'Medium',
        scalability: 'High',
        dependencyRisk: 'Low',
        bestFor: 'Organisations planning a sustained analytics programme',
        limitation: 'Slower to hire and high ongoing salary commitment',
        isRecommended: false,
        recommendationLabel: '',
        recommendationReason: '',
        speedAttr: 1.5,
        budgetAttr: 1,
        controlAttr: 3,
        retentionAttr: 3,
        baseScore: 65,
      },
      {
        route: 'train',
        title: 'Train Existing Operations Staff in Data Skills',
        cost: 8000,
        costLabel: '£8,000',
        timeToCapability: '8–10 weeks',
        expectedBenefit: 60000,
        netValue: 52000,
        roi: 650,
        control: 'High',
        speed: 'Medium',
        retention: 'Very High',
        risk: 'Low–Medium',
        scalability: 'Medium',
        dependencyRisk: 'Low',
        bestFor: 'Teams with strong operational knowledge who need analytical tools',
        limitation: 'Requires time commitment from staff with existing workloads',
        isRecommended: true,
        recommendationLabel: 'Recommended for BrightCart',
        recommendationReason:
          'BrightCart\'s operations team already understands the business context. Upskilling in data tools produces high retention and strong ROI without permanent headcount risk.',
        speedAttr: 2,
        budgetAttr: 3,
        controlAttr: 3,
        retentionAttr: 3,
        baseScore: 78,
      },
      {
        route: 'outsource',
        title: 'Engage a Data Analytics Consultant',
        cost: 22000,
        costLabel: '£22,000',
        timeToCapability: '3–5 weeks',
        expectedBenefit: 80000,
        netValue: 58000,
        roi: 264,
        control: 'Medium',
        speed: 'High',
        retention: 'Low',
        risk: 'Low',
        scalability: 'Low–Medium',
        dependencyRisk: 'High',
        bestFor: 'Rapid insight delivery for a specific analytical challenge',
        limitation: 'Low capability transfer risk; dependence if not structured well',
        isRecommended: false,
        recommendationLabel: '',
        recommendationReason: '',
        speedAttr: 3,
        budgetAttr: 2,
        controlAttr: 2,
        retentionAttr: 1.5,
        baseScore: 68,
      },
    ],
  },

  sales: {
    capabilityId: 'sales',
    defaultRecommended: 'train',
    recommendationHeadline:
      'Reinforce existing sales strength through targeted AI tool training rather than additional headcount.',
    options: [
      {
        route: 'hire',
        title: 'Hire a Senior Sales Manager',
        cost: 55000,
        costLabel: '£55,000/year',
        timeToCapability: '4–6 months',
        expectedBenefit: 140000,
        netValue: 85000,
        roi: 155,
        control: 'High',
        speed: 'Low',
        retention: 'High',
        risk: 'Medium',
        scalability: 'High',
        dependencyRisk: 'Low',
        bestFor: 'Expanding into new market segments or channels',
        limitation: 'High cost and BrightCart sales is already strong',
        isRecommended: false,
        recommendationLabel: '',
        recommendationReason: '',
        speedAttr: 1,
        budgetAttr: 1,
        controlAttr: 3,
        retentionAttr: 3,
        baseScore: 58,
      },
      {
        route: 'train',
        title: 'Train the Sales Team in AI-Assisted Selling',
        cost: 4500,
        costLabel: '£4,500',
        timeToCapability: '4–6 weeks',
        expectedBenefit: 28000,
        netValue: 23500,
        roi: 522,
        control: 'High',
        speed: 'Medium–High',
        retention: 'Very High',
        risk: 'Low',
        scalability: 'Medium',
        dependencyRisk: 'Low',
        bestFor: 'Incrementally improving an already capable sales operation',
        limitation: 'Lower absolute uplift since BrightCart sales is already strong',
        isRecommended: true,
        recommendationLabel: 'Recommended for BrightCart',
        recommendationReason:
          'BrightCart sales capability is already strong at 85/100. AI-assisted selling training offers the best risk-adjusted return without adding unnecessary headcount.',
        speedAttr: 2.5,
        budgetAttr: 3,
        controlAttr: 3,
        retentionAttr: 3,
        baseScore: 80,
      },
      {
        route: 'outsource',
        title: 'Engage a Sales Optimisation Consultant',
        cost: 14000,
        costLabel: '£14,000',
        timeToCapability: '4–6 weeks',
        expectedBenefit: 45000,
        netValue: 31000,
        roi: 221,
        control: 'Medium',
        speed: 'High',
        retention: 'Low–Medium',
        risk: 'Low',
        scalability: 'Low',
        dependencyRisk: 'Medium',
        bestFor: 'A short-term sales process audit and optimisation project',
        limitation: 'Limited long-term value; low incremental gain for a strong sales team',
        isRecommended: false,
        recommendationLabel: '',
        recommendationReason: '',
        speedAttr: 3,
        budgetAttr: 2,
        controlAttr: 2,
        retentionAttr: 1.5,
        baseScore: 62,
      },
    ],
  },

  sustainability: {
    capabilityId: 'sustainability',
    defaultRecommended: 'outsource',
    recommendationHeadline:
      'Outsource the initial sustainability audit and AI energy-optimisation configuration, then transfer knowledge internally.',
    options: [
      {
        route: 'hire',
        title: 'Hire a Sustainability and ESG Lead',
        cost: 48000,
        costLabel: '£48,000/year',
        timeToCapability: '4–6 months',
        expectedBenefit: 65000,
        netValue: 17000,
        roi: 35,
        control: 'High',
        speed: 'Low',
        retention: 'High',
        risk: 'Medium–High',
        scalability: 'High',
        dependencyRisk: 'Low',
        bestFor: 'Organisations with public ESG reporting commitments',
        limitation: 'Significant fixed cost relative to near-term sustainability savings',
        isRecommended: false,
        recommendationLabel: '',
        recommendationReason: '',
        speedAttr: 1,
        budgetAttr: 1,
        controlAttr: 3,
        retentionAttr: 3,
        baseScore: 52,
      },
      {
        route: 'train',
        title: 'Train the Operations Team in Energy Monitoring',
        cost: 3500,
        costLabel: '£3,500',
        timeToCapability: '4–6 weeks',
        expectedBenefit: 20000,
        netValue: 16500,
        roi: 471,
        control: 'High',
        speed: 'Medium',
        retention: 'Very High',
        risk: 'Low',
        scalability: 'Medium',
        dependencyRisk: 'Low',
        bestFor: 'Embedding sustainable practices within an existing operational team',
        limitation: 'Requires time allocation from the operations team',
        isRecommended: false,
        recommendationLabel: '',
        recommendationReason: '',
        speedAttr: 2,
        budgetAttr: 3,
        controlAttr: 3,
        retentionAttr: 3,
        baseScore: 70,
      },
      {
        route: 'outsource',
        title: 'Engage a Sustainability Specialist Partner',
        cost: 9500,
        costLabel: '£9,500',
        timeToCapability: '3–5 weeks',
        expectedBenefit: 35000,
        netValue: 25500,
        roi: 268,
        control: 'Medium',
        speed: 'High',
        retention: 'Medium',
        risk: 'Low',
        scalability: 'Medium',
        dependencyRisk: 'Medium',
        bestFor: 'Fast-track energy audit, AI optimisation setup and ESG baseline',
        limitation: 'Ongoing dependence if monitoring is not transferred internally',
        isRecommended: true,
        recommendationLabel: 'Recommended for BrightCart',
        recommendationReason:
          'The specialist partner can deliver an energy audit, configure AI scheduling optimisation, and transfer monitoring capability to operations staff within a short engagement.',
        speedAttr: 3,
        budgetAttr: 2,
        controlAttr: 2,
        retentionAttr: 2,
        baseScore: 76,
      },
    ],
  },

  operations: {
    capabilityId: 'operations',
    defaultRecommended: 'train',
    recommendationHeadline:
      'Upskill the existing operations team in AI-assisted workflow management to consolidate a strong existing foundation.',
    options: [
      {
        route: 'hire',
        title: 'Hire an Operations and AI Integration Manager',
        cost: 52000,
        costLabel: '£52,000/year',
        timeToCapability: '3–5 months',
        expectedBenefit: 130000,
        netValue: 78000,
        roi: 150,
        control: 'High',
        speed: 'Low–Medium',
        retention: 'High',
        risk: 'Medium',
        scalability: 'High',
        dependencyRisk: 'Low',
        bestFor: 'Organisations scaling operations significantly or entering new fulfilment models',
        limitation: 'High fixed cost relative to an already competent operations team',
        isRecommended: false,
        recommendationLabel: '',
        recommendationReason: '',
        speedAttr: 1.5,
        budgetAttr: 1,
        controlAttr: 3,
        retentionAttr: 3,
        baseScore: 66,
      },
      {
        route: 'train',
        title: 'Train Operations Team in AI Workflow Tools',
        cost: 7000,
        costLabel: '£7,000',
        timeToCapability: '4–8 weeks',
        expectedBenefit: 85000,
        netValue: 78000,
        roi: 1114,
        control: 'High',
        speed: 'Medium–High',
        retention: 'Very High',
        risk: 'Low',
        scalability: 'Medium–High',
        dependencyRisk: 'Low',
        bestFor: 'Teams with operational knowledge who can quickly adopt AI-assisted tools',
        limitation: 'Requires structured change management to avoid workflow disruption',
        isRecommended: true,
        recommendationLabel: 'Recommended for BrightCart',
        recommendationReason:
          'BrightCart\'s operations team is already capable at 70/100. AI workflow training delivers exceptional ROI by amplifying existing strengths with minimal risk.',
        speedAttr: 2.5,
        budgetAttr: 3,
        controlAttr: 3,
        retentionAttr: 3,
        baseScore: 84,
      },
      {
        route: 'outsource',
        title: 'Engage an Operations Optimisation Specialist',
        cost: 18000,
        costLabel: '£18,000',
        timeToCapability: '4–6 weeks',
        expectedBenefit: 90000,
        netValue: 72000,
        roi: 400,
        control: 'Medium',
        speed: 'High',
        retention: 'Low–Medium',
        risk: 'Low–Medium',
        scalability: 'Medium',
        dependencyRisk: 'Medium',
        bestFor: 'Rapid process mapping, automation scoping and quick-win implementation',
        limitation: 'Limited retention of specialist knowledge without formal transfer',
        isRecommended: false,
        recommendationLabel: '',
        recommendationReason: '',
        speedAttr: 3,
        budgetAttr: 2,
        controlAttr: 2,
        retentionAttr: 1.5,
        baseScore: 70,
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Strategic fit score coefficients (applied per priority delta from Medium=2)
// ---------------------------------------------------------------------------

export interface FitCoefficients {
  speed: number;
  budget: number;
  control: number;
  retention: number;
}

export const FIT_COEFFICIENTS: Record<AcquisitionRoute, FitCoefficients> = {
  hire: { speed: -2, budget: -3, control: 3, retention: 2 },
  train: { speed: -1.5, budget: 4, control: 2, retention: 3 },
  outsource: { speed: 3, budget: 1, control: -3, retention: -2.5 },
};

export const PRIORITY_VALUES: Record<PriorityLevel, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
};

export function computeFitScore(
  option: AcquisitionOption,
  priorities: { speed: PriorityLevel; budget: PriorityLevel; control: PriorityLevel; retention: PriorityLevel }
): number {
  const coeff = FIT_COEFFICIENTS[option.route];
  const sp = PRIORITY_VALUES[priorities.speed] - 2;
  const bu = PRIORITY_VALUES[priorities.budget] - 2;
  const co = PRIORITY_VALUES[priorities.control] - 2;
  const re = PRIORITY_VALUES[priorities.retention] - 2;
  const delta = sp * coeff.speed + bu * coeff.budget + co * coeff.control + re * coeff.retention;
  return Math.round(Math.min(99, Math.max(10, option.baseScore + delta)));
}

// ---------------------------------------------------------------------------
// Comparison matrix
// ---------------------------------------------------------------------------

export interface MatrixRow {
  label: string;
  hire: string;
  train: string;
  outsource: string;
}

export const COMPARISON_MATRIX: Record<CapabilityId, MatrixRow[]> = {
  'ai-automation': [
    { label: 'Cost', hire: 'High', train: 'Low', outsource: 'Medium' },
    { label: 'Speed to Impact', hire: 'Low–Medium', train: 'Medium', outsource: 'High' },
    { label: 'Expected Benefit', hire: 'High', train: 'Medium', outsource: 'High' },
    { label: 'ROI', hire: 'Medium', train: 'Very High', outsource: 'High' },
    { label: 'Internal Control', hire: 'High', train: 'High', outsource: 'Medium' },
    { label: 'Capability Retention', hire: 'High', train: 'Very High', outsource: 'Medium' },
    { label: 'Scalability', hire: 'High', train: 'Medium', outsource: 'Medium' },
    { label: 'Implementation Risk', hire: 'Medium', train: 'Medium–High', outsource: 'Low–Medium' },
    { label: 'Dependency Risk', hire: 'Low', train: 'Low', outsource: 'Medium–High' },
  ],
  marketing: [
    { label: 'Cost', hire: 'High', train: 'Very Low', outsource: 'Medium' },
    { label: 'Speed to Impact', hire: 'Low–Medium', train: 'Medium', outsource: 'High' },
    { label: 'Expected Benefit', hire: 'High', train: 'Medium', outsource: 'Medium–High' },
    { label: 'ROI', hire: 'Medium', train: 'Very High', outsource: 'High' },
    { label: 'Internal Control', hire: 'High', train: 'High', outsource: 'Medium' },
    { label: 'Capability Retention', hire: 'High', train: 'Very High', outsource: 'Low–Medium' },
    { label: 'Scalability', hire: 'High', train: 'Medium', outsource: 'Medium' },
    { label: 'Implementation Risk', hire: 'Medium', train: 'Low–Medium', outsource: 'Low' },
    { label: 'Dependency Risk', hire: 'Low', train: 'Low', outsource: 'High' },
  ],
  'data-analysis': [
    { label: 'Cost', hire: 'High', train: 'Low', outsource: 'Medium' },
    { label: 'Speed to Impact', hire: 'Low–Medium', train: 'Medium', outsource: 'High' },
    { label: 'Expected Benefit', hire: 'High', train: 'Medium', outsource: 'Medium–High' },
    { label: 'ROI', hire: 'Medium', train: 'Very High', outsource: 'High' },
    { label: 'Internal Control', hire: 'High', train: 'High', outsource: 'Medium' },
    { label: 'Capability Retention', hire: 'High', train: 'Very High', outsource: 'Low' },
    { label: 'Scalability', hire: 'High', train: 'Medium', outsource: 'Low–Medium' },
    { label: 'Implementation Risk', hire: 'Medium', train: 'Low–Medium', outsource: 'Low' },
    { label: 'Dependency Risk', hire: 'Low', train: 'Low', outsource: 'High' },
  ],
  sales: [
    { label: 'Cost', hire: 'High', train: 'Very Low', outsource: 'Low–Medium' },
    { label: 'Speed to Impact', hire: 'Low', train: 'Medium–High', outsource: 'High' },
    { label: 'Expected Benefit', hire: 'High', train: 'Low–Medium', outsource: 'Medium' },
    { label: 'ROI', hire: 'Medium', train: 'Very High', outsource: 'High' },
    { label: 'Internal Control', hire: 'High', train: 'High', outsource: 'Medium' },
    { label: 'Capability Retention', hire: 'High', train: 'Very High', outsource: 'Low–Medium' },
    { label: 'Scalability', hire: 'High', train: 'Medium', outsource: 'Low' },
    { label: 'Implementation Risk', hire: 'Medium', train: 'Low', outsource: 'Low' },
    { label: 'Dependency Risk', hire: 'Low', train: 'Low', outsource: 'Medium' },
  ],
  sustainability: [
    { label: 'Cost', hire: 'High', train: 'Very Low', outsource: 'Low' },
    { label: 'Speed to Impact', hire: 'Low', train: 'Medium', outsource: 'High' },
    { label: 'Expected Benefit', hire: 'Medium', train: 'Medium', outsource: 'Medium' },
    { label: 'ROI', hire: 'Low', train: 'High', outsource: 'High' },
    { label: 'Internal Control', hire: 'High', train: 'High', outsource: 'Medium' },
    { label: 'Capability Retention', hire: 'High', train: 'Very High', outsource: 'Medium' },
    { label: 'Scalability', hire: 'High', train: 'Medium', outsource: 'Medium' },
    { label: 'Implementation Risk', hire: 'Medium–High', train: 'Low', outsource: 'Low' },
    { label: 'Dependency Risk', hire: 'Low', train: 'Low', outsource: 'Medium' },
  ],
  operations: [
    { label: 'Cost', hire: 'High', train: 'Very Low', outsource: 'Medium' },
    { label: 'Speed to Impact', hire: 'Low–Medium', train: 'Medium–High', outsource: 'High' },
    { label: 'Expected Benefit', hire: 'High', train: 'High', outsource: 'High' },
    { label: 'ROI', hire: 'Medium', train: 'Very High', outsource: 'High' },
    { label: 'Internal Control', hire: 'High', train: 'High', outsource: 'Medium' },
    { label: 'Capability Retention', hire: 'High', train: 'Very High', outsource: 'Low–Medium' },
    { label: 'Scalability', hire: 'High', train: 'Medium–High', outsource: 'Medium' },
    { label: 'Implementation Risk', hire: 'Medium', train: 'Low', outsource: 'Low–Medium' },
    { label: 'Dependency Risk', hire: 'Low', train: 'Low', outsource: 'Medium' },
  ],
};

// ---------------------------------------------------------------------------
// Workforce action plan
// ---------------------------------------------------------------------------

export interface WorkforceAction {
  id: string;
  action: string;
  owner: string;
  timing: string;
  cost: string;
  successMetric: string;
}

export const WORKFORCE_ACTIONS: WorkforceAction[] = [
  {
    id: 'wa-1',
    action: 'Appoint internal AI pilot owner',
    owner: 'Operations Director',
    timing: 'Week 1',
    cost: 'Internal time',
    successMetric: 'Named accountable owner confirmed',
  },
  {
    id: 'wa-2',
    action: 'Select specialist implementation partner',
    owner: 'Operations & Procurement',
    timing: 'Weeks 1–2',
    cost: 'Included in contract',
    successMetric: 'Partner selected using agreed criteria',
  },
  {
    id: 'wa-3',
    action: 'Train inventory planners',
    owner: 'External partner & Operations',
    timing: 'Weeks 3–6',
    cost: 'Included in contract',
    successMetric: '100% pilot-team training completion',
  },
  {
    id: 'wa-4',
    action: 'Establish human-approval workflow',
    owner: 'Operations & Risk',
    timing: 'Weeks 3–5',
    cost: 'Internal time',
    successMetric: 'All recommendations reviewed before action',
  },
  {
    id: 'wa-5',
    action: 'Transfer model documentation & monitoring',
    owner: 'Partner & Internal Data Owner',
    timing: 'Weeks 6–10',
    cost: 'Included in contract',
    successMetric: 'Internal team can operate pilot independently',
  },
  {
    id: 'wa-6',
    action: 'Review permanent workforce need',
    owner: 'Leadership & Finance',
    timing: 'Month 6',
    cost: 'Internal time',
    successMetric: 'Evidence-based Hire / Train / Continue Outsourcing decision',
  },
];

// ---------------------------------------------------------------------------
// Phased workforce model
// ---------------------------------------------------------------------------

export interface WorkforcePhase {
  phase: string;
  period: string;
  description: string;
}

export const WORKFORCE_PHASES: WorkforcePhase[] = [
  {
    phase: 'Phase 1',
    period: 'Weeks 1–2',
    description: 'Appoint internal project owner and select external specialist partner',
  },
  {
    phase: 'Phase 2',
    period: 'Weeks 3–8',
    description: 'Configure pilot and train operations employees alongside specialist team',
  },
  {
    phase: 'Phase 3',
    period: 'Months 3–4',
    description: 'Transfer documentation, monitoring and workflow ownership internally',
  },
  {
    phase: 'Phase 4',
    period: 'Month 6',
    description: 'Reassess whether to hire a permanent automation or data specialist',
  },
];
