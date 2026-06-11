/**
 * Demo data for the four business-school strategy modules:
 *   1. Email & Meeting Intelligence™
 *   2. Business Vital Monitor™
 *   3. Consumer Insight Hub™
 *   4. Policy Monitor™
 *
 * All values are simulated, illustrative BrightCart demo data — no live
 * integrations, real recordings, real legal analysis or external APIs.
 */

/* ================================================================== *
 * 1. Email & Meeting Intelligence
 * ================================================================== */

export interface EmailMessage {
  sender: string;
  time: string;
  body: string;
}

export interface PriorityEmail {
  id: string;
  subject: string;
  preview: string;
  priority: 'High' | 'Medium' | 'Low';
  businessImpact?: string;
  recommendedAction?: string;
}

export interface TranscriptLine {
  speaker: string;
  time: string;
  text: string;
}

export interface ActionItem {
  owner: string;
  task: string;
  due: string;
  status: 'Not started' | 'In progress' | 'Complete';
}

export const EMAIL_MEETING = {
  emailThread: [
    {
      sender: 'Daniel Okoye — Supplier Account Manager',
      time: 'Mon 09:14',
      body: 'Following our call, I can confirm the current container shipment has been delayed at port. We are looking at an additional two weeks before the priority SKUs arrive at your warehouse.',
    },
    {
      sender: 'Priya Sharma — BrightCart Operations',
      time: 'Mon 10:02',
      body: 'Thanks Daniel. A two-week delay is significant for us — several of these lines are high-demand and we are already running low. Can you confirm a firm revised delivery date?',
    },
    {
      sender: 'James Whitlock — BrightCart Finance',
      time: 'Mon 11:20',
      body: 'Before we approve any additional purchases to cover the gap, I need updated payment timing. We should not commit further cash until the revised schedule is clear.',
    },
    {
      sender: 'Priya Sharma — BrightCart Operations',
      time: 'Mon 13:45',
      body: 'Understood. I will also start reviewing alternative suppliers for the priority SKUs in case the delay extends. Customer Service should be briefed in case fulfilment slips.',
    },
    {
      sender: 'Daniel Okoye — Supplier Account Manager',
      time: 'Mon 16:08',
      body: 'I will escalate internally and come back with a revised date by Wednesday. A partial shipment of the highest-priority items may be possible — I will confirm.',
    },
  ] as EmailMessage[],

  emailSummary: {
    keyPoints: [
      'Supplier delivery is delayed by two weeks.',
      'BrightCart may face stockouts on selected high-demand SKUs.',
      'Finance wants updated payment timing before approving additional purchases.',
    ],
    decisions: [
      'Inform customer-service team about possible fulfilment delays.',
      'Review alternative suppliers for priority SKUs.',
    ],
    questions: [
      'Can the supplier confirm a revised delivery date?',
      'Should BrightCart split the order across another supplier?',
    ],
    actions: [
      'Operations to update inventory forecast.',
      'Finance to review payment schedule.',
      'Customer team to prepare communication if delays continue.',
    ],
  },

  translation: {
    sourceLanguage: 'French',
    original:
      'Bonjour, je vous informe que notre expédition sera retardée de deux semaines en raison d’un problème portuaire. Nous proposons une livraison partielle des articles prioritaires.',
    translatedSummary:
      'The supplier confirms a two-week shipment delay caused by a port issue and offers a partial delivery of the priority items.',
    generatedResponse:
      'Thank you for the update. Please confirm the revised shipment date and whether partial delivery is possible for the priority items.',
  },

  responseTones: {
    Professional:
      'Dear Supplier Team,\n\nThank you for informing us about the shipment delay. Could you please confirm the revised delivery date and whether a partial shipment can be arranged for the priority SKUs? This will help us update our inventory plan and customer commitments.\n\nKind regards,\nBrightCart Operations Team',
    Formal:
      'Dear Sir or Madam,\n\nWe acknowledge receipt of your notification regarding the delay to our scheduled shipment. We should be grateful if you would confirm, in writing, the revised delivery date together with the feasibility of a partial dispatch of the priority items. This information is required to maintain our inventory planning obligations.\n\nYours faithfully,\nBrightCart Operations Team',
    Friendly:
      'Hi there,\n\nThanks so much for the heads-up on the delay! Could you let us know the new delivery date, and whether you could send the priority items a little earlier as a partial shipment? That would really help us keep our customers happy.\n\nThanks again,\nBrightCart Operations Team',
    Concise:
      'Thanks for the update. Please confirm the revised delivery date and whether a partial shipment of the priority SKUs is possible.\n\nBrightCart Operations',
    Detailed:
      'Dear Supplier Team,\n\nThank you for letting us know about the two-week delay. As several of the affected SKUs are high-demand lines, this has a direct impact on our fulfilment and customer commitments.\n\nTo help us plan, please confirm:\n1. The revised delivery date for the full order.\n2. Whether a partial shipment of the priority SKUs can be arranged sooner.\n3. Any updated payment timing associated with the revised schedule.\n\nWe would appreciate confirmation by Wednesday so we can update our inventory forecast and brief our customer-service team accordingly.\n\nKind regards,\nBrightCart Operations Team',
  } as Record<string, string>,

  priorityEmails: [
    {
      id: 'pe1',
      subject: 'Supplier delay affecting priority inventory',
      preview: 'Container shipment delayed two weeks — high-demand SKUs at risk.',
      priority: 'High',
      businessImpact: 'Possible stockout risk within 14 days',
      recommendedAction: 'Escalate to Operations and Finance',
    },
    {
      id: 'pe2',
      subject: 'Wholesale payment follow-up',
      preview: 'Reminder regarding outstanding wholesale invoice from last month.',
      priority: 'Medium',
    },
    {
      id: 'pe3',
      subject: 'Energy contract renewal notice',
      preview: 'Your commercial energy contract is due for renewal in 60 days.',
      priority: 'Medium',
    },
    {
      id: 'pe4',
      subject: 'Newsletter from trade association',
      preview: 'Monthly retail-sector trends and upcoming member events.',
      priority: 'Low',
    },
    {
      id: 'pe5',
      subject: 'Routine software update',
      preview: 'Your inventory platform will receive a minor update this weekend.',
      priority: 'Low',
    },
  ] as PriorityEmail[],

  meetingTranscript: [
    { speaker: 'John', time: '00:02', text: 'We should reduce inventory purchases next quarter.' },
    { speaker: 'Sarah', time: '00:18', text: 'Agreed. We should also negotiate supplier payment terms.' },
    { speaker: 'Michael', time: '00:39', text: 'The bigger issue is cash conversion. Receivables are stretching beyond 28 days.' },
    { speaker: 'Anika', time: '01:05', text: 'Let us prioritise invoice collection and test AI-supported inventory planning.' },
  ] as TranscriptLine[],

  speakers: ['John Smith', 'Sarah Williams', 'Michael Chen', 'Anika Patel'],

  meetingSummary: {
    keyPoints: [
      'Inventory purchases may need to be reduced.',
      'Supplier payment terms should be renegotiated.',
      'Cash conversion is becoming a priority issue.',
      'AI-supported inventory planning should be tested.',
    ],
    decisions: [
      'Prioritise invoice collection.',
      'Review supplier terms.',
      'Explore AI inventory pilot.',
    ],
    risks: [
      'Liquidity pressure within 45–60 days.',
      'Stockout risk if inventory is reduced too aggressively.',
    ],
    opportunities: [
      'Improve working capital without external finance.',
      'Use AI to support inventory decisions.',
    ],
  },

  actionItems: [
    { owner: 'John', task: 'Contact supplier', due: 'Friday', status: 'Not started' },
    { owner: 'Sarah', task: 'Prepare budget proposal', due: 'Next week', status: 'In progress' },
    { owner: 'Operations Team', task: 'Review inventory forecast', due: '7 days', status: 'Not started' },
    { owner: 'Finance Team', task: 'Analyse receivables delay', due: '5 days', status: 'Not started' },
  ] as ActionItem[],

  fullTranscript: [
    { speaker: 'John', time: '00:02', text: 'We should reduce inventory purchases next quarter to free up cash.' },
    { speaker: 'Sarah', time: '00:18', text: 'Agreed. We should also negotiate supplier payment terms to give us more breathing room.' },
    { speaker: 'John', time: '00:31', text: 'If we negotiate terms, we can scale purchasing back gradually rather than cutting suddenly.' },
    { speaker: 'Michael', time: '00:39', text: 'The bigger issue is cash conversion. Receivables are stretching beyond 28 days.' },
    { speaker: 'Michael', time: '00:52', text: 'Until collection improves, reducing inventory alone will not solve the liquidity pressure.' },
    { speaker: 'Anika', time: '01:05', text: 'Let us prioritise invoice collection and test AI-supported inventory planning.' },
    { speaker: 'Sarah', time: '01:21', text: 'I can prepare a budget proposal that pairs the inventory reduction with the collections push.' },
  ] as TranscriptLine[],

  meetingSearch: {
    placeholder: 'What did Sarah say about inventory?',
    query: 'What did Sarah say about inventory?',
    answer:
      'Sarah agreed that inventory purchases should be reduced and connected the issue to supplier payment-term negotiation.',
  },

  savedMeetings: [
    { title: 'Weekly Operations Review', date: '06 Jun 2026', duration: '32 min', actions: 6 },
    { title: 'Supplier Planning Meeting', date: '04 Jun 2026', duration: '47 min', actions: 9 },
    { title: 'Finance Review', date: '01 Jun 2026', duration: '28 min', actions: 5 },
    { title: 'Sustainability Planning Discussion', date: '28 May 2026', duration: '41 min', actions: 7 },
  ],

  productivity: [
    { label: 'Hours saved this month', value: '18' },
    { label: 'Emails summarised', value: '142' },
    { label: 'Meetings transcribed', value: '27' },
    { label: 'Action items generated', value: '89' },
  ],

  productivityInsight:
    'AI-assisted communication workflows reduce administrative load and help employees focus on higher-value business decisions.',
};

/* ================================================================== *
 * 2. Business Vital Monitor
 * ================================================================== */

export type VitalLevel = 'critical' | 'warning' | 'healthy';

export interface Vital {
  id: string;
  label: string;
  position: string;
  status: string;
  metaLabel: string;
  metaValue: string;
  level: VitalLevel;
}

export const VITALS: Vital[] = [
  { id: 'cashflow', label: 'Cash Flow Health', position: 'Near Risk Zone', status: 'Immediate Attention Required', metaLabel: 'Est. time before impact', metaValue: '45 days', level: 'critical' },
  { id: 'receivables', label: 'Receivables Health', position: 'Warning Zone', status: 'Monitor Closely', metaLabel: 'Review within', metaValue: '30 days', level: 'warning' },
  { id: 'opex', label: 'Operating Expenses', position: 'Stable but Rising', status: 'Monitor Closely', metaLabel: 'Review within', metaValue: '60 days', level: 'warning' },
  { id: 'revenue', label: 'Revenue Stability', position: 'Strong', status: 'Healthy', metaLabel: 'Trend', metaValue: 'Consistent Growth', level: 'healthy' },
  { id: 'profitability', label: 'Profitability', position: 'Strong', status: 'Healthy', metaLabel: 'Trend', metaValue: 'Above Industry Benchmark', level: 'healthy' },
  { id: 'working-capital', label: 'Working Capital', position: 'Risk Zone', status: 'Immediate Attention Required', metaLabel: 'Est. time before impact', metaValue: '60 days', level: 'critical' },
  { id: 'inventory', label: 'Inventory Health', position: 'Slightly Elevated', status: 'Monitor Closely', metaLabel: 'Review within', metaValue: '45 days', level: 'warning' },
  { id: 'debt', label: 'Debt Position', position: 'Stable', status: 'Healthy', metaLabel: 'Trend', metaValue: 'Within Acceptable Range', level: 'healthy' },
  { id: 'sustainability', label: 'Sustainability Performance', position: 'Improving', status: 'Healthy', metaLabel: 'Trend', metaValue: 'Emissions Reducing', level: 'healthy' },
];

export const VITAL_INSIGHT =
  'Your business remains operationally strong, with revenue growth, profitability, debt position and sustainability performance all remaining healthy. However, the system has detected growing pressure in liquidity management. The primary concern is not revenue generation, but the speed at which cash is being converted back into the business. Slower receivables collection combined with increasing working-capital requirements may begin restricting financial flexibility within the next 45–60 days.';

export const VITAL_ACTIONS = {
  high: [
    'Accelerate outstanding invoice collections',
    'Review supplier payment schedules',
    'Implement cash-flow and working-capital recommendations',
  ],
  medium: [
    'Review energy expenditure and logistics costs',
    'Reduce slow-moving inventory',
    'Assess recurring operational expenses',
  ],
  monitoring: [
    'Continue tracking receivables collection trends',
    'Monitor operating expense growth',
    'Reassess inventory turnover over the next 30–60 days',
  ],
};

/* ================================================================== *
 * 3. Consumer Insight Hub
 * ================================================================== */

export interface Complaint {
  id: string;
  label: string;
  pct: number;
  color: string;
  change: string;
  comments: string[];
}

export const CONSUMER = {
  sentiment: { overall: 82, positive: 68, neutral: 20, negative: 12 },

  sentimentTrend: [
    { month: 'Jan', sentiment: 77, deliveryNeg: 7 },
    { month: 'Feb', sentiment: 78, deliveryNeg: 8 },
    { month: 'Mar', sentiment: 79, deliveryNeg: 9 },
    { month: 'Apr', sentiment: 80, deliveryNeg: 10 },
    { month: 'May', sentiment: 81, deliveryNeg: 12 },
    { month: 'Jun', sentiment: 82, deliveryNeg: 14 },
  ],

  complaints: [
    {
      id: 'delivery', label: 'Delivery Issues', pct: 34, color: '#db0011', change: 'increased 22% this quarter',
      comments: [
        'Delivery tracking was unclear.',
        'My order arrived later than expected.',
        'Customer support could not confirm the delivery date.',
      ],
    },
    {
      id: 'service', label: 'Customer Service', pct: 26, color: '#d97706', change: 'broadly stable this quarter',
      comments: [
        'It took a while to reach a human agent.',
        'Response to my query was slower than expected.',
        'The agent was helpful once I got through.',
      ],
    },
    {
      id: 'quality', label: 'Product Quality', pct: 18, color: '#1d4ed8', change: 'slightly improved this quarter',
      comments: [
        'Item quality was good for the price.',
        'One product did not match the description.',
        'Packaging protected the item well.',
      ],
    },
    {
      id: 'pricing', label: 'Pricing Concerns', pct: 12, color: '#6b21a8', change: 'broadly stable this quarter',
      comments: [
        'Prices crept up on some lines.',
        'Still good value compared to competitors.',
        'Would like more bundle discounts.',
      ],
    },
    {
      id: 'website', label: 'Website Experience', pct: 10, color: '#0f766e', change: 'slightly improved this quarter',
      comments: [
        'Checkout was quick and simple.',
        'Search could surface products better.',
        'Mobile site works well.',
      ],
    },
  ] as Complaint[],

  trends: [
    { label: 'Sustainable Packaging', growth: 41 },
    { label: 'Subscription Services', growth: 29 },
    { label: 'Faster Response Times', growth: 24 },
    { label: 'Digital Self-Service', growth: 18 },
  ],

  wordCloud: [
    { word: 'Delivery', weight: 5 },
    { word: 'Sustainable', weight: 5 },
    { word: 'Customer Service', weight: 5 },
    { word: 'Tracking', weight: 5 },
    { word: 'Fast', weight: 3 },
    { word: 'Affordable', weight: 3 },
    { word: 'Quality', weight: 3 },
    { word: 'Loyalty', weight: 3 },
    { word: 'Packaging', weight: 2 },
    { word: 'Returns', weight: 2 },
    { word: 'Convenient', weight: 2 },
    { word: 'Reliable', weight: 2 },
  ],

  actionPriorities: [
    {
      rank: 1, title: 'Improve Delivery Tracking',
      issue: 'Unclear tracking is the top driver of delivery complaints.',
      signal: 'Customers repeatedly mention uncertainty about delivery dates.',
      action: 'Introduce clearer, proactive delivery-tracking updates.',
      impact: '+12% customer satisfaction',
    },
    {
      rank: 2, title: 'Reduce Customer Service Response Times',
      issue: 'Response time is slower than peer benchmark.',
      signal: 'Feedback highlights wait times before reaching an agent.',
      action: 'Add triage and AI-assisted responses for common queries.',
      impact: '+9% customer retention',
    },
    {
      rank: 3, title: 'Expand Sustainable Packaging Options',
      issue: 'Rising customer expectation for sustainable choices.',
      signal: 'Sustainable packaging is the fastest-growing trend topic.',
      action: 'Offer recyclable packaging options at checkout.',
      impact: '+6% brand perception',
    },
  ],

  benchmarks: [
    { metric: 'Customer Satisfaction', you: '82%', industry: '76%', youBetter: true },
    { metric: 'Response Time', you: '6 hrs', industry: '4 hrs', youBetter: false },
    { metric: 'Complaint Rate', you: '12%', industry: '15%', youBetter: true },
  ],

  benchmarkInsight:
    'BrightCart performs above the industry average on satisfaction and complaint rate, but response time is slower than peers.',

  hsbcInsight:
    'Businesses in similar retail categories that reduced delivery-related complaints by 20% saw stronger customer retention and repeat-purchase behaviour.',

  outcome:
    'Consumer Insight Hub helps BrightCart identify customer pain points, understand emerging expectations, benchmark against competitors and prioritise actions that improve loyalty and competitiveness.',
};

/* ================================================================== *
 * 4. Policy Monitor
 * ================================================================== */

export interface PolicyUpdate {
  id: string;
  title: string;
  effective: string;
  impact: 'Low' | 'Low to Medium' | 'Medium' | 'High';
  areas: string[];
  urgency: string;
  whatChanged: string;
  whyMatters: string;
  affected: string[];
  nextSteps: string[];
}

export interface ComplianceAction {
  task: string;
  owner: string;
  due: string;
  status: 'Not started' | 'In progress' | 'Complete';
  priority: 'High' | 'Medium' | 'Low';
}

export const POLICY = {
  updates: [
    {
      id: 'sustainability-reporting',
      title: 'New Sustainability Reporting Requirements',
      effective: 'January 2027',
      impact: 'Medium',
      areas: ['Energy tracking', 'Emissions reporting', 'Supplier data'],
      urgency: 'Prepare within 12 months',
      whatChanged:
        'New ESG disclosure expectations may require BrightCart to track energy consumption and emissions more consistently.',
      whyMatters:
        'The business already tracks monthly electricity usage, but may need stronger reporting procedures, assigned ownership and supplier-data collection before 2027.',
      affected: ['Operations', 'Finance', 'Supplier management'],
      nextSteps: [
        'Strengthen energy and emissions reporting procedures.',
        'Assign clear ownership for sustainability reporting.',
        'Begin collecting supplier-level data.',
      ],
    },
    {
      id: 'data-protection',
      title: 'Data Protection Review for Automated Tools',
      effective: 'Ongoing',
      impact: 'Medium',
      areas: ['Customer data', 'AI tools', 'Third-party software'],
      urgency: 'Review current policies',
      whatChanged:
        'Expectations around how automated and AI tools handle personal data continue to tighten.',
      whyMatters:
        'BrightCart uses several digital tools that touch customer data, so current policies and third-party arrangements should be reviewed.',
      affected: ['Customer service', 'Technology', 'Compliance'],
      nextSteps: [
        'Review how AI tools process customer data.',
        'Confirm third-party software handling arrangements.',
        'Update internal data-handling guidance.',
      ],
    },
    {
      id: 'employment-contracts',
      title: 'Employment Contract Update Guidance',
      effective: 'Next review cycle',
      impact: 'Low to Medium',
      areas: ['Employee handbook', 'Technology-use rules', 'AI acceptable-use policy'],
      urgency: 'Update internal policy wording',
      whatChanged:
        'Guidance suggests refreshing employment documentation to reflect technology and AI use in the workplace.',
      whyMatters:
        'Clear wording on technology and AI use protects the business and gives employees consistent expectations.',
      affected: ['HR', 'Management', 'All employees'],
      nextSteps: [
        'Refresh the employee handbook wording.',
        'Add or update technology-use rules.',
        'Introduce an AI acceptable-use policy.',
      ],
    },
  ] as PolicyUpdate[],

  complianceActions: [
    { task: 'Update reporting procedures', owner: 'Operations Manager', due: 'Next 60 days', status: 'Not started', priority: 'High' },
    { task: 'Assign compliance responsibility', owner: 'Senior Management', due: 'Next 30 days', status: 'Not started', priority: 'High' },
    { task: 'Review internal policies', owner: 'HR Manager', due: 'Next 90 days', status: 'In progress', priority: 'Medium' },
    { task: 'Complete compliance review before deadline', owner: 'Finance Manager', due: 'Before Jan 2027', status: 'Not started', priority: 'Medium' },
  ] as ComplianceAction[],

  document: {
    name: 'supplier_agreement_brightcart.pdf',
    supportedTypes: [
      'Supplier Agreements',
      'Client Contracts',
      'Employment Contracts',
      'NDAs',
      'Partnership Agreements',
      'Service Contracts',
    ],
    contractSummary: [
      { label: 'Contract duration', value: '12 months' },
      { label: 'Payment terms', value: '30 days' },
      { label: 'Renewal clause', value: 'Automatic renewal unless cancelled 60 days before expiry' },
      { label: 'Termination condition', value: 'Written notice required' },
      { label: 'Key obligation', value: 'Maintain minimum purchase volume' },
    ],
    riskAssessment: [
      'Uncapped liability clause',
      'Automatic renewal clause',
      'One-sided termination rights',
      'High financial exposure if supplier disruption occurs',
    ],
    complianceCheck: [
      'Data protection clause needs review',
      'Supplier reporting requirements are unclear',
      'Termination language should be reviewed',
    ],
    recommendedActions: [
      'Review liability provisions',
      'Negotiate termination terms',
      'Update compliance clauses',
      'Seek legal review before renewal',
    ],
  },

  aiComplianceInsight:
    'Businesses in similar sectors are preparing for upcoming sustainability disclosure requirements. Based on BrightCart’s current reporting processes, additional energy-consumption tracking and clearer internal ownership may be required within the next 12 months.',
};
